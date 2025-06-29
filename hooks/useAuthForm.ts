import { useState } from 'react'
import { Alert } from 'react-native'

interface ValidationRules {
  required?: boolean
  minLength?: number
  email?: boolean
  match?: string
}

interface FormField {
  value: string
  error: string
  rules?: ValidationRules
}

interface FormFields {
  [key: string]: FormField
}

export function useAuthForm<T extends FormFields>(initialFields: T) {
  const [fields, setFields] = useState<T>(initialFields)
  const [loading, setLoading] = useState(false)

  const updateField = (fieldName: keyof T, value: string) => {
    setFields(prev => ({
      ...prev,
      [fieldName]: {
        ...prev[fieldName],
        value,
        error: '' // Clear error when user starts typing
      }
    }))
  }

  const validateField = (fieldName: keyof T): boolean => {
    const field = fields[fieldName]
    const { value, rules } = field

    if (!rules) return true

    let error = ''

    // Required validation
    if (rules.required && !value.trim()) {
      error = `${String(fieldName).charAt(0).toUpperCase() + String(fieldName).slice(1)} is required`
    }
    // Email validation
    else if (rules.email && value.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(value.trim())) {
        error = 'Please enter a valid email address'
      }
    }
    // Min length validation
    else if (rules.minLength && value.length < rules.minLength) {
      error = `Must be at least ${rules.minLength} characters long`
    }
    // Match validation (for password confirmation)
    else if (rules.match && value !== fields[rules.match as keyof T].value) {
      error = 'Passwords do not match'
    }

    setFields(prev => ({
      ...prev,
      [fieldName]: {
        ...prev[fieldName],
        error
      }
    }))

    return !error
  }

  const validateAll = (): boolean => {
    let isValid = true
    
    Object.keys(fields).forEach(fieldName => {
      const fieldValid = validateField(fieldName as keyof T)
      if (!fieldValid) isValid = false
    })

    return isValid
  }

  const getFieldProps = (fieldName: keyof T) => ({
    value: fields[fieldName].value,
    onChangeText: (value: string) => updateField(fieldName, value),
    error: fields[fieldName].error,
    onBlur: () => validateField(fieldName)
  })

  const resetForm = () => {
    const resetFields = Object.keys(fields).reduce((acc, key) => {
      acc[key as keyof T] = {
        ...fields[key as keyof T],
        value: '',
        error: ''
      }
      return acc
    }, {} as T)
    
    setFields(resetFields)
  }

  const handleError = (error: any) => {
    console.error('Auth error:', error)
    
    // Handle specific Supabase auth errors
    let message = 'An unexpected error occurred'
    
    if (error?.message) {
      const errorMessage = error.message.toLowerCase()
      
      if (errorMessage.includes('invalid login credentials')) {
        message = 'Invalid email or password. Please check your credentials and try again.'
      } else if (errorMessage.includes('email not confirmed')) {
        message = 'Please check your email and click the verification link before signing in.'
      } else if (errorMessage.includes('user already registered')) {
        message = 'An account with this email already exists. Please sign in instead.'
      } else if (errorMessage.includes('password should be at least')) {
        message = 'Password must be at least 6 characters long.'
      } else if (errorMessage.includes('signup is disabled')) {
        message = 'Account registration is currently disabled. Please contact support.'
      } else {
        message = error.message
      }
    }
    
    Alert.alert('Error', message)
  }

  return {
    fields,
    loading,
    setLoading,
    updateField,
    validateField,
    validateAll,
    getFieldProps,
    resetForm,
    handleError
  }
} 