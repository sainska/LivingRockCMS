-- =====================================================
-- Living Rock CMS - Fixed Implementation Script
-- =====================================================
-- This script creates all necessary tables, functions, and sample data
-- Execute this entire script in Supabase SQL Editor for complete automation

-- =====================================================
-- STEP 1: Create Core Tables (if they don't exist)
-- =====================================================

-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    date_of_birth DATE,
    gender TEXT CHECK (gender IN ('male', 'female', 'other')),
    address TEXT,
    city TEXT,
    country TEXT DEFAULT 'Kenya',
    profile_image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_roles table
CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('system_admin', 'clergy', 'treasurer', 'secretary', 'member')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, role)
);

-- Create members table
CREATE TABLE IF NOT EXISTS public.members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    membership_number TEXT UNIQUE,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
    join_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create ministries table
CREATE TABLE IF NOT EXISTS public.ministries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    leader_id UUID REFERENCES public.profiles(id),
    meeting_time TEXT,
    location TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create ministry_members table
CREATE TABLE IF NOT EXISTS public.ministry_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ministry_id UUID REFERENCES public.ministries(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    role TEXT DEFAULT 'member',
    join_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(ministry_id, user_id)
);

-- Create financial_accounts table
CREATE TABLE IF NOT EXISTS public.financial_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    account_type TEXT NOT NULL CHECK (account_type IN ('tithe', 'offering', 'project', 'missions', 'general', 'special')),
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create financial_transactions table
CREATE TABLE IF NOT EXISTS public.financial_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    account_id UUID REFERENCES public.financial_accounts(id),
    user_id UUID REFERENCES public.profiles(id),
    amount DECIMAL(10,2) NOT NULL,
    transaction_type TEXT NOT NULL CHECK (transaction_type IN ('income', 'expense')),
    date DATE DEFAULT CURRENT_DATE,
    description TEXT,
    payment_method TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create events table
CREATE TABLE IF NOT EXISTS public.events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE,
    location TEXT,
    event_type TEXT DEFAULT 'service',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create attendance_records table
CREATE TABLE IF NOT EXISTS public.attendance_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    attendance_status TEXT DEFAULT 'present' CHECK (attendance_status IN ('present', 'absent', 'late')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(event_id, user_id)
);

-- Create announcements table
CREATE TABLE IF NOT EXISTS public.announcements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    author_id UUID REFERENCES public.profiles(id),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create messages table
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    recipient_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    subject TEXT,
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create pastoral_visits table
CREATE TABLE IF NOT EXISTS public.pastoral_visits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visitor_id UUID REFERENCES public.profiles(id),
    visited_id UUID REFERENCES public.profiles(id),
    visit_date DATE NOT NULL,
    purpose TEXT,
    notes TEXT,
    follow_up_required BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create counseling_sessions table
CREATE TABLE IF NOT EXISTS public.counseling_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    counselor_id UUID REFERENCES public.profiles(id),
    client_id UUID REFERENCES public.profiles(id),
    session_date DATE NOT NULL,
    duration_minutes INTEGER,
    topic TEXT,
    notes TEXT,
    follow_up_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create error_logs table
CREATE TABLE IF NOT EXISTS public.error_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    error_type TEXT NOT NULL,
    error_message TEXT NOT NULL,
    table_name TEXT,
    operation TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create audit_logs table
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id),
    action TEXT NOT NULL,
    table_name TEXT,
    record_id UUID,
    old_values JSONB,
    new_values JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

SELECT 'Step 1: Core Tables Created' as step_name, 'SUCCESS' as status;

-- =====================================================
-- STEP 2: Enable RLS Security
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ministries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ministry_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pastoral_visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.counseling_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.error_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Create basic RLS policies
CREATE POLICY "Users can view their own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can view their own roles" ON public.user_roles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own member info" ON public.members
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "All users can view ministries" ON public.ministries
    FOR SELECT USING (true);

CREATE POLICY "Users can view their ministry memberships" ON public.ministry_members
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "All users can view financial accounts" ON public.financial_accounts
    FOR SELECT USING (true);

CREATE POLICY "Users can view their own transactions" ON public.financial_transactions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "All users can view events" ON public.events
    FOR SELECT USING (true);

CREATE POLICY "Users can view their own attendance" ON public.attendance_records
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "All users can view announcements" ON public.announcements
    FOR SELECT USING (true);

CREATE POLICY "Users can view messages sent to them" ON public.messages
    FOR SELECT USING (auth.uid() = recipient_id);

SELECT 'Step 2: RLS Security Enabled' as step_name, 'SUCCESS' as status;

-- =====================================================
-- STEP 3: Create Core Functions
-- =====================================================

-- Function to check if user has a specific role
CREATE OR REPLACE FUNCTION public.has_role(role_name text)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role = role_name
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get all roles for current user
CREATE OR REPLACE FUNCTION public.get_user_roles()
RETURNS text[] AS $$
BEGIN
  RETURN ARRAY(
    SELECT role FROM public.user_roles 
    WHERE user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user dashboard access
CREATE OR REPLACE FUNCTION public.get_user_dashboard_access()
RETURNS json AS $$
DECLARE
    user_roles text[];
    result json;
BEGIN
    user_roles := public.get_user_roles();
    
    result := json_build_object(
        'is_admin', 'system_admin' = ANY(user_roles),
        'is_clergy', 'clergy' = ANY(user_roles),
        'is_treasurer', 'treasurer' = ANY(user_roles),
        'is_secretary', 'secretary' = ANY(user_roles),
        'is_member', 'member' = ANY(user_roles),
        'roles', user_roles
    );
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get financial summary
CREATE OR REPLACE FUNCTION public.get_financial_summary(start_date date DEFAULT NULL, end_date date DEFAULT NULL)
RETURNS json AS $$
DECLARE
    result json;
BEGIN
    SELECT json_build_object(
        'total_income', COALESCE(SUM(CASE WHEN transaction_type = 'income' THEN amount ELSE 0 END), 0),
        'total_expenses', COALESCE(SUM(CASE WHEN transaction_type = 'expense' THEN ABS(amount) ELSE 0 END), 0),
        'net_amount', COALESCE(SUM(CASE WHEN transaction_type = 'income' THEN amount ELSE -amount END), 0),
        'transaction_count', COUNT(*)
    ) INTO result
    FROM public.financial_transactions
    WHERE (start_date IS NULL OR date >= start_date)
      AND (end_date IS NULL OR date <= end_date);
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get member activity
CREATE OR REPLACE FUNCTION public.get_member_activity(user_uuid uuid)
RETURNS json AS $$
DECLARE
    result json;
BEGIN
    SELECT json_build_object(
        'profile', row_to_json(p),
        'member_info', row_to_json(m),
        'roles', array_agg(ur.role),
        'ministry_count', COUNT(DISTINCT mm.ministry_id),
        'events_attended', COUNT(DISTINCT ar.event_id),
        'total_given', COALESCE(SUM(CASE WHEN ft.transaction_type = 'income' THEN ft.amount ELSE 0 END), 0)
    ) INTO result
    FROM public.profiles p
    LEFT JOIN public.members m ON m.user_id = p.id
    LEFT JOIN public.user_roles ur ON ur.user_id = p.id
    LEFT JOIN public.ministry_members mm ON mm.user_id = p.id
    LEFT JOIN public.attendance_records ar ON ar.user_id = p.id AND ar.attendance_status = 'present'
    LEFT JOIN public.financial_transactions ft ON ft.user_id = p.id
    WHERE p.id = user_uuid
    GROUP BY p.id, p.first_name, p.last_name, p.email, p.phone, p.profile_image_url, 
             m.membership_number, m.status, m.join_date;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get system health
CREATE OR REPLACE FUNCTION public.get_system_health()
RETURNS json AS $$
DECLARE
    result json;
BEGIN
    SELECT json_build_object(
        'total_users', (SELECT COUNT(*) FROM public.profiles),
        'total_members', (SELECT COUNT(*) FROM public.members),
        'total_ministries', (SELECT COUNT(*) FROM public.ministries),
        'total_events', (SELECT COUNT(*) FROM public.events),
        'total_transactions', (SELECT COUNT(*) FROM public.financial_transactions),
        'recent_errors', (SELECT COUNT(*) FROM public.error_logs WHERE created_at > NOW() - INTERVAL '24 hours'),
        'system_status', 'healthy'
    ) INTO result;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to log errors
CREATE OR REPLACE FUNCTION public.log_error(
    error_type text,
    error_message text,
    table_name text DEFAULT NULL,
    operation text DEFAULT NULL
)
RETURNS void AS $$
BEGIN
    INSERT INTO public.error_logs (error_type, error_message, table_name, operation)
    VALUES (error_type, error_message, table_name, operation);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

SELECT 'Step 3: Core Functions Created' as step_name, 'SUCCESS' as status;

-- =====================================================
-- STEP 4: Create Dashboard Views
-- =====================================================

-- Member dashboard view
CREATE OR REPLACE VIEW public.member_dashboard_view AS
SELECT 
    p.id, p.first_name, p.last_name, p.email, p.phone, p.profile_image_url,
    m.membership_number, m.status as membership_status, m.join_date,
    ur.role,
    COUNT(DISTINCT mm.ministry_id) as ministry_count,
    COUNT(DISTINCT ar.event_id) as events_attended,
    COALESCE(SUM(CASE WHEN ft.transaction_type = 'income' THEN ft.amount ELSE 0 END), 0) as total_given
FROM public.profiles p
LEFT JOIN public.members m ON m.user_id = p.id
LEFT JOIN public.user_roles ur ON ur.user_id = p.id
LEFT JOIN public.ministry_members mm ON mm.user_id = p.id
LEFT JOIN public.attendance_records ar ON ar.user_id = p.id AND ar.attendance_status = 'present'
LEFT JOIN public.financial_transactions ft ON ft.user_id = p.id
GROUP BY p.id, p.first_name, p.last_name, p.email, p.phone, p.profile_image_url, 
         m.membership_number, m.status, m.join_date, ur.role;

-- Financial dashboard view
CREATE OR REPLACE VIEW public.financial_dashboard_view AS
SELECT 
    fa.id as account_id, fa.name as account_name, fa.account_type, fa.description,
    COUNT(ft.id) as transaction_count,
    COALESCE(SUM(CASE WHEN ft.transaction_type = 'income' THEN ft.amount ELSE 0 END), 0) as total_income,
    COALESCE(SUM(CASE WHEN ft.transaction_type = 'expense' THEN ABS(ft.amount) ELSE 0 END), 0) as total_expenses,
    COALESCE(SUM(CASE WHEN ft.transaction_type = 'income' THEN ft.amount ELSE -ft.amount END), 0) as net_amount,
    MAX(ft.date) as last_transaction_date
FROM public.financial_accounts fa
LEFT JOIN public.financial_transactions ft ON ft.account_id = fa.id
GROUP BY fa.id, fa.name, fa.account_type, fa.description;

SELECT 'Step 4: Dashboard Views Created' as step_name, 'SUCCESS' as status;

-- =====================================================
-- STEP 5: Insert Sample Data
-- =====================================================

-- Insert user profiles
INSERT INTO public.profiles (id, first_name, last_name, email, phone, date_of_birth, gender, address, city, country, profile_image_url)
VALUES 
-- System Admin
('11111111-1111-1111-1111-111111111111', 'Admin', 'User', 'admin@livingrock.com', '+254700000001', '1980-01-01', 'male', '123 Admin Street', 'Nairobi', 'Kenya', 'https://example.com/admin.jpg'),
-- Clergy
('22222222-2222-2222-2222-222222222222', 'Pastor', 'John', 'pastor.john@livingrock.com', '+254700000002', '1975-05-15', 'male', '456 Church Road', 'Nairobi', 'Kenya', 'https://example.com/pastor.jpg'),
('33333333-3333-3333-3333-333333333333', 'Reverend', 'Sarah', 'rev.sarah@livingrock.com', '+254700000003', '1982-08-20', 'female', '789 Ministry Ave', 'Nairobi', 'Kenya', 'https://example.com/reverend.jpg'),
-- Treasurer
('44444444-4444-4444-4444-444444444444', 'Treasurer', 'Mike', 'treasurer@livingrock.com', '+254700000004', '1978-12-10', 'male', '321 Finance Street', 'Nairobi', 'Kenya', 'https://example.com/treasurer.jpg'),
-- Secretary
('55555555-5555-5555-5555-555555555555', 'Secretary', 'Jane', 'secretary@livingrock.com', '+254700000005', '1985-03-25', 'female', '654 Admin Blvd', 'Nairobi', 'Kenya', 'https://example.com/secretary.jpg'),
-- Members
('66666666-6666-6666-6666-666666666666', 'James', 'Kamau', 'james.kamau@email.com', '+254700000006', '1990-06-12', 'male', '100 Member Street', 'Nairobi', 'Kenya', NULL),
('77777777-7777-7777-7777-777777777777', 'Mary', 'Wanjiku', 'mary.wanjiku@email.com', '+254700000007', '1988-09-18', 'female', '101 Member Street', 'Nairobi', 'Kenya', NULL),
('88888888-8888-8888-8888-888888888888', 'David', 'Ochieng', 'david.ochieng@email.com', '+254700000008', '1992-04-30', 'male', '102 Member Street', 'Nairobi', 'Kenya', NULL),
('99999999-9999-9999-9999-999999999999', 'Grace', 'Akinyi', 'grace.akinyi@email.com', '+254700000009', '1987-11-05', 'female', '103 Member Street', 'Nairobi', 'Kenya', NULL),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Peter', 'Muthoni', 'peter.muthoni@email.com', '+254700000010', '1995-02-14', 'male', '104 Member Street', 'Nairobi', 'Kenya', NULL)
ON CONFLICT (id) DO NOTHING;

-- Insert user roles
INSERT INTO public.user_roles (user_id, role)
VALUES 
('11111111-1111-1111-1111-111111111111', 'system_admin'),
('22222222-2222-2222-2222-222222222222', 'clergy'),
('33333333-3333-3333-3333-333333333333', 'clergy'),
('44444444-4444-4444-4444-444444444444', 'treasurer'),
('55555555-5555-5555-5555-555555555555', 'secretary'),
('66666666-6666-6666-6666-666666666666', 'member'),
('77777777-7777-7777-7777-777777777777', 'member'),
('88888888-8888-8888-8888-888888888888', 'member'),
('99999999-9999-9999-9999-999999999999', 'member'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'member')
ON CONFLICT (user_id, role) DO NOTHING;

-- Insert ministries
INSERT INTO public.ministries (id, name, description, leader_id, meeting_time, location, is_active)
VALUES 
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Youth Ministry', 'Engaging young people in faith and community', '22222222-2222-2222-2222-222222222222', 'Sunday 2:00 PM', 'Youth Hall', true),
('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Worship Team', 'Leading congregation in worship and music', '33333333-3333-3333-3333-333333333333', 'Saturday 10:00 AM', 'Main Sanctuary', true),
('dddddddd-dddd-dddd-dddd-dddddddddddd', 'Children Ministry', 'Nurturing children in faith and values', '66666666-6666-6666-6666-666666666666', 'Sunday 9:00 AM', 'Children Room', true),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'Prayer Team', 'Intercessory prayer and spiritual support', '77777777-7777-7777-7777-777777777777', 'Wednesday 7:00 PM', 'Prayer Room', true),
('ffffffff-ffff-ffff-ffff-ffffffffffff', 'Outreach Ministry', 'Community service and evangelism', '88888888-8888-8888-8888-888888888888', 'Saturday 3:00 PM', 'Various Locations', true)
ON CONFLICT (id) DO NOTHING;

-- Insert ministry members
INSERT INTO public.ministry_members (ministry_id, user_id, role, join_date)
VALUES 
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '66666666-6666-6666-6666-666666666666', 'member', '2024-01-15'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '77777777-7777-7777-7777-777777777777', 'member', '2024-01-20'),
('cccccccc-cccc-cccc-cccc-cccccccccccc', '88888888-8888-8888-8888-888888888888', 'member', '2024-02-01'),
('cccccccc-cccc-cccc-cccc-cccccccccccc', '99999999-9999-9999-9999-999999999999', 'member', '2024-02-05'),
('dddddddd-dddd-dddd-dddd-dddddddddddd', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'member', '2024-02-10')
ON CONFLICT (ministry_id, user_id) DO NOTHING;

-- Insert financial accounts
INSERT INTO public.financial_accounts (id, name, account_type, description, is_active)
VALUES 
('gggggggg-gggg-gggg-gggg-gggggggggggg', 'Tithe Account', 'tithe', 'Member tithes and offerings', true),
('hhhhhhhh-hhhh-hhhh-hhhh-hhhhhhhhhhhh', 'Building Fund', 'project', 'Church building and maintenance', true),
('iiiiiiii-iiii-iiii-iiii-iiiiiiiiiiii', 'Missions Fund', 'missions', 'Missionary support and outreach', true),
('jjjjjjjj-jjjj-jjjj-jjjj-jjjjjjjjjjjj', 'General Fund', 'general', 'General church operations', true),
('kkkkkkkk-kkkk-kkkk-kkkk-kkkkkkkkkkkk', 'Youth Fund', 'special', 'Youth ministry activities', true)
ON CONFLICT (id) DO NOTHING;

-- Insert sample financial transactions
INSERT INTO public.financial_transactions (id, account_id, user_id, amount, transaction_type, date, description, payment_method)
VALUES 
-- Tithes
('llllllll-llll-llll-llll-llllllllllll', 'gggggggg-gggg-gggg-gggg-gggggggggggg', '66666666-6666-6666-6666-666666666666', 5000.00, 'income', '2024-01-01', 'January Tithe', 'bank_transfer'),
('mmmmmmmm-mmmm-mmmm-mmmm-mmmmmmmmmmmm', 'gggggggg-gggg-gggg-gggg-gggggggggggg', '77777777-7777-7777-7777-777777777777', 3500.00, 'income', '2024-01-01', 'January Tithe', 'cash'),
('nnnnnnnn-nnnn-nnnn-nnnn-nnnnnnnnnnnn', 'gggggggg-gggg-gggg-gggg-gggggggggggg', '88888888-8888-8888-8888-888888888888', 4200.00, 'income', '2024-01-01', 'January Tithe', 'mobile_money'),
-- Offerings
('oooooooo-oooo-oooo-oooo-oooooooooooo', 'jjjjjjjj-jjjj-jjjj-jjjj-jjjjjjjjjjjj', '99999999-9999-9999-9999-999999999999', 1000.00, 'income', '2024-01-01', 'Sunday Offering', 'cash'),
('pppppppp-pppp-pppp-pppp-pppppppppppp', 'jjjjjjjj-jjjj-jjjj-jjjj-jjjjjjjjjjjj', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 800.00, 'income', '2024-01-01', 'Sunday Offering', 'mobile_money'),
-- Building Fund
('qqqqqqqq-qqqq-qqqq-qqqq-qqqqqqqqqqqq', 'hhhhhhhh-hhhh-hhhh-hhhh-hhhhhhhhhhhh', '66666666-6666-6666-6666-666666666666', 2000.00, 'income', '2024-01-15', 'Building Fund Donation', 'bank_transfer'),
-- Expenses
('rrrrrrrr-rrrr-rrrr-rrrr-rrrrrrrrrrrr', 'jjjjjjjj-jjjj-jjjj-jjjj-jjjjjjjjjjjj', NULL, 15000.00, 'expense', '2024-01-20', 'Utility Bills', 'bank_transfer'),
('ssssssss-ssss-ssss-ssss-ssssssssssss', 'jjjjjjjj-jjjj-jjjj-jjjj-jjjjjjjjjjjj', NULL, 8000.00, 'expense', '2024-01-25', 'Maintenance', 'cash')
ON CONFLICT (id) DO NOTHING;

-- Insert sample events
INSERT INTO public.events (id, title, description, start_date, end_date, location, event_type, is_active)
VALUES 
('tttttttt-tttt-tttt-tttt-tttttttttttt', 'Sunday Service', 'Weekly Sunday worship service', '2024-01-07 09:00:00+00', '2024-01-07 11:00:00+00', 'Main Sanctuary', 'service', true),
('uuuuuuuu-uuuu-uuuu-uuuu-uuuuuuuuuuuu', 'Youth Meeting', 'Youth ministry weekly meeting', '2024-01-07 14:00:00+00', '2024-01-07 16:00:00+00', 'Youth Hall', 'meeting', true),
('vvvvvvvv-vvvv-vvvv-vvvv-vvvvvvvvvvvv', 'Prayer Meeting', 'Weekly prayer and intercession', '2024-01-10 19:00:00+00', '2024-01-10 20:30:00+00', 'Prayer Room', 'prayer', true),
('wwwwwwww-wwww-wwww-wwww-wwwwwwwwwwww', 'Sunday Service', 'Weekly Sunday worship service', '2024-01-14 09:00:00+00', '2024-01-14 11:00:00+00', 'Main Sanctuary', 'service', true),
('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx', 'Bible Study', 'Weekly Bible study session', '2024-01-16 19:00:00+00', '2024-01-16 20:30:00+00', 'Fellowship Hall', 'study', true)
ON CONFLICT (id) DO NOTHING;

-- Insert sample attendance records
INSERT INTO public.attendance_records (event_id, user_id, attendance_status, notes)
VALUES 
('tttttttt-tttt-tttt-tttt-tttttttttttt', '66666666-6666-6666-6666-666666666666', 'present', NULL),
('tttttttt-tttt-tttt-tttt-tttttttttttt', '77777777-7777-7777-7777-777777777777', 'present', NULL),
('tttttttt-tttt-tttt-tttt-tttttttttttt', '88888888-8888-8888-8888-888888888888', 'late', 'Arrived 15 minutes late'),
('uuuuuuuu-uuuu-uuuu-uuuu-uuuuuuuuuuuu', '66666666-6666-6666-6666-666666666666', 'present', NULL),
('uuuuuuuu-uuuu-uuuu-uuuu-uuuuuuuuuuuu', '77777777-7777-7777-7777-777777777777', 'present', NULL),
('vvvvvvvv-vvvv-vvvv-vvvv-vvvvvvvvvvvv', '77777777-7777-7777-7777-777777777777', 'present', NULL),
('wwwwwwww-wwww-wwww-wwww-wwwwwwwwwwww', '66666666-6666-6666-6666-666666666666', 'present', NULL),
('wwwwwwww-wwww-wwww-wwww-wwwwwwwwwwww', '99999999-9999-9999-9999-999999999999', 'present', NULL),
('wwwwwwww-wwww-wwww-wwww-wwwwwwwwwwww', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'absent', 'Called in sick')
ON CONFLICT (event_id, user_id) DO NOTHING;

-- Insert sample announcements
INSERT INTO public.announcements (id, title, content, author_id, is_active)
VALUES 
('yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy', 'Welcome to 2024', 'Happy New Year! We are excited to start this new year with renewed faith and commitment to serving God and our community.', '22222222-2222-2222-2222-222222222222', true),
('zzzzzzzz-zzzz-zzzz-zzzz-zzzzzzzzzzzz', 'Youth Ministry Meeting', 'All youth are invited to our weekly meeting this Sunday at 2 PM in the Youth Hall. Come and be part of our growing community!', '22222222-2222-2222-2222-222222222222', true),
('11111111-2222-3333-4444-555555555555', 'Prayer Request', 'Please keep our church family in your prayers as we continue to grow and serve our community.', '33333333-3333-3333-3333-333333333333', true)
ON CONFLICT (id) DO NOTHING;

SELECT 'Step 5: Sample Data Inserted' as step_name, 'SUCCESS' as status;

-- =====================================================
-- STEP 6: Create Indexes for Performance
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role ON public.user_roles(role);
CREATE INDEX IF NOT EXISTS idx_financial_transactions_user_id ON public.financial_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_financial_transactions_date ON public.financial_transactions(date);
CREATE INDEX IF NOT EXISTS idx_attendance_records_user_id ON public.attendance_records(user_id);
CREATE INDEX IF NOT EXISTS idx_attendance_records_event_id ON public.attendance_records(event_id);
CREATE INDEX IF NOT EXISTS idx_events_start_date ON public.events(start_date);
CREATE INDEX IF NOT EXISTS idx_announcements_is_active ON public.announcements(is_active);
CREATE INDEX IF NOT EXISTS idx_messages_recipient_id ON public.messages(recipient_id);

SELECT 'Step 6: Performance Indexes Created' as step_name, 'SUCCESS' as status;

-- =====================================================
-- STEP 7: Final Verification
-- =====================================================

SELECT 'Step 7: Final Verification' as step_name,
       (SELECT COUNT(*) FROM public.profiles) as total_profiles,
       (SELECT COUNT(*) FROM public.user_roles) as total_roles,
       (SELECT COUNT(*) FROM public.ministries) as total_ministries,
       (SELECT COUNT(*) FROM public.financial_accounts) as total_accounts,
       (SELECT COUNT(*) FROM public.financial_transactions) as total_transactions,
       (SELECT COUNT(*) FROM public.events) as total_events,
       (SELECT COUNT(*) FROM public.attendance_records) as total_attendance,
       (SELECT COUNT(*) FROM public.announcements) as total_announcements;

-- =====================================================
-- SUCCESS MESSAGE
-- =====================================================

SELECT '🎉 Living Rock CMS Implementation Complete!' as message,
       'All tables, functions, views, and sample data have been created successfully.' as details,
       NOW() as completed_at; 