-- =====================================================
-- Living Rock CMS - Complete Dashboard Database Schema
-- =====================================================
-- This script creates all necessary tables for dashboard functionality
-- Run this in your Supabase SQL editor

-- =====================================================
-- 1. SYSTEM STATISTICS AND METRICS
-- =====================================================

-- System statistics table
CREATE TABLE IF NOT EXISTS public.system_stats (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    stat_type TEXT NOT NULL, -- 'total_users', 'active_sessions', 'system_health', 'storage_used'
    value TEXT NOT NULL,
    change_value TEXT,
    change_description TEXT,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- System health monitoring
CREATE TABLE IF NOT EXISTS public.system_health (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    metric_name TEXT NOT NULL,
    metric_value DECIMAL(5,2) NOT NULL,
    status TEXT NOT NULL, -- 'healthy', 'warning', 'critical'
    details JSONB,
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 2. ACTIVITY AND EVENTS
-- =====================================================

-- System events/activities
CREATE TABLE IF NOT EXISTS public.system_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    event_type TEXT NOT NULL, -- 'user_added', 'backup_completed', 'security_scan', 'church_info_updated', 'role_changed'
    action TEXT NOT NULL,
    user_id UUID REFERENCES public.profiles(id),
    user_name TEXT,
    details JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User activity logs
CREATE TABLE IF NOT EXISTS public.user_activity (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) NOT NULL,
    activity_type TEXT NOT NULL,
    description TEXT,
    module TEXT, -- 'dashboard', 'members', 'events', 'finances', etc.
    session_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 3. CHURCH INFORMATION
-- =====================================================

-- Church information
CREATE TABLE IF NOT EXISTS public.church_info (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    church_name TEXT NOT NULL,
    address TEXT,
    city TEXT,
    state TEXT,
    country TEXT DEFAULT 'Kenya',
    postal_code TEXT,
    phone TEXT,
    email TEXT,
    website TEXT,
    pastor_name TEXT,
    established_date DATE,
    denomination TEXT,
    description TEXT,
    logo_url TEXT,
    banner_url TEXT,
    social_media JSONB, -- {facebook: url, twitter: url, instagram: url}
    service_times JSONB, -- {sunday: "9:00 AM", wednesday: "7:00 PM"}
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_by UUID REFERENCES public.profiles(id)
);

-- =====================================================
-- 4. MEMBERS MANAGEMENT
-- =====================================================

-- Members table
CREATE TABLE IF NOT EXISTS public.members (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    profile_id UUID REFERENCES public.profiles(id) NOT NULL,
    member_number TEXT UNIQUE,
    date_joined DATE NOT NULL,
    membership_status member_status DEFAULT 'active',
    baptism_date DATE,
    baptism_location TEXT,
    marital_status TEXT,
    spouse_name TEXT,
    children_count INTEGER DEFAULT 0,
    emergency_contact JSONB, -- {name: text, phone: text, relationship: text}
    ministry_involvement TEXT[],
    skills TEXT[],
    notes TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ministry teams
CREATE TABLE IF NOT EXISTS public.ministry_teams (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    leader_id UUID REFERENCES public.profiles(id),
    member_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Team members
CREATE TABLE IF NOT EXISTS public.team_members (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    team_id UUID REFERENCES public.ministry_teams(id) ON DELETE CASCADE,
    member_id UUID REFERENCES public.members(id) ON DELETE CASCADE,
    role TEXT, -- 'leader', 'member', 'coordinator'
    joined_date DATE DEFAULT CURRENT_DATE,
    is_active BOOLEAN DEFAULT TRUE,
    UNIQUE(team_id, member_id)
);

-- =====================================================
-- 5. EVENTS AND SERVICES
-- =====================================================

-- Events table
CREATE TABLE IF NOT EXISTS public.events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    event_type TEXT NOT NULL, -- 'service', 'bible_study', 'youth_service', 'meeting', 'special_event'
    date DATE NOT NULL,
    start_time TIME,
    end_time TIME,
    location TEXT,
    speaker TEXT,
    topic TEXT,
    scripture TEXT,
    expected_attendance INTEGER,
    actual_attendance INTEGER,
    status TEXT DEFAULT 'scheduled', -- 'scheduled', 'ongoing', 'completed', 'cancelled'
    is_recurring BOOLEAN DEFAULT FALSE,
    recurrence_pattern JSONB, -- {type: 'weekly', 'monthly', day_of_week: 1}
    created_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Event attendance
CREATE TABLE IF NOT EXISTS public.event_attendance (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
    member_id UUID REFERENCES public.members(id),
    guest_name TEXT, -- For non-members
    check_in_time TIMESTAMP WITH TIME ZONE,
    check_out_time TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    recorded_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 6. FINANCIAL MANAGEMENT
-- =====================================================

-- Financial categories
CREATE TABLE IF NOT EXISTS public.financial_categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL, -- 'income', 'expense'
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Financial transactions
CREATE TABLE IF NOT EXISTS public.financial_transactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    transaction_date DATE NOT NULL,
    category_id UUID REFERENCES public.financial_categories(id),
    amount DECIMAL(10,2) NOT NULL,
    type TEXT NOT NULL, -- 'income', 'expense'
    description TEXT NOT NULL,
    payment_method TEXT, -- 'cash', 'check', 'bank_transfer', 'mobile_money'
    reference_number TEXT,
    donor_name TEXT, -- For anonymous donations
    member_id UUID REFERENCES public.members(id), -- For member contributions
    receipt_url TEXT,
    notes TEXT,
    recorded_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Budget planning
CREATE TABLE IF NOT EXISTS public.budgets (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    year INTEGER NOT NULL,
    month INTEGER NOT NULL,
    category_id UUID REFERENCES public.financial_categories(id),
    planned_amount DECIMAL(10,2) NOT NULL,
    actual_amount DECIMAL(10,2) DEFAULT 0,
    notes TEXT,
    created_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(year, month, category_id)
);

-- =====================================================
-- 7. COMMUNICATION
-- =====================================================

-- Announcements
CREATE TABLE IF NOT EXISTS public.announcements (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    priority TEXT DEFAULT 'normal', -- 'low', 'normal', 'high', 'urgent'
    target_audience TEXT[], -- ['all', 'members', 'clergy', 'youth']
    start_date DATE,
    end_date DATE,
    is_active BOOLEAN DEFAULT TRUE,
    created_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Messages
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    sender_id UUID REFERENCES public.profiles(id) NOT NULL,
    recipient_id UUID REFERENCES public.profiles(id),
    recipient_group TEXT, -- For group messages
    subject TEXT,
    content TEXT NOT NULL,
    message_type TEXT DEFAULT 'internal', -- 'internal', 'sms', 'email'
    status TEXT DEFAULT 'sent', -- 'draft', 'sent', 'delivered', 'read'
    read_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 8. REPORTS AND ANALYTICS
-- =====================================================

-- Report templates
CREATE TABLE IF NOT EXISTS public.report_templates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    report_type TEXT NOT NULL, -- 'attendance', 'financial', 'membership', 'activity'
    parameters JSONB, -- Report configuration
    created_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Generated reports
CREATE TABLE IF NOT EXISTS public.generated_reports (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    template_id UUID REFERENCES public.report_templates(id),
    report_name TEXT NOT NULL,
    parameters JSONB,
    file_url TEXT,
    generated_by UUID REFERENCES public.profiles(id),
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 9. SECURITY AND ACCESS CONTROL
-- =====================================================

-- Security logs
CREATE TABLE IF NOT EXISTS public.security_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id),
    action TEXT NOT NULL, -- 'login', 'logout', 'failed_login', 'password_change', 'role_change'
    ip_address INET,
    user_agent TEXT,
    location TEXT,
    success BOOLEAN DEFAULT TRUE,
    details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Access attempts
CREATE TABLE IF NOT EXISTS public.access_attempts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT NOT NULL,
    ip_address INET,
    user_agent TEXT,
    success BOOLEAN DEFAULT FALSE,
    attempt_time TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 10. NOTIFICATIONS
-- =====================================================

-- Notifications
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT DEFAULT 'info', -- 'info', 'success', 'warning', 'error'
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP WITH TIME ZONE,
    action_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 11. BACKUP AND SYSTEM SETTINGS
-- =====================================================

-- System settings
CREATE TABLE IF NOT EXISTS public.system_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    setting_key TEXT UNIQUE NOT NULL,
    setting_value JSONB NOT NULL,
    description TEXT,
    updated_by UUID REFERENCES public.profiles(id),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Backup logs
CREATE TABLE IF NOT EXISTS public.backup_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    backup_type TEXT NOT NULL, -- 'full', 'incremental', 'manual'
    status TEXT NOT NULL, -- 'started', 'completed', 'failed'
    file_size BIGINT,
    file_url TEXT,
    error_message TEXT,
    started_by UUID REFERENCES public.profiles(id),
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE
);

-- =====================================================
-- 12. INTEGRATIONS
-- =====================================================

-- Integration settings
CREATE TABLE IF NOT EXISTS public.integrations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL, -- 'sms', 'email', 'payment', 'social_media'
    provider TEXT NOT NULL,
    config JSONB NOT NULL,
    is_active BOOLEAN DEFAULT FALSE,
    last_sync TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 13. CREATE INDEXES FOR PERFORMANCE
-- =====================================================

-- System stats indexes
CREATE INDEX IF NOT EXISTS idx_system_stats_type ON public.system_stats(stat_type);
CREATE INDEX IF NOT EXISTS idx_system_stats_updated ON public.system_stats(last_updated);

-- Events indexes
CREATE INDEX IF NOT EXISTS idx_events_date ON public.events(date);
CREATE INDEX IF NOT EXISTS idx_events_type ON public.events(event_type);
CREATE INDEX IF NOT EXISTS idx_events_status ON public.events(status);

-- Financial indexes
CREATE INDEX IF NOT EXISTS idx_financial_transactions_date ON public.financial_transactions(transaction_date);
CREATE INDEX IF NOT EXISTS idx_financial_transactions_type ON public.financial_transactions(type);
CREATE INDEX IF NOT EXISTS idx_financial_transactions_category ON public.financial_transactions(category_id);

-- Members indexes
CREATE INDEX IF NOT EXISTS idx_members_status ON public.members(membership_status);
CREATE INDEX IF NOT EXISTS idx_members_active ON public.members(is_active);
CREATE INDEX IF NOT EXISTS idx_members_joined ON public.members(date_joined);

-- Activity indexes
CREATE INDEX IF NOT EXISTS idx_user_activity_user ON public.user_activity(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activity_type ON public.user_activity(activity_type);
CREATE INDEX IF NOT EXISTS idx_user_activity_created ON public.user_activity(created_at);

-- Security indexes
CREATE INDEX IF NOT EXISTS idx_security_logs_user ON public.security_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_security_logs_action ON public.security_logs(action);
CREATE INDEX IF NOT EXISTS idx_security_logs_created ON public.security_logs(created_at);

-- Notifications indexes
CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON public.notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created ON public.notifications(created_at);

-- =====================================================
-- 14. INSERT DEFAULT DATA
-- =====================================================

-- Insert default church info
INSERT INTO public.church_info (church_name, address, city, country, phone, email, pastor_name, description)
VALUES (
    'Living Rock Church',
    '123 Church Street',
    'Nairobi',
    'Kenya',
    '+254 700 000 000',
    'info@livingrockchurch.org',
    'Pastor John Doe',
    'A vibrant community of believers committed to spreading the Gospel and serving our community.'
) ON CONFLICT DO NOTHING;

-- Insert default financial categories
INSERT INTO public.financial_categories (name, type, description) VALUES
('Tithes & Offerings', 'income', 'Regular church offerings and tithes'),
('Special Offerings', 'income', 'Special collections and donations'),
('Building Fund', 'income', 'Contributions for building projects'),
('Ministry Expenses', 'expense', 'General ministry expenses'),
('Utilities', 'expense', 'Electricity, water, internet, etc.'),
('Staff Salaries', 'expense', 'Church staff compensation'),
('Maintenance', 'expense', 'Building and equipment maintenance')
ON CONFLICT DO NOTHING;

-- Insert default system settings
INSERT INTO public.system_settings (setting_key, setting_value, description) VALUES
('church_info', '{"name": "Living Rock Church", "address": "123 Church Street", "city": "Nairobi"}', 'Basic church information'),
('notification_settings', '{"email_enabled": true, "sms_enabled": false}', 'Notification preferences'),
('backup_settings', '{"auto_backup": true, "backup_frequency": "daily"}', 'Backup configuration'),
('security_settings', '{"session_timeout": 3600, "max_login_attempts": 5}', 'Security configuration')
ON CONFLICT DO NOTHING;

-- Insert default ministry teams
INSERT INTO public.ministry_teams (name, description) VALUES
('Youth Ministry', 'Ministry focused on young people'),
('Women\'s Fellowship', 'Women\'s ministry and fellowship'),
('Men\'s Brotherhood', 'Men\'s ministry and fellowship'),
('Children\'s Ministry', 'Ministry for children'),
('Worship Team', 'Music and worship ministry'),
('Ushering Team', 'Church ushering and hospitality'),
('Prayer Team', 'Intercessory prayer ministry')
ON CONFLICT DO NOTHING;

-- =====================================================
-- 15. CREATE RLS POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE public.system_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_health ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.church_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ministry_teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.report_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.generated_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.security_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.access_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.backup_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.integrations ENABLE ROW LEVEL SECURITY;

-- Create basic RLS policies (you may need to customize these based on your requirements)
-- This is a simplified version - you should create more specific policies based on your needs

-- Allow system admins to access everything
CREATE POLICY "System admins can access all data" ON public.system_stats
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.user_roles 
            WHERE user_id = auth.uid() 
            AND role = 'system_admin' 
            AND is_active = true
        )
    );

-- Allow users to view their own data
CREATE POLICY "Users can view own profile" ON public.members
    FOR SELECT USING (profile_id = auth.uid());

-- Allow clergy to view member data
CREATE POLICY "Clergy can view member data" ON public.members
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.user_roles 
            WHERE user_id = auth.uid() 
            AND role IN ('clergy', 'system_admin') 
            AND is_active = true
        )
    );

-- Allow treasurer to view financial data
CREATE POLICY "Treasurer can view financial data" ON public.financial_transactions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.user_roles 
            WHERE user_id = auth.uid() 
            AND role IN ('treasurer', 'system_admin') 
            AND is_active = true
        )
    );

-- =====================================================
-- SCHEMA COMPLETE
-- =====================================================

-- This schema provides:
-- 1. Complete data structure for all dashboard modules
-- 2. Real-time statistics and metrics
-- 3. Comprehensive activity tracking
-- 4. Financial management system
-- 5. Member management
-- 6. Event and service management
-- 7. Communication tools
-- 8. Security and access control
-- 9. Reporting and analytics
-- 10. Notification system
-- 11. Backup and system settings
-- 12. Integration framework

-- Next steps:
-- 1. Run this script in your Supabase SQL editor
-- 2. Update your frontend components to use real data
-- 3. Create API functions to interact with these tables
-- 4. Test all dashboard functionality with real data 