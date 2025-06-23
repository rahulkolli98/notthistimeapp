import { useState, useEffect, useRef } from 'react'
import { supabase } from '../lib/supabase'

export interface ReplacementRequest {
  id: string
  item_id: string
  original_item_name: string
  suggested_replacement: string
  requested_by: string
  responded_by: string | null
  status: 'pending' | 'accepted' | 'rejected'
  created_at: string
  updated_at: string
  // Joined data
  item_name?: string
  list_id?: string
  list_name?: string
  requester_name?: string
}

export function useReplacementRequests(listId?: string) {
  const [requests, setRequests] = useState<ReplacementRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const subscriptionRef = useRef<any>(null)

  const fetchRequests = async () => {
    try {
      setLoading(true)
      setError(null)

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No authenticated user')

      let query = supabase
        .from('replacement_requests')
        .select(`
          id,
          item_id,
          original_item_name,
          suggested_replacement,
          requested_by,
          responded_by,
          status,
          created_at,
          updated_at
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: false })

      // Get user's list memberships first to filter requests
      const { data: memberData } = await supabase
        .from('list_members')
        .select('list_id')
        .eq('user_id', user.id)

      const userListIds = memberData?.map(m => m.list_id) || []
      if (userListIds.length === 0) {
        setRequests([])
        return
      }

      const { data, error } = await query

      if (error) throw error

      if (!data || data.length === 0) {
        setRequests([])
        return
      }

      // Get related item and user data separately
      const itemIds = [...new Set(data.map(req => req.item_id))]
      const userIds = [...new Set(data.map(req => req.requested_by))]

      // Fetch items data
      const { data: itemsData, error: itemsError } = await supabase
        .from('items')
        .select('id, name, list_id')
        .in('id', itemIds)

      if (itemsError) throw itemsError

      // Filter items to only those in lists the user is a member of
      const filteredItemsData = itemsData?.filter(item => 
        userListIds.includes(item.list_id) &&
        (listId ? item.list_id === listId : true)
      ) || []

      if (filteredItemsData.length === 0) {
        setRequests([])
        return
      }

      // Filter requests to only those for items the user can see
      const filteredItemIds = filteredItemsData.map(item => item.id)
      const filteredData = data.filter(req => filteredItemIds.includes(req.item_id))

      // Fetch list data for the filtered items
      const listIds = [...new Set(filteredItemsData.map(item => item.list_id))]
      const { data: listsData, error: listsError } = await supabase
        .from('lists')
        .select('id, name')
        .in('id', listIds)

      if (listsError) throw listsError

      // Fetch user data for the filtered requests
      const filteredUserIds = [...new Set(filteredData.map(req => req.requested_by))]
      const { data: usersData, error: usersError } = await supabase
        .from('profiles')
        .select('id, name')
        .in('id', filteredUserIds)

      if (usersError) throw usersError

      // Create maps for quick lookup
      const itemMap = new Map(filteredItemsData.map(item => [item.id, item]))
      const listMap = new Map(listsData?.map(list => [list.id, list]) || [])
      const userMap = new Map(usersData?.map(user => [user.id, user]) || [])

      // Transform the filtered data
      const transformedRequests: ReplacementRequest[] = filteredData.map(request => {
        const item = itemMap.get(request.item_id)
        const list = item ? listMap.get(item.list_id) : null
        const user = userMap.get(request.requested_by)

        return {
          id: request.id,
          item_id: request.item_id,
          original_item_name: request.original_item_name,
          suggested_replacement: request.suggested_replacement,
          requested_by: request.requested_by,
          responded_by: request.responded_by,
          status: request.status,
          created_at: request.created_at,
          updated_at: request.updated_at,
          item_name: item?.name,
          list_id: item?.list_id,
          list_name: list?.name,
          requester_name: user?.name || 'Unknown'
        }
      })

      setRequests(transformedRequests)
    } catch (err) {
      console.error('Error fetching replacement requests:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch replacement requests')
    } finally {
      setLoading(false)
    }
  }

  const respondToRequest = async (
    requestId: string, 
    response: 'accepted' | 'rejected',
    newItemName?: string
  ) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No authenticated user')

      // Immediately remove the request from local state for instant UI feedback
      setRequests(prevRequests => prevRequests.filter(r => r.id !== requestId))

      // Update the replacement request status
      const { error: updateError } = await supabase
        .from('replacement_requests')
        .update({
          status: response,
          responded_by: user.id,
          updated_at: new Date().toISOString()
        })
        .eq('id', requestId)

      if (updateError) {
        // If update fails, restore the request to the list and throw error
        await fetchRequests()
        throw updateError
      }

      // If accepted and newItemName provided, add the replacement as a new item
      if (response === 'accepted' && newItemName) {
        const request = requests.find(r => r.id === requestId)
        if (request && request.list_id) {
          const { error: insertError } = await supabase
            .from('items')
            .insert({
              list_id: request.list_id,
              name: newItemName.trim(),
              created_by: user.id,
              status: 'needed'
            })

          if (insertError) {
            console.error('Error adding replacement item:', insertError)
            // Don't throw here - the request was still processed successfully
          }
        }
      }

      // Refresh requests to ensure consistency (but UI already updated)
      await fetchRequests()
    } catch (err) {
      console.error('Error responding to replacement request:', err)
      throw err
    }
  }

  const createReplacementRequest = async (
    itemId: string,
    suggestions: string[]
  ) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No authenticated user')

      const replacementRequests = suggestions.map(suggestion => ({
        item_id: itemId,
        requested_by: user.id,
        suggested_replacement: suggestion.trim(),
        status: 'pending' as const
      }))

      const { error } = await supabase
        .from('replacement_requests')
        .insert(replacementRequests)

      if (error) throw error

      // Refresh requests
      await fetchRequests()
    } catch (err) {
      console.error('Error creating replacement request:', err)
      throw err
    }
  }

  useEffect(() => {
    fetchRequests()

    // Clean up any existing subscription
    if (subscriptionRef.current) {
      supabase.removeChannel(subscriptionRef.current)
      subscriptionRef.current = null
    }

    // Set up real-time subscription for replacement requests
    const channel = supabase
      .channel(`replacement-requests-${listId || 'all'}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'replacement_requests'
        },
        (payload) => {
          console.log('New replacement request:', payload)
          // Refetch requests when new replacement request is created
          fetchRequests()
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'replacement_requests'
        },
        (payload) => {
          console.log('Replacement request updated:', payload)
          // If status changed to accepted/rejected, remove from local state immediately
          if (payload.new.status !== 'pending') {
            setRequests(prevRequests => 
              prevRequests.filter(r => r.id !== payload.new.id)
            )
          }
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
    requests,
    loading,
    error,
    refetch: fetchRequests,
    respondToRequest,
    createReplacementRequest
  }
} 