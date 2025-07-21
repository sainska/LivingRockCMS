-- =====================================================
-- Living Rock CMS - RLS Security Implementation
-- =====================================================
-- This script implements Row Level Security (RLS) policies
-- for the Living Rock CMS database to ensure proper data access control

-- Enable RLS on all tables
-- =====================================================

-- User Management Tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Ministry Management Tables
ALTER TABLE public.ministries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ministry_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ministry_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ministry_group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ministry_group_join_requests ENABLE ROW LEVEL SECURITY;

-- Financial Management Tables
ALTER TABLE public.financial_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pledges ENABLE ROW LEVEL SECURITY;

-- Event Management Tables
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.volunteer_opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.volunteer_signups ENABLE ROW LEVEL SECURITY;

-- Pastoral Care Tables
ALTER TABLE public.pastoral_visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.counseling_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pastoral_support_requests ENABLE ROW LEVEL SECURITY;

-- Communication Tables
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prayer_requests ENABLE ROW LEVEL SECURITY;

-- System Tables
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.church_settings ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- RLS Policies Implementation
-- =====================================================

-- 1. PROFILES TABLE POLICIES
-- =====================================================

-- Users can view their own profile
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- System admins can view all profiles
CREATE POLICY "System admins can view all profiles" ON public.profiles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() 
      AND role = 'system_admin'
    )
  );

-- 2. MEMBERS TABLE POLICIES
-- =====================================================

-- Members can view their own member record
CREATE POLICY "Members can view own record" ON public.members
  FOR SELECT USING (user_id = auth.uid());

-- Clergy and admins can view all member records
CREATE POLICY "Clergy and admins can view all members" ON public.members
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('system_admin', 'clergy', 'secretary')
    )
  );

-- 3. USER ROLES TABLE POLICIES
-- =====================================================

-- Users can view their own roles
CREATE POLICY "Users can view own roles" ON public.user_roles
  FOR SELECT USING (user_id = auth.uid());

-- System admins can manage all roles
CREATE POLICY "System admins can manage all roles" ON public.user_roles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() 
      AND role = 'system_admin'
    )
  );

-- 4. MINISTRIES TABLE POLICIES
-- =====================================================

-- All authenticated users can view ministries
CREATE POLICY "All users can view ministries" ON public.ministries
  FOR SELECT USING (auth.role() = 'authenticated');

-- Clergy and admins can manage ministries
CREATE POLICY "Clergy and admins can manage ministries" ON public.ministries
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('system_admin', 'clergy', 'secretary')
    )
  );

-- 5. MINISTRY MEMBERS TABLE POLICIES
-- =====================================================

-- Members can view their own ministry assignments
CREATE POLICY "Members can view own ministry assignments" ON public.ministry_members
  FOR SELECT USING (user_id = auth.uid());

-- Clergy and admins can view all ministry assignments
CREATE POLICY "Clergy and admins can view all ministry assignments" ON public.ministry_members
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('system_admin', 'clergy', 'secretary')
    )
  );

-- 6. FINANCIAL TRANSACTIONS TABLE POLICIES
-- =====================================================

-- Members can only see their own transactions
CREATE POLICY "Members can view own transactions" ON public.financial_transactions
  FOR SELECT USING (user_id = auth.uid());

-- Treasurers and admins can view all transactions
CREATE POLICY "Treasurers can view all transactions" ON public.financial_transactions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('system_admin', 'treasurer')
    )
  );

-- 7. EVENTS TABLE POLICIES
-- =====================================================

-- All authenticated users can view events
CREATE POLICY "All users can view events" ON public.events
  FOR SELECT USING (auth.role() = 'authenticated');

-- Only clergy and admins can create/edit events
CREATE POLICY "Clergy and admins can manage events" ON public.events
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('system_admin', 'clergy', 'secretary')
    )
  );

-- 8. ATTENDANCE RECORDS TABLE POLICIES
-- =====================================================

-- Members can view their own attendance
CREATE POLICY "Members can view own attendance" ON public.attendance_records
  FOR SELECT USING (user_id = auth.uid());

-- Clergy and admins can view all attendance
CREATE POLICY "Clergy and admins can view all attendance" ON public.attendance_records
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('system_admin', 'clergy', 'secretary')
    )
  );

-- 9. PASTORAL VISITS TABLE POLICIES
-- =====================================================

-- Members can view their own pastoral visits
CREATE POLICY "Members can view own pastoral visits" ON public.pastoral_visits
  FOR SELECT USING (member_id = auth.uid());

-- Clergy and admins can view all pastoral visits
CREATE POLICY "Clergy and admins can view all pastoral visits" ON public.pastoral_visits
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('system_admin', 'clergy')
    )
  );

-- 10. MESSAGES TABLE POLICIES
-- =====================================================

-- Users can view messages they sent or received
CREATE POLICY "Users can view own messages" ON public.messages
  FOR SELECT USING (
    sender_id = auth.uid() OR recipient_id = auth.uid()
  );

-- Users can send messages
CREATE POLICY "Users can send messages" ON public.messages
  FOR INSERT WITH CHECK (sender_id = auth.uid());

-- Users can update their own sent messages
CREATE POLICY "Users can update own sent messages" ON public.messages
  FOR UPDATE USING (sender_id = auth.uid());

-- 11. ANNOUNCEMENTS TABLE POLICIES
-- =====================================================

-- All authenticated users can view active announcements
CREATE POLICY "All users can view announcements" ON public.announcements
  FOR SELECT USING (
    auth.role() = 'authenticated' 
    AND is_active = TRUE
    AND (start_date IS NULL OR start_date <= CURRENT_DATE)
    AND (end_date IS NULL OR end_date >= CURRENT_DATE)
  );

-- Only clergy and admins can manage announcements
CREATE POLICY "Clergy and admins can manage announcements" ON public.announcements
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('system_admin', 'clergy', 'secretary')
    )
  );

-- 12. AUDIT LOGS TABLE POLICIES
-- =====================================================

-- Only system admins can view audit logs
CREATE POLICY "Only system admins can view audit logs" ON public.audit_logs
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() 
      AND role = 'system_admin'
    )
  );

-- 13. CHURCH SETTINGS TABLE POLICIES
-- =====================================================

-- Only system admins can manage church settings
CREATE POLICY "Only system admins can manage church settings" ON public.church_settings
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() 
      AND role = 'system_admin'
    )
  );

-- =====================================================
-- Helper Functions for RLS
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

-- Function to check if user has any of the specified roles
CREATE OR REPLACE FUNCTION public.has_any_role(role_names text[])
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role = ANY(role_names)
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user's roles
CREATE OR REPLACE FUNCTION public.get_user_roles()
RETURNS text[] AS $$
BEGIN
  RETURN ARRAY(
    SELECT role FROM public.user_roles 
    WHERE user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- Audit Logging Function
-- =====================================================

-- Function to log audit events
CREATE OR REPLACE FUNCTION public.log_audit_event(
  table_name text,
  action text,
  record_id uuid,
  old_data jsonb DEFAULT NULL,
  new_data jsonb DEFAULT NULL
)
RETURNS void AS $$
BEGIN
  INSERT INTO public.audit_logs (
    user_id,
    table_name,
    action,
    record_id,
    old_data,
    new_data,
    ip_address,
    user_agent
  ) VALUES (
    auth.uid(),
    table_name,
    action,
    record_id,
    old_data,
    new_data,
    current_setting('request.headers')::json->>'x-forwarded-for',
    current_setting('request.headers')::json->>'user-agent'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- Triggers for Audit Logging
-- =====================================================

-- Create audit triggers for sensitive tables
CREATE OR REPLACE FUNCTION public.audit_trigger_function()
RETURNS trigger AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    PERFORM public.log_audit_event(
      TG_TABLE_NAME,
      'INSERT',
      NEW.id,
      NULL,
      to_jsonb(NEW)
    );
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    PERFORM public.log_audit_event(
      TG_TABLE_NAME,
      'UPDATE',
      NEW.id,
      to_jsonb(OLD),
      to_jsonb(NEW)
    );
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    PERFORM public.log_audit_event(
      TG_TABLE_NAME,
      'DELETE',
      OLD.id,
      to_jsonb(OLD),
      NULL
    );
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add audit triggers to sensitive tables
CREATE TRIGGER audit_profiles_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_function();

CREATE TRIGGER audit_financial_transactions_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.financial_transactions
  FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_function();

CREATE TRIGGER audit_members_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.members
  FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_function();
