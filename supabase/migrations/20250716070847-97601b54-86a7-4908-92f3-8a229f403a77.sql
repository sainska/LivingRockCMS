
-- Create comprehensive tables for the Church Management System

-- Create additional user role types and event types
DO $$ BEGIN
    CREATE TYPE event_status AS ENUM ('scheduled', 'in_progress', 'completed', 'cancelled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE ministry_role AS ENUM ('leader', 'co_leader', 'member', 'volunteer');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE message_type AS ENUM ('announcement', 'reminder', 'alert', 'newsletter', 'prayer_update');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE message_status AS ENUM ('draft', 'sent', 'failed', 'delivered');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Update profiles table with additional fields
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS household_id UUID,
ADD COLUMN IF NOT EXISTS next_of_kin_name TEXT,
ADD COLUMN IF NOT EXISTS next_of_kin_phone TEXT,
ADD COLUMN IF NOT EXISTS next_of_kin_relationship TEXT,
ADD COLUMN IF NOT EXISTS baptism_status BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS confirmation_status BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS marital_status TEXT,
ADD COLUMN IF NOT EXISTS occupation TEXT,
ADD COLUMN IF NOT EXISTS emergency_contact_name TEXT,
ADD COLUMN IF NOT EXISTS emergency_contact_phone TEXT;

-- Update members table to ensure all necessary fields exist
ALTER TABLE public.members 
ADD COLUMN IF NOT EXISTS address TEXT,
ADD COLUMN IF NOT EXISTS city TEXT,
ADD COLUMN IF NOT EXISTS country TEXT DEFAULT 'Kenya',
ADD COLUMN IF NOT EXISTS date_of_birth DATE,
ADD COLUMN IF NOT EXISTS gender TEXT,
ADD COLUMN IF NOT EXISTS marital_status TEXT,
ADD COLUMN IF NOT EXISTS occupation TEXT,
ADD COLUMN IF NOT EXISTS household_id UUID;

-- Create households table
CREATE TABLE IF NOT EXISTS public.households (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  head_of_household_id UUID REFERENCES public.profiles(id),
  address TEXT,
  city TEXT,
  country TEXT DEFAULT 'Kenya',
  phone TEXT,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create resource bookings table
CREATE TABLE IF NOT EXISTS public.resource_bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES public.events(id),
  resource_name TEXT NOT NULL,
  resource_type TEXT NOT NULL, -- 'hall', 'projector', 'vehicle', 'sound_system'
  booking_date DATE NOT NULL,
  start_time TIME,
  end_time TIME,
  status TEXT DEFAULT 'confirmed',
  notes TEXT,
  booked_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create message recipients table
CREATE TABLE IF NOT EXISTS public.message_recipients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  message_id UUID NOT NULL,
  recipient_id UUID REFERENCES auth.users(id),
  recipient_type TEXT NOT NULL, -- 'individual', 'group', 'ministry', 'all'
  delivery_status TEXT DEFAULT 'pending',
  delivered_at TIMESTAMP WITH TIME ZONE,
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create WhatsApp logs table
CREATE TABLE IF NOT EXISTS public.whatsapp_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  recipient_phone TEXT NOT NULL,
  message_type TEXT NOT NULL,
  message_content TEXT NOT NULL,
  status TEXT DEFAULT 'sent',
  error_message TEXT,
  sent_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create counseling sessions table
CREATE TABLE IF NOT EXISTS public.counseling_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  member_id UUID REFERENCES public.members(id),
  counselor_id UUID REFERENCES auth.users(id),
  session_date DATE NOT NULL,
  session_time TIME,
  topic TEXT NOT NULL,
  notes TEXT,
  follow_up_required BOOLEAN DEFAULT false,
  follow_up_date DATE,
  status TEXT DEFAULT 'scheduled',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create bible study groups table
CREATE TABLE IF NOT EXISTS public.bible_study_groups (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  leader_id UUID REFERENCES auth.users(id),
  meeting_day TEXT,
  meeting_time TIME,
  location TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create bible study attendance table
CREATE TABLE IF NOT EXISTS public.bible_study_attendance (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  group_id UUID REFERENCES public.bible_study_groups(id),
  member_id UUID REFERENCES public.members(id),
  attendance_date DATE NOT NULL,
  status TEXT DEFAULT 'present',
  notes TEXT,
  recorded_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create volunteers table
CREATE TABLE IF NOT EXISTS public.volunteers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  department TEXT NOT NULL,
  role TEXT NOT NULL,
  start_date DATE DEFAULT CURRENT_DATE,
  end_date DATE,
  hours_per_week INTEGER DEFAULT 0,
  skills TEXT[],
  is_active BOOLEAN DEFAULT true,
  supervisor_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create staff table
CREATE TABLE IF NOT EXISTS public.staff (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  employee_id TEXT UNIQUE NOT NULL,
  position TEXT NOT NULL,
  department TEXT NOT NULL,
  hire_date DATE NOT NULL,
  salary NUMERIC(10,2),
  contract_type TEXT DEFAULT 'permanent',
  supervisor_id UUID REFERENCES auth.users(id),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on all new tables
ALTER TABLE public.households ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resource_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_recipients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.whatsapp_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.counseling_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bible_study_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bible_study_attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.volunteers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for new tables

-- Households policies
CREATE POLICY "Users can view households" ON public.households FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Admins and secretaries can manage households" ON public.households FOR ALL USING (
  has_role(auth.uid(), 'system_admin'::user_role) OR 
  has_role(auth.uid(), 'secretary'::user_role)
);

-- Resource bookings policies
CREATE POLICY "Users can view resource bookings" ON public.resource_bookings FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Clergy and secretaries can manage bookings" ON public.resource_bookings FOR ALL USING (
  is_admin_or_clergy(auth.uid()) OR 
  has_role(auth.uid(), 'secretary'::user_role)
);

-- Message recipients policies
CREATE POLICY "Users can view their own messages" ON public.message_recipients FOR SELECT USING (recipient_id = auth.uid());
CREATE POLICY "Admins and secretaries can manage messages" ON public.message_recipients FOR ALL USING (
  has_role(auth.uid(), 'system_admin'::user_role) OR 
  has_role(auth.uid(), 'secretary'::user_role) OR
  is_admin_or_clergy(auth.uid())
);

-- WhatsApp logs policies
CREATE POLICY "Admins can view WhatsApp logs" ON public.whatsapp_logs FOR SELECT USING (
  has_role(auth.uid(), 'system_admin'::user_role)
);
CREATE POLICY "Authorized roles can create WhatsApp logs" ON public.whatsapp_logs FOR INSERT WITH CHECK (
  has_role(auth.uid(), 'system_admin'::user_role) OR 
  has_role(auth.uid(), 'secretary'::user_role) OR
  has_role(auth.uid(), 'treasurer'::user_role)
);

-- Counseling sessions policies
CREATE POLICY "Clergy can manage counseling sessions" ON public.counseling_sessions FOR ALL USING (is_admin_or_clergy(auth.uid()));
CREATE POLICY "Members can view their own sessions" ON public.counseling_sessions FOR SELECT USING (
  member_id IN (SELECT id FROM public.members WHERE user_id = auth.uid()) OR is_admin_or_clergy(auth.uid())
);

-- Bible study groups policies
CREATE POLICY "Users can view bible study groups" ON public.bible_study_groups FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Clergy can manage bible study groups" ON public.bible_study_groups FOR ALL USING (is_admin_or_clergy(auth.uid()));

-- Bible study attendance policies
CREATE POLICY "Users can view bible study attendance" ON public.bible_study_attendance FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Clergy can manage bible study attendance" ON public.bible_study_attendance FOR ALL USING (is_admin_or_clergy(auth.uid()));

-- Volunteers policies
CREATE POLICY "Users can view volunteers" ON public.volunteers FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Admins can manage volunteers" ON public.volunteers FOR ALL USING (
  has_role(auth.uid(), 'system_admin'::user_role) OR 
  has_role(auth.uid(), 'secretary'::user_role)
);

-- Staff policies
CREATE POLICY "Admins can manage staff" ON public.staff FOR ALL USING (has_role(auth.uid(), 'system_admin'::user_role));
CREATE POLICY "Users can view basic staff info" ON public.staff FOR SELECT USING (auth.uid() IS NOT NULL);

-- Add updated_at triggers for new tables
CREATE TRIGGER update_households_updated_at BEFORE UPDATE ON public.households FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bible_study_groups_updated_at BEFORE UPDATE ON public.bible_study_groups FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_volunteers_updated_at BEFORE UPDATE ON public.volunteers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_staff_updated_at BEFORE UPDATE ON public.staff FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data for testing
INSERT INTO public.households (name, address, city, phone) VALUES
('Kamau Family', 'P.O. Box 123, Nairobi', 'Nairobi', '+254712345678'),
('Wanjiku Family', 'P.O. Box 456, Nakuru', 'Nakuru', '+254722345678'),
('Mwangi Family', 'P.O. Box 789, Kisumu', 'Kisumu', '+254733345678');

INSERT INTO public.bible_study_groups (name, description, meeting_day, meeting_time, location) VALUES
('Young Adults Bible Study', 'Bible study for young adults aged 18-35', 'Wednesday', '19:00', 'Church Hall'),
('Women Fellowship Study', 'Weekly women fellowship and Bible study', 'Thursday', '14:00', 'Conference Room'),
('Men Brotherhood Study', 'Men''s Bible study and fellowship', 'Saturday', '08:00', 'Main Sanctuary');

INSERT INTO public.volunteers (user_id, department, role, hours_per_week, skills) VALUES
((SELECT id FROM auth.users LIMIT 1), 'Media', 'Sound Technician', 4, ARRAY['Audio Engineering', 'Live Sound']),
((SELECT id FROM auth.users LIMIT 1), 'Hospitality', 'Usher', 2, ARRAY['Customer Service', 'Event Management']),
((SELECT id FROM auth.users LIMIT 1), 'Youth', 'Youth Leader', 6, ARRAY['Leadership', 'Youth Ministry']);

-- Create functions for dashboard statistics
CREATE OR REPLACE FUNCTION public.get_dashboard_stats()
RETURNS TABLE(
  total_members BIGINT,
  new_members_this_month BIGINT,
  upcoming_events BIGINT,
  total_donations NUMERIC,
  monthly_donations NUMERIC,
  active_ministries BIGINT,
  pending_communications BIGINT,
  prayer_requests BIGINT
)
LANGUAGE sql
STABLE
AS $$
  SELECT
    (SELECT COUNT(*) FROM public.members WHERE status = 'active') as total_members,
    (SELECT COUNT(*) FROM public.members WHERE join_date >= date_trunc('month', CURRENT_DATE)) as new_members_this_month,
    (SELECT COUNT(*) FROM public.events WHERE start_date >= CURRENT_DATE AND start_date <= CURRENT_DATE + INTERVAL '30 days') as upcoming_events,
    (SELECT COALESCE(SUM(amount), 0) FROM public.donations) as total_donations,
    (SELECT COALESCE(SUM(amount), 0) FROM public.donations WHERE donation_date >= date_trunc('month', CURRENT_DATE)) as monthly_donations,
    (SELECT COUNT(*) FROM public.ministries WHERE is_active = true) as active_ministries,
    (SELECT COUNT(*) FROM public.communications WHERE status = 'draft') as pending_communications,
    (SELECT COUNT(*) FROM public.prayer_requests WHERE status = 'active') as prayer_requests;
$$;
