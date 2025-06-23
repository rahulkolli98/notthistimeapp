import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import AsyncStorage from '@react-native-async-storage/async-storage'

interface ListInfo {
  name: string
  category: string
}

export function useListDetails(listId: string) {
  const [listInfo, setListInfo] = useState<ListInfo | null>(null)
  const [listMemberCount, setListMemberCount] = useState(0)
  const [isOwner, setIsOwner] = useState(false)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchListInfo = async () => {
    try {
      setLoading(true)
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      setCurrentUserId(user.id)

      const { data, error } = await supabase
        .from('lists')
        .select('name, category, created_by')
        .eq('id', listId)
        .single()

      if (error) throw error
      setListInfo(data)
      setIsOwner(data.created_by === user.id)

      // Get member count for this list
      const { data: memberData, error: memberError } = await supabase
        .from('list_members')
        .select('id')
        .eq('list_id', listId)

      if (memberError) throw memberError
      setListMemberCount(memberData?.length || 0)

      // Save this as the last accessed list
      try {
        await AsyncStorage.setItem('lastAccessedListId', listId)
      } catch (storageError) {
        console.error('Error saving last accessed list:', storageError)
      }
    } catch (err) {
      console.error('Error fetching list info:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (listId) fetchListInfo()
  }, [listId])

  return {
    listInfo,
    listMemberCount,
    isOwner,
    currentUserId,
    loading,
    refetch: fetchListInfo
  }
} 