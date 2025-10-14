# Beehiv Integration Setup Guide

## Issue: Beehiv Not Receiving Email Submissions

The API is working correctly, but Beehiv isn't receiving submissions because the environment variables aren't configured.

## Required Setup Steps

### 1. Create Environment File
Create a `.env.local` file in your project root with the following content:

```bash
# Required Environment Variables
# Replace the placeholder values with your actual API keys

# Database (Supabase)
POSTGRES_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"

# Beehiiv API - Get these from your Beehiiv dashboard
BEEHIIV_API_KEY="YOUR_BEEHIIV_API_KEY"
BEEHIIV_PUBLICATION_ID="YOUR_BEEHIIV_PUBLICATION_ID"

# Email Service (Resend) - Get this from Resend dashboard
RESEND_API_KEY="YOUR_RESEND_API_KEY"

# Contentful CMS (Optional)
CONTENTFUL_SPACE_ID="YOUR_CONTENTFUL_SPACE_ID"
CONTENTFUL_ACCESS_TOKEN="YOUR_CONTENTFUL_ACCESS_TOKEN"
```

### 2. Get Beehiv API Credentials

#### Step 1: Access Beehiv Dashboard
1. Go to [Beehiv Dashboard](https://app.beehiiv.com/)
2. Log in to your account
3. Navigate to your publication

#### Step 2: Get API Key
1. Go to **Settings** → **API**
2. Create a new API key or copy existing one
3. Copy the API key to `BEEHIIV_API_KEY` in your `.env.local`

#### Step 3: Get Publication ID
1. In your Beehiv dashboard, go to **Settings** → **Publication**
2. Find your **Publication ID** (usually a long string)
3. Copy it to `BEEHIIV_PUBLICATION_ID` in your `.env.local`

### 3. Get Resend API Key (for welcome emails)

#### Step 1: Access Resend Dashboard
1. Go to [Resend Dashboard](https://resend.com/)
2. Log in to your account

#### Step 2: Create API Key
1. Go to **API Keys** section
2. Create a new API key
3. Copy it to `RESEND_API_KEY` in your `.env.local`

### 4. Test the Integration

After setting up the environment variables:

1. Restart your development server:
   ```bash
   npm run dev
   ```

2. Test the subscription API:
   ```bash
   curl -X POST http://localhost:3000/api/subscribe \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com"}'
   ```

3. Check the server logs for Beehiv success messages

### 5. Verify Beehiv Submissions

1. Go to your Beehiv dashboard
2. Navigate to **Subscribers** section
3. Check if new emails appear after testing

## Current API Behavior

The subscription API currently:
- ✅ Attempts to subscribe to Beehiv (with retry logic)
- ✅ Sends welcome email via Resend
- ✅ Stores email in database as fallback
- ✅ Handles duplicates gracefully
- ✅ Provides detailed logging

## Troubleshooting

### If Beehiv still doesn't receive emails:

1. **Check API Key Format**: Ensure no extra spaces or quotes
2. **Verify Publication ID**: Make sure it's the correct publication
3. **Check Beehiv API Status**: Visit [Beehiv Status Page](https://status.beehiiv.com/)
4. **Review Server Logs**: Look for detailed error messages in console
5. **Test API Directly**: Use Beehiv's API documentation to test manually

### Common Issues:

- **Invalid API Key**: Double-check the key format
- **Wrong Publication ID**: Ensure it matches your publication
- **Rate Limiting**: Beehiv may have rate limits
- **Email Format**: Ensure emails are valid format

## Next Steps

1. Set up the environment variables as described above
2. Test with a real email address
3. Check Beehiv dashboard for new subscribers
4. Monitor server logs for any errors

The integration code is working correctly - it just needs the proper API credentials configured.
