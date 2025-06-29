import React, { useState } from 'react'
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  Alert,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity
} from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useListItems, ListItem } from '../../hooks/useListItems'
import { useReplacementRequests, ReplacementRequest } from '../../hooks/useReplacementRequests'
import { useUserLists } from '../../hooks/useUserLists'
import { useListMembers, ListMember } from '../../hooks/useListMembers'
import { useListDetails } from '../../hooks/useListDetails'
import { useItemModal } from '../../hooks/useItemModal'
import { supabase } from '../../lib/supabase'
import { 
  modalStyles, 
  AddItemModal, 
  ListItemCard, 
  TruckLoader,
  ListDetailsHeader,
  ShoppingModeToggle,
  EmptyListState,
  ReplacementRequestsSection,
  InviteMembersModal,
  listDetailsStyles
} from '../../components'
import { sortItems } from '../../utils/itemHelpers'

export default function ListDetails() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const router = useRouter()
  
  // Custom hooks
  const { items, loading, error, refetch, addItem, updateItemStatus, deleteItem } = useListItems(id!)
  const { requests, loading: requestsLoading, respondToRequest } = useReplacementRequests(id!)
  const { leaveList, deleteList } = useUserLists()
  const { members, loading: membersLoading, removeMember, updateMemberRole } = useListMembers(id!)
  const { listInfo, listMemberCount, isOwner, currentUserId } = useListDetails(id!)
  const itemModal = useItemModal()
  
  // Shopping mode and out of stock replacement states
  const [shoppingMode, setShoppingMode] = useState(false)
  const [showReplacementModal, setShowReplacementModal] = useState(false)
  const [selectedOutOfStockItem, setSelectedOutOfStockItem] = useState<ListItem | null>(null)
  const [replacementSuggestions, setReplacementSuggestions] = useState([''])
  const [submittingReplacements, setSubmittingReplacements] = useState(false)
  
  // Replacement request response states
  const [showResponseModal, setShowResponseModal] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState<ReplacementRequest | null>(null)
  const [responseItemName, setResponseItemName] = useState('')
  const [respondingToRequest, setRespondingToRequest] = useState(false)

  // Invitation modal state
  const [showInviteModal, setShowInviteModal] = useState(false)

  const handleAddItem = async () => {
    if (!itemModal.validateForm()) return

    itemModal.setAddingItem(true)
    try {
      await addItem(itemModal.getFormData())
      itemModal.closeModal()
    } catch (err) {
      Alert.alert('Error', 'Failed to add item')
    } finally {
      itemModal.setAddingItem(false)
    }
  }

  const handleStatusChange = async (item: ListItem, newStatus: ListItem['status']) => {
    // If marking as out of stock and in shopping mode, give user options
    if (newStatus === 'out_of_stock' && shoppingMode) {
      // Only show replacement modal if there are collaborators (more than 1 member)
      if (listMemberCount > 1) {
        Alert.alert(
          'Item Out of Stock',
          `"${item.name}" is not available. What would you like to do?`,
          [
            { text: 'Cancel', style: 'cancel' },
            { 
              text: 'Just Mark Out of Stock', 
              onPress: async () => {
                try {
                  await updateItemStatus(item.id, newStatus)
                } catch (err) {
                  Alert.alert('Error', 'Failed to update item status')
                }
              }
            },
            {
              text: 'Suggest Replacements',
              onPress: () => {
                setSelectedOutOfStockItem(item)
                setReplacementSuggestions(['']) // Start with one empty suggestion
                setShowReplacementModal(true)
              }
            }
          ]
        )
        return
      } else {
        // If no collaborators, just mark as out of stock without replacement options
        Alert.alert(
          'Item Out of Stock',
          'This item will be marked as out of stock. Add collaborators to your list to request replacement suggestions.',
          [
            { text: 'Cancel', style: 'cancel' },
            { 
              text: 'Mark Out of Stock', 
              onPress: async () => {
                try {
                  await updateItemStatus(item.id, newStatus)
                } catch (err) {
                  Alert.alert('Error', 'Failed to update item status')
                }
              }
            }
          ]
        )
        return
      }
    }

    // Otherwise, just update the status normally
    try {
      await updateItemStatus(item.id, newStatus)
    } catch (err) {
      Alert.alert('Error', 'Failed to update item status')
    }
  }

  const handleDeleteItem = (item: ListItem) => {
    Alert.alert(
      'Delete Item',
      `Are you sure you want to delete "${item.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteItem(item.id)
            } catch (err) {
              Alert.alert('Error', 'Failed to delete item')
            }
          }
        }
      ]
    )
  }

  const handleLeaveList = () => {
    Alert.alert(
      'Leave List',
      `Are you sure you want to leave "${listInfo?.name}"? You will no longer have access to this list.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Leave',
          style: 'destructive',
          onPress: async () => {
            try {
              await leaveList(id!)
              Alert.alert(
                'Left List',
                'You have successfully left the list.',
                [{ text: 'OK', onPress: () => router.back() }]
              )
            } catch (err) {
              Alert.alert('Error', err instanceof Error ? err.message : 'Failed to leave list')
            }
          }
        }
      ]
    )
  }

  const handleDeleteList = () => {
    Alert.alert(
      'Delete List',
      `Are you sure you want to permanently delete "${listInfo?.name}"? This action cannot be undone and will remove all items, members, and related data.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteList(id!)
              Alert.alert(
                'List Deleted',
                'The list has been permanently deleted.',
                [{ text: 'OK', onPress: () => router.back() }]
              )
            } catch (err) {
              Alert.alert('Error', err instanceof Error ? err.message : 'Failed to delete list')
            }
          }
        }
      ]
    )
  }

  const handleOutOfStockWithoutReplacements = async () => {
    if (!selectedOutOfStockItem) return

    try {
      await updateItemStatus(selectedOutOfStockItem.id, 'out_of_stock')
      setShowReplacementModal(false)
      setSelectedOutOfStockItem(null)
      setReplacementSuggestions([''])
    } catch (err) {
      Alert.alert('Error', 'Failed to update item status')
    }
  }

  const handleSubmitReplacements = async () => {
    if (!selectedOutOfStockItem) return

    // Filter out empty suggestions
    const validSuggestions = replacementSuggestions.filter(s => s.trim() !== '')
    
    if (validSuggestions.length === 0) {
      Alert.alert('Error', 'Please add at least one replacement suggestion or mark as out of stock without replacements')
      return
    }

    setSubmittingReplacements(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No authenticated user')

      // First, mark the item as out of stock
      await updateItemStatus(selectedOutOfStockItem.id, 'out_of_stock')

      // Then, create replacement requests for each suggestion
      const replacementRequests = validSuggestions.map(suggestion => ({
        item_id: selectedOutOfStockItem.id,
        requested_by: user.id,
        suggested_replacement: suggestion.trim(),
        original_item_name: selectedOutOfStockItem.name,
        status: 'pending'
      }))

      const { error } = await supabase
        .from('replacement_requests')
        .insert(replacementRequests)

      if (error) throw error
      
      Alert.alert(
        'Replacement Suggestions Sent!',
        `Your replacement suggestions for "${selectedOutOfStockItem.name}" have been sent to your collaborators.`,
        [{ text: 'OK' }]
      )

      // Reset and close modal
      setShowReplacementModal(false)
      setSelectedOutOfStockItem(null)
      setReplacementSuggestions([''])
    } catch (err) {
      console.error('Error submitting replacements:', err)
      Alert.alert('Error', 'Failed to submit replacement suggestions')
    } finally {
      setSubmittingReplacements(false)
    }
  }

  const addReplacementField = () => {
    setReplacementSuggestions([...replacementSuggestions, ''])
  }

  const updateReplacementSuggestion = (index: number, value: string) => {
    const updated = [...replacementSuggestions]
    updated[index] = value
    setReplacementSuggestions(updated)
  }

  const removeReplacementField = (index: number) => {
    if (replacementSuggestions.length > 1) {
      const updated = replacementSuggestions.filter((_, i) => i !== index)
      setReplacementSuggestions(updated)
    }
  }

  const handleRequestResponse = (request: ReplacementRequest) => {
    setSelectedRequest(request)
    setResponseItemName(request.suggested_replacement) // Pre-fill with the suggestion
    setShowResponseModal(true)
  }

  const handleAcceptRequest = async () => {
    if (!selectedRequest || !responseItemName.trim()) {
      Alert.alert('Error', 'Please enter the item name to add to the list')
      return
    }

    setRespondingToRequest(true)
    try {
      await respondToRequest(selectedRequest.id, 'accepted', responseItemName.trim())
      
      // Close modal immediately and show success
      setShowResponseModal(false)
      setSelectedRequest(null)
      setResponseItemName('')
      
      Alert.alert('Success', `"${responseItemName.trim()}" has been added to your shopping list!`)
      
      // Refresh the items list to show the new item
      refetch()
    } catch (err) {
      Alert.alert('Error', 'Failed to accept replacement request')
    } finally {
      setRespondingToRequest(false)
    }
  }

  const handleRejectRequest = async () => {
    if (!selectedRequest) return

    setRespondingToRequest(true)
    try {
      await respondToRequest(selectedRequest.id, 'rejected')
      
      // Close modal immediately
      setShowResponseModal(false)
      setSelectedRequest(null)
      setResponseItemName('')
      
      Alert.alert('Success', 'Replacement request has been declined')
    } catch (err) {
      Alert.alert('Error', 'Failed to reject replacement request')
    } finally {
      setRespondingToRequest(false)
    }
  }

  if (loading && items.length === 0) {
    return (
      <View style={listDetailsStyles.loadingContainer}>
        <TruckLoader size="medium" />
        <Text style={listDetailsStyles.loadingText}>Loading items...</Text>
      </View>
    )
  }

  return (
    <View style={listDetailsStyles.root}>
      {/* Header */}
      <ListDetailsHeader
        listName={listInfo?.name || 'Shopping List'}
        category={listInfo?.category || ''}
        isOwner={isOwner}
        onBack={() => router.back()}
        onInvite={() => setShowInviteModal(true)}
        onDelete={handleDeleteList}
        onLeave={handleLeaveList}
        onAddItem={itemModal.openModal}
      />

      {/* Shopping Mode Toggle */}
      <ShoppingModeToggle
        shoppingMode={shoppingMode}
        onToggle={setShoppingMode}
      />

      {/* Replacement Requests Section */}
      <ReplacementRequestsSection
        requests={requests}
        loading={requestsLoading}
        onRequestPress={handleRequestResponse}
      />

      {/* Items List */}
      <FlatList
        data={sortItems(items)}
        renderItem={({ item }) => (
          <ListItemCard
            item={item}
            shoppingMode={shoppingMode}
            onStatusChange={handleStatusChange}
            onDelete={handleDeleteItem}
          />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={items.length === 0 ? listDetailsStyles.emptyContainer : listDetailsStyles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={loading && items.length > 0}
            onRefresh={refetch}
            colors={['#007AFF']}
            tintColor="#007AFF"
          />
        }
        ListEmptyComponent={<EmptyListState onAddItem={itemModal.openModal} />}
      />

      {/* Add Item Modal */}
      <AddItemModal
        visible={itemModal.showAddModal}
        onClose={itemModal.closeModal}
        onSubmit={handleAddItem}
        loading={itemModal.addingItem}
        itemName={itemModal.newItemName}
        setItemName={itemModal.setNewItemName}
        itemNotes={itemModal.newItemNotes}
        setItemNotes={itemModal.setNewItemNotes}
        quantity={itemModal.newItemQuantity}
        setQuantity={itemModal.setNewItemQuantity}
        storeName={itemModal.newItemStoreName}
        setStoreName={itemModal.setNewItemStoreName}
      />

      {/* Replacement Suggestions Modal */}
      <Modal
        visible={showReplacementModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowReplacementModal(false)}
      >
        <KeyboardAvoidingView
          style={modalStyles.modalContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={modalStyles.modalHeader}>
            <TouchableOpacity onPress={() => setShowReplacementModal(false)}>
              <Text style={modalStyles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
            <Text style={modalStyles.modalTitle}>Item Out of Stock</Text>
            <TouchableOpacity onPress={handleSubmitReplacements} disabled={submittingReplacements}>
              <Text style={[modalStyles.modalSaveText, submittingReplacements && modalStyles.modalSaveTextDisabled]}>
                {submittingReplacements ? 'Sending...' : 'Send'}
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={modalStyles.modalContent}>
            <View style={modalStyles.outOfStockInfo}>
              <Text style={modalStyles.outOfStockItemName}>"{selectedOutOfStockItem?.name}"</Text>
              <Text style={modalStyles.outOfStockSubtext}>
                This item is not available. You can suggest replacements to your collaborators or mark it as out of stock without replacements.
              </Text>
            </View>

            <View style={modalStyles.inputGroup}>
              <Text style={modalStyles.inputLabel}>Replacement Suggestions</Text>
              {replacementSuggestions.map((suggestion, index) => (
                <View key={index} style={modalStyles.replacementRow}>
                  <TextInput
                    style={[modalStyles.textInput, modalStyles.replacementInput]}
                    value={suggestion}
                    onChangeText={(value) => updateReplacementSuggestion(index, value)}
                    placeholder={`Alternative ${index + 1} (e.g., Brand X, Different size)`}
                    autoCapitalize="words"
                    maxLength={100}
                  />
                  {replacementSuggestions.length > 1 && (
                    <TouchableOpacity
                      style={modalStyles.removeButton}
                      onPress={() => removeReplacementField(index)}
                    >
                      <Text style={modalStyles.removeButtonText}>✕</Text>
                    </TouchableOpacity>
                  )}
                </View>
              ))}
              
              <TouchableOpacity style={modalStyles.addReplacementButton} onPress={addReplacementField}>
                <Text style={modalStyles.addReplacementButtonText}>+ Add Another Suggestion</Text>
              </TouchableOpacity>
            </View>

            <View style={modalStyles.actionButtons}>
              <TouchableOpacity
                style={modalStyles.outOfStockOnlyButton}
                onPress={handleOutOfStockWithoutReplacements}
              >
                <Text style={modalStyles.outOfStockOnlyButtonText}>Mark Out of Stock Only</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>

      {/* Replacement Request Response Modal */}
      <Modal
        visible={showResponseModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowResponseModal(false)}
      >
        <KeyboardAvoidingView
          style={modalStyles.modalContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={modalStyles.modalHeader}>
            <TouchableOpacity onPress={() => setShowResponseModal(false)}>
              <Text style={modalStyles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
            <Text style={modalStyles.modalTitle}>Replacement Request</Text>
            <View style={{ width: 60 }} />
          </View>

          <ScrollView style={modalStyles.modalContent}>
            <View style={modalStyles.requestResponseInfo}>
              <Text style={modalStyles.requestResponseItemName}>
                Original item: "{selectedRequest?.original_item_name}"
              </Text>
              <Text style={modalStyles.requestResponseSuggestion}>
                Suggested replacement: "{selectedRequest?.suggested_replacement}"
              </Text>
              <Text style={modalStyles.requestResponseRequester}>
                Requested by: {selectedRequest?.requester_name}
              </Text>
            </View>

            <View style={modalStyles.inputGroup}>
              <Text style={modalStyles.inputLabel}>Add to List As:</Text>
              <TextInput
                style={modalStyles.textInput}
                value={responseItemName}
                onChangeText={setResponseItemName}
                placeholder="Enter the item name to add to the list"
                autoCapitalize="words"
                maxLength={100}
              />
              <Text style={modalStyles.helperText}>
                You can modify the suggested name before adding it to the list
              </Text>
            </View>

            <View style={modalStyles.responseActionButtons}>
              <TouchableOpacity
                style={[modalStyles.acceptButton, respondingToRequest && modalStyles.buttonDisabled]}
                onPress={handleAcceptRequest}
                disabled={respondingToRequest}
              >
                <Text style={modalStyles.acceptButtonText}>
                  {respondingToRequest ? 'Processing...' : 'Accept & Add to List'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[modalStyles.rejectButton, respondingToRequest && modalStyles.buttonDisabled]}
                onPress={handleRejectRequest}
                disabled={respondingToRequest}
              >
                <Text style={modalStyles.rejectButtonText}>
                  {respondingToRequest ? 'Processing...' : 'Decline'}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>

      {/* Invite Members Modal */}
      <InviteMembersModal
        visible={showInviteModal}
        listId={id!}
        listName={listInfo?.name || 'Shopping List'}
        members={members}
        membersLoading={membersLoading}
        currentUserId={currentUserId}
        isOwner={isOwner}
        onClose={() => setShowInviteModal(false)}
        onRemoveMember={removeMember}
        onUpdateMemberRole={updateMemberRole}
      />
    </View>
  )
} 