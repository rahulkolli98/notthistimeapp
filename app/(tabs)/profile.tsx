import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { StyleSheet, View, Button, TextInput, Text, ScrollView, TouchableOpacity, Alert, RefreshControl } from 'react-native'
import { Session } from '@supabase/supabase-js'
import { useInvitations, Invitation } from '../../hooks/useInvitations'
import { getCurrentUserPushToken, sendTestPushNotification } from '../../test-push-notifications'
import { testListDeletionFlow } from '../../test-list-deletion'

export default function Profile() {
  const [session, setSession] = useState<Session | null>(null)
  const [invitations, setInvitations] = useState<Invitation[]>([])
  const [refreshing, setRefreshing] = useState(false)
  const { getReceivedInvitations, acceptInvitation, declineInvitation, loading } = useInvitations()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })
  }, [])

  const fetchInvitations = async () => {
    try {
      const receivedInvitations = await getReceivedInvitations()
      setInvitations(receivedInvitations)
    } catch (err) {
      console.error('Error fetching invitations:', err)
    }
  }

  useEffect(() => {
    if (session) {
      fetchInvitations()
    }
  }, [session])

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchInvitations()
    setRefreshing(false)
  }

  const handleAcceptInvitation = async (invitation: Invitation) => {
    Alert.alert(
      'Accept Invitation',
      `Join "${invitation.list_name}" as a ${invitation.role}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Accept',
          onPress: async () => {
            try {
              await acceptInvitation(invitation.id)
              Alert.alert('Success', 'You have joined the list!')
              await fetchInvitations()
            } catch (err) {
              Alert.alert('Error', 'Failed to accept invitation')
            }
          }
        }
      ]
    )
  }

  const handleDeclineInvitation = async (invitation: Invitation) => {
    Alert.alert(
      'Decline Invitation',
      `Decline invitation to join "${invitation.list_name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Decline',
          style: 'destructive',
          onPress: async () => {
            try {
              await declineInvitation(invitation.id)
              Alert.alert('Success', 'Invitation declined')
              await fetchInvitations()
            } catch (err) {
              Alert.alert('Error', 'Failed to decline invitation')
            }
          }
        }
      ]
    )
  }

  const testPushNotification = async () => {
    try {
      const token = await getCurrentUserPushToken()
      if (token) {
        await sendTestPushNotification(token)
        Alert.alert('Success', 'Test notification sent! Check your device.')
      } else {
        Alert.alert('No Push Token', 'No push token found. Make sure notifications are enabled.')
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to send test notification')
      console.error('Test notification error:', error)
    }
  }

  const testListDeletion = async () => {
    try {
      Alert.alert(
        'Test List Deletion',
        'This will create a test list with items and then delete it to verify the deletion functionality works correctly.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Run Test',
            onPress: async () => {
              const result = await testListDeletionFlow()
              if (result.success) {
                Alert.alert('Test Passed ✅', result.message)
              } else {
                Alert.alert('Test Failed ❌', result.error || 'Unknown error')
              }
            }
          }
        ]
      )
    } catch (error) {
      Alert.alert('Error', 'Failed to run deletion test')
      console.error('List deletion test error:', error)
    }
  }

  const renderInvitation = (invitation: Invitation) => (
    <View key={invitation.id} style={styles.invitationCard}>
      <View style={styles.invitationHeader}>
        <Text style={styles.invitationTitle}>Invitation to "{invitation.list_name}"</Text>
        <Text style={styles.invitationRole}>{invitation.role}</Text>
      </View>
      
      <Text style={styles.invitationFrom}>From: {invitation.inviter_name}</Text>
      
      {invitation.message && (
        <Text style={styles.invitationMessage}>"{invitation.message}"</Text>
      )}
      
      <View style={styles.invitationActions}>
        <TouchableOpacity
          style={styles.acceptButton}
          onPress={() => handleAcceptInvitation(invitation)}
          disabled={loading}
        >
          <Text style={styles.acceptButtonText}>Accept</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.declineButton}
          onPress={() => handleDeclineInvitation(invitation)}
          disabled={loading}
        >
          <Text style={styles.declineButtonText}>Decline</Text>
        </TouchableOpacity>
      </View>
      
      <Text style={styles.invitationExpiry}>
        Expires: {new Date(invitation.expires_at).toLocaleDateString()}
      </Text>
    </View>
  )

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          colors={['#007AFF']}
          tintColor="#007AFF"
        />
      }
    >
      <Text style={styles.title}>Profile</Text>
      
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Text style={styles.label}>Email</Text>
        <TextInput 
          style={styles.input} 
          value={session?.user?.email || ''} 
          editable={false} 
        />
      </View>

      {invitations.length > 0 && (
        <View style={styles.invitationsSection}>
          <Text style={styles.sectionTitle}>
            Pending Invitations ({invitations.length})
          </Text>
          {invitations.map(renderInvitation)}
        </View>
      )}

      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Button title="Sign Out" onPress={() => supabase.auth.signOut()} />
      </View>

      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Button title="Test Push Notification" onPress={testPushNotification} />
      </View>

      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Button title="Test List Deletion" onPress={testListDeletion} />
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
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
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  invitationsSection: {
    marginTop: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  invitationCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  invitationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  invitationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
    marginRight: 8,
  },
  invitationRole: {
    fontSize: 12,
    fontWeight: '500',
    color: '#007AFF',
    backgroundColor: '#f0f8ff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    textTransform: 'capitalize',
  },
  invitationFrom: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  invitationMessage: {
    fontSize: 14,
    color: '#333',
    fontStyle: 'italic',
    marginBottom: 12,
    paddingLeft: 8,
    borderLeftWidth: 2,
    borderLeftColor: '#e0e0e0',
  },
  invitationActions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 8,
  },
  acceptButton: {
    flex: 1,
    backgroundColor: '#34C759',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  acceptButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  declineButton: {
    flex: 1,
    backgroundColor: '#FF3B30',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  declineButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  invitationExpiry: {
    fontSize: 12,
    color: '#999',
    textAlign: 'right',
  },
}) 