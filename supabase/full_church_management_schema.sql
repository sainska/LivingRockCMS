-- FULL CHURCH MANAGEMENT SYSTEM SCHEMA

-- 1. Volunteer Management
CREATE TABLE IF NOT EXISTS public.volunteer_opportunities (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
    event_title TEXT,
    role_needed TEXT,
    description TEXT,
    is_open BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS public.volunteer_signups (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    opportunity_id UUID REFERENCES public.volunteer_opportunities(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    signed_up_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(opportunity_id, user_id)
);

-- 2. Event Management Enhancements
ALTER TABLE IF EXISTS public.event_registrations
ADD COLUMN IF NOT EXISTS ticket_code TEXT UNIQUE;
CREATE TABLE IF NOT EXISTS public.event_feedback (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comments TEXT,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Child & Youth Ministry
CREATE TABLE IF NOT EXISTS public.age_groups (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    min_age INTEGER,
    max_age INTEGER,
    description TEXT
);
CREATE TABLE IF NOT EXISTS public.child_age_group_assignments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    child_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    age_group_id UUID REFERENCES public.age_groups(id) ON DELETE CASCADE,
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
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
CREATE TABLE IF NOT EXISTS public.parental_notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    child_id UUID REFERENCES public.profiles(id),
    parent_id UUID REFERENCES public.profiles(id),
    notification_type TEXT CHECK (notification_type IN ('checkin', 'checkout', 'incident', 'general')),
    message TEXT,
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    delivery_status TEXT
);

-- 4. Facility & Asset Management
CREATE TABLE IF NOT EXISTS public.facilities (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    address TEXT,
    description TEXT
);
CREATE TABLE IF NOT EXISTS public.rooms (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    facility_id UUID REFERENCES public.facilities(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    capacity INTEGER,
    description TEXT
);
CREATE TABLE IF NOT EXISTS public.room_bookings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    room_id UUID REFERENCES public.rooms(id) ON DELETE CASCADE,
    booked_by UUID REFERENCES public.profiles(id),
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    purpose TEXT,
    status TEXT DEFAULT 'booked' CHECK (status IN ('booked', 'cancelled', 'completed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS public.assets (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    facility_id UUID REFERENCES public.facilities(id),
    room_id UUID REFERENCES public.rooms(id),
    status TEXT DEFAULT 'available' CHECK (status IN ('available', 'in_use', 'maintenance', 'retired')),
    value NUMERIC,
    acquired_at TIMESTAMP WITH TIME ZONE
);
CREATE TABLE IF NOT EXISTS public.asset_assignments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    asset_id UUID REFERENCES public.assets(id) ON DELETE CASCADE,
    assigned_to UUID REFERENCES public.profiles(id),
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    returned_at TIMESTAMP WITH TIME ZONE
);

-- 5. Advanced Analytics & Insights
CREATE OR REPLACE VIEW public.engagement_analytics AS
SELECT
  p.id AS user_id,
  p.first_name,
  p.last_name,
  COUNT(DISTINCT ar.event_id) AS events_attended,
  COUNT(DISTINCT mg.ministry_group_id) AS groups_joined,
  COUNT(DISTINCT pr.id) AS prayer_requests,
  COUNT(DISTINCT d.id) AS donations
FROM profiles p
LEFT JOIN attendance_records ar ON ar.member_id = p.id
LEFT JOIN ministry_group_members mg ON mg.user_id = p.id
LEFT JOIN prayer_requests pr ON pr.requester_id = p.id
LEFT JOIN financial_transactions d ON d.recorded_by = p.id
GROUP BY p.id, p.first_name, p.last_name;
CREATE OR REPLACE VIEW public.giving_analytics AS
SELECT
  p.id AS user_id,
  p.first_name,
  p.last_name,
  SUM(CASE WHEN ft.transaction_type = 'tithe' THEN ft.amount ELSE 0 END) AS total_tithes,
  SUM(CASE WHEN ft.transaction_type = 'offering' THEN ft.amount ELSE 0 END) AS total_offerings,
  SUM(CASE WHEN ft.transaction_type = 'donation' THEN ft.amount ELSE 0 END) AS total_donations,
  COUNT(ft.id) AS giving_transactions
FROM profiles p
LEFT JOIN financial_transactions ft ON ft.recorded_by = p.id
GROUP BY p.id, p.first_name, p.last_name;
CREATE TABLE IF NOT EXISTS public.predictive_analytics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    metric TEXT NOT NULL,
    forecast_value NUMERIC,
    forecast_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Compliance & Security
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id),
    action TEXT NOT NULL,
    target_table TEXT,
    target_id UUID,
    details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS public.role_permissions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    role TEXT NOT NULL,
    permission TEXT NOT NULL,
    granted BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS public.gdpr_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id),
    request_type TEXT CHECK (request_type IN ('export', 'delete', 'anonymize')),
    status TEXT DEFAULT 'pending',
    requested_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    processed_at TIMESTAMP WITH TIME ZONE
);

-- 7. Outreach & Missions
CREATE TABLE IF NOT EXISTS public.mission_trips (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    start_date DATE,
    end_date DATE,
    location TEXT,
    status TEXT DEFAULT 'planned' CHECK (status IN ('planned', 'active', 'completed', 'cancelled')),
    created_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS public.mission_trip_participants (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    mission_trip_id UUID REFERENCES public.mission_trips(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    role TEXT,
    status TEXT DEFAULT 'registered' CHECK (status IN ('registered', 'confirmed', 'cancelled')),
    registered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS public.community_service_projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    start_date DATE,
    end_date DATE,
    location TEXT,
    status TEXT DEFAULT 'planned' CHECK (status IN ('planned', 'active', 'completed', 'cancelled')),
    created_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS public.service_participation (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID REFERENCES public.community_service_projects(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    role TEXT,
    hours NUMERIC,
    status TEXT DEFAULT 'registered' CHECK (status IN ('registered', 'completed', 'cancelled')),
    registered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
); 