-- Living Rock CMS Database Schema
-- This schema creates all necessary tables for the church management system
-- Run this in your Supabase SQL editor

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types (these will fail if types already exist, which is expected)
DO $$ BEGIN
    CREATE TYPE event_type AS ENUM ('service', 'meeting', 'conference', 'outreach', 'youth', 'children', 'other');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE member_status AS ENUM ('active', 'inactive', 'suspended', 'deceased');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE donation_type AS ENUM ('tithe', 'offering', 'special_offering', 'building_fund', 'mission_fund', 'other');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE payment_method AS ENUM ('cash', 'mpesa', 'bank_transfer', 'check', 'card', 'other');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create profiles table (if not exists)
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid NOT NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL UNIQUE,
  phone text,
  date_of_birth date,
  gender text CHECK (gender = ANY (ARRAY['male'::text, 'female'::text])),
  address text,
  city text,
  profile_image_url text,
  country text DEFAULT 'Kenya'::text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT profiles_pkey PRIMARY KEY (id),
  CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create user_roles table (if not exists)
CREATE TABLE IF NOT EXISTS public.user_roles (
  user_id uuid NOT NULL,
  role text NOT NULL CHECK (role = ANY (ARRAY['member'::text, 'clergy'::text, 'treasurer'::text, 'secretary'::text, 'system_admin'::text])),
  assigned_by uuid,
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  assigned_at timestamp with time zone DEFAULT now(),
  is_active boolean DEFAULT true,
  CONSTRAINT user_roles_pkey PRIMARY KEY (id),
  CONSTRAINT user_roles_assigned_by_fkey FOREIGN KEY (assigned_by) REFERENCES public.profiles(id) ON DELETE SET NULL,
  CONSTRAINT user_roles_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE
);

-- Create members table (if not exists)
CREATE TABLE IF NOT EXISTS public.members (
  user_id uuid NOT NULL,
  membership_number text NOT NULL UNIQUE,
  baptism_date date,
  confirmation_date date,
  ministry_involvement text[],
  emergency_contact_name text,
  emergency_contact_phone text,
  notes text,
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  join_date date NOT NULL DEFAULT CURRENT_DATE,
  status member_status DEFAULT 'active'::member_status,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  email character varying UNIQUE,
  phone character varying,
  joined_at date,
  CONSTRAINT members_pkey PRIMARY KEY (id),
  CONSTRAINT members_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE
);

-- Create events table (if not exists)
CREATE TABLE IF NOT EXISTS public.events (
  title text NOT NULL,
  description text,
  start_date timestamp with time zone NOT NULL,
  end_date timestamp with time zone,
  location text,
  organizer_id uuid,
  max_attendees integer,
  registration_deadline timestamp with time zone,
  recurrence_pattern text,
  created_by uuid NOT NULL,
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  event_type event_type NOT NULL DEFAULT 'other'::event_type,
  registration_required boolean DEFAULT false,
  is_recurring boolean DEFAULT false,
  status text DEFAULT 'scheduled'::text CHECK (status = ANY (ARRAY['scheduled'::text, 'ongoing'::text, 'completed'::text, 'cancelled'::text])),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  event_date date,
  CONSTRAINT events_pkey PRIMARY KEY (id),
  CONSTRAINT events_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.profiles(id) ON DELETE CASCADE,
  CONSTRAINT events_organizer_id_fkey FOREIGN KEY (organizer_id) REFERENCES public.profiles(id) ON DELETE SET NULL
);

-- Create event_registrations table (if not exists)
CREATE TABLE IF NOT EXISTS public.event_registrations (
  event_id uuid NOT NULL,
  user_id uuid NOT NULL,
  notes text,
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  registration_date timestamp with time zone DEFAULT now(),
  attendance_status text DEFAULT 'registered'::text CHECK (attendance_status = ANY (ARRAY['registered'::text, 'attended'::text, 'no_show'::text, 'cancelled'::text])),
  CONSTRAINT event_registrations_pkey PRIMARY KEY (id),
  CONSTRAINT event_registrations_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.events(id) ON DELETE CASCADE,
  CONSTRAINT event_registrations_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE
);

-- Create attendance_records table (if not exists)
CREATE TABLE IF NOT EXISTS public.attendance_records (
  event_id uuid NOT NULL,
  member_id uuid NOT NULL,
  notes text,
  recorded_by uuid NOT NULL,
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  attendance_date date NOT NULL DEFAULT CURRENT_DATE,
  status text NOT NULL DEFAULT 'present'::text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT attendance_records_pkey PRIMARY KEY (id),
  CONSTRAINT attendance_records_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.events(id) ON DELETE CASCADE,
  CONSTRAINT attendance_records_member_id_fkey FOREIGN KEY (member_id) REFERENCES public.members(id) ON DELETE CASCADE,
  CONSTRAINT attendance_records_recorded_by_fkey FOREIGN KEY (recorded_by) REFERENCES public.profiles(id) ON DELETE CASCADE
);

-- Create financial_accounts table (if not exists)
CREATE TABLE IF NOT EXISTS public.financial_accounts (
  account_name text NOT NULL UNIQUE,
  account_type text NOT NULL CHECK (account_type = ANY (ARRAY['checking'::text, 'savings'::text, 'petty_cash'::text, 'investment'::text])),
  bank_name text,
  account_number text,
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  current_balance numeric DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT financial_accounts_pkey PRIMARY KEY (id)
);

-- Create financial_transactions table (if not exists)
CREATE TABLE IF NOT EXISTS public.financial_transactions (
  account_id uuid NOT NULL,
  transaction_type text NOT NULL CHECK (transaction_type = ANY (ARRAY['income'::text, 'expense'::text])),
  amount numeric NOT NULL CHECK (amount > 0::numeric),
  description text NOT NULL,
  category text,
  reference_number text,
  recorded_by uuid NOT NULL,
  approved_by uuid,
  notes text,
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  transaction_date date NOT NULL DEFAULT CURRENT_DATE,
  approval_status text DEFAULT 'pending'::text CHECK (approval_status = ANY (ARRAY['pending'::text, 'approved'::text, 'rejected'::text])),
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT financial_transactions_pkey PRIMARY KEY (id),
  CONSTRAINT financial_transactions_recorded_by_fkey FOREIGN KEY (recorded_by) REFERENCES public.profiles(id) ON DELETE CASCADE,
  CONSTRAINT financial_transactions_account_id_fkey FOREIGN KEY (account_id) REFERENCES public.financial_accounts(id) ON DELETE CASCADE,
  CONSTRAINT financial_transactions_approved_by_fkey FOREIGN KEY (approved_by) REFERENCES public.profiles(id) ON DELETE SET NULL
);

-- Create donations table (if not exists)
CREATE TABLE IF NOT EXISTS public.donations (
  donor_id uuid,
  amount numeric NOT NULL CHECK (amount > 0::numeric),
  donation_type donation_type NOT NULL,
  payment_method payment_method NOT NULL,
  reference_number text UNIQUE,
  purpose text,
  campaign_id uuid,
  receipt_number text,
  notes text,
  recorded_by uuid NOT NULL,
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  currency text DEFAULT 'KES'::text,
  transaction_date timestamp with time zone DEFAULT now(),
  is_anonymous boolean DEFAULT false,
  receipt_issued boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  donation_date date,
  CONSTRAINT donations_pkey PRIMARY KEY (id),
  CONSTRAINT donations_recorded_by_fkey FOREIGN KEY (recorded_by) REFERENCES public.profiles(id) ON DELETE CASCADE,
  CONSTRAINT donations_donor_id_fkey FOREIGN KEY (donor_id) REFERENCES public.profiles(id) ON DELETE SET NULL
);

-- Create donation_campaigns table (if not exists)
CREATE TABLE IF NOT EXISTS public.donation_campaigns (
  name text NOT NULL,
  description text,
  end_date date,
  created_by uuid NOT NULL,
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  target_amount numeric NOT NULL DEFAULT 0,
  current_amount numeric NOT NULL DEFAULT 0,
  start_date date NOT NULL DEFAULT CURRENT_DATE,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT donation_campaigns_pkey PRIMARY KEY (id),
  CONSTRAINT donation_campaigns_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.profiles(id) ON DELETE CASCADE
);

-- Create campaigns table (if not exists)
CREATE TABLE IF NOT EXISTS public.campaigns (
  name character varying NOT NULL,
  goal_amount numeric,
  start_date date,
  end_date date,
  description text,
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT campaigns_pkey PRIMARY KEY (id)
);

-- Create pledges table (if not exists)
CREATE TABLE IF NOT EXISTS public.pledges (
  member_id uuid,
  campaign_id uuid,
  amount numeric NOT NULL,
  pledge_date date NOT NULL,
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  status character varying DEFAULT 'active'::character varying,
  created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT pledges_pkey PRIMARY KEY (id),
  CONSTRAINT pledges_member_id_fkey FOREIGN KEY (member_id) REFERENCES public.members(id) ON DELETE CASCADE,
  CONSTRAINT pledges_campaign_id_fkey FOREIGN KEY (campaign_id) REFERENCES public.campaigns(id) ON DELETE CASCADE
);

-- Create budgets table (if not exists)
CREATE TABLE IF NOT EXISTS public.budgets (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  name character varying NOT NULL,
  amount numeric NOT NULL,
  start_date date NOT NULL,
  end_date date NOT NULL,
  CONSTRAINT budgets_pkey PRIMARY KEY (id)
);

-- Create budget_categories table (if not exists)
CREATE TABLE IF NOT EXISTS public.budget_categories (
  name text NOT NULL,
  description text,
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  allocated_amount numeric NOT NULL DEFAULT 0,
  spent_amount numeric NOT NULL DEFAULT 0,
  budget_year integer NOT NULL DEFAULT EXTRACT(year FROM CURRENT_DATE),
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT budget_categories_pkey PRIMARY KEY (id)
);

-- Create expenses table (if not exists)
CREATE TABLE IF NOT EXISTS public.expenses (
  member_id uuid,
  description character varying NOT NULL,
  amount numeric NOT NULL,
  category character varying,
  expense_date date NOT NULL,
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT expenses_pkey PRIMARY KEY (id),
  CONSTRAINT expenses_member_id_fkey FOREIGN KEY (member_id) REFERENCES public.members(id) ON DELETE SET NULL
);

-- Create ministries table (if not exists)
CREATE TABLE IF NOT EXISTS public.ministries (
  name text NOT NULL UNIQUE,
  description text,
  leader_id uuid,
  co_leader_id uuid,
  meeting_day text,
  meeting_time time without time zone,
  meeting_location text,
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT ministries_pkey PRIMARY KEY (id),
  CONSTRAINT ministries_leader_id_fkey FOREIGN KEY (leader_id) REFERENCES public.profiles(id) ON DELETE SET NULL,
  CONSTRAINT ministries_co_leader_id_fkey FOREIGN KEY (co_leader_id) REFERENCES public.profiles(id) ON DELETE SET NULL
);

-- Create ministry_members table (if not exists)
CREATE TABLE IF NOT EXISTS public.ministry_members (
  ministry_id uuid NOT NULL,
  member_id uuid NOT NULL,
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  role text DEFAULT 'member'::text,
  joined_date date DEFAULT CURRENT_DATE,
  is_active boolean DEFAULT true,
  CONSTRAINT ministry_members_pkey PRIMARY KEY (id),
  CONSTRAINT ministry_members_ministry_id_fkey FOREIGN KEY (ministry_id) REFERENCES public.ministries(id) ON DELETE CASCADE,
  CONSTRAINT ministry_members_member_id_fkey FOREIGN KEY (member_id) REFERENCES public.profiles(id) ON DELETE CASCADE
);

-- Create pastoral_visits table (if not exists)
CREATE TABLE IF NOT EXISTS public.pastoral_visits (
  member_id uuid NOT NULL,
  visitor_id uuid NOT NULL,
  purpose text NOT NULL,
  notes text,
  follow_up_date date,
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  visit_date date NOT NULL DEFAULT CURRENT_DATE,
  follow_up_required boolean NOT NULL DEFAULT false,
  status text NOT NULL DEFAULT 'completed'::text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT pastoral_visits_pkey PRIMARY KEY (id),
  CONSTRAINT pastoral_visits_member_id_fkey FOREIGN KEY (member_id) REFERENCES public.members(id) ON DELETE CASCADE,
  CONSTRAINT pastoral_visits_visitor_id_fkey FOREIGN KEY (visitor_id) REFERENCES public.profiles(id) ON DELETE CASCADE
);

-- Create prayer_requests table (if not exists)
CREATE TABLE IF NOT EXISTS public.prayer_requests (
  requester_id uuid NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  is_anonymous boolean NOT NULL DEFAULT false,
  is_urgent boolean NOT NULL DEFAULT false,
  status text NOT NULL DEFAULT 'active'::text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT prayer_requests_pkey PRIMARY KEY (id),
  CONSTRAINT prayer_requests_requester_id_fkey FOREIGN KEY (requester_id) REFERENCES public.profiles(id) ON DELETE CASCADE
);

-- Create sermons table (if not exists)
CREATE TABLE IF NOT EXISTS public.sermons (
  title text NOT NULL,
  scripture_reference text,
  preacher_id uuid NOT NULL,
  summary text,
  audio_url text,
  video_url text,
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  date_preached date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT sermons_pkey PRIMARY KEY (id),
  CONSTRAINT sermons_preacher_id_fkey FOREIGN KEY (preacher_id) REFERENCES public.profiles(id) ON DELETE CASCADE
);

-- Create communications table (if not exists)
CREATE TABLE IF NOT EXISTS public.communications (
  title text NOT NULL,
  content text NOT NULL,
  sent_by uuid NOT NULL,
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  type text NOT NULL DEFAULT 'announcement'::text,
  target_audience text[] DEFAULT ARRAY['all'::text],
  sent_at timestamp with time zone NOT NULL DEFAULT now(),
  is_urgent boolean NOT NULL DEFAULT false,
  status text NOT NULL DEFAULT 'draft'::text,
  CONSTRAINT communications_pkey PRIMARY KEY (id),
  CONSTRAINT communications_sent_by_fkey FOREIGN KEY (sent_by) REFERENCES public.profiles(id) ON DELETE CASCADE
);

-- Create church_settings table (if not exists)
CREATE TABLE IF NOT EXISTS public.church_settings (
  setting_key text NOT NULL UNIQUE,
  setting_value text,
  description text,
  updated_by uuid,
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  setting_type text DEFAULT 'text'::text CHECK (setting_type = ANY (ARRAY['text'::text, 'number'::text, 'boolean'::text, 'json'::text])),
  is_public boolean DEFAULT false,
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT church_settings_pkey PRIMARY KEY (id),
  CONSTRAINT church_settings_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES public.profiles(id) ON DELETE SET NULL
);

-- Create audit_logs table (if not exists)
CREATE TABLE IF NOT EXISTS public.audit_logs (
  user_id uuid,
  action text NOT NULL,
  table_name text,
  record_id uuid,
  old_values jsonb,
  new_values jsonb,
  ip_address inet,
  user_agent text,
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT audit_logs_pkey PRIMARY KEY (id),
  CONSTRAINT audit_logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE SET NULL
);

-- Create groups table (if not exists) - Note: This might conflict with existing groups table
-- If you have an existing groups table, you may need to rename it or drop it first
CREATE TABLE IF NOT EXISTS public.church_groups (
  name character varying NOT NULL,
  description text,
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT church_groups_pkey PRIMARY KEY (id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role ON public.user_roles(role);
CREATE INDEX IF NOT EXISTS idx_members_user_id ON public.members(user_id);
CREATE INDEX IF NOT EXISTS idx_members_status ON public.members(status);
CREATE INDEX IF NOT EXISTS idx_events_start_date ON public.events(start_date);
CREATE INDEX IF NOT EXISTS idx_events_created_by ON public.events(created_by);
CREATE INDEX IF NOT EXISTS idx_event_registrations_event_id ON public.event_registrations(event_id);
CREATE INDEX IF NOT EXISTS idx_event_registrations_user_id ON public.event_registrations(user_id);
CREATE INDEX IF NOT EXISTS idx_attendance_records_event_id ON public.attendance_records(event_id);
CREATE INDEX IF NOT EXISTS idx_attendance_records_member_id ON public.attendance_records(member_id);
CREATE INDEX IF NOT EXISTS idx_financial_transactions_account_id ON public.financial_transactions(account_id);
CREATE INDEX IF NOT EXISTS idx_financial_transactions_transaction_date ON public.financial_transactions(transaction_date);
CREATE INDEX IF NOT EXISTS idx_donations_donor_id ON public.donations(donor_id);
CREATE INDEX IF NOT EXISTS idx_donations_transaction_date ON public.donations(transaction_date);
CREATE INDEX IF NOT EXISTS idx_ministry_members_ministry_id ON public.ministry_members(ministry_id);
CREATE INDEX IF NOT EXISTS idx_ministry_members_member_id ON public.ministry_members(member_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donation_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pledges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.budget_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ministries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ministry_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pastoral_visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prayer_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sermons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.communications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.church_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.church_groups ENABLE ROW LEVEL SECURITY;

-- Create basic RLS policies (you may need to customize these based on your requirements)
-- Profiles: Users can only see their own profile, admins can see all
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "System admins can view all profiles" ON public.profiles FOR ALL USING (
  EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'system_admin')
);

-- User roles: Allow all authenticated users to read their own roles
-- For admin operations, we'll handle this in the application layer
CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Allow authenticated users to manage roles" ON public.user_roles FOR ALL USING (auth.role() = 'authenticated');

-- Members: All authenticated users can view and manage
CREATE POLICY "Authenticated users can view members" ON public.members FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can manage members" ON public.members FOR ALL USING (auth.role() = 'authenticated');

-- Events: All authenticated users can view and manage
CREATE POLICY "Authenticated users can view events" ON public.events FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can manage events" ON public.events FOR ALL USING (auth.role() = 'authenticated');

-- Financial data: Allow authenticated users to access (role checking will be done in application)
CREATE POLICY "Authenticated users can access financial data" ON public.financial_transactions FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can access donations" ON public.donations FOR ALL USING (auth.role() = 'authenticated');

-- Church settings: Allow authenticated users to access (role checking will be done in application)
CREATE POLICY "Authenticated users can manage church settings" ON public.church_settings FOR ALL USING (auth.role() = 'authenticated');

-- Audit logs: Allow authenticated users to access (role checking will be done in application)
CREATE POLICY "Authenticated users can view audit logs" ON public.audit_logs FOR SELECT USING (auth.role() = 'authenticated');

-- Insert default church settings
INSERT INTO public.church_settings (setting_key, setting_value, description, setting_type, is_public) VALUES
('church_name', 'Living Rock Church', 'Name of the church', 'text', true),
('church_address', 'Nairobi, Kenya', 'Church address', 'text', true),
('church_phone', '+254 700 000 000', 'Church phone number', 'text', true),
('church_email', 'info@livingrockchurch.com', 'Church email address', 'text', true),
('currency', 'KES', 'Default currency for financial transactions', 'text', false),
('timezone', 'Africa/Nairobi', 'Church timezone', 'text', false),
('system_version', '1.0.0', 'Current system version', 'text', false)
ON CONFLICT (setting_key) DO NOTHING;

-- Create function to automatically create profile when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name, email)
  VALUES (new.id, new.raw_user_meta_data->>'first_name', new.raw_user_meta_data->>'last_name', new.email);
  
  -- Assign default member role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (new.id, 'member');
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update profile updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at columns
CREATE TRIGGER handle_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_members_updated_at
  BEFORE UPDATE ON public.members
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_events_updated_at
  BEFORE UPDATE ON public.events
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_ministries_updated_at
  BEFORE UPDATE ON public.ministries
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_donation_campaigns_updated_at
  BEFORE UPDATE ON public.donation_campaigns
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_budget_categories_updated_at
  BEFORE UPDATE ON public.budget_categories
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_financial_accounts_updated_at
  BEFORE UPDATE ON public.financial_accounts
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_prayer_requests_updated_at
  BEFORE UPDATE ON public.prayer_requests
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_sermons_updated_at
  BEFORE UPDATE ON public.sermons
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_church_settings_updated_at
  BEFORE UPDATE ON public.church_settings
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;

-- Grant future permissions
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO anon, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON FUNCTIONS TO anon, authenticated; 