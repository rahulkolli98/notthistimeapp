import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, TextInputProps } from 'react-native'
import { authStyles } from './AuthStyles'

interface AuthInputProps extends TextInputProps {
  label: string
  error?: string
  isPassword?: boolean
}

export function AuthInput({ 
  label, 
  error, 
  isPassword = false, 
  style,
  ...props 
}: AuthInputProps) {
  const [isFocused, setIsFocused] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  return (
    <View style={authStyles.inputGroup}>
      <Text style={authStyles.label}>{label}</Text>
      <View style={{ position: 'relative' }}>
        <TextInput
          style={[
            authStyles.input,
            isFocused && authStyles.inputFocused,
            error && authStyles.inputError,
            style
          ]}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          secureTextEntry={isPassword && !showPassword}
          {...props}
        />
        {isPassword && (
          <TouchableOpacity
            style={{
              position: 'absolute',
              right: 16,
              top: 16,
              padding: 4,
            }}
            onPress={() => setShowPassword(!showPassword)}
          >
            <Text style={{ fontSize: 16, color: '#666' }}>
              {showPassword ? '🙈' : '👁️'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={authStyles.errorText}>{error}</Text>}
    </View>
  )
} 