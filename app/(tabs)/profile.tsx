import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native'
import { createListStyles } from '../../components/CreateListStyles'
import { Session } from '@supabase/supabase-js'
import { TruckLoader } from '../../components/TruckLoader'

export default function Profile() {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })
  }, [])

  const handleLogout = async () => {
    setLoading(true)
    await supabase.auth.signOut()
    setLoading(false)
  }

  if (loading) {
    return (
      <View style={styles.centered}>
        <TruckLoader size="medium" />
      </View>
    )
  }

  const name = session?.user?.user_metadata?.name || 'User'
  const email = session?.user?.email || ''

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {/* Card background pattern (beige) */}
        <View style={styles.cardImg} />
        {/* Avatar */}
        <View style={styles.cardAvatar}>
          {/* SVG avatar, can be replaced with user image if available */}
          <View style={styles.avatarCircle} />
      </View>
        {/* Name */}
        <Text style={styles.cardTitle}>{name}</Text>
        {/* Email */}
        <Text style={styles.cardSubtitle}>{email}</Text>
        {/* Logout Button */}
        <TouchableOpacity style={styles.cardBtn} onPress={handleLogout}>
          <Text style={styles.cardBtnText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#add8e6', // blue background
    alignItems: 'center',
    justifyContent: 'center',
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#add8e6', // blue background
  },
  card: {
    width: 320,
    minHeight: 400,
    borderRadius: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    position: 'relative',
    borderWidth: 2,
    borderColor: '#000',
    borderRightWidth: 4,
    borderBottomWidth: 4,
    borderRightColor: '#000',
    borderBottomColor: '#000',
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 8,
    marginTop: 40,
    marginBottom: 40,
    paddingBottom: 32,
  },
  cardImg: {
    width: '100%',
    height: 120,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: '#f5deb3', // beige top section
    borderBottomWidth: 2,
    borderBottomColor: '#000',
    // Optionally add a pattern or SVG background here
  },
  cardAvatar: {
    position: 'absolute',
    top: 80,
    left: '50%',
    marginLeft: -57,
    width: 114,
    height: 114,
    backgroundColor: '#fff',
    borderRadius: 57,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#000',
    zIndex: 2,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 4,
  },
  avatarCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#ff8475',
    borderWidth: 2,
    borderColor: '#f85565',
  },
  cardTitle: {
    marginTop: 80,
    fontWeight: '900',
    fontSize: 20,
    color: '#323232',
    textAlign: 'center',
  },
  cardSubtitle: {
    marginTop: 10,
    fontWeight: '600',
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
  },
  cardBtn: {
    marginTop: 30,
    width: 120,
    height: 40,
    borderWidth: 2,
    borderColor: '#000',
    borderRightWidth: 4,
    borderBottomWidth: 4,
    borderRightColor: '#000',
    borderBottomColor: '#000',
    borderRadius: 6,
    backgroundColor: '#f5deb3',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 8,
  },
  cardBtnText: {
    fontWeight: '900',
    fontSize: 14,
    color: '#323232',
    textTransform: 'uppercase',
  },
}) 