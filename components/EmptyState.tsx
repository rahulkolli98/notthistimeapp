import React, { useState } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { homeStyles } from './HomeStyles'

interface EmptyStateProps {
  type: 'no-lists' | 'no-search-results'
  searchQuery?: string
  onCreateList?: () => void
  onClearSearch?: () => void
}

export function EmptyState({ type, searchQuery, onCreateList, onClearSearch }: EmptyStateProps) {
  const [isPressed, setIsPressed] = useState(false)

  if (type === 'no-search-results') {
    return (
      <View style={homeStyles.emptyState}>
        <Text style={homeStyles.emptyTitle}>No Lists Found</Text>
        <Text style={homeStyles.emptySubtitle}>
          No lists match your search for "{searchQuery}". Try a different search term.
        </Text>
        <TouchableOpacity 
          style={[
            homeStyles.emptyButton,
            isPressed && {
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0,
              elevation: 0,
              transform: [{ translateX: 3 }, { translateY: 3 }]
            }
          ]} 
          onPress={onClearSearch}
          onPressIn={() => setIsPressed(true)}
          onPressOut={() => setIsPressed(false)}
          activeOpacity={1}
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
      <TouchableOpacity 
        style={[
          homeStyles.emptyButton,
          isPressed && {
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0,
            elevation: 0,
            transform: [{ translateX: 3 }, { translateY: 3 }]
          }
        ]} 
        onPress={onCreateList}
        onPressIn={() => setIsPressed(true)}
        onPressOut={() => setIsPressed(false)}
        activeOpacity={1}
      >
        <Text style={homeStyles.emptyButtonText}>Create Your First List</Text>
      </TouchableOpacity>
    </View>
  )
} 