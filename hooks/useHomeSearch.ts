import { useState, useMemo } from 'react'
import { ShoppingList } from './useUserLists'

export function useHomeSearch(lists: ShoppingList[]) {
  const [searchQuery, setSearchQuery] = useState('')

  // Filter lists based on search query
  const filteredLists = useMemo(() => {
    if (!searchQuery.trim()) return lists
    
    const query = searchQuery.toLowerCase()
    return lists.filter(list => 
      list.name.toLowerCase().includes(query) ||
      list.category.toLowerCase().includes(query) ||
      (list.description && list.description.toLowerCase().includes(query))
    )
  }, [lists, searchQuery])

  const clearSearch = () => setSearchQuery('')

  return {
    searchQuery,
    setSearchQuery,
    filteredLists,
    clearSearch
  }
} 