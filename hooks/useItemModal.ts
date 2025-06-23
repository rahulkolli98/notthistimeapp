import { useState } from 'react'
import { Alert } from 'react-native'

export function useItemModal() {
  const [showAddModal, setShowAddModal] = useState(false)
  const [newItemName, setNewItemName] = useState('')
  const [newItemNotes, setNewItemNotes] = useState('')
  const [newItemQuantity, setNewItemQuantity] = useState('1')
  const [newItemStoreName, setNewItemStoreName] = useState('')
  const [addingItem, setAddingItem] = useState(false)

  const openModal = () => setShowAddModal(true)
  
  const closeModal = () => {
    setShowAddModal(false)
    resetForm()
  }

  const resetForm = () => {
    setNewItemName('')
    setNewItemNotes('')
    setNewItemQuantity('1')
    setNewItemStoreName('')
  }

  const validateForm = () => {
    if (newItemName.trim() === '') {
      Alert.alert('Error', 'Please enter an item name')
      return false
    }
    return true
  }

  const getFormData = () => ({
    name: newItemName,
    notes: newItemNotes || undefined,
    quantity: parseInt(newItemQuantity) || 1,
    store_name: newItemStoreName || undefined
  })

  return {
    // Modal state
    showAddModal,
    addingItem,
    setAddingItem,
    
    // Form fields
    newItemName,
    setNewItemName,
    newItemNotes,
    setNewItemNotes,
    newItemQuantity,
    setNewItemQuantity,
    newItemStoreName,
    setNewItemStoreName,
    
    // Actions
    openModal,
    closeModal,
    resetForm,
    validateForm,
    getFormData
  }
} 