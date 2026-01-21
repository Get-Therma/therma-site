-- Migration: Add email_events table for tracking email opens, clicks, bounces
-- Created: 2026-01-21

CREATE TABLE IF NOT EXISTS email_events (
  id SERIAL PRIMARY KEY,
  email_id TEXT NOT NULL,
  recipient_email TEXT,
  event_type TEXT NOT NULL,
  link_url TEXT,
  user_agent TEXT,
  ip_address TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Index for faster queries by email_id
CREATE INDEX IF NOT EXISTS idx_email_events_email_id ON email_events(email_id);

-- Index for faster queries by event type
CREATE INDEX IF NOT EXISTS idx_email_events_event_type ON email_events(event_type);

-- Index for time-based queries
CREATE INDEX IF NOT EXISTS idx_email_events_created_at ON email_events(created_at);

-- Composite index for common queries (event type + date range)
CREATE INDEX IF NOT EXISTS idx_email_events_type_date ON email_events(event_type, created_at);

-- Comment on table
COMMENT ON TABLE email_events IS 'Tracks email events from Resend webhooks (opens, clicks, bounces, etc.)';
