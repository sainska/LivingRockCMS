
-- Create comprehensive tables for the Church Management System

-- Create household membership table for family groupings
CREATE TABLE IF NOT EXISTS public.household_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  household_id UUID NOT NULL REFERENCES public.households(id) ON DELETE CASCADE,
  member_id UUID NOT NULL REFERENCES public.members(id) ON DELETE CASCADE,
  relationship TEXT DEFAULT 'member',
  is_head BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(household_id, member_id)
);

-- Create prayer request responses table
CREATE TABLE IF NOT EXISTS public.prayer_responses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  prayer_request_id UUID NOT NULL REFERENCES public.prayer_requests(id) ON DELETE CASCADE,
  responder_id UUID NOT NULL,
  response_text TEXT NOT NULL,
  response_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  is_private BOOLEAN DEFAULT false
);

-- Create communication templates table
CREATE TABLE IF NOT EXISTS public.communication_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  template_type TEXT NOT NULL DEFAULT 'email',
  subject TEXT,
  content TEXT NOT NULL,
  variables JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create notification preferences table
CREATE TABLE IF NOT EXISTS public.notification_preferences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  email_notifications BOOLEAN DEFAULT true,
  sms_notifications BOOLEAN DEFAULT true,
  whatsapp_notifications BOOLEAN DEFAULT true,
  event_reminders BOOLEAN DEFAULT true,
  donation_receipts BOOLEAN DEFAULT true,
  prayer_updates BOOLEAN DEFAULT true,
  newsletter BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id)
);

-- Create system notifications table
CREATE TABLE IF NOT EXISTS public.system_notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  recipient_id UUID NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  notification_type TEXT DEFAULT 'info',
  is_read BOOLEAN DEFAULT false,
  action_url TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create event resources table
CREATE TABLE IF NOT EXISTS public.event_resources (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  resource_name TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  quantity INTEGER DEFAULT 1,
  status TEXT DEFAULT 'confirmed',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create recurring donation schedules table
CREATE TABLE IF NOT EXISTS public.recurring_donations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  donor_id UUID,
  amount NUMERIC NOT NULL,
  frequency TEXT NOT NULL DEFAULT 'monthly',
  start_date DATE NOT NULL,
  end_date DATE,
  is_active BOOLEAN DEFAULT true,
  payment_method TEXT DEFAULT 'cash',
  purpose TEXT,
  campaign_id UUID REFERENCES public.donation_campaigns(id),
  next_donation_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create member spiritual milestones table
CREATE TABLE IF NOT EXISTS public.spiritual_milestones (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  member_id UUID NOT NULL REFERENCES public.members(id) ON DELETE CASCADE,
  milestone_type TEXT NOT NULL,
  milestone_date DATE NOT NULL,
  officiant_id UUID,
  location TEXT,
  notes TEXT,
  certificate_issued BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on all new tables
ALTER TABLE public.household_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prayer_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.communication_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recurring_donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.spiritual_milestones ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for household_members
CREATE POLICY "Users can view household members" ON public.household_members FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Admins can manage household members" ON public.household_members FOR ALL USING (has_role(auth.uid(), 'system_admin'::user_role) OR has_role(auth.uid(), 'secretary'::user_role));

-- Create RLS policies for prayer_responses
CREATE POLICY "Users can view non-private responses" ON public.prayer_responses FOR SELECT USING (is_private = false AND auth.uid() IS NOT NULL);
CREATE POLICY "Clergy can manage prayer responses" ON public.prayer_responses FOR ALL USING (is_admin_or_clergy(auth.uid()));
CREATE POLICY "Users can respond to prayers" ON public.prayer_responses FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Create RLS policies for communication_templates
CREATE POLICY "Admins can manage templates" ON public.communication_templates FOR ALL USING (has_role(auth.uid(), 'system_admin'::user_role) OR has_role(auth.uid(), 'secretary'::user_role) OR has_role(auth.uid(), 'clergy'::user_role));
CREATE POLICY "Users can view active templates" ON public.communication_templates FOR SELECT USING (is_active = true AND auth.uid() IS NOT NULL);

-- Create RLS policies for notification_preferences
CREATE POLICY "Users can manage own preferences" ON public.notification_preferences FOR ALL USING (user_id = auth.uid());

-- Create RLS policies for system_notifications
CREATE POLICY "Users can view own notifications" ON public.system_notifications FOR SELECT USING (recipient_id = auth.uid());
CREATE POLICY "Users can update own notifications" ON public.system_notifications FOR UPDATE USING (recipient_id = auth.uid());
CREATE POLICY "System can create notifications" ON public.system_notifications FOR INSERT WITH CHECK (true);

-- Create RLS policies for event_resources
CREATE POLICY "Users can view event resources" ON public.event_resources FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Clergy and secretaries can manage resources" ON public.event_resources FOR ALL USING (is_admin_or_clergy(auth.uid()) OR has_role(auth.uid(), 'secretary'::user_role));

-- Create RLS policies for recurring_donations
CREATE POLICY "Treasurers can manage recurring donations" ON public.recurring_donations FOR ALL USING (has_role(auth.uid(), 'treasurer'::user_role) OR has_role(auth.uid(), 'system_admin'::user_role));

-- Create RLS policies for spiritual_milestones
CREATE POLICY "Clergy can manage spiritual milestones" ON public.spiritual_milestones FOR ALL USING (is_admin_or_clergy(auth.uid()));
CREATE POLICY "Members can view milestones" ON public.spiritual_milestones FOR SELECT USING (auth.uid() IS NOT NULL);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_household_members_household_id ON public.household_members(household_id);
CREATE INDEX IF NOT EXISTS idx_household_members_member_id ON public.household_members(member_id);
CREATE INDEX IF NOT EXISTS idx_prayer_responses_request_id ON public.prayer_responses(prayer_request_id);
CREATE INDEX IF NOT EXISTS idx_system_notifications_recipient ON public.system_notifications(recipient_id);
CREATE INDEX IF NOT EXISTS idx_system_notifications_read_status ON public.system_notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_event_resources_event_id ON public.event_resources(event_id);
CREATE INDEX IF NOT EXISTS idx_recurring_donations_donor ON public.recurring_donations(donor_id);
CREATE INDEX IF NOT EXISTS idx_recurring_donations_active ON public.recurring_donations(is_active);
CREATE INDEX IF NOT EXISTS idx_spiritual_milestones_member ON public.spiritual_milestones(member_id);

-- Insert sample data for communication templates
INSERT INTO public.communication_templates (name, template_type, subject, content, created_by) VALUES
('Welcome Message', 'email', 'Welcome to Living Rock Church', 'Dear {{name}}, Welcome to our church family! We are excited to have you join us.', (SELECT id FROM auth.users LIMIT 1)),
('Event Reminder', 'sms', '', 'Hi {{name}}, This is a reminder about {{event_name}} on {{event_date}} at {{event_time}}.', (SELECT id FROM auth.users LIMIT 1)),
('Donation Receipt', 'email', 'Thank you for your donation', 'Dear {{donor_name}}, Thank you for your generous donation of {{amount}} on {{date}}. Receipt #{{receipt_number}}.', (SELECT id FROM auth.users LIMIT 1)),
('Prayer Request Confirmation', 'whatsapp', '', 'Thank you {{name}} for your prayer request. Our prayer team will be interceding for you.', (SELECT id FROM auth.users LIMIT 1));

-- Add triggers for updated_at columns
CREATE TRIGGER update_communication_templates_updated_at BEFORE UPDATE ON public.communication_templates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_notification_preferences_updated_at BEFORE UPDATE ON public.notification_preferences FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_recurring_donations_updated_at BEFORE UPDATE ON public.recurring_donations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
