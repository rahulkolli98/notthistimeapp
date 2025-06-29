import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import { homeStyles } from './HomeStyles'

interface SearchSectionProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  totalResults: number
  filteredResults: number
}

export function SearchSection({ 
  searchQuery, 
  onSearchChange, 
  totalResults, 
  filteredResults 
}: SearchSectionProps) {
  const [isPressed, setIsPressed] = useState(false)

  return (
    <View style={homeStyles.searchSection}>
      <View style={[
        homeStyles.searchContainer,
        isPressed && {
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0,
          elevation: 0,
          transform: [{ translateX: 3 }, { translateY: 3 }]
        }
      ]}>
        <Text style={homeStyles.searchIcon}>🔍</Text>
        <TextInput
          style={homeStyles.searchInput}
          placeholder="Search lists by name, category, or description..."
          value={searchQuery}
          onChangeText={onSearchChange}
          autoCapitalize="none"
          autoCorrect={false}
          clearButtonMode="while-editing"
          onFocus={() => setIsPressed(true)}
          onBlur={() => setIsPressed(false)}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity 
            style={homeStyles.clearButton}
            onPress={() => onSearchChange('')}
          >
            <Text style={homeStyles.clearButtonText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>
      {searchQuery.trim() && (
        <Text style={homeStyles.searchResults}>
          {filteredResults} of {totalResults} lists
        </Text>
      )}
    </View>
  )
} 