import React, { useState } from 'react'
import { View, Text, TouchableOpacity, Alert } from 'react-native'
import { ShoppingList } from '../hooks/useUserLists'
import { homeStyles } from './index'

interface ShoppingListCardProps {
  list: ShoppingList
  onPress: (list: ShoppingList) => void
  onDelete?: (listId: string) => void
  isOwner?: boolean
}

export function ShoppingListCard({ list, onPress, onDelete, isOwner }: ShoppingListCardProps) {
  const [isPressed, setIsPressed] = useState(false)

  const handleDelete = () => {
    if (!onDelete || !isOwner) return
    
    Alert.alert(
      'Delete List',
      `Are you sure you want to permanently delete "${list.name}"? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => onDelete(list.id)
        }
      ]
    )
  }

  return (
    <TouchableOpacity 
      style={[
        homeStyles.card,
        isPressed && {
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0,
          elevation: 0,
          transform: [{ translateX: 3 }, { translateY: 3 }]
        }
      ]} 
      onPress={() => onPress(list)}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      activeOpacity={1}
    >
      <View style={homeStyles.cardHeader}>
        <Text style={homeStyles.listName}>{list.name}</Text>
        <View style={homeStyles.categoryContainer}>
          <Text style={homeStyles.category}>{list.category}</Text>
          {isOwner && onDelete && (
            <TouchableOpacity 
              style={homeStyles.deleteButton}
              onPress={(e) => {
                e.stopPropagation()
                handleDelete()
              }}
            >
              <Text style={homeStyles.deleteButtonText}>🗑</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
      
      <View style={homeStyles.cardContent}>
        {list.description && (
          <Text style={homeStyles.description} numberOfLines={2}>
            {list.description}
          </Text>
        )}
        
        <View style={homeStyles.cardFooter}>
          <Text style={homeStyles.itemCount}>
            {list.item_count || 0} {(list.item_count || 0) === 1 ? 'item' : 'items'}
          </Text>
          <Text style={homeStyles.creator}>by {list.creator_name}</Text>
        </View>
      </View>
    </TouchableOpacity>
  )
} 