import React, { useState } from 'react'
import { View, Text, TextInput, TextInputProps } from 'react-native'
import { createListStyles } from './CreateListStyles'

interface CreateListInputProps extends TextInputProps {
  label: string
  helperText?: string
  required?: boolean
  maxLength?: number
  multiline?: boolean
  showCharCount?: boolean
}

export function CreateListInput({ 
  label, 
  helperText,
  required = false,
  maxLength,
  multiline = false,
  showCharCount = false,
  value,
  style,
  ...props 
}: CreateListInputProps) {
  const [isFocused, setIsFocused] = useState(false)
  const [isPressed, setIsPressed] = useState(false)

  return (
    <View style={createListStyles.inputGroup}>
      <Text style={required ? createListStyles.requiredLabel : createListStyles.label}>
        {label}{required && ' *'}
      </Text>
      
      {helperText && (
        <Text style={createListStyles.helperText}>{helperText}</Text>
      )}
      
      <TextInput
        style={[
          createListStyles.textInput,
          multiline && createListStyles.textArea,
          (isFocused || isPressed) && createListStyles.textInputFocused,
          style
        ]}
        onFocus={() => {
          setIsFocused(true)
          setIsPressed(true)
        }}
        onBlur={() => {
          setIsFocused(false)
          setIsPressed(false)
        }}
        maxLength={maxLength}
        multiline={multiline}
        textAlignVertical={multiline ? 'top' : 'center'}
        value={value}
        {...props}
      />
      
      {showCharCount && maxLength && (
        <Text style={createListStyles.charCount}>
          {(value || '').length}/{maxLength}
        </Text>
      )}
    </View>
  )
} 