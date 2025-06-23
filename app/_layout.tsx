import 'react-native-url-polyfill/auto'
import { useEffect, useState } from 'react'
import { Stack, useRouter, useSegments } from 'expo-router'
import { supabase } from '../lib/supabase'
import { Session } from '@supabase/supabase-js'
import { usePushNotifications } from '../hooks/usePushNotifications'

export default function RootLayout() {
  const [session, setSession] = useState<Session | null>(null)
  const [initialized, setInitialized] = useState(false)
  
  const router = useRouter()
  const segments = useSegments()

  usePushNotifications()

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setInitialized(true)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!initialized) return

    // Check if we're in an auth route
    const inAuthGroup = segments[0] === '(auth)'

    if (session && inAuthGroup) {
      // User is signed in but viewing auth screens, redirect to main app
      router.replace('/(tabs)')
    } else if (!session && !inAuthGroup) {
      // User is not signed in but not viewing auth screens, redirect to login
      router.replace('/(auth)/login')
    }
  }, [session, initialized, segments])

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(tabs)" />
    </Stack>
  )
} 