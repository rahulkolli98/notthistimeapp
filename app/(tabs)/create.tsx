import React, { useState } from 'react'
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  KeyboardAvoidingView,
  Platform
} from 'react-native'
import { useCreateListForm } from '../../hooks/useCreateListForm'
import { CreateListInput, CategorySelector, createListStyles, TruckLoader } from '../../components'

const CATEGORIES = [
  'Groceries',
  'Hardware',
  'Pharmacy',
  'Electronics',
  'Clothing',
  'Home & Garden',
  'Sports',
  'Books',
  'Other'
]

export default function CreateList() {
  const {
    formData,
    loading,
    errors,
    updateField,
    handleCreateList,
    isFormValid
  } = useCreateListForm()

  const [isPressed, setIsPressed] = useState(false)
  const isDisabled = !isFormValid() || loading

  return (
    <KeyboardAvoidingView 
      style={createListStyles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        style={createListStyles.scrollView} 
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={createListStyles.header}>
          <Text style={createListStyles.title}>Create Shopping List</Text>
          <Text style={createListStyles.subtitle}>
            Set up a new list for collaborative shopping
          </Text>
        </View>

        {/* Form */}
        <View style={createListStyles.form}>
          {/* List Name Input */}
          <CreateListInput
            label="List Name"
            placeholder="e.g., Weekly Groceries, Home Depot Run"
            value={formData.name}
            onChangeText={(value) => updateField('name', value)}
            maxLength={50}
            showCharCount
            required
            autoCapitalize="words"
            autoComplete="off"
            autoCorrect={false}
          />

          {/* Category Selection */}
          <CategorySelector
            label="Category"
            helperText="Choose the type of shopping list to help organize your items"
            categories={CATEGORIES}
            selectedCategory={formData.selectedCategory}
            onCategorySelect={(category) => updateField('selectedCategory', category)}
            required
          />

          {/* Description Input */}
          <CreateListInput
            label="Description"
            helperText="Add any notes about this shopping trip (optional)"
            placeholder="Add any notes about this shopping trip..."
            value={formData.description}
            onChangeText={(value) => updateField('description', value)}
            maxLength={200}
            showCharCount
            multiline
            numberOfLines={3}
          />
        </View>
      </ScrollView>

      {/* Create Button */}
      <View style={createListStyles.buttonContainer}>
        <TouchableOpacity 
          style={[
            createListStyles.createButton,
            isDisabled && createListStyles.createButtonDisabled,
            isPressed && !loading && isFormValid() && createListStyles.textInputFocused
          ]}
          onPress={handleCreateList}
          onPressIn={() => setIsPressed(true)}
          onPressOut={() => setIsPressed(false)}
          disabled={isDisabled}
          activeOpacity={1}
        >
          {loading ? (
            <TruckLoader size="small" />
          ) : (
            <Text style={[
              createListStyles.createButtonText,
              isDisabled && createListStyles.createButtonTextDisabled
            ]}>
              Create List
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  )
}