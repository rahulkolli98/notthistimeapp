import { StyleSheet } from 'react-native'

export const replacementRequestStyles = StyleSheet.create({
  replacementRequestsSection: {
    backgroundColor: '#fff',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  replacementRequestsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  replacementRequestCard: {
    backgroundColor: '#fff3cd',
    borderWidth: 1,
    borderColor: '#ffeaa7',
    borderRadius: 8,
    padding: 12,
    marginLeft: 16,
    marginRight: 8,
    width: 180,
    borderLeftWidth: 4,
    borderLeftColor: '#FF9500',
  },
  requestItemName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  requestSuggestion: {
    fontSize: 13,
    color: '#666',
    marginBottom: 4,
  },
  requestRequester: {
    fontSize: 11,
    color: '#999',
  },
}) 