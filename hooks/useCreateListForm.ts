import { useState } from 'react'
import { Alert } from 'react-native'
import { useRouter } from 'expo-router'
import { supabase } from '../lib/supabase'

interface CreateListFormData {
  name: string
  selectedCategory: string
  description: string
}

interface ValidationErrors {
  name?: string
  category?: string
}

export function useCreateListForm() {
  const [formData, setFormData] = useState<CreateListFormData>({
    name: '',
    selectedCategory: '',
    description: ''
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<ValidationErrors>({})
  const router = useRouter()

  const updateField = (field: keyof CreateListFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field as keyof ValidationErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'List name is required'
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'List name must be at least 2 characters'
    }

    if (!formData.selectedCategory) {
      newErrors.category = 'Please select a category'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const resetForm = () => {
    setFormData({
      name: '',
      selectedCategory: '',
      description: ''
    })
    setErrors({})
  }

  const handleCreateList = async () => {
    if (!validateForm()) {
      const firstError = Object.values(errors)[0]
      if (firstError) {
        Alert.alert('Validation Error', firstError)
      }
      return
    }

    setLoading(true)

    try {
      // Get the current user
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        throw new Error('No authenticated user')
      }

      // Create the list (the trigger will automatically add the creator as owner)
      const { data: listData, error: listError } = await supabase
        .from('lists')
        .insert({
          name: formData.name.trim(),
          category: formData.selectedCategory.toLowerCase(),
          description: formData.description.trim() || null,
          created_by: user.id
        })
        .select()
        .single()

      if (listError) throw listError

      Alert.alert(
        'Success!', 
        'Your shopping list has been created.',
        [
          {
            text: 'OK',
            onPress: () => {
              resetForm()
              router.push('/(tabs)/')
            }
          }
        ]
      )

    } catch (error) {
      console.error('Error creating list:', error)
      Alert.alert(
        'Error', 
        error instanceof Error ? error.message : 'Failed to create list'
      )
    } finally {
      setLoading(false)
    }
  }

  const isFormValid = () => {
    return formData.name.trim() !== '' && formData.selectedCategory !== ''
  }

  return {
    formData,
    loading,
    errors,
    updateField,
    handleCreateList,
    resetForm,
    isFormValid
  }
} 