import React from 'react'
import { View, Text } from 'react-native'
import { homeStyles } from './HomeStyles'
import { TruckLoader } from './TruckLoader'

interface LoadingStateProps {
  message?: string
}

export function LoadingState({ message = 'Loading your lists...' }: LoadingStateProps) {
  return (
    <View style={homeStyles.loadingContainer}>
      <TruckLoader size="medium" />
      <Text style={homeStyles.loadingText}>{message}</Text>
    </View>
  )
} 