import React, { useState } from 'react'
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert
} from 'react-native'
import { ListMember } from '../hooks/useListMembers'
import { modalStyles } from './ModalStyles'
import { listDetailsStyles } from './ListDetailsStyles'
import { TruckLoader } from './TruckLoader'
import { supabase } from '../lib/supabase'

interface InviteMembersModalProps {
  visible: boolean
  listId: string
  listName: string
  members: ListMember[]
  membersLoading: boolean
  currentUserId: string | null
  isOwner: boolean
  onClose: () => void
  onRemoveMember: (memberId: string) => void
  onUpdateMemberRole: (memberId: string, newRole: 'editor' | 'member') => void
}

export function InviteMembersModal({
  visible,
  listId,
  listName,
  members,
  membersLoading,
  currentUserId,
  isOwner,
  onClose,
  onRemoveMember,
  onUpdateMemberRole
}: InviteMembersModalProps) {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [role, setRole] = useState<'member' | 'editor'>('member')
  const [sending, setSending] = useState(false)
  const [showInviteSection, setShowInviteSection] = useState(false)

  const handleSendInvitation = async () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter an email address')
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address')
      return
    }

    setSending(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No authenticated user')

      const { error } = await supabase
        .from('invitations')
        .insert({
          list_id: listId,
          invited_by: user.id,
          invited_email: email.trim().toLowerCase(),
          role,
          message: message.trim() || null,
          status: 'pending'
        })

      if (error) {
        if (error.code === '23505') {
          throw new Error('An invitation has already been sent to this email for this list')
        }
        throw error
      }

      Alert.alert(
        'Invitation Sent!',
        `An invitation to join "${listName}" has been sent to ${email}`,
        [{ text: 'OK', onPress: () => {
          setEmail('')
          setMessage('')
          setRole('member')
          onClose()
        }}]
      )
    } catch (err) {
      console.error('Error sending invitation:', err)
      Alert.alert('Error', err instanceof Error ? err.message : 'Failed to send invitation')
    } finally {
      setSending(false)
    }
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={modalStyles.modalContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={modalStyles.modalHeader}>
          <TouchableOpacity onPress={onClose}>
            <Text style={modalStyles.modalCancelText}>Close</Text>
          </TouchableOpacity>
          <Text style={modalStyles.modalTitle}>Members & Sharing</Text>
          <View style={{ width: 50 }} />
        </View>

        <ScrollView style={modalStyles.modalContent}>
          {/* Current Members Section */}
          <View style={modalStyles.membersSection}>
            <Text style={modalStyles.sectionTitle}>Current Members ({members.length})</Text>
            
            {membersLoading ? (
              <View style={listDetailsStyles.loadingContainer}>
                <TruckLoader size="small" />
                <Text style={listDetailsStyles.loadingText}>Loading members...</Text>
              </View>
            ) : (
              <>
                {members.map((member) => (
                  <View key={member.id} style={modalStyles.memberCard}>
                    <View style={modalStyles.memberInfo}>
                      <Text style={modalStyles.memberName}>
                        {member.name}
                        {member.isCurrentUser && ' (You)'}
                      </Text>
                      {member.email && (
                        <Text style={modalStyles.memberEmail}>{member.email}</Text>
                      )}
                      <Text style={modalStyles.memberJoinDate}>
                        Joined {new Date(member.joined_at).toLocaleDateString()}
                      </Text>
                    </View>
                    <View style={modalStyles.memberActions}>
                      <View style={[modalStyles.roleBadge, member.role === 'owner' && modalStyles.ownerBadge]}>
                        <Text style={[modalStyles.roleBadgeText, member.role === 'owner' && modalStyles.ownerBadgeText]}>
                          {member.role === 'owner' ? 'Owner' : member.role === 'editor' ? 'Editor' : 'Member'}
                        </Text>
                      </View>
                      {isOwner && member.role !== 'owner' && !member.isCurrentUser && (
                        <TouchableOpacity
                          style={modalStyles.removeButton}
                          onPress={() => {
                            Alert.alert(
                              'Remove Member',
                              `Are you sure you want to remove ${member.name} from this list?`,
                              [
                                { text: 'Cancel', style: 'cancel' },
                                { 
                                  text: 'Remove', 
                                  style: 'destructive',
                                  onPress: () => onRemoveMember(member.id)
                                }
                              ]
                            )
                          }}
                        >
                          <Text style={modalStyles.removeButtonText}>×</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                ))}
              </>
            )}
          </View>

          {/* Invite New Member Section */}
          <View style={modalStyles.inviteSection}>
            <TouchableOpacity
              style={modalStyles.inviteToggleButton}
              onPress={() => setShowInviteSection(!showInviteSection)}
            >
              <Text style={modalStyles.inviteToggleText}>
                {showInviteSection ? '− Hide Invite Options' : '+ Invite New Member'}
              </Text>
            </TouchableOpacity>

            {showInviteSection && (
              <>
                <View style={modalStyles.inviteInfo}>
                  <Text style={modalStyles.inviteInfoTitle}>Invite to "{listName}"</Text>
                  <Text style={modalStyles.inviteInfoSubtext}>
                    Send an invitation to a registered user. They must already have an account to join your list.
                  </Text>
                </View>

                <View style={modalStyles.inputGroup}>
                  <Text style={modalStyles.inputLabel}>Email Address *</Text>
                  <TextInput
                    style={modalStyles.textInput}
                    value={email}
                    onChangeText={setEmail}
                    placeholder="Enter their email address"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    maxLength={100}
                  />
                  <Text style={modalStyles.helperText}>
                    The user must already be registered with this email address
                  </Text>
                </View>

                <View style={modalStyles.inputGroup}>
                  <Text style={modalStyles.inputLabel}>Role</Text>
                  <View style={modalStyles.roleSelector}>
                    <TouchableOpacity
                      style={[
                        modalStyles.roleButton,
                        role === 'member' && modalStyles.roleButtonSelected
                      ]}
                      onPress={() => setRole('member')}
                    >
                      <Text style={[
                        modalStyles.roleButtonText,
                        role === 'member' && modalStyles.roleButtonTextSelected
                      ]}>
                        Member
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        modalStyles.roleButton,
                        role === 'editor' && modalStyles.roleButtonSelected
                      ]}
                      onPress={() => setRole('editor')}
                    >
                      <Text style={[
                        modalStyles.roleButtonText,
                        role === 'editor' && modalStyles.roleButtonTextSelected
                      ]}>
                        Editor
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <Text style={modalStyles.helperText}>
                    Members can view and edit items. Editors can also invite others.
                  </Text>
                </View>

                <View style={modalStyles.inputGroup}>
                  <Text style={modalStyles.inputLabel}>Personal Message (Optional)</Text>
                  <TextInput
                    style={[modalStyles.textInput, modalStyles.textArea]}
                    value={message}
                    onChangeText={setMessage}
                    placeholder="Add a personal message to your invitation..."
                    multiline
                    numberOfLines={3}
                    maxLength={200}
                    textAlignVertical="top"
                  />
                  <Text style={modalStyles.charCount}>{message.length}/200</Text>
                </View>

                <TouchableOpacity
                  style={[modalStyles.sendInviteButton, (!email.trim() || sending) && modalStyles.sendInviteButtonDisabled]}
                  onPress={handleSendInvitation}
                  disabled={!email.trim() || sending}
                >
                  <Text style={[modalStyles.sendInviteButtonText, (!email.trim() || sending) && modalStyles.sendInviteButtonTextDisabled]}>
                    {sending ? 'Sending Invitation...' : 'Send Invitation'}
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  )
} 