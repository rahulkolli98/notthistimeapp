import React from 'react'
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native'
import { modalStyles } from './index'

interface AddItemModalProps {
  visible: boolean
  onClose: () => void
  onSubmit: () => Promise<void>
  loading: boolean
  // Form fields
  itemName: string
  setItemName: (value: string) => void
  itemNotes: string
  setItemNotes: (value: string) => void
  quantity: string
  setQuantity: (value: string) => void
  storeName: string
  setStoreName: (value: string) => void
}

export function AddItemModal({
  visible,
  onClose,
  onSubmit,
  loading,
  itemName,
  setItemName,
  itemNotes,
  setItemNotes,
  quantity,
  setQuantity,
  storeName,
  setStoreName
}: AddItemModalProps) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={modalStyles.modalContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={modalStyles.modalHeader}>
          <TouchableOpacity onPress={onClose}>
            <Text style={modalStyles.modalCancelText}>Cancel</Text>
          </TouchableOpacity>
          <Text style={modalStyles.modalTitle}>Add Item</Text>
          <TouchableOpacity onPress={onSubmit} disabled={loading}>
            <Text style={[modalStyles.modalSaveText, loading && modalStyles.modalSaveTextDisabled]}>
              {loading ? 'Adding...' : 'Add'}
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={modalStyles.modalContent}>
          <View style={modalStyles.inputGroup}>
            <Text style={modalStyles.inputLabel}>Item Name *</Text>
            <TextInput
              style={modalStyles.textInput}
              value={itemName}
              onChangeText={setItemName}
              placeholder="e.g., Milk, Bread, Apples"
              autoCapitalize="words"
              maxLength={100}
            />
          </View>

          <View style={modalStyles.inputGroup}>
            <Text style={modalStyles.inputLabel}>Notes (Optional)</Text>
            <TextInput
              style={[modalStyles.textInput, modalStyles.textArea]}
              value={itemNotes}
              onChangeText={setItemNotes}
              placeholder="Any specific details or preferences..."
              multiline
              numberOfLines={2}
              maxLength={200}
            />
          </View>

          <View style={modalStyles.inputRow}>
            <View style={[modalStyles.inputGroup, modalStyles.inputGroupHalf]}>
              <Text style={modalStyles.inputLabel}>Quantity</Text>
              <TextInput
                style={modalStyles.textInput}
                value={quantity}
                onChangeText={setQuantity}
                placeholder="1"
                keyboardType="numeric"
                maxLength={3}
              />
            </View>

            <View style={[modalStyles.inputGroup, modalStyles.inputGroupHalf]}>
              <Text style={modalStyles.inputLabel}>Store Name (Optional)</Text>
              <TextInput
                style={modalStyles.textInput}
                value={storeName}
                onChangeText={setStoreName}
                placeholder="e.g., Walmart, Aisle 5"
                maxLength={50}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  )
} 