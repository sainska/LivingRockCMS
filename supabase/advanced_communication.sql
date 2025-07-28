-- 1. In-App Chat Messages Table
CREATE TABLE IF NOT EXISTS public.chat_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    sender_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    recipient_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    group_id UUID REFERENCES public.ministry_groups(id),
    message TEXT NOT NULL,
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_read BOOLEAN DEFAULT FALSE
);

-- 2. Add push delivery columns to system_notifications
ALTER TABLE IF EXISTS public.system_notifications
ADD COLUMN IF NOT EXISTS push_sent BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS push_sent_at TIMESTAMP WITH TIME ZONE;

-- 3. Communications Outbox (for queued email/SMS)
CREATE TABLE IF NOT EXISTS public.communications_outbox (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    type TEXT CHECK (type IN ('email', 'sms')),
    recipient_id UUID REFERENCES public.profiles(id),
    recipient_address TEXT,
    subject TEXT,
    message TEXT,
    status TEXT DEFAULT 'pending',
    sent_at TIMESTAMP WITH TIME ZONE,
    error TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
); 