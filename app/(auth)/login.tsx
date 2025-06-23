import React, { useState } from 'react'
import { Alert, StyleSheet, View, AppState, Button, TextInput, Text, TouchableOpacity } from 'react-native'
import { Link } from 'expo-router'
import { supabase } from '../../lib/supabase'

// Tells Supabase Auth to continuously refresh the session automatically if
// the app is in the foreground. When this is turned on, you don't need to
// manually refresh the session.
AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh()
  } else {
    supabase.auth.stopAutoRefresh()
  }
})

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function signInWithEmail() {
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    })

    if (error) Alert.alert(error.message)
    setLoading(false)
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign In</Text>
      
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <TextInput
          onChangeText={(text) => setEmail(text)}
          value={email}
          placeholder="email@address.com"
          autoCapitalize={'none'}
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
      
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Button title="Sign In" disabled={loading} onPress={() => signInWithEmail()} />
      </View>
      
      <View style={styles.linkContainer}>
        <Text style={styles.linkText}>Don't have an account? </Text>
        <Link href="/(auth)/register" asChild>
          <TouchableOpacity>
            <Text style={styles.link}>Register</Text>
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