import React, { useState } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { createListStyles } from './CreateListStyles'

interface CategorySelectorProps {
  categories: string[]
  selectedCategory: string
  onCategorySelect: (category: string) => void
  label?: string
  helperText?: string
  required?: boolean
}

export function CategorySelector({ 
  categories,
  selectedCategory,
  onCategorySelect,
  label = 'Category',
  helperText,
  required = false
}: CategorySelectorProps) {
  const [pressedCategory, setPressedCategory] = useState<string | null>(null)
  
  const renderCategoryButton = (category: string) => {
    const isSelected = selectedCategory === category
    const isPressed = pressedCategory === category

    return (
      <TouchableOpacity
        key={category}
        style={[
          createListStyles.categoryButton,
          (isSelected || isPressed) && createListStyles.categoryButtonSelected
        ]}
        onPress={() => onCategorySelect(category)}
        onPressIn={() => setPressedCategory(category)}
        onPressOut={() => setPressedCategory(null)}
        activeOpacity={1}
      >
        <Text style={[
          createListStyles.categoryButtonText,
          isSelected && createListStyles.categoryButtonTextSelected
        ]}>
          {category}
        </Text>
      </TouchableOpacity>
    )
  }

  return (
    <View style={createListStyles.inputGroup}>
      <Text style={required ? createListStyles.requiredLabel : createListStyles.label}>
        {label}{required && ' *'}
      </Text>
      
      {helperText && (
        <Text style={createListStyles.helperText}>{helperText}</Text>
      )}
      
      <View style={createListStyles.categoryGrid}>
        {categories.map(renderCategoryButton)}
      </View>
    </View>
  )
} 