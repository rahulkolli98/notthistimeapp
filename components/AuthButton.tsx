import React from 'react'
import { TouchableOpacity, Text } from 'react-native'
import { authStyles } from './AuthStyles'
import { TruckLoader } from './TruckLoader'

interface AuthButtonProps {
  title: string
  onPress: () => void
  loading?: boolean
  disabled?: boolean
}

export function AuthButton({ title, onPress, loading = false, disabled = false }: AuthButtonProps) {
  const isDisabled = loading || disabled

  return (
    <TouchableOpacity
      style={[
        authStyles.button,
        isDisabled && authStyles.buttonDisabled
      ]}
      onPress={onPress}
      disabled={isDisabled}
    >
      {loading ? (
        <TruckLoader size="small" />
      ) : (
        <Text style={[
          authStyles.buttonText,
          isDisabled && authStyles.buttonTextDisabled
        ]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  )
} 