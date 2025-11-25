# How to Test Duplicate Email Detection

## Method 1: Test via Browser (Easiest)

1. **Start your dev server:**
   ```bash
   npm run dev
   ```

2. **Open your browser and go to:**
   ```
   http://localhost:3000
   ```

3. **Open Browser DevTools:**
   - Press `F12` or `Cmd+Option+I` (Mac) / `Ctrl+Shift+I` (Windows)
   - Go to the **Console** tab
   - Go to the **Network** tab (keep it open)

4. **First submission (should succeed):**
   - Enter an email address (e.g., `test@example.com`)
   - Click "Join Waitlist"
   - Watch the console - you should see logs
   - Check the Network tab - find the `/api/subscribe` request
   - Status should be `200` or `201`

5. **Second submission (should show duplicate message):**
   - Enter the **same email** again
   - Click "Join Waitlist"
   - You should see:
     - A yellow message: "⚠️ This email is already on our waitlist. Redirecting..."
     - After 2 seconds, redirect to `/thank-you?duplicate=true`
     - The thank you page should say "You're Already In!"

6. **Check the Network tab:**
   - Find the second `/api/subscribe` request
   - Status should be `409` (Conflict)
   - Response should have `"duplicate": true`

## Method 2: Test via Command Line

1. **Start your dev server** (in one terminal):
   ```bash
   npm run dev
   ```

2. **Run the test script** (in another terminal):
   ```bash
   node scripts/test-duplicate-simple.js test@example.com
   ```

   This will:
   - Submit the email once (should succeed)
   - Submit the same email again (should return 409 with duplicate: true)
   - Show you the results

## Method 3: Check Server Logs

When you submit a duplicate email, check your terminal where `npm run dev` is running. You should see logs like:

```
🚫 DUPLICATE DETECTED in database - Returning 409 Conflict
   Skipping Beehiv and email sending
```

or

```
🚫 DUPLICATE DETECTED in Beehiv - Returning 409 Conflict
   Skipping email sending and database insert
```

## What to Look For

### ✅ Working Correctly:
- First submission: Status 200/201, success message
- Second submission: Status 409, yellow duplicate message appears, redirects to thank-you page
- Thank you page shows "You're Already In!" message

### ❌ Not Working:
- Second submission still shows success
- No duplicate message appears
- Status is 200 instead of 409

## Debugging

If it's not working:

1. **Check browser console** for errors
2. **Check Network tab** - what status code is returned?
3. **Check server logs** - are duplicates being detected?
4. **Check database** - is the email actually in the database?
   ```bash
   node scripts/view-supabase-emails.js
   ```

## Quick Test Email

Use a unique email for testing:
```bash
node scripts/test-duplicate-simple.js mytest-$(date +%s)@example.com
```

This creates a unique email each time you run it.

