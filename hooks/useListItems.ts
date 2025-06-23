import { useState, useEffect, useRef } from 'react'
import { supabase } from '../lib/supabase'

export interface ListItem {
  id: string
  list_id: string
  name: string
  notes: string | null
  quantity: number
  status: 'needed' | 'in_cart' | 'bought' | 'out_of_stock'
  store_name: string | null
  created_by: string
  created_at: string
  updated_at: string
  created_by_name?: string
}

export function useListItems(listId: string) {
  const [items, setItems] = useState<ListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const subscriptionRef = useRef<any>(null)

  const fetchItems = async () => {
    try {
      setLoading(true)
      setError(null)

      // Get items for this list
      const { data: itemsData, error: itemsError } = await supabase
        .from('items')
        .select(`
          id,
          list_id,
          name,
          notes,
          quantity,
          status,
          store_name,
          created_by,
          created_at,
          updated_at
        `)
        .eq('list_id', listId)
        .order('created_at', { ascending: false })

      if (itemsError) throw itemsError

      if (!itemsData || itemsData.length === 0) {
        setItems([])
        return
      }

      // Get user names for who created each item
      const createdByIds = [...new Set(itemsData.map(item => item.created_by))]
      const { data: usersData, error: usersError } = await supabase
        .from('profiles')
        .select('id, name')
        .in('id', createdByIds)

      if (usersError) throw usersError

      // Create a map of user names
      const userMap = new Map(usersData?.map(user => [user.id, user.name]) || [])

      // Transform the data
      const transformedItems: ListItem[] = itemsData.map(item => ({
        ...item,
        created_by_name: userMap.get(item.created_by) || 'Unknown'
      }))

      setItems(transformedItems)
    } catch (err) {
      console.error('Error fetching items:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch items')
    } finally {
      setLoading(false)
    }
  }

  const addItem = async (itemData: {
    name: string
    notes?: string
    quantity?: number
    store_name?: string
  }) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No authenticated user')

      const { error } = await supabase
        .from('items')
        .insert({
          list_id: listId,
          name: itemData.name.trim(),
          notes: itemData.notes?.trim() || null,
          quantity: itemData.quantity || 1,
          store_name: itemData.store_name?.trim() || null,
          created_by: user.id,
          status: 'needed'
        })

      if (error) throw error

      // Refresh items list
      await fetchItems()
    } catch (err) {
      console.error('Error adding item:', err)
      throw err
    }
  }

  const updateItemStatus = async (itemId: string, status: ListItem['status']) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No authenticated user')

      const { error } = await supabase
        .from('items')
        .update({ 
          status,
          updated_by: user.id,
          updated_at: new Date().toISOString()
        })
        .eq('id', itemId)

      if (error) throw error

      // Update local state immediately for better UX
      setItems(prevItems => 
        prevItems.map(item => 
          item.id === itemId 
            ? { ...item, status, updated_at: new Date().toISOString() }
            : item
        )
      )
    } catch (err) {
      console.error('Error updating item status:', err)
      throw err
    }
  }

  const updateItem = async (itemId: string, updates: Partial<Pick<ListItem, 'name' | 'notes' | 'quantity' | 'store_name'>>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No authenticated user')

      const { error } = await supabase
        .from('items')
        .update({
          ...updates,
          updated_by: user.id,
          updated_at: new Date().toISOString()
        })
        .eq('id', itemId)

      if (error) throw error

      // Refresh items list
      await fetchItems()
    } catch (err) {
      console.error('Error updating item:', err)
      throw err
    }
  }

  const deleteItem = async (itemId: string) => {
    try {
      const { error } = await supabase
        .from('items')
        .delete()
        .eq('id', itemId)

      if (error) throw error

      // Remove from local state immediately
      setItems(prevItems => prevItems.filter(item => item.id !== itemId))
    } catch (err) {
      console.error('Error deleting item:', err)
      throw err
    }
  }

  useEffect(() => {
    if (!listId) return

    fetchItems()

    // Clean up any existing subscription
    if (subscriptionRef.current) {
      supabase.removeChannel(subscriptionRef.current)
      subscriptionRef.current = null
    }

    // Set up real-time subscription for items in this list
    const channel = supabase
      .channel(`list-items-${listId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'items',
          filter: `list_id=eq.${listId}`
        },
        () => {
          // Refetch items when any item in this list changes
          fetchItems()
        }
      )
      .subscribe()

    subscriptionRef.current = channel

    return () => {
      if (subscriptionRef.current) {
        supabase.removeChannel(subscriptionRef.current)
        subscriptionRef.current = null
      }
    }
  }, [listId])

  return {
    items,
    loading,
    error,
    refetch: fetchItems,
    addItem,
    updateItemStatus,
    updateItem,
    deleteItem
  }
} 