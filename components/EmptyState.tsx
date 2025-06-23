import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { homeStyles } from './HomeStyles'

interface EmptyStateProps {
  type: 'no-lists' | 'no-search-results'
  searchQuery?: string
  onCreateList?: () => void
  onClearSearch?: () => void
}

export function EmptyState({ type, searchQuery, onCreateList, onClearSearch }: EmptyStateProps) {
  if (type === 'no-search-results') {
    return (
      <View style={homeStyles.emptyState}>
        <Text style={homeStyles.emptyTitle}>No Lists Found</Text>
        <Text style={homeStyles.emptySubtitle}>
          No lists match your search for "{searchQuery}". Try a different search term.
        </Text>
        <TouchableOpacity 
          style={homeStyles.emptyButton} 
          onPress={onClearSearch}
        >
          <Text style={homeStyles.emptyButtonText}>Clear Search</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View style={homeStyles.emptyState}>
      <Text style={homeStyles.emptyTitle}>No Shopping Lists Yet</Text>
      <Text style={homeStyles.emptySubtitle}>
        Create your first shopping list to get started with collaborative shopping!
      </Text>
      <TouchableOpacity style={homeStyles.emptyButton} onPress={onCreateList}>
        <Text style={homeStyles.emptyButtonText}>Create Your First List</Text>
      </TouchableOpacity>
    </View>
  )
} 