import { useState, useEffect, useRef } from 'react'
import { supabase } from '../lib/supabase'

export interface ShoppingList {
  id: string
  name: string
  category: string
  description: string | null
  created_by: string
  created_at: string
  updated_at: string
  item_count?: number
  creator_name?: string
}

export function useUserLists() {
  const [lists, setLists] = useState<ShoppingList[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const subscriptionRef = useRef<any>(null)

  const fetchLists = async () => {
    try {
      setLoading(true)
      setError(null)

      // Get the current user
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        throw new Error('No authenticated user')
      }

      // First, get the list IDs where the user is a member
      const { data: memberData, error: memberError } = await supabase
        .from('list_members')
        .select('list_id')
        .eq('user_id', user.id)

      if (memberError) throw memberError

      const listIds = memberData?.map(item => item.list_id) || []

      if (listIds.length === 0) {
        setLists([])
        return
      }

      // Then fetch the lists with creator info and item counts
      // We'll do separate queries to avoid foreign key relationship issues
      const { data: listsData, error: listsError } = await supabase
        .from('lists')
        .select(`
          id,
          name,
          category,
          description,
          created_by,
          created_at,
          updated_at
        `)
        .in('id', listIds)
        .order('updated_at', { ascending: false })

      if (listsError) throw listsError

      if (!listsData || listsData.length === 0) {
        setLists([])
        return
      }

      // Get creator names separately
      const creatorIds = [...new Set(listsData.map(list => list.created_by))]
      const { data: creatorsData, error: creatorsError } = await supabase
        .from('profiles')
        .select('id, name')
        .in('id', creatorIds)

      if (creatorsError) throw creatorsError

      // Get item counts for each list
      const { data: itemCounts, error: itemCountsError } = await supabase
        .from('items')
        .select('list_id, id')
        .in('list_id', listIds)

      if (itemCountsError) throw itemCountsError

      // Create a map of creator names and item counts
      const creatorMap = new Map(creatorsData?.map(creator => [creator.id, creator.name]) || [])
      const itemCountMap = new Map()
      
      itemCounts?.forEach(item => {
        const currentCount = itemCountMap.get(item.list_id) || 0
        itemCountMap.set(item.list_id, currentCount + 1)
      })

      // Transform the data to match our interface
      const transformedLists: ShoppingList[] = listsData.map(list => ({
        id: list.id,
        name: list.name,
        category: list.category,
        description: list.description,
        created_by: list.created_by,
        created_at: list.created_at,
        updated_at: list.updated_at,
        creator_name: creatorMap.get(list.created_by) || 'Unknown',
        item_count: itemCountMap.get(list.id) || 0
      }))

      setLists(transformedLists)
    } catch (err) {
      console.error('Error fetching lists:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch lists')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLists()

    // Clean up any existing subscription
    if (subscriptionRef.current) {
      supabase.removeChannel(subscriptionRef.current)
      subscriptionRef.current = null
    }

    // Set up real-time subscriptions with unique channel name
    const channel = supabase
      .channel(`user-lists-${Date.now()}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'lists'
        },
        () => {
          // Refetch lists when any list changes
          fetchLists()
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'list_members'
        },
        () => {
          // Refetch lists when memberships change
          fetchLists()
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'items'
        },
        () => {
          // Refetch lists when items change (to update counts)
          fetchLists()
        }
      )
      .subscribe()

    subscriptionRef.current = channel

    // Cleanup subscription on unmount
    return () => {
      if (subscriptionRef.current) {
        supabase.removeChannel(subscriptionRef.current)
        subscriptionRef.current = null
      }
    }
  }, [])

  // Leave a list (remove user from list_members)
  const leaveList = async (listId: string) => {
    try {
      setLoading(true)
      setError(null)

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No authenticated user')

      // Check if user is the owner of the list
      const { data: listData, error: listError } = await supabase
        .from('lists')
        .select('created_by')
        .eq('id', listId)
        .single()

      if (listError) throw listError

      if (listData.created_by === user.id) {
        throw new Error('List owners cannot leave their own lists. You can delete the list instead.')
      }

      // Remove user from list_members
      const { error } = await supabase
        .from('list_members')
        .delete()
        .eq('list_id', listId)
        .eq('user_id', user.id)

      if (error) throw error

      // Refresh lists to update UI
      await fetchLists()

      return true
    } catch (err) {
      console.error('Error leaving list:', err)
      setError(err instanceof Error ? err.message : 'Failed to leave list')
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Delete a list (only for list owners)
  const deleteList = async (listId: string) => {
    try {
      setLoading(true)
      setError(null)

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No authenticated user')

      // Check if user is the owner of the list
      const { data: listData, error: listError } = await supabase
        .from('lists')
        .select('created_by')
        .eq('id', listId)
        .single()

      if (listError) throw listError

      if (listData.created_by !== user.id) {
        throw new Error('Only list owners can delete lists')
      }

      // Delete the list (this will cascade delete all related data)
      const { error } = await supabase
        .from('lists')
        .delete()
        .eq('id', listId)

      if (error) throw error

      // Refresh lists to update UI
      await fetchLists()

      return true
    } catch (err) {
      console.error('Error deleting list:', err)
      setError(err instanceof Error ? err.message : 'Failed to delete list')
      throw err
    } finally {
      setLoading(false)
    }
  }

  return {
    lists,
    loading,
    error,
    refetch: fetchLists,
    leaveList,
    deleteList
  }
} 