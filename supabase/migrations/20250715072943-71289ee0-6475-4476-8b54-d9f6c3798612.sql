
-- =====================================================
-- Living Rock Church Management System - Database Schema
-- =====================================================

-- 1. Create ENUM types for better data integrity
DO $$ BEGIN
    CREATE TYPE public.user_role AS ENUM ('system_admin', 'clergy', 'treasurer', 'secretary', 'member');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE public.member_status AS ENUM ('active', 'inactive', 'visitor', 'transferred', 'deceased');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE public.event_type AS ENUM ('worship', 'conference', 'bible_study', 'training', 'wedding', 'funeral', 'other');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE public.donation_type AS ENUM ('tithe', 'offering', 'pledge', 'special', 'missions');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE public.payment_method AS ENUM ('cash', 'mpesa', 'bank_transfer', 'cheque', 'card', 'online');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Households table (for family grouping)
CREATE TABLE IF NOT EXISTS public.households (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    head_of_household_id UUID,
    address TEXT,
    phone VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Enhanced profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    date_of_birth DATE,
    gender TEXT CHECK (gender IN ('male', 'female')),
    marital_status TEXT CHECK (marital_status IN ('single', 'married', 'divorced', 'widowed')),
    address TEXT,
    city TEXT,
    country TEXT DEFAULT 'Kenya',
    household_id UUID REFERENCES public.households(id),
    profile_image_url TEXT,
    emergency_contact_name TEXT,
    emergency_contact_phone TEXT,
    baptism_date DATE,
    confirmation_date DATE,
    join_date DATE DEFAULT CURRENT_DATE,
    membership_number TEXT UNIQUE,
    status member_status DEFAULT 'active',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (id)
);

-- 4. User roles table (already exists but ensuring it's updated)
CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    role user_role NOT NULL,
    assigned_by UUID REFERENCES public.profiles(id),
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE,
    UNIQUE(user_id, role)
);

-- 5. Enhanced events table
CREATE TABLE IF NOT EXISTS public.events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    event_type event_type DEFAULT 'other',
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE,
    location TEXT,
    organizer_id UUID REFERENCES public.profiles(id),
    created_by UUID REFERENCES public.profiles(id) NOT NULL,
    max_attendees INTEGER,
    registration_required BOOLEAN DEFAULT FALSE,
    registration_deadline TIMESTAMP WITH TIME ZONE,
    is_recurring BOOLEAN DEFAULT FALSE,
    recurrance_pattern TEXT,
    status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'ongoing', 'completed', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Event registrations table
CREATE TABLE IF NOT EXISTS public.event_registrations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    event_id UUID REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    registration_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    attendance_status TEXT DEFAULT 'registered' CHECK (attendance_status IN ('registered', 'attended', 'absent', 'cancelled')),
    notes TEXT,
    UNIQUE(event_id, user_id)
);

-- 7. Enhanced donations table
CREATE TABLE IF NOT EXISTS public.donations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    donor_id UUID REFERENCES public.profiles(id),
    amount DECIMAL(12,2) NOT NULL CHECK (amount > 0),
    donation_type donation_type NOT NULL,
    payment_method payment_method NOT NULL,
    donation_date DATE DEFAULT CURRENT_DATE,
    transaction_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_anonymous BOOLEAN DEFAULT FALSE,
    campaign_id UUID,
    receipt_number TEXT UNIQUE,
    receipt_issued BOOLEAN DEFAULT FALSE,
    recorded_by UUID REFERENCES public.profiles(id) NOT NULL,
    purpose TEXT,
    reference_number TEXT,
    notes TEXT,
    currency TEXT DEFAULT 'KES',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Donation campaigns table
CREATE TABLE IF NOT EXISTS public.donation_campaigns (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    target_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
    current_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
    start_date DATE NOT NULL DEFAULT CURRENT_DATE,
    end_date DATE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_by UUID REFERENCES public.profiles(id) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. Pledges table
CREATE TABLE IF NOT EXISTS public.pledges (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    member_id UUID REFERENCES public.profiles(id) NOT NULL,
    campaign_id UUID REFERENCES public.donation_campaigns(id),
    amount DECIMAL(12,2) NOT NULL CHECK (amount > 0),
    pledge_date DATE NOT NULL DEFAULT CURRENT_DATE,
    fulfilled_amount DECIMAL(12,2) DEFAULT 0,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'fulfilled', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. Expenses table
CREATE TABLE IF NOT EXISTS public.expenses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    description TEXT NOT NULL,
    amount DECIMAL(12,2) NOT NULL CHECK (amount > 0),
    category TEXT NOT NULL,
    expense_date DATE NOT NULL DEFAULT CURRENT_DATE,
    payment_method payment_method NOT NULL,
    receipt_url TEXT,
    reference_number TEXT,
    recorded_by UUID REFERENCES public.profiles(id) NOT NULL,
    approved_by UUID REFERENCES public.profiles(id),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 11. Budget categories table
CREATE TABLE IF NOT EXISTS public.budget_categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    allocated_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
    spent_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
    budget_year INTEGER NOT NULL DEFAULT EXTRACT(year FROM CURRENT_DATE),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 12. Financial accounts table
CREATE TABLE IF NOT EXISTS public.financial_accounts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    account_name TEXT NOT NULL,
    account_type TEXT NOT NULL CHECK (account_type IN ('savings', 'current', 'fixed_deposit', 'investment')),
    bank_name TEXT,
    account_number TEXT,
    current_balance DECIMAL(12,2) DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 13. Financial transactions table
CREATE TABLE IF NOT EXISTS public.financial_transactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    account_id UUID REFERENCES public.financial_accounts(id) NOT NULL,
    transaction_type TEXT NOT NULL CHECK (transaction_type IN ('debit', 'credit')),
    amount DECIMAL(12,2) NOT NULL CHECK (amount > 0),
    description TEXT NOT NULL,
    category TEXT,
    transaction_date DATE NOT NULL DEFAULT CURRENT_DATE,
    reference_number TEXT,
    recorded_by UUID REFERENCES public.profiles(id) NOT NULL,
    approved_by UUID REFERENCES public.profiles(id),
    approval_status TEXT DEFAULT 'pending' CHECK (approval_status IN ('pending', 'approved', 'rejected')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 14. Sermons table
CREATE TABLE IF NOT EXISTS public.sermons (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    scripture_reference TEXT,
    summary TEXT,
    date_preached DATE NOT NULL DEFAULT CURRENT_DATE,
    preacher_id UUID REFERENCES public.profiles(id) NOT NULL,
    audio_url TEXT,
    video_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 15. Bible study groups/ministries table
CREATE TABLE IF NOT EXISTS public.ministries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    leader_id UUID REFERENCES public.profiles(id),
    co_leader_id UUID REFERENCES public.profiles(id),
    meeting_day TEXT,
    meeting_time TIME,
    meeting_location TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 16. Ministry members table
CREATE TABLE IF NOT EXISTS public.ministry_members (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    ministry_id UUID REFERENCES public.ministries(id) ON DELETE CASCADE NOT NULL,
    member_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    role TEXT DEFAULT 'member' CHECK (role IN ('leader', 'co_leader', 'member')),
    joined_date DATE DEFAULT CURRENT_DATE,
    is_active BOOLEAN DEFAULT TRUE,
    UNIQUE(ministry_id, member_id)
);

-- 17. Prayer requests table
CREATE TABLE IF NOT EXISTS public.prayer_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    requester_id UUID REFERENCES public.profiles(id) NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    is_anonymous BOOLEAN NOT NULL DEFAULT FALSE,
    is_urgent BOOLEAN NOT NULL DEFAULT FALSE,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'answered', 'closed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 18. Pastoral visits table
CREATE TABLE IF NOT EXISTS public.pastoral_visits (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    member_id UUID REFERENCES public.profiles(id) NOT NULL,
    visitor_id UUID REFERENCES public.profiles(id) NOT NULL,
    purpose TEXT NOT NULL,
    visit_date DATE NOT NULL DEFAULT CURRENT_DATE,
    notes TEXT,
    follow_up_required BOOLEAN NOT NULL DEFAULT FALSE,
    follow_up_date DATE,
    status TEXT NOT NULL DEFAULT 'completed' CHECK (status IN ('scheduled', 'completed', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 19. Attendance records table
CREATE TABLE IF NOT EXISTS public.attendance_records (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    event_id UUID REFERENCES public.events(id) NOT NULL,
    member_id UUID REFERENCES public.profiles(id) NOT NULL,
    attendance_date DATE NOT NULL DEFAULT CURRENT_DATE,
    status TEXT NOT NULL DEFAULT 'present' CHECK (status IN ('present', 'absent', 'late')),
    recorded_by UUID REFERENCES public.profiles(id) NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(event_id, member_id, attendance_date)
);

-- 20. Communications table
CREATE TABLE IF NOT EXISTS public.communications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'announcement' CHECK (type IN ('announcement', 'newsletter', 'reminder', 'alert')),
    sent_by UUID REFERENCES public.profiles(id) NOT NULL,
    target_audience TEXT[] DEFAULT ARRAY['all'],  -- roles or specific groups
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'sent')),
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_urgent BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 21. Church settings table
CREATE TABLE IF NOT EXISTS public.church_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    setting_key TEXT NOT NULL UNIQUE,
    setting_value TEXT,
    setting_type TEXT DEFAULT 'text' CHECK (setting_type IN ('text', 'number', 'boolean', 'json')),
    description TEXT,
    is_public BOOLEAN DEFAULT FALSE,
    updated_by UUID REFERENCES public.profiles(id),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 22. Audit logs table (already exists but ensuring it's comprehensive)
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id),
    action TEXT NOT NULL,
    table_name TEXT,
    record_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- FUNCTIONS AND TRIGGERS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    -- Insert profile
    INSERT INTO public.profiles (id, first_name, last_name, email)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
        COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
        NEW.email
    );
    
    -- Auto-assign member role
    INSERT INTO public.user_roles (user_id, role, is_active)
    VALUES (NEW.id, 'member', true);
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user role
CREATE OR REPLACE FUNCTION public.get_user_role(user_uuid UUID)
RETURNS user_role
LANGUAGE sql
STABLE SECURITY DEFINER
AS $$
  SELECT role FROM public.user_roles 
  WHERE user_id = user_uuid AND is_active = true 
  ORDER BY 
    CASE role
      WHEN 'system_admin' THEN 1
      WHEN 'clergy' THEN 2
      WHEN 'treasurer' THEN 3
      WHEN 'secretary' THEN 4
      WHEN 'member' THEN 5
    END
  LIMIT 1;
$$;

-- Function to check if user has specific role
CREATE OR REPLACE FUNCTION public.has_role(user_uuid UUID, required_role user_role)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = user_uuid 
    AND role = required_role 
    AND is_active = true
  );
$$;

-- Function to check if user is admin or clergy
CREATE OR REPLACE FUNCTION public.is_admin_or_clergy(user_uuid UUID)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = user_uuid 
    AND role IN ('system_admin', 'clergy') 
    AND is_active = true
  );
$$;

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Trigger for new user registration
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Triggers for updating updated_at columns
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_events_updated_at ON public.events;
CREATE TRIGGER update_events_updated_at
    BEFORE UPDATE ON public.events
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_households_updated_at ON public.households;
CREATE TRIGGER update_households_updated_at
    BEFORE UPDATE ON public.households
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donation_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pledges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.budget_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sermons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ministries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ministry_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prayer_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pastoral_visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.communications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.church_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "System admins can view all profiles" ON public.profiles
    FOR ALL USING (has_role(auth.uid(), 'system_admin'));

CREATE POLICY "Users can view all profiles" ON public.profiles
    FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "System can insert profiles" ON public.profiles
    FOR INSERT WITH CHECK (true);

-- User roles policies
CREATE POLICY "Users can view own roles" ON public.user_roles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view all roles" ON public.user_roles
    FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "System admins can manage roles" ON public.user_roles
    FOR ALL USING (has_role(auth.uid(), 'system_admin'));

-- Events policies
CREATE POLICY "Users can view events" ON public.events
    FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Clergy and admins can manage events" ON public.events
    FOR ALL USING (is_admin_or_clergy(auth.uid()));

-- Event registrations policies
CREATE POLICY "Users can view registrations" ON public.event_registrations
    FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can register for events" ON public.event_registrations
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own registrations" ON public.event_registrations
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Clergy can manage all registrations" ON public.event_registrations
    FOR ALL USING (is_admin_or_clergy(auth.uid()));

-- Donations policies  
CREATE POLICY "Treasurers can manage donations" ON public.donations
    FOR ALL USING (has_role(auth.uid(), 'treasurer') OR has_role(auth.uid(), 'system_admin'));

-- Donation campaigns policies
CREATE POLICY "Users can view active campaigns" ON public.donation_campaigns
    FOR SELECT USING (is_active = true AND auth.uid() IS NOT NULL);

CREATE POLICY "Treasurers can manage campaigns" ON public.donation_campaigns
    FOR ALL USING (has_role(auth.uid(), 'treasurer') OR has_role(auth.uid(), 'system_admin'));

-- Financial policies (restricted to treasurers and admins)
CREATE POLICY "Treasurers can manage financial accounts" ON public.financial_accounts
    FOR ALL USING (has_role(auth.uid(), 'treasurer') OR has_role(auth.uid(), 'system_admin'));

CREATE POLICY "Treasurers can manage financial transactions" ON public.financial_transactions
    FOR ALL USING (has_role(auth.uid(), 'treasurer') OR has_role(auth.uid(), 'system_admin'));

CREATE POLICY "Users can view budget categories" ON public.budget_categories
    FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Treasurers can manage budget categories" ON public.budget_categories
    FOR ALL USING (has_role(auth.uid(), 'treasurer') OR has_role(auth.uid(), 'system_admin'));

-- Sermons policies
CREATE POLICY "Users can view sermons" ON public.sermons
    FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Clergy can manage sermons" ON public.sermons
    FOR ALL USING (is_admin_or_clergy(auth.uid()));

-- Ministries policies
CREATE POLICY "Users can view ministries" ON public.ministries
    FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Clergy can manage ministries" ON public.ministries
    FOR ALL USING (is_admin_or_clergy(auth.uid()));

CREATE POLICY "Users can view ministry members" ON public.ministry_members
    FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Clergy can manage ministry members" ON public.ministry_members
    FOR ALL USING (is_admin_or_clergy(auth.uid()));

-- Prayer requests policies
CREATE POLICY "Users can view non-anonymous prayer requests" ON public.prayer_requests
    FOR SELECT USING (is_anonymous = false AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can manage their own prayer requests" ON public.prayer_requests
    FOR ALL USING (requester_id = auth.uid());

CREATE POLICY "Clergy can view all prayer requests" ON public.prayer_requests
    FOR SELECT USING (is_admin_or_clergy(auth.uid()));

-- Pastoral visits policies
CREATE POLICY "Members can view their own visits" ON public.pastoral_visits
    FOR SELECT USING (member_id = auth.uid() OR is_admin_or_clergy(auth.uid()));

CREATE POLICY "Clergy can manage pastoral visits" ON public.pastoral_visits
    FOR ALL USING (is_admin_or_clergy(auth.uid()));

-- Attendance policies
CREATE POLICY "Users can view attendance records" ON public.attendance_records
    FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Clergy can manage attendance" ON public.attendance_records
    FOR ALL USING (is_admin_or_clergy(auth.uid()));

-- Communications policies
CREATE POLICY "Users can view published communications" ON public.communications
    FOR SELECT USING (status = 'sent' AND auth.uid() IS NOT NULL);

CREATE POLICY "Clergy and secretaries can manage communications" ON public.communications
    FOR ALL USING (has_role(auth.uid(), 'clergy') OR has_role(auth.uid(), 'secretary') OR has_role(auth.uid(), 'system_admin'));

-- Church settings policies
CREATE POLICY "Users can view public settings" ON public.church_settings
    FOR SELECT USING (is_public = true OR is_admin_or_clergy(auth.uid()));

CREATE POLICY "Admins can manage settings" ON public.church_settings
    FOR ALL USING (has_role(auth.uid(), 'system_admin'));

-- Audit logs policies
CREATE POLICY "Admins can view audit logs" ON public.audit_logs
    FOR SELECT USING (has_role(auth.uid(), 'system_admin'));

CREATE POLICY "System can insert audit logs" ON public.audit_logs
    FOR INSERT WITH CHECK (true);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_household_id ON public.profiles(household_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role ON public.user_roles(role);
CREATE INDEX IF NOT EXISTS idx_user_roles_active ON public.user_roles(is_active);
CREATE INDEX IF NOT EXISTS idx_events_start_date ON public.events(start_date);
CREATE INDEX IF NOT EXISTS idx_events_type ON public.events(event_type);
CREATE INDEX IF NOT EXISTS idx_donations_donor_id ON public.donations(donor_id);
CREATE INDEX IF NOT EXISTS idx_donations_date ON public.donations(donation_date);
CREATE INDEX IF NOT EXISTS idx_donations_type ON public.donations(donation_type);
CREATE INDEX IF NOT EXISTS idx_attendance_event_id ON public.attendance_records(event_id);
CREATE INDEX IF NOT EXISTS idx_attendance_member_id ON public.attendance_records(member_id);
CREATE INDEX IF NOT EXISTS idx_attendance_date ON public.attendance_records(attendance_date);

-- =====================================================
-- SAMPLE DATA FOR DEVELOPMENT (Optional)
-- =====================================================

-- Insert default church settings
INSERT INTO public.church_settings (setting_key, setting_value, setting_type, description, is_public) VALUES
('church_name', 'Living Rock Church', 'text', 'Name of the church', true),
('church_address', 'P.O. Box 123, Eldoret, Kenya', 'text', 'Church address', true),
('church_phone', '+254700000000', 'text', 'Church contact phone', true),
('church_email', 'info@livingrockchurch.org', 'text', 'Church contact email', true),
('default_currency', 'KES', 'text', 'Default currency for financial transactions', false),
('enable_online_giving', 'true', 'boolean', 'Enable online giving functionality', false)
ON CONFLICT (setting_key) DO NOTHING;

-- Insert sample budget categories
INSERT INTO public.budget_categories (name, description, allocated_amount) VALUES
('Salaries & Benefits', 'Staff salaries and benefits', 500000.00),
('Building & Maintenance', 'Church building maintenance and utilities', 200000.00),
('Missions & Outreach', 'Missionary support and outreach programs', 150000.00),
('Youth & Children Ministry', 'Programs for youth and children', 100000.00),
('Equipment & Technology', 'Audio/visual and office equipment', 75000.00)
ON CONFLICT DO NOTHING;

COMMIT;
