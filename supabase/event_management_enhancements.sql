-- 1. Add ticket_code to event_registrations
ALTER TABLE IF EXISTS public.event_registrations
ADD COLUMN IF NOT EXISTS ticket_code TEXT UNIQUE;

-- 2. Event Feedback Table
CREATE TABLE IF NOT EXISTS public.event_feedback (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comments TEXT,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
); 