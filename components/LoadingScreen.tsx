import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { TruckLoader } from './TruckLoader'

interface LoadingScreenProps {
  message?: string
  size?: 'small' | 'medium' | 'large'
}

export function LoadingScreen({ 
  message = 'Loading...', 
  size = 'medium' 
}: LoadingScreenProps) {
  return (
    <View style={styles.container}>
      <TruckLoader size={size} />
      <Text style={styles.message}>{message}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5deb3', // beige background
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  message: {
    marginTop: 20,
    fontSize: 16,
    color: '#323232',
    fontWeight: '600',
    textAlign: 'center',
  },
}) 