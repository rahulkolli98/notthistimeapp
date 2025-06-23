/**
 * Test Push Notifications
 * 
 * This file contains utility functions to test push notifications during development.
 * You can call these functions from your app to test different notification scenarios.
 */

import { supabase } from './lib/supabase'

interface TestNotificationData {
  listId: string
  itemName: string
  suggestedReplacement: string
}

/**
 * Create a test replacement request to trigger notifications
 * This simulates what happens when a user marks an item as out of stock with replacements
 */
export async function createTestReplacementRequest(data: TestNotificationData) {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      throw new Error('No authenticated user')
    }

    // First, create a test item if needed
    const { data: item, error: itemError } = await supabase
      .from('items')
      .select('id')
      .eq('list_id', data.listId)
      .eq('name', data.itemName)
      .single()

    let itemId: string

    if (itemError || !item) {
      // Create the test item
      const { data: newItem, error: createError } = await supabase
        .from('items')
        .insert({
          list_id: data.listId,
          name: data.itemName,
          status: 'out_of_stock',
          quantity: 1,
          created_by: user.id
        })
        .select('id')
        .single()

      if (createError) throw createError
      itemId = newItem.id
    } else {
      itemId = item.id
    }

    // Create the replacement request (this should trigger the notification)
    const { data: request, error: requestError } = await supabase
      .from('replacement_requests')
      .insert({
        item_id: itemId,
        original_item_name: data.itemName,
        suggested_replacement: data.suggestedReplacement,
        requested_by: user.id,
        status: 'pending'
      })
      .select()
      .single()

    if (requestError) throw requestError

    console.log('Test replacement request created:', request)
    return request

  } catch (error) {
    console.error('Error creating test replacement request:', error)
    throw error
  }
}

/**
 * Check notification logs to see if notifications were sent
 */
export async function checkNotificationLogs() {
  try {
    const { data, error } = await supabase
      .from('notification_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10)

    if (error) throw error

    console.log('Recent notification logs:', data)
    return data

  } catch (error) {
    console.error('Error fetching notification logs:', error)
    throw error
  }
}

/**
 * Get current user's push token
 */
export async function getCurrentUserPushToken() {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      throw new Error('No authenticated user')
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('push_token')
      .eq('id', user.id)
      .single()

    if (error) throw error

    console.log('Current user push token:', data.push_token)
    return data.push_token

  } catch (error) {
    console.error('Error fetching push token:', error)
    throw error
  }
}

/**
 * Test direct push notification (bypasses the Edge Function)
 * Useful for testing if push tokens and Expo service are working
 */
export async function sendTestPushNotification(pushToken: string) {
  try {
    const notification = {
      to: pushToken,
      sound: 'default',
      title: 'Test Notification',
      body: 'This is a test notification from your shopping list app!',
      data: {
        type: 'test',
        timestamp: new Date().toISOString()
      }
    }

    const response = await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Accept-encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(notification),
    })

    const result = await response.json()
    
    if (!response.ok) {
      throw new Error(`Push notification failed: ${JSON.stringify(result)}`)
    }

    console.log('Test push notification sent:', result)
    return result

  } catch (error) {
    console.error('Error sending test push notification:', error)
    throw error
  }
}

// Example usage:
/*
// In your app, you can call these functions for testing:

// 1. Test creating a replacement request
await createTestReplacementRequest({
  listId: 'your-list-id',
  itemName: 'Test Item',
  suggestedReplacement: 'Test Replacement'
})

// 2. Check if notifications were logged
await checkNotificationLogs()

// 3. Get your push token
const token = await getCurrentUserPushToken()

// 4. Send a direct test notification
if (token) {
  await sendTestPushNotification(token)
}
*/ 