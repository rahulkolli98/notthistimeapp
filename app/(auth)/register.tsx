import React from 'react'
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native'
import { Link } from 'expo-router'
import { supabase } from '../../lib/supabase'
import { useAuthForm } from '../../hooks/useAuthForm'
import { AuthInput, AuthButton, authStyles } from '../../components'

export default function Register() {
  const form = useAuthForm({
    name: {
      value: '',
      error: '',
      rules: { required: true }
    },
    email: {
      value: '',
      error: '',
      rules: { required: true, email: true }
    },
    password: {
      value: '',
      error: '',
      rules: { required: true, minLength: 6 }
    },
    confirmPassword: {
      value: '',
      error: '',
      rules: { required: true, match: 'password' }
    }
  })

  const handleSignUp = async () => {
    if (!form.validateAll()) {
      return
    }

    form.setLoading(true)

    try {
      const { error } = await supabase.auth.signUp({
        email: form.fields.email.value.trim(),
        password: form.fields.password.value,
        options: {
          data: {
            name: form.fields.name.value.trim(),
          },
        },
      })

      if (error) {
        form.handleError(error)
      } else {
        Alert.alert(
          'Account Created!',
          'Please check your email inbox for a verification link to complete your account setup.',
          [
            {
              text: 'OK',
              onPress: () => form.resetForm()
            }
          ]
        )
      }
    } catch (error) {
      form.handleError(error)
    } finally {
      form.setLoading(false)
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
            <Text style={authStyles.title}>Create Account</Text>
            <Text style={authStyles.subtitle}>
              Join NotThisTime to start collaborating on shopping lists with friends and family
            </Text>
          </View>

          {/* Form */}
          <View style={authStyles.form}>
            <AuthInput
              label="Full Name"
              placeholder="Enter your full name"
              autoCapitalize="words"
              autoComplete="name"
              autoCorrect={false}
              {...form.getFieldProps('name')}
            />

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
              placeholder="Create a password (min. 6 characters)"
              isPassword
              autoCapitalize="none"
              autoComplete="new-password"
              {...form.getFieldProps('password')}
            />

            <AuthInput
              label="Confirm Password"
              placeholder="Confirm your password"
              isPassword
              autoCapitalize="none"
              autoComplete="new-password"
              {...form.getFieldProps('confirmPassword')}
            />

            <AuthButton
              title="Create Account"
              onPress={handleSignUp}
              loading={form.loading}
            />
          </View>

          {/* Divider */}
          <View style={authStyles.divider}>
            <View style={authStyles.dividerLine} />
            <Text style={authStyles.dividerText}>or</Text>
            <View style={authStyles.dividerLine} />
          </View>

          {/* Sign In Link */}
          <View style={authStyles.linkContainer}>
            <Text style={authStyles.linkText}>Already have an account? </Text>
            <Link href="/(auth)/login" asChild>
              <TouchableOpacity>
                <Text style={authStyles.link}>Sign In</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>

        {/* Footer */}
        <View style={authStyles.footer}>
          <Text style={authStyles.footerText}>
            By creating an account, you agree to our Terms of Service and Privacy Policy
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
} 