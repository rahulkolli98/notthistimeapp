import React, { useEffect } from 'react'
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  AppState,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native'
import { Link } from 'expo-router'
import { supabase } from '../../lib/supabase'
import { useAuthForm } from '../../hooks/useAuthForm'
import { AuthInput, AuthButton, authStyles } from '../../components'

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
  const form = useAuthForm({
    email: {
      value: '',
      error: '',
      rules: { required: true, email: true }
    },
    password: {
      value: '',
      error: '',
      rules: { required: true, minLength: 6 }
    }
  })

  const handleSignIn = async () => {
    if (!form.validateAll()) {
      return
    }

    form.setLoading(true)
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: form.fields.email.value.trim(),
        password: form.fields.password.value,
      })

      if (error) {
        form.handleError(error)
      }
    } catch (error) {
      form.handleError(error)
    } finally {
      form.setLoading(false)
    }
  }

  const handleForgotPassword = async () => {
    const email = form.fields.email.value.trim()
    
    if (!email) {
      Alert.alert('Email Required', 'Please enter your email address first.')
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.')
      return
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email)
      
      if (error) {
        form.handleError(error)
      } else {
        Alert.alert(
          'Password Reset Sent',
          'Check your email for password reset instructions.',
          [{ text: 'OK' }]
        )
      }
    } catch (error) {
      form.handleError(error)
    }
  }

  return (
    <KeyboardAvoidingView 
      style={authStyles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        contentContainerStyle={authStyles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={authStyles.card}>
          {/* Header */}
          <View style={authStyles.header}>
            <Text style={authStyles.title}>Welcome Back</Text>
            <Text style={authStyles.subtitle}>
              Sign in to your NotThisTime account to continue managing your shopping lists
            </Text>
          </View>

          {/* Form */}
          <View style={authStyles.form}>
            <AuthInput
              label="Email Address"
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect={false}
              {...form.getFieldProps('email')}
            />

            <AuthInput
              label="Password"
              placeholder="Enter your password"
              isPassword
              autoCapitalize="none"
              autoComplete="password"
              {...form.getFieldProps('password')}
            />

            <AuthButton
              title="Sign In"
              onPress={handleSignIn}
              loading={form.loading}
            />

            {/* Forgot Password */}
            <TouchableOpacity onPress={handleForgotPassword}>
              <Text style={[authStyles.link, { textAlign: 'center', marginTop: 16 }]}>
                Forgot your password?
              </Text>
            </TouchableOpacity>
          </View>

          {/* Divider */}
          <View style={authStyles.divider}>
            <View style={authStyles.dividerLine} />
            <Text style={authStyles.dividerText}>or</Text>
            <View style={authStyles.dividerLine} />
          </View>

          {/* Sign Up Link */}
          <View style={authStyles.linkContainer}>
            <Text style={authStyles.linkText}>Don't have an account? </Text>
            <Link href="/(auth)/register" asChild>
              <TouchableOpacity>
                <Text style={authStyles.link}>Create Account</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>

        {/* Footer */}
        <View style={authStyles.footer}>
          <Text style={authStyles.footerText}>
            By signing in, you agree to our Terms of Service and Privacy Policy
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
} 