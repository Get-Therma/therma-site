# Therma Landing Page

A Next.js landing page with Drizzle ORM, email notifications, and Slack integration.

## Environment Variables

### Required for Database
```bash
POSTGRES_URL="your_vercel_postgres_connection_string"
```

### Required for Email Notifications (Resend)
```bash
RESEND_API_KEY="your_resend_api_key"
WAITLIST_FROM="Therma Waitlist <noreply@gettherma.ai>"
CONTACT_FROM="Therma Contact Form <noreply@gettherma.ai>"
CONTACT_TO="support@gettherma.ai"
```

### Optional for Slack Notifications
```bash
SLACK_WEBHOOK_URL="https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK"
```

## Features

- ✅ **Waitlist signup** with UTM tracking
- ✅ **Contact form** with multiple subjects
- ✅ **Database storage** with Drizzle ORM
- ✅ **Email notifications** via Resend
- ✅ **Slack notifications** via webhook
- ✅ **Honeypot protection** against bots
- ✅ **Mobile responsive** (iPhone 16/16 Pro optimized)
- ✅ **Thank you pages** with social links

## Database Schema

### Waitlist Table
- `id` - Primary key
- `email` - User email (unique)
- `attribution` - UTM tracking data (JSON)
- `referer` - Referrer URL
- `created_at` - Timestamp

### Contacts Table
- `id` - Primary key
- `type` - Contact type (general, support, etc.)
- `name` - User name
- `email` - User email
- `subject` - Contact subject
- `message` - Contact message
- `created_at` - Timestamp

## Deployment

1. Set environment variables in Vercel
2. Run database migration: `npx drizzle-kit push`
3. Deploy to Vercel

## Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run db:generate  # Generate database migrations
npm run db:push      # Push schema to database
npm run db:studio    # Open Drizzle Studio
```# Updated Sun Oct 12 02:37:12 PDT 2025
# Updated Sun Oct 12 03:36:00 PDT 2025
