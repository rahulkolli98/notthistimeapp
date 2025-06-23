import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { ShoppingList } from '../hooks/useUserLists'
import { homeStyles } from './HomeStyles'

interface ShoppingListCardProps {
  list: ShoppingList
  onPress: (list: ShoppingList) => void
}

export function ShoppingListCard({ list, onPress }: ShoppingListCardProps) {
  return (
    <TouchableOpacity style={homeStyles.card} onPress={() => onPress(list)}>
      <View style={homeStyles.cardHeader}>
        <Text style={homeStyles.listName}>{list.name}</Text>
        <Text style={homeStyles.category}>{list.category}</Text>
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