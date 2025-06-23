import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export interface User {
  id: string
  name: string
  email: string
}

export interface Invitation {
  id: string
  list_id: string
  invited_by: string
  invited_email: string
  invited_user_id: string | null
  role: 'owner' | 'editor' | 'member'
  status: 'pending' | 'accepted' | 'declined' | 'expired'
  message: string | null
  created_at: string
  expires_at: string
  responded_at: string | null
  // Joined data
  list_name?: string
  inviter_name?: string
  invited_user_name?: string
}

export function useInvitations() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Search for registered users by email
  // Note: This is a simplified version for registered users only
  // In a real app, you'd want a backend endpoint to search users securely
  const searchUsers = async (email: string): Promise<User[]> => {
    try {
      setLoading(true)
      setError(null)

      if (!email.trim()) {
        return []
      }

      // For now, we'll return an empty array and let users type exact emails
      // In a production app, you'd want a secure backend endpoint to search users
      // This prevents exposing all user emails to any authenticated user
      
      // For demo purposes, we'll just validate the email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        return []
      }

      // Return a placeholder result indicating the email is valid
      // The actual user lookup will happen when sending the invitation
      return [{
        id: 'placeholder',
        name: 'User (if registered)',
        email: email
      }]
    } catch (err) {
      console.error('Error searching users:', err)
      setError(err instanceof Error ? err.message : 'Failed to search users')
      return []
    } finally {
      setLoading(false)
    }
  }

  // Send invitation to a registered user
  const sendInvitation = async (
    listId: string,
    userEmail: string,
    role: 'member' | 'editor' = 'member',
    message?: string
  ) => {
    try {
      setLoading(true)
      setError(null)

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No authenticated user')

      // The invitation will be created and the invited_user_id will be set
      // automatically by the database trigger if the user exists
      const { error } = await supabase
        .from('invitations')
        .insert({
          list_id: listId,
          invited_by: user.id,
          invited_email: userEmail,
          role,
          message: message?.trim() || null,
          status: 'pending'
        })

      if (error) {
        // Handle specific error for duplicate invitations
        if (error.code === '23505') {
          throw new Error('An invitation has already been sent to this email for this list')
        }
        throw error
      }

      return true
    } catch (err) {
      console.error('Error sending invitation:', err)
      setError(err instanceof Error ? err.message : 'Failed to send invitation')
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Get sent invitations (invitations I sent)
  const getSentInvitations = async (listId?: string): Promise<Invitation[]> => {
    try {
      setLoading(true)
      setError(null)

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No authenticated user')

      let query = supabase
        .from('invitations')
        .select(`
          id,
          list_id,
          invited_by,
          invited_email,
          invited_user_id,
          role,
          status,
          message,
          created_at,
          expires_at,
          responded_at
        `)
        .eq('invited_by', user.id)
        .order('created_at', { ascending: false })

      if (listId) {
        query = query.eq('list_id', listId)
      }

      const { data, error } = await query

      if (error) throw error

      if (!data || data.length === 0) {
        return []
      }

      // Get list names and invited user names
      const listIds = [...new Set(data.map(inv => inv.list_id))]
      const userIds = [...new Set(data.map(inv => inv.invited_user_id).filter(Boolean))]

      const [listsData, usersData] = await Promise.all([
        supabase.from('lists').select('id, name').in('id', listIds),
        userIds.length > 0 
          ? supabase.from('profiles').select('id, name').in('id', userIds)
          : Promise.resolve({ data: [], error: null })
      ])

      if (listsData.error) throw listsData.error
      if (usersData.error) throw usersData.error

      // Create maps for quick lookup
      const listMap = new Map(listsData.data?.map(list => [list.id, list.name]) || [])
      const userMap = new Map(usersData.data?.map(user => [user.id, user.name]) || [])

      // Transform the data
      const invitations: Invitation[] = data.map(inv => ({
        ...inv,
        list_name: listMap.get(inv.list_id),
        invited_user_name: inv.invited_user_id ? userMap.get(inv.invited_user_id) : undefined
      }))

      return invitations
    } catch (err) {
      console.error('Error fetching sent invitations:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch sent invitations')
      return []
    } finally {
      setLoading(false)
    }
  }

  // Get received invitations (invitations sent to me)
  const getReceivedInvitations = async (): Promise<Invitation[]> => {
    try {
      setLoading(true)
      setError(null)

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No authenticated user')

      const { data, error } = await supabase
        .from('invitations')
        .select(`
          id,
          list_id,
          invited_by,
          invited_email,
          invited_user_id,
          role,
          status,
          message,
          created_at,
          expires_at,
          responded_at
        `)
        .eq('invited_user_id', user.id)
        .eq('status', 'pending')
        .gt('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false })

      if (error) throw error

      if (!data || data.length === 0) {
        return []
      }

      // Get list names and inviter names
      const listIds = [...new Set(data.map(inv => inv.list_id))]
      const inviterIds = [...new Set(data.map(inv => inv.invited_by))]

      const [listsData, invitersData] = await Promise.all([
        supabase.from('lists').select('id, name').in('id', listIds),
        supabase.from('profiles').select('id, name').in('id', inviterIds)
      ])

      if (listsData.error) throw listsData.error
      if (invitersData.error) throw invitersData.error

      // Create maps for quick lookup
      const listMap = new Map(listsData.data?.map(list => [list.id, list.name]) || [])
      const inviterMap = new Map(invitersData.data?.map(user => [user.id, user.name]) || [])

      // Transform the data
      const invitations: Invitation[] = data.map(inv => ({
        ...inv,
        list_name: listMap.get(inv.list_id),
        inviter_name: inviterMap.get(inv.invited_by)
      }))

      return invitations
    } catch (err) {
      console.error('Error fetching received invitations:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch received invitations')
      return []
    } finally {
      setLoading(false)
    }
  }

  // Accept an invitation
  const acceptInvitation = async (invitationId: string) => {
    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase.rpc('accept_invitation', {
        invitation_id: invitationId
      })

      if (error) throw error
      if (!data) throw new Error('Failed to accept invitation')

      return true
    } catch (err) {
      console.error('Error accepting invitation:', err)
      setError(err instanceof Error ? err.message : 'Failed to accept invitation')
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Decline an invitation
  const declineInvitation = async (invitationId: string) => {
    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase.rpc('decline_invitation', {
        invitation_id: invitationId
      })

      if (error) throw error
      if (!data) throw new Error('Failed to decline invitation')

      return true
    } catch (err) {
      console.error('Error declining invitation:', err)
      setError(err instanceof Error ? err.message : 'Failed to decline invitation')
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Cancel a sent invitation
  const cancelInvitation = async (invitationId: string) => {
    try {
      setLoading(true)
      setError(null)

      const { error } = await supabase
        .from('invitations')
        .delete()
        .eq('id', invitationId)

      if (error) throw error

      return true
    } catch (err) {
      console.error('Error canceling invitation:', err)
      setError(err instanceof Error ? err.message : 'Failed to cancel invitation')
      throw err
    } finally {
      setLoading(false)
    }
  }

  return {
    loading,
    error,
    searchUsers,
    sendInvitation,
    getSentInvitations,
    getReceivedInvitations,
    acceptInvitation,
    declineInvitation,
    cancelInvitation
  }
} 