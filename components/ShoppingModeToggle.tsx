import React from 'react'
import { View, Text, Switch } from 'react-native'
import { listDetailsStyles } from './ListDetailsStyles'

interface ShoppingModeToggleProps {
  shoppingMode: boolean
  onToggle: (value: boolean) => void
}

export function ShoppingModeToggle({ shoppingMode, onToggle }: ShoppingModeToggleProps) {
  return (
    <View style={listDetailsStyles.shoppingModeSection}>
      <View style={listDetailsStyles.shoppingModeInfo}>
        <Text style={listDetailsStyles.shoppingModeLabel}>Shopping Mode</Text>
        <Text style={listDetailsStyles.shoppingModeSubtext}>
          {shoppingMode ? 'Enhanced out-of-stock options' : 'Basic list management'}
        </Text>
      </View>
      <Switch
        value={shoppingMode}
        onValueChange={onToggle}
        trackColor={{ false: '#e0e0e0', true: '#007AFF' }}
        thumbColor={shoppingMode ? '#fff' : '#f4f3f4'}
      />
    </View>
  )
} 