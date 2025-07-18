
-- First, let's ensure we have the ministry_members table to connect members to ministries
CREATE TABLE IF NOT EXISTS public.ministry_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ministry_id UUID NOT NULL REFERENCES public.ministries(id) ON DELETE CASCADE,
  member_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  joined_date DATE NOT NULL DEFAULT CURRENT_DATE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  role TEXT DEFAULT 'member',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(ministry_id, member_id)
);

-- Enable RLS for ministry_members
ALTER TABLE public.ministry_members ENABLE ROW LEVEL SECURITY;

-- Create policies for ministry_members
CREATE POLICY "Clergy can manage ministry members" 
  ON public.ministry_members 
  FOR ALL 
  USING (is_admin_or_clergy(auth.uid()));

CREATE POLICY "Users can view ministry members" 
  ON public.ministry_members 
  FOR SELECT 
  USING (auth.uid() IS NOT NULL);

-- Create members table if it doesn't exist (referenced in some queries)
CREATE TABLE IF NOT EXISTS public.members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  membership_number TEXT UNIQUE,
  join_date DATE NOT NULL DEFAULT CURRENT_DATE,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for members
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;

-- Create policies for members
CREATE POLICY "Admins can manage members" 
  ON public.members 
  FOR ALL 
  USING (has_role(auth.uid(), 'system_admin'::user_role) OR has_role(auth.uid(), 'secretary'::user_role));

CREATE POLICY "Users can view members" 
  ON public.members 
  FOR SELECT 
  USING (auth.uid() IS NOT NULL);

-- Insert some sample ministries and ministry members to test with
INSERT INTO public.ministries (name, description, leader_id, meeting_day, meeting_time, meeting_location) VALUES
('Youth Ministry', 'Ministry for young people aged 12-25', NULL, 'Saturday', '14:00', 'Youth Hall'),
('Worship Team', 'Music and worship ministry', NULL, 'Sunday', '08:00', 'Main Sanctuary'),
('Children Ministry', 'Ministry for children under 12', NULL, 'Sunday', '09:00', 'Children Hall'),
('Prayer Warriors', 'Intercessory prayer ministry', NULL, 'Wednesday', '18:00', 'Prayer Room')
ON CONFLICT (name) DO NOTHING;

-- Update the get_dashboard_stats function to work with the actual tables
CREATE OR REPLACE FUNCTION public.get_dashboard_stats()
RETURNS TABLE(
  total_members bigint, 
  new_members_this_month bigint, 
  upcoming_events bigint, 
  total_donations numeric, 
  monthly_donations numeric, 
  active_ministries bigint, 
  pending_communications bigint, 
  prayer_requests bigint
)
LANGUAGE sql
STABLE
AS $function$
  SELECT
    (SELECT COUNT(*) FROM public.profiles) as total_members,
    (SELECT COUNT(*) FROM public.profiles WHERE created_at >= date_trunc('month', CURRENT_DATE)) as new_members_this_month,
    (SELECT COUNT(*) FROM public.events WHERE start_date >= CURRENT_DATE AND start_date <= CURRENT_DATE + INTERVAL '30 days') as upcoming_events,
    (SELECT COALESCE(SUM(amount), 0) FROM public.donations) as total_donations,
    (SELECT COALESCE(SUM(amount), 0) FROM public.donations WHERE donation_date >= date_trunc('month', CURRENT_DATE)) as monthly_donations,
    (SELECT COUNT(*) FROM public.ministries WHERE is_active = true) as active_ministries,
    (SELECT COUNT(*) FROM public.communications WHERE status = 'draft') as pending_communications,
    (SELECT COUNT(*) FROM public.prayer_requests WHERE status = 'active') as prayer_requests;
$function$;
