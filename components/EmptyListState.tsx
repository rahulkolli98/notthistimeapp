import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { listDetailsStyles } from './ListDetailsStyles'

interface EmptyListStateProps {
  onAddItem: () => void
}

export function EmptyListState({ onAddItem }: EmptyListStateProps) {
  return (
    <View style={listDetailsStyles.emptyStateCard}>
      <Text style={listDetailsStyles.emptyTitle}>No Items Yet</Text>
      <Text style={listDetailsStyles.emptySubtitle}>
        Start building your shopping list by adding items!
      </Text>
      <TouchableOpacity style={listDetailsStyles.emptyButton} onPress={onAddItem}>
        <Text style={listDetailsStyles.emptyButtonText}>Add First Item</Text>
      </TouchableOpacity>
    </View>
  )
} 