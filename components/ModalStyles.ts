import { StyleSheet } from 'react-native'

export const modalStyles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalCancelText: {
    fontSize: 16,
    color: '#007AFF',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  modalSaveText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
  modalSaveTextDisabled: {
    color: '#ccc',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputGroupHalf: {
    flex: 1,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 16,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
  },
  textArea: {
    height: 60,
    textAlignVertical: 'top',
  },
  helperText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  charCount: {
    fontSize: 12,
    color: '#666',
    textAlign: 'right',
    marginTop: 4,
  },
  // Out of Stock Modal Styles
  outOfStockInfo: {
    backgroundColor: '#fff3cd',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#FF9500',
  },
  outOfStockItemName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  outOfStockSubtext: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  replacementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  replacementInput: {
    flex: 1,
  },
  removeButton: {
    marginLeft: 12,
    padding: 8,
    backgroundColor: '#ff3b30',
    borderRadius: 16,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  addReplacementButton: {
    backgroundColor: '#f0f8ff',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#007AFF',
    borderStyle: 'dashed',
  },
  addReplacementButtonText: {
    color: '#007AFF',
    fontWeight: '500',
  },
  actionButtons: {
    marginTop: 20,
  },
  outOfStockOnlyButton: {
    backgroundColor: '#f8f8f8',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  outOfStockOnlyButtonText: {
    color: '#666',
    fontWeight: '500',
  },
  // Replacement Request Response Modal Styles
  requestResponseInfo: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  requestResponseItemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  requestResponseSuggestion: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  requestResponseRequester: {
    fontSize: 12,
    color: '#999',
  },
  responseActionButtons: {
    gap: 12,
    marginTop: 20,
  },
  acceptButton: {
    backgroundColor: '#34C759',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  acceptButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  rejectButton: {
    backgroundColor: '#FF3B30',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  rejectButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  // Invite Modal Styles
  inviteInfo: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#34C759',
  },
  inviteInfoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  inviteInfoSubtext: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  roleSelector: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 8,
  },
  roleButton: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  roleButtonSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  roleButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  roleButtonTextSelected: {
    color: '#fff',
  },
  membersSection: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  memberCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 8,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  memberEmail: {
    fontSize: 12,
    color: '#666',
  },
  memberJoinDate: {
    fontSize: 11,
    color: '#999',
    marginTop: 2,
  },
  memberActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  roleBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
  },
  ownerBadge: {
    backgroundColor: '#34C759',
  },
  roleBadgeText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#333',
  },
  ownerBadgeText: {
    color: '#fff',
  },
  inviteSection: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  inviteToggleButton: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  inviteToggleText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  sendInviteButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  sendInviteButtonDisabled: {
    backgroundColor: '#ccc',
  },
  sendInviteButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  sendInviteButtonTextDisabled: {
    color: '#999',
  },
}) 