import React, { useState } from 'react'
import { Alert, StyleSheet, View, Button, TextInput, Text, TouchableOpacity } from 'react-native'
import { Link } from 'expo-router'
import { supabase } from '../../lib/supabase'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function signUpWithEmail() {
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match')
      return
    }

    if (name.trim() === '') {
      Alert.alert('Error', 'Please enter your name')
      return
    }

    setLoading(true)
    const { error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          name: name.trim(),
        },
      },
    })

    if (error) {
      Alert.alert('Error', error.message)
    } else {
      Alert.alert('Success', 'Please check your inbox for email verification!')
    }
    setLoading(false)
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <TextInput
          onChangeText={(text) => setName(text)}
          value={name}
          placeholder="Full Name"
          autoCapitalize={'words'}
          style={styles.input}
        />
      </View>
      
      <View style={styles.verticallySpaced}>
        <TextInput
          onChangeText={(text) => setEmail(text)}
          value={email}
          placeholder="email@address.com"
          autoCapitalize={'none'}
          keyboardType="email-address"
          style={styles.input}
        />
      </View>
      
      <View style={styles.verticallySpaced}>
        <TextInput
          onChangeText={(text) => setPassword(text)}
          value={password}
          secureTextEntry={true}
          placeholder="Password"
          autoCapitalize={'none'}
          style={styles.input}
        />
      </View>
      
      <View style={styles.verticallySpaced}>
        <TextInput
          onChangeText={(text) => setConfirmPassword(text)}
          value={confirmPassword}
          secureTextEntry={true}
          placeholder="Confirm Password"
          autoCapitalize={'none'}
          style={styles.input}
        />
      </View>
      
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Button title="Create Account" disabled={loading} onPress={() => signUpWithEmail()} />
      </View>
      
      <View style={styles.linkContainer}>
        <Text style={styles.linkText}>Already have an account? </Text>
        <Link href="/(auth)/login" asChild>
          <TouchableOpacity>
            <Text style={styles.link}>Sign In</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: 'stretch',
  },
  mt20: {
    marginTop: 20,
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
  },
  linkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  linkText: {
    fontSize: 16,
    color: '#666',
  },
  link: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
}) 