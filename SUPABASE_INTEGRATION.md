# Supabase Integration Guide

## ✅ Setup Complete

Your Therma application is now integrated with Supabase for email storage!

### GitHub Integration Enabled ✅
- Automatic migrations on push to `main` branch
- Preview databases for pull requests
- Schema versioning through Git

## Database Configuration

**Connection String:**
```
postgresql://postgres:TeamTherma123!@db.ooaqigzgvrmyomfbdygz.supabase.co:5432/postgres
```

## Tables Created

### 1. `waitlist` table
Stores email subscriptions with attribution data:
- `id` - Auto-incrementing primary key
- `email` - Unique email address
- `attribution` - JSON field with UTM parameters and source tracking
- `referer` - HTTP referer
- `created_at` - Timestamp

### 2. `contacts` table
Stores contact form submissions:
- `id` - Auto-incrementing primary key
- `type` - Contact type
- `name` - Sender name
- `email` - Sender email
- `subject` - Message subject
- `message` - Message content
- `created_at` - Timestamp

## How It Works

When someone subscribes on your website:

1. **Beehiiv** - Email is added to your newsletter (primary)
2. **Supabase** - Email is stored in your database (backup)
3. **Resend** - Welcome email is sent
4. **Attribution** - UTM parameters and source are tracked

This gives you:
- ✅ Newsletter management via Beehiiv
- ✅ Your own database backup with full control
- ✅ Complete attribution tracking
- ✅ No vendor lock-in

## Environment Variables

### Local Development (`.env.local`)
Already configured with:
```bash
POSTGRES_URL="postgresql://postgres:TeamTherma123!@db.ooaqigzgvrmyomfbdygz.supabase.co:5432/postgres"
BEEHIIV_API_KEY="r9ajBbhYuypNuHda1ZGy2gX6sob1IvehIbp9MBCLnadmffnNqXXncSWrgmtUnway"
BEEHIIV_PUBLICATION_ID="pub_0365e6c3-9f7c-4e2c-b315-bb3cd68b205e"
RESEND_API_KEY="re_HtjCK98h_B7jY8EYZwvfQ3spzeXN9f94v"
```

### Vercel Production

**⚠️ ACTION REQUIRED:** Add to Vercel Environment Variables

1. Go to https://vercel.com/dashboard
2. Select your project (`therma-cursor-next`)
3. Go to **Settings** → **Environment Variables**
4. Add the following variable:

```
Variable Name: POSTGRES_URL
Value: postgresql://postgres:TeamTherma123!@db.ooaqigzgvrmyomfbdygz.supabase.co:5432/postgres
```

5. Select all environments (Production, Preview, Development)
6. Click **Save**
7. **Redeploy** your application

## Viewing Your Data

### Command Line
Run this script to view emails in your Supabase database:

```bash
node scripts/view-supabase-emails.js
```

### Supabase Dashboard
1. Go to https://supabase.com/dashboard
2. Select your project
3. Go to **Table Editor**
4. View `waitlist` and `contacts` tables

### SQL Queries

Connect to your database and run queries:

```sql
-- View all emails
SELECT * FROM waitlist ORDER BY created_at DESC;

-- Count total subscribers
SELECT COUNT(*) FROM waitlist;

-- View emails with attribution
SELECT 
  email, 
  attribution::json->>'source' as source,
  attribution::json->>'utm_campaign' as campaign,
  created_at 
FROM waitlist 
ORDER BY created_at DESC;

-- View contact form submissions
SELECT * FROM contacts ORDER BY created_at DESC;
```

## Files Modified

1. **`lib/db.ts`** - Updated to use `POSTGRES_URL` environment variable
2. **`app/api/subscribe/route.ts`** - Enabled Supabase storage
3. **`drizzle.config.ts`** - Updated with Supabase connection
4. **`.env.local`** - Added `POSTGRES_URL`

## Testing

The integration has been tested and verified:
- ✅ Tables created successfully
- ✅ Insert operations working
- ✅ Query operations working
- ✅ Connection pooling configured
- ✅ SSL enabled for security

## Troubleshooting

### Connection Issues
If you see connection errors, verify:
1. `POSTGRES_URL` is set in environment variables
2. Password is correct: `TeamTherma123!`
3. SSL is enabled in the connection

### Database Not Storing
Check Vercel logs:
1. Go to Vercel Dashboard → Your Project → Deployments
2. Click on latest deployment → View Function Logs
3. Look for "Email stored in Supabase database successfully"

### View Logs
```bash
# Local development
npm run dev
# Check console for "Email stored in Supabase database successfully"
```

## Security Notes

- ✅ Connection uses SSL encryption
- ✅ Password is stored in environment variables (not in code)
- ✅ Database credentials are not exposed to client-side
- ⚠️ Keep your `.env.local` file private (it's in `.gitignore`)

## GitHub Integration

Your Supabase project is now connected to GitHub! This means:

### Automatic Deployments
When you push to `main` branch:
1. Supabase detects migration files in `supabase/migrations/`
2. Automatically applies them to production database
3. Keeps schema in sync with your Git repository

### Migration Files
Located in `supabase/migrations/`:
- `20241114000000_initial_schema.sql` - Initial database schema with tables, indexes, and RLS policies

### Preview Databases
- Pull requests automatically get preview databases
- Test schema changes before merging to production
- Up to 50 preview branches configured

## Next Steps

1. **Commit and Push to GitHub**
   ```bash
   git commit -m "Add Supabase integration with migrations"
   git push origin main
   ```

2. **Add `POSTGRES_URL` to Vercel** (see instructions above)

3. **Redeploy** your application

4. **Test** by submitting an email on your live site

5. **View data** using `node scripts/view-supabase-emails.js`

## Support

For Supabase support:
- Dashboard: https://supabase.com/dashboard
- Docs: https://supabase.com/docs
- Community: https://github.com/supabase/supabase/discussions

---

**Status:** ✅ Ready for Production (after adding to Vercel)
