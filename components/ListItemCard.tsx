import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { ListItem } from '../hooks/useListItems'
import { listStyles } from './index'
import { getStatusColor, getStatusBackgroundColor, getStatusText, getStatusIcon } from '../utils/itemHelpers'

interface ListItemCardProps {
  item: ListItem
  shoppingMode: boolean
  onStatusChange: (item: ListItem, newStatus: ListItem['status']) => void
  onDelete: (item: ListItem) => void
}

export function ListItemCard({ item, shoppingMode, onStatusChange, onDelete }: ListItemCardProps) {
  const renderStatusButton = (status: ListItem['status'], label: string) => (
    <TouchableOpacity
      key={status}
      style={[
        listStyles.statusButton,
        { backgroundColor: item.status === status ? getStatusColor(status) : '#f0f0f0' }
      ]}
      onPress={() => onStatusChange(item, status)}
    >
      <Text style={[
        listStyles.statusButtonText,
        { color: item.status === status ? '#fff' : '#333' }
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  )

  return (
    <View style={[
      listStyles.itemCard,
      { 
        borderLeftColor: getStatusColor(item.status),
        backgroundColor: getStatusBackgroundColor(item.status)
      }
    ]}>
      {/* Status Icon */}
      <View style={[listStyles.statusIcon, { backgroundColor: getStatusColor(item.status) }]}>
        <Text style={listStyles.statusIconText}>
          {getStatusIcon(item.status)}
        </Text>
      </View>

      <View style={listStyles.itemContent}>
        <View style={listStyles.itemHeader}>
          <View style={listStyles.itemInfo}>
            <Text style={[
              listStyles.itemName,
              item.status === 'bought' && listStyles.itemNameCompleted
            ]}>
              {item.name}
            </Text>
            {item.quantity > 1 && (
              <Text style={listStyles.quantity}>Qty: {item.quantity}</Text>
            )}
          </View>
          <View style={[listStyles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
            <Text style={listStyles.statusBadgeText}>{getStatusText(item.status)}</Text>
          </View>
        </View>

        {(item.notes || item.store_name) && (
          <View style={listStyles.itemDetails}>
            {item.notes && (
              <Text style={listStyles.itemDescription}>{item.notes}</Text>
            )}
            {item.store_name && (
              <Text style={listStyles.storeNote}>🏪 {item.store_name}</Text>
            )}
          </View>
        )}

        <View style={listStyles.itemActions}>
          {shoppingMode ? (
            // Shopping Mode: Show all status buttons
            <View style={listStyles.statusButtons}>
              {renderStatusButton('needed', 'Need')}
              {renderStatusButton('in_cart', 'Cart')}
              {renderStatusButton('bought', '✓')}
              {renderStatusButton('out_of_stock', 'Out?')}
            </View>
          ) : (
            // Regular Mode: Show only item status info
            <View style={listStyles.regularModeInfo}>
              <Text style={[listStyles.regularModeText, { color: getStatusColor(item.status) }]}>
                Status: {getStatusText(item.status)}
              </Text>
            </View>
          )}
          
          <TouchableOpacity
            style={listStyles.deleteButton}
            onPress={() => onDelete(item)}
          >
            <Text style={listStyles.deleteButtonText}>🗑</Text>
          </TouchableOpacity>
        </View>

        <Text style={listStyles.addedBy}>Added by {item.created_by_name}</Text>
      </View>
    </View>
  )
} 