-- Create waitlist_entries table for pre-launch signups
CREATE TABLE public.waitlist_entries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  job_title TEXT,
  industry TEXT,
  language_preference TEXT DEFAULT 'en',
  source TEXT DEFAULT 'app', -- where they signed up from (app, pricing, landing, etc.)
  user_id UUID, -- optional link to existing user
  status TEXT NOT NULL DEFAULT 'pending', -- pending, notified, converted
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.waitlist_entries ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (public signup)
CREATE POLICY "Anyone can join waitlist"
ON public.waitlist_entries
FOR INSERT
WITH CHECK (true);

-- Users can view their own entry
CREATE POLICY "Users can view their own waitlist entry"
ON public.waitlist_entries
FOR SELECT
USING (
  email = current_setting('request.jwt.claims', true)::json->>'email'
  OR user_id = auth.uid()
);

-- Create index for email lookups
CREATE INDEX idx_waitlist_entries_email ON public.waitlist_entries(email);

-- Create index for status filtering (for future email campaigns)
CREATE INDEX idx_waitlist_entries_status ON public.waitlist_entries(status);

-- Trigger for updated_at
CREATE TRIGGER update_waitlist_entries_updated_at
BEFORE UPDATE ON public.waitlist_entries
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();