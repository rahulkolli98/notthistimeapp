import React, { useState } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { homeStyles } from './HomeStyles'

interface ErrorStateProps {
  error: string
  onRetry: () => void
}

export function ErrorState({ error, onRetry }: ErrorStateProps) {
  const [isPressed, setIsPressed] = useState(false)

  return (
    <View style={homeStyles.errorState}>
      <Text style={homeStyles.errorTitle}>Something went wrong</Text>
      <Text style={homeStyles.errorSubtitle}>{error}</Text>
      <TouchableOpacity 
        style={[
          homeStyles.retryButton,
          isPressed && {
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0,
            elevation: 0,
            transform: [{ translateX: 3 }, { translateY: 3 }]
          }
        ]} 
        onPress={onRetry}
        onPressIn={() => setIsPressed(true)}
        onPressOut={() => setIsPressed(false)}
        activeOpacity={1}
      >
        <Text style={homeStyles.retryButtonText}>Try Again</Text>
      </TouchableOpacity>
    </View>
  )
} 