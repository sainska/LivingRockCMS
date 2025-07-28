-- 1. Age Groups
CREATE TABLE IF NOT EXISTS public.age_groups (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    min_age INTEGER,
    max_age INTEGER,
    description TEXT
);

-- 2. Child Age Group Assignments
CREATE TABLE IF NOT EXISTS public.child_age_group_assignments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    child_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    age_group_id UUID REFERENCES public.age_groups(id) ON DELETE CASCADE,
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Child Check-in/Out Sessions
CREATE TABLE IF NOT EXISTS public.child_checkin_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    child_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES public.profiles(id),
    checkin_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    checkout_time TIMESTAMP WITH TIME ZONE,
    guardian_name TEXT,
    status TEXT DEFAULT 'checked_in' CHECK (status IN ('checked_in', 'checked_out', 'pending', 'incident')),
    notes TEXT
);

-- 4. Parental Notifications Log
CREATE TABLE IF NOT EXISTS public.parental_notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    child_id UUID REFERENCES public.profiles(id),
    parent_id UUID REFERENCES public.profiles(id),
    notification_type TEXT CHECK (notification_type IN ('checkin', 'checkout', 'incident', 'general')),
    message TEXT,
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    delivery_status TEXT
); 