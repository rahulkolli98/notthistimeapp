import React, { useState } from 'react'
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform
} from 'react-native'
import { useRouter } from 'expo-router'
import { supabase } from '../../lib/supabase'

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
  const [name, setName] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleCreateList = async () => {
    // Validation
    if (name.trim() === '') {
      Alert.alert('Error', 'Please enter a list name')
      return
    }

    if (selectedCategory === '') {
      Alert.alert('Error', 'Please select a category')
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
          name: name.trim(),
          category: selectedCategory.toLowerCase(),
          description: description.trim() || null,
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
              // Reset form
              setName('')
              setSelectedCategory('')
              setDescription('')
              // Navigate back to home
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

  const renderCategoryButton = (category: string) => (
    <TouchableOpacity
      key={category}
      style={[
        styles.categoryButton,
        selectedCategory === category && styles.categoryButtonSelected
      ]}
      onPress={() => setSelectedCategory(category)}
    >
      <Text style={[
        styles.categoryButtonText,
        selectedCategory === category && styles.categoryButtonTextSelected
      ]}>
        {category}
      </Text>
    </TouchableOpacity>
  )

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Create Shopping List</Text>
          <Text style={styles.subtitle}>
            Set up a new list for collaborative shopping
          </Text>
        </View>

        <View style={styles.form}>
          {/* List Name */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>List Name *</Text>
            <TextInput
              style={styles.textInput}
              value={name}
              onChangeText={setName}
              placeholder="e.g., Weekly Groceries, Home Depot Run"
              maxLength={50}
              autoCapitalize="words"
            />
            <Text style={styles.charCount}>{name.length}/50</Text>
          </View>

          {/* Category Selection */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Category *</Text>
            <Text style={styles.helperText}>
              Choose the type of shopping list to help organize your items
            </Text>
            <View style={styles.categoryGrid}>
              {CATEGORIES.map(renderCategoryButton)}
            </View>
          </View>

          {/* Description */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description (Optional)</Text>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="Add any notes about this shopping trip..."
              maxLength={200}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
            <Text style={styles.charCount}>{description.length}/200</Text>
          </View>
        </View>
      </ScrollView>

      {/* Create Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[
            styles.createButton,
            loading && styles.createButtonDisabled
          ]}
          onPress={handleCreateList}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.createButtonText}>Create List</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    lineHeight: 22,
  },
  form: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  helperText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    lineHeight: 20,
  },
  textInput: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
  },
  textArea: {
    height: 80,
    paddingTop: 12,
  },
  charCount: {
    fontSize: 12,
    color: '#999',
    textAlign: 'right',
    marginTop: 4,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 8,
  },
  categoryButtonSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  categoryButtonText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  categoryButtonTextSelected: {
    color: '#fff',
  },
  buttonContainer: {
    padding: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  createButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
  },
  createButtonDisabled: {
    backgroundColor: '#ccc',
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
}) 