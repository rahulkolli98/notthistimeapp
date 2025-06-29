import React from 'react'
import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import { ReplacementRequest } from '../hooks/useReplacementRequests'
import { replacementRequestStyles } from './ReplacementRequestStyles'
import { listDetailsStyles } from './ListDetailsStyles'
import { TruckLoader } from './TruckLoader'

interface ReplacementRequestsSectionProps {
  requests: ReplacementRequest[]
  loading: boolean
  onRequestPress: (request: ReplacementRequest) => void
}

export function ReplacementRequestsSection({
  requests,
  loading,
  onRequestPress
}: ReplacementRequestsSectionProps) {
  if (requests.length === 0 && !loading) {
    return null
  }

  return (
    <View style={replacementRequestStyles.replacementRequestsSection}>
      <Text style={replacementRequestStyles.replacementRequestsTitle}>
        {loading ? 'Loading Requests...' : `Pending Replacement Requests (${requests.length})`}
      </Text>
      {loading ? (
        <View style={listDetailsStyles.loadingContainer}>
          <TruckLoader size="small" />
        </View>
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {requests.map((request) => (
            <TouchableOpacity
              key={request.id}
              style={replacementRequestStyles.replacementRequestCard}
              onPress={() => onRequestPress(request)}
            >
              <Text style={replacementRequestStyles.requestItemName}>
                {request.original_item_name}
              </Text>
              <Text style={replacementRequestStyles.requestSuggestion}>
                → {request.suggested_replacement}
              </Text>
              <Text style={replacementRequestStyles.requestRequester}>
                by {request.requester_name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  )
} 