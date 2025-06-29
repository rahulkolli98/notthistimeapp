import React, { useState } from 'react'
import { View, Text, TouchableOpacity, Modal, Alert } from 'react-native'
import { listDetailsStyles } from './ListDetailsStyles'

interface ListDetailsHeaderProps {
  listName: string
  category: string
  isOwner: boolean
  onBack: () => void
  onInvite: () => void
  onDelete: () => void
  onLeave: () => void
  onAddItem: () => void
}

export function ListDetailsHeader({
  listName,
  category,
  isOwner,
  onBack,
  onInvite,
  onDelete,
  onLeave,
  onAddItem
}: ListDetailsHeaderProps) {
  const [showMenu, setShowMenu] = useState(false)

  const handleMenuAction = (action: 'invite' | 'delete' | 'leave') => {
    setShowMenu(false)
    
    if (action === 'invite') {
      onInvite()
    } else if (action === 'delete') {
      Alert.alert(
        'Delete List',
        `Are you sure you want to permanently delete "${listName}"? This action cannot be undone and will remove all items, members, and related data.`,
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Delete', 
            style: 'destructive',
            onPress: onDelete
          }
        ]
      )
    } else if (action === 'leave') {
      Alert.alert(
        'Leave List',
        `Are you sure you want to leave "${listName}"? You will no longer have access to this list.`,
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Leave', 
            style: 'destructive',
            onPress: onLeave
          }
        ]
      )
    }
  }

  return (
    <View style={listDetailsStyles.header}>
      <TouchableOpacity style={listDetailsStyles.backButton} onPress={onBack}>
        <Text style={listDetailsStyles.backButtonText}>← Back</Text>
      </TouchableOpacity>
      
      <View style={listDetailsStyles.headerInfo}>
        <Text style={listDetailsStyles.listName}>{listName}</Text>
        <Text style={listDetailsStyles.listCategory}>{category}</Text>
      </View>
      
      <View style={listDetailsStyles.headerActions}>
        <TouchableOpacity style={listDetailsStyles.addButton} onPress={onAddItem}>
          <Text style={listDetailsStyles.addButtonText}>+ Add</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={listDetailsStyles.menuButton} 
          onPress={() => setShowMenu(true)}
        >
          <Text style={listDetailsStyles.menuButtonText}>⋯</Text>
        </TouchableOpacity>
      </View>

      {/* Menu Modal */}
      <Modal
        visible={showMenu}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowMenu(false)}
      >
        <TouchableOpacity 
          style={listDetailsStyles.menuOverlay}
          activeOpacity={1}
          onPress={() => setShowMenu(false)}
        >
          <View style={listDetailsStyles.menuContainer}>
            <TouchableOpacity 
              style={listDetailsStyles.menuItem}
              onPress={() => handleMenuAction('invite')}
            >
              <Text style={listDetailsStyles.menuItemText}>👥 Invite Members</Text>
            </TouchableOpacity>
            
            {isOwner ? (
              <TouchableOpacity 
                style={[listDetailsStyles.menuItem, listDetailsStyles.menuItemDestructive]}
                onPress={() => handleMenuAction('delete')}
              >
                <Text style={[listDetailsStyles.menuItemText, listDetailsStyles.menuItemTextDestructive]}>
                  🗑 Delete List
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity 
                style={[listDetailsStyles.menuItem, listDetailsStyles.menuItemDestructive]}
                onPress={() => handleMenuAction('leave')}
              >
                <Text style={[listDetailsStyles.menuItemText, listDetailsStyles.menuItemTextDestructive]}>
                  🚪 Leave List
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  )
} 