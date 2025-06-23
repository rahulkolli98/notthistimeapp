import React from 'react'
import { View, Text, ActivityIndicator } from 'react-native'
import { homeStyles } from './HomeStyles'

interface LoadingStateProps {
  message?: string
}

export function LoadingState({ message = 'Loading your lists...' }: LoadingStateProps) {
  return (
    <View style={homeStyles.loadingContainer}>
      <ActivityIndicator size="large" color="#007AFF" />
      <Text style={homeStyles.loadingText}>{message}</Text>
    </View>
  )
} 