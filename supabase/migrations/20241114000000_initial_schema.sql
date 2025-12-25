-- Create waitlist table for email subscriptions
CREATE TABLE IF NOT EXISTS public.waitlist (
  id SERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  attribution TEXT,
  referer TEXT,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Create contacts table for contact form submissions
CREATE TABLE IF NOT EXISTS public.contacts (
  id SERIAL PRIMARY KEY,
  type TEXT NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_waitlist_email ON public.waitlist(email);
CREATE INDEX IF NOT EXISTS idx_waitlist_created_at ON public.waitlist(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contacts_email ON public.contacts(email);
CREATE INDEX IF NOT EXISTS idx_contacts_created_at ON public.contacts(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated access (you can modify these based on your needs)
-- For now, we'll allow service role access (your API will use service role key)

-- Policy: Allow service role to do everything
CREATE POLICY "Service role can do everything on waitlist"
  ON public.waitlist
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role can do everything on contacts"
  ON public.contacts
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Optional: If you want to allow anonymous inserts (for your API)
-- Uncomment these if your API uses anon key instead of service role key
-- CREATE POLICY "Allow anonymous inserts on waitlist"
--   ON public.waitlist
--   FOR INSERT
--   TO anon
--   WITH CHECK (true);

-- CREATE POLICY "Allow anonymous inserts on contacts"
--   ON public.contacts
--   FOR INSERT
--   TO anon
--   WITH CHECK (true);




