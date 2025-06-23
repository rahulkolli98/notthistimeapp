import { StyleSheet } from 'react-native'

export const listStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    paddingVertical: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '500',
  },
  headerInfo: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 16,
  },
  listName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  listCategory: {
    fontSize: 14,
    color: '#666',
    textTransform: 'capitalize',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  inviteButton: {
    backgroundColor: '#34C759',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  inviteButtonText: {
    fontSize: 16,
  },
  deleteListButton: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  deleteListButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 12,
  },
  leaveButton: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  leaveButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 12,
  },
  addButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  shoppingModeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  shoppingModeInfo: {
    flex: 1,
  },
  shoppingModeLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  shoppingModeSubtext: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  listContainer: {
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
  },
  itemCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderLeftWidth: 4,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  statusIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  statusIconText: {
    fontSize: 16,
  },
  itemContent: {
    flex: 1,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  itemInfo: {
    flex: 1,
    marginRight: 12,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937', // Gray-800 for better contrast
    marginBottom: 4,
  },
  itemNameCompleted: {
    textDecorationLine: 'line-through',
    color: '#6B7280', // Gray-500
  },
  quantity: {
    fontSize: 12,
    color: '#6B7280', // Gray-500
    fontWeight: '500',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  itemDetails: {
    marginBottom: 12,
  },
  itemDescription: {
    fontSize: 14,
    color: '#6B7280', // Gray-500
    lineHeight: 20,
    marginBottom: 4,
  },
  storeNote: {
    fontSize: 12,
    color: '#007AFF',
    fontStyle: 'italic',
  },
  itemActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusButtons: {
    flexDirection: 'row',
    gap: 8,
    flex: 1,
  },
  statusButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    flex: 1,
    alignItems: 'center',
  },
  statusButtonText: {
    fontSize: 12,
    fontWeight: '500',
  },
  deleteButton: {
    padding: 8,
    marginLeft: 8,
  },
  deleteButtonText: {
    fontSize: 16,
  },
  addedBy: {
    fontSize: 11,
    color: '#9CA3AF', // Gray-400
    textAlign: 'right',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  emptyButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
  },
  regularModeInfo: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    marginRight: 8,
  },
  regularModeText: {
    fontSize: 14,
    fontWeight: '600',
    // Color will be set dynamically based on status
  },
}) 