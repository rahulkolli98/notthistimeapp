# Push Notifications Setup Guide

This guide walks you through setting up push notifications for replacement requests using Supabase Edge Functions.

## Prerequisites

1. **Supabase CLI installed**: `npm install -g supabase`
2. **Supabase project linked**: `supabase link --project-ref YOUR_PROJECT_REF`
3. **Expo project ID**: Found in your `app.json` or Expo dashboard

## Step 1: Database Setup

Run the database migration to add necessary tables and triggers:

```bash
# Apply the database changes
supabase db push
```

Or manually run the SQL file in your Supabase dashboard:
```sql
-- Run the contents of supabase-replacement-notification-trigger.sql
```

## Step 2: Deploy the Edge Function

1. **Deploy the function**:
```bash
supabase functions deploy send-replacement-notification
```

2. **Set up environment secrets** in your Supabase dashboard:
   - Go to Settings > Edge Functions
   - Add these secrets:
     - `SUPABASE_URL`: Your Supabase project URL
     - `SUPABASE_SERVICE_ROLE_KEY`: Your service role key
     - `SUPABASE_FUNCTION_URL`: Your Supabase project URL (same as SUPABASE_URL)

## Step 3: Configure Database Webhook (Recommended Approach)

Instead of using the pg_net approach, use Supabase's built-in webhook functionality:

1. **Go to your Supabase dashboard**
2. **Navigate to Database > Webhooks**
3. **Create a new webhook**:
   - **Name**: `replacement-request-notifications`
   - **Table**: `replacement_requests`
   - **Events**: `INSERT`
   - **Type**: `HTTP Request`
   - **HTTP URL**: `https://YOUR_PROJECT_REF.supabase.co/functions/v1/send-replacement-notification`
   - **HTTP Method**: `POST`
   - **HTTP Headers**:
     ```json
     {
       "Content-Type": "application/json",
       "Authorization": "Bearer YOUR_SERVICE_ROLE_KEY"
     }
     ```

## Step 4: Update Your App Code

Update your `usePushNotifications.ts` hook to use the correct project ID:

```typescript
// In notthistimeapp/hooks/usePushNotifications.ts
// Replace 'your-project-id-here' with your actual Expo project ID
token = (await Notifications.getExpoPushTokenAsync({ 
  projectId: '' // Your actual project ID
})).data;
```

## Step 5: Test the Setup

1. **Create a replacement request** in your app
2. **Check the Supabase logs**:
   - Go to Logs > Edge Functions
   - Look for logs from `send-replacement-notification`
3. **Check the notification_logs table**:
   ```sql
   SELECT * FROM notification_logs ORDER BY created_at DESC;
   ```

## Troubleshooting

### Common Issues:

1. **"No members with push tokens"**
   - Make sure users have granted notification permissions
   - Check that push tokens are being saved to the database
   - Verify the `push_token` column exists in the `profiles` table

2. **"Error fetching list members"**
   - Check that the `list_id` column was added to `replacement_requests`
   - Verify the foreign key relationships are correct

3. **"Webhook not firing"**
   - Check the webhook configuration in Supabase dashboard
   - Verify the HTTP URL is correct
   - Check that the service role key is valid

4. **"Push notifications not received"**
   - Test with Expo's push notification tool: https://expo.dev/notifications
   - Check that the device has notification permissions enabled
   - Verify the push token format is correct

### Testing Push Notifications Manually

You can test push notifications manually using curl:

```bash
curl -X POST "https://exp.host/--/api/v2/push/send" \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  -d '{
    "to": "EXPO_PUSH_TOKEN_HERE",
    "sound": "default",
    "title": "Test Notification",
    "body": "This is a test notification"
  }'
```

## Security Considerations

1. **Service Role Key**: Keep your service role key secure and never expose it in client code
2. **Rate Limiting**: Expo has rate limits for push notifications
3. **Token Validation**: Consider implementing token validation to prevent spam
4. **Error Handling**: The system is designed to not fail the original request if notifications fail

## Monitoring

Monitor your push notifications through:

1. **Supabase Edge Function logs**
2. **notification_logs table**
3. **Expo push notification receipts** (can be implemented for more detailed tracking)

## Next Steps

1. **Add more notification types** (invitations, list updates, etc.)
2. **Implement notification preferences** (allow users to control what they receive)
3. **Add push notification receipts** for delivery confirmation
4. **Implement notification batching** for multiple requests 