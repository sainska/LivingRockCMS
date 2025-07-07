
-- Create donation campaigns table
CREATE TABLE public.donation_campaigns (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  target_amount NUMERIC NOT NULL DEFAULT 0,
  current_amount NUMERIC NOT NULL DEFAULT 0,
  start_date DATE NOT NULL DEFAULT CURRENT_DATE,
  end_date DATE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create communications table
CREATE TABLE public.communications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'announcement',
  target_audience TEXT[] DEFAULT ARRAY['all'],
  sent_by UUID NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_urgent BOOLEAN NOT NULL DEFAULT false,
  status TEXT NOT NULL DEFAULT 'draft'
);

-- Create attendance records table
CREATE TABLE public.attendance_records (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID NOT NULL,
  member_id UUID NOT NULL,
  attendance_date DATE NOT NULL DEFAULT CURRENT_DATE,
  status TEXT NOT NULL DEFAULT 'present',
  notes TEXT,
  recorded_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create sermon records table
CREATE TABLE public.sermons (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  scripture_reference TEXT,
  date_preached DATE NOT NULL DEFAULT CURRENT_DATE,
  preacher_id UUID NOT NULL,
  summary TEXT,
  audio_url TEXT,
  video_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create pastoral visits table
CREATE TABLE public.pastoral_visits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  member_id UUID NOT NULL,
  visitor_id UUID NOT NULL,
  visit_date DATE NOT NULL DEFAULT CURRENT_DATE,
  purpose TEXT NOT NULL,
  notes TEXT,
  follow_up_required BOOLEAN NOT NULL DEFAULT false,
  follow_up_date DATE,
  status TEXT NOT NULL DEFAULT 'completed',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create budget categories table
CREATE TABLE public.budget_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  allocated_amount NUMERIC NOT NULL DEFAULT 0,
  spent_amount NUMERIC NOT NULL DEFAULT 0,
  budget_year INTEGER NOT NULL DEFAULT EXTRACT(year FROM CURRENT_DATE),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create prayer requests table
CREATE TABLE public.prayer_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  requester_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  is_anonymous BOOLEAN NOT NULL DEFAULT false,
  is_urgent BOOLEAN NOT NULL DEFAULT false,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add RLS policies for all new tables
ALTER TABLE public.donation_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.communications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sermons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pastoral_visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.budget_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prayer_requests ENABLE ROW LEVEL SECURITY;

-- Donation campaigns policies
CREATE POLICY "Treasurers can manage campaigns" ON public.donation_campaigns FOR ALL USING (has_role(auth.uid(), 'treasurer'::user_role) OR has_role(auth.uid(), 'system_admin'::user_role));
CREATE POLICY "Users can view active campaigns" ON public.donation_campaigns FOR SELECT USING (is_active = true AND auth.uid() IS NOT NULL);

-- Communications policies
CREATE POLICY "Clergy and secretaries can manage communications" ON public.communications FOR ALL USING (has_role(auth.uid(), 'clergy'::user_role) OR has_role(auth.uid(), 'secretary'::user_role) OR has_role(auth.uid(), 'system_admin'::user_role));
CREATE POLICY "Users can view published communications" ON public.communications FOR SELECT USING (status = 'published' AND auth.uid() IS NOT NULL);

-- Attendance records policies
CREATE POLICY "Clergy can manage attendance" ON public.attendance_records FOR ALL USING (is_admin_or_clergy(auth.uid()));
CREATE POLICY "Users can view attendance records" ON public.attendance_records FOR SELECT USING (auth.uid() IS NOT NULL);

-- Sermons policies
CREATE POLICY "Clergy can manage sermons" ON public.sermons FOR ALL USING (is_admin_or_clergy(auth.uid()));
CREATE POLICY "Users can view sermons" ON public.sermons FOR SELECT USING (auth.uid() IS NOT NULL);

-- Pastoral visits policies
CREATE POLICY "Clergy can manage pastoral visits" ON public.pastoral_visits FOR ALL USING (is_admin_or_clergy(auth.uid()));
CREATE POLICY "Members can view their own visits" ON public.pastoral_visits FOR SELECT USING (member_id = auth.uid() OR is_admin_or_clergy(auth.uid()));

-- Budget categories policies
CREATE POLICY "Treasurers can manage budget categories" ON public.budget_categories FOR ALL USING (has_role(auth.uid(), 'treasurer'::user_role) OR has_role(auth.uid(), 'system_admin'::user_role));
CREATE POLICY "Users can view budget categories" ON public.budget_categories FOR SELECT USING (auth.uid() IS NOT NULL);

-- Prayer requests policies
CREATE POLICY "Users can manage their own prayer requests" ON public.prayer_requests FOR ALL USING (requester_id = auth.uid());
CREATE POLICY "Clergy can view all prayer requests" ON public.prayer_requests FOR SELECT USING (is_admin_or_clergy(auth.uid()));
CREATE POLICY "Users can view non-anonymous prayer requests" ON public.prayer_requests FOR SELECT USING (is_anonymous = false AND auth.uid() IS NOT NULL);

-- Insert sample data
INSERT INTO public.donation_campaigns (name, description, target_amount, current_amount, created_by) VALUES
('Building Fund 2024', 'Funds for new church building construction', 1000000, 450000, (SELECT id FROM auth.users LIMIT 1)),
('Mission Outreach', 'Support for local community missions', 250000, 180000, (SELECT id FROM auth.users LIMIT 1)),
('Youth Ministry', 'Equipment and activities for youth programs', 150000, 95000, (SELECT id FROM auth.users LIMIT 1));

INSERT INTO public.budget_categories (name, description, allocated_amount, spent_amount) VALUES
('Ministry Operations', 'Day-to-day ministry activities', 800000, 650000),
('Building Maintenance', 'Facility upkeep and repairs', 500000, 320000),
('Outreach Programs', 'Community outreach initiatives', 300000, 180000),
('Staff Salaries', 'Compensation for church staff', 1200000, 1200000),
('Utilities', 'Electricity, water, internet', 200000, 165000),
('Equipment', 'Sound system, computers, furniture', 300000, 220000);

INSERT INTO public.communications (title, content, type, sent_by, status) VALUES
('Sunday Service Schedule Change', 'Please note that this Sunday service will start at 9:00 AM instead of 10:00 AM due to special guest speaker.', 'announcement', (SELECT id FROM auth.users LIMIT 1), 'published'),
('Prayer Meeting Tonight', 'Join us for our weekly prayer meeting at 7:00 PM in the main sanctuary.', 'event', (SELECT id FROM auth.users LIMIT 1), 'published'),
('Volunteer Appreciation Dinner', 'All volunteers are invited to our appreciation dinner this Friday at 6:00 PM.', 'invitation', (SELECT id FROM auth.users LIMIT 1), 'published');

-- Add triggers for updated_at columns
CREATE OR REPLACE FUNCTION update_updated_at_column() RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_donation_campaigns_updated_at BEFORE UPDATE ON public.donation_campaigns FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_budget_categories_updated_at BEFORE UPDATE ON public.budget_categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_sermons_updated_at BEFORE UPDATE ON public.sermons FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_prayer_requests_updated_at BEFORE UPDATE ON public.prayer_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
