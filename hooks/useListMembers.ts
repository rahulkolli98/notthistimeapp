import { useState, useEffect, useRef } from 'react'
import { supabase } from '../lib/supabase'

export interface ListMember {
  id: string
  user_id: string
  list_id: string
  role: 'owner' | 'editor' | 'member'
  joined_at: string
  // Joined data from profiles
  name: string
  email?: string // Optional, only shown for current user
  isCurrentUser: boolean
}

export function useListMembers(listId: string) {
  const [members, setMembers] = useState<ListMember[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const subscriptionRef = useRef<any>(null)

  const fetchMembers = async () => {
    try {
      setLoading(true)
      setError(null)

      // Get list members
      const { data: membersData, error: membersError } = await supabase
        .from('list_members')
        .select(`
          id,
          user_id,
          list_id,
          role,
          joined_at
        `)
        .eq('list_id', listId)
        .order('joined_at', { ascending: true })

      if (membersError) throw membersError

      if (!membersData || membersData.length === 0) {
        setMembers([])
        return
      }

      // Get user details for all members from profiles
      const userIds = membersData.map(member => member.user_id)
      const { data: usersData, error: usersError } = await supabase
        .from('profiles')
        .select('id, name')
        .in('id', userIds)

      if (usersError) throw usersError

      // Get email addresses from auth.users via RPC call or direct query
      // Since we can't directly query auth.users, we'll need to get emails differently
      const { data: { user: currentUser } } = await supabase.auth.getUser()
      
      // Get the list owner to set their role correctly
      const { data: listData, error: listError } = await supabase
        .from('lists')
        .select('created_by')
        .eq('id', listId)
        .single()

      if (listError) throw listError

      // Create a map of user details
      const userMap = new Map(usersData?.map(user => [user.id, user]) || [])

      // For now, we'll use a placeholder for emails since we can't easily access auth.users
      // In a real implementation, you might want to store email in profiles or use an RPC function
      const transformedMembers: ListMember[] = membersData.map(member => {
        const user = userMap.get(member.user_id)
        const isOwner = member.user_id === listData.created_by
        const isCurrentUser = member.user_id === currentUser?.id
        
        return {
          id: member.id,
          user_id: member.user_id,
          list_id: member.list_id,
          role: isOwner ? 'owner' : member.role,
          joined_at: member.joined_at,
          name: user?.name || 'Unknown',
          email: isCurrentUser ? currentUser?.email : undefined,
          isCurrentUser
        }
      })

      setMembers(transformedMembers)
    } catch (err) {
      console.error('Error fetching list members:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch members')
    } finally {
      setLoading(false)
    }
  }

  const removeMember = async (memberId: string) => {
    try {
      const { error } = await supabase
        .from('list_members')
        .delete()
        .eq('id', memberId)

      if (error) throw error

      // Refresh members list
      await fetchMembers()
    } catch (err) {
      console.error('Error removing member:', err)
      throw err
    }
  }

  const updateMemberRole = async (memberId: string, newRole: 'editor' | 'member') => {
    try {
      const { error } = await supabase
        .from('list_members')
        .update({ role: newRole })
        .eq('id', memberId)

      if (error) throw error

      // Refresh members list
      await fetchMembers()
    } catch (err) {
      console.error('Error updating member role:', err)
      throw err
    }
  }

  useEffect(() => {
    if (!listId) return

    fetchMembers()

    // Clean up any existing subscription
    if (subscriptionRef.current) {
      supabase.removeChannel(subscriptionRef.current)
      subscriptionRef.current = null
    }

    // Set up real-time subscription for list members
    const channel = supabase
      .channel(`list-members-${listId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'list_members',
          filter: `list_id=eq.${listId}`
        },
        () => {
          // Refetch members when memberships change
          fetchMembers()
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
    members,
    loading,
    error,
    refetch: fetchMembers,
    removeMember,
    updateMemberRole
  }
} 