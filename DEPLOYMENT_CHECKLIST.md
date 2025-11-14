# 🚀 Deployment Checklist - Supabase Integration

## ✅ Completed

- [x] Supabase database created
- [x] Tables created (waitlist, contacts)
- [x] Migration files created
- [x] GitHub integration connected
- [x] Local environment configured
- [x] Database connection tested
- [x] Code updated to use Supabase
- [x] Documentation created
- [x] Files staged for commit

## 📋 TODO - Complete These Steps

### Step 1: Commit & Push to GitHub

```bash
git commit -m "Add Supabase integration with migrations"
git push origin main
```

**What happens:**
- Supabase detects the migration file
- Automatically applies schema to production database
- Creates indexes and RLS policies

### Step 2: Add Environment Variable to Vercel

1. Go to: https://vercel.com/dashboard
2. Select project: `therma-cursor-next`
3. Navigate to: **Settings** → **Environment Variables**
4. Click: **Add New**
5. Enter:
   - **Name:** `POSTGRES_URL`
   - **Value:** `postgresql://postgres:TeamTherma123!@db.ooaqigzgvrmyomfbdygz.supabase.co:5432/postgres`
6. Select: **All Environments** (Production, Preview, Development)
7. Click: **Save**

### Step 3: Redeploy Application

**Option A: Automatic (Recommended)**
- Push to GitHub (Step 1) will trigger automatic deployment

**Option B: Manual**
- Go to Vercel Dashboard → Deployments
- Click "Redeploy" on latest deployment

### Step 4: Test the Integration

**Test on Live Site:**
1. Visit your live site (therma.one, get-therma.com, or gettherma.ai)
2. Submit an email subscription
3. Check Vercel logs for: "Email stored in Supabase database successfully"

**View Stored Emails:**
```bash
node scripts/view-supabase-emails.js
```

**Or check Supabase Dashboard:**
- https://supabase.com/dashboard
- Go to Table Editor
- View `waitlist` table

## 🔍 Verification Checklist

After deployment, verify:

- [ ] Email submission works on live site
- [ ] Email appears in Beehiiv
- [ ] Email appears in Supabase database
- [ ] Welcome email sent via Resend
- [ ] No errors in Vercel logs
- [ ] Attribution data captured correctly

## 📊 Current Environment Variables

### Local (.env.local) ✅
```
POSTGRES_URL="postgresql://postgres:TeamTherma123!@db.ooaqigzgvrmyomfbdygz.supabase.co:5432/postgres"
BEEHIIV_API_KEY="r9ajBbhYuypNuHda1ZGy2gX6sob1IvehIbp9MBCLnadmffnNqXXncSWrgmtUnway"
BEEHIIV_PUBLICATION_ID="pub_0365e6c3-9f7c-4e2c-b315-bb3cd68b205e"
RESEND_API_KEY="re_HtjCK98h_B7jY8EYZwvfQ3spzeXN9f94v"
```

### Vercel (Production) ⚠️ NEEDS POSTGRES_URL
```
BEEHIIV_API_KEY="..." ✅
BEEHIIV_PUBLICATION_ID="..." ✅
RESEND_API_KEY="..." ✅
POSTGRES_URL="..." ❌ ADD THIS
```

## 🎯 Success Criteria

Your integration is complete when:

1. ✅ Code pushed to GitHub
2. ✅ Supabase migration applied automatically
3. ✅ POSTGRES_URL added to Vercel
4. ✅ Application redeployed
5. ✅ Test email stored in both Beehiiv and Supabase
6. ✅ Welcome email received

## 📚 Resources

- **Documentation:** `SUPABASE_INTEGRATION.md`
- **View Emails:** `node scripts/view-supabase-emails.js`
- **Supabase Dashboard:** https://supabase.com/dashboard
- **Vercel Dashboard:** https://vercel.com/dashboard

## 🆘 Troubleshooting

### If emails aren't storing in Supabase:
1. Check Vercel logs for errors
2. Verify POSTGRES_URL is set in Vercel
3. Test connection: `node scripts/view-supabase-emails.js`

### If migration doesn't apply:
1. Check Supabase Dashboard → Database → Migrations
2. Verify GitHub integration is active
3. Check for migration errors in Supabase logs

### If connection fails:
1. Verify password: `TeamTherma123!`
2. Check SSL is enabled
3. Confirm Supabase project is active

---

**Current Status:** Ready to commit and deploy! 🚀

**Next Action:** Run `git commit -m "Add Supabase integration with migrations" && git push origin main`
