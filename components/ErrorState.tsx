import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { homeStyles } from './HomeStyles'

interface ErrorStateProps {
  error: string
  onRetry: () => void
}

export function ErrorState({ error, onRetry }: ErrorStateProps) {
  return (
    <View style={homeStyles.errorState}>
      <Text style={homeStyles.errorTitle}>Something went wrong</Text>
      <Text style={homeStyles.errorSubtitle}>{error}</Text>
      <TouchableOpacity style={homeStyles.retryButton} onPress={onRetry}>
        <Text style={homeStyles.retryButtonText}>Try Again</Text>
      </TouchableOpacity>
    </View>
  )
} 