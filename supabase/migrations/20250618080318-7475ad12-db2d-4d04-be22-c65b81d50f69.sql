
-- Create enum types for user roles and other status fields
CREATE TYPE public.user_role AS ENUM ('system_admin', 'clergy', 'treasurer', 'secretary', 'member');
CREATE TYPE public.member_status AS ENUM ('active', 'inactive', 'deceased', 'transferred');
CREATE TYPE public.event_type AS ENUM ('service', 'meeting', 'conference', 'social', 'outreach', 'other');
CREATE TYPE public.donation_type AS ENUM ('tithe', 'offering', 'special', 'project', 'missions');
CREATE TYPE public.payment_method AS ENUM ('cash', 'check', 'card', 'bank_transfer', 'mobile_money');

-- Create profiles table that extends auth.users
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  date_of_birth DATE,
  gender TEXT CHECK (gender IN ('male', 'female')),
  address TEXT,
  city TEXT,
  country TEXT DEFAULT 'Kenya',
  profile_image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  role user_role NOT NULL,
  assigned_by UUID REFERENCES public.profiles(id),
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE,
  UNIQUE(user_id, role)
);

-- Create members table for church membership details
CREATE TABLE public.members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  membership_number TEXT UNIQUE NOT NULL,
  join_date DATE NOT NULL DEFAULT CURRENT_DATE,
  status member_status DEFAULT 'active',
  baptism_date DATE,
  confirmation_date DATE,
  ministry_involvement TEXT[],
  emergency_contact_name TEXT,
  emergency_contact_phone TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create events table
CREATE TABLE public.events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  event_type event_type NOT NULL DEFAULT 'other',
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE,
  location TEXT,
  organizer_id UUID REFERENCES public.profiles(id),
  max_attendees INTEGER,
  registration_required BOOLEAN DEFAULT FALSE,
  registration_deadline TIMESTAMP WITH TIME ZONE,
  is_recurring BOOLEAN DEFAULT FALSE,
  recurrence_pattern TEXT,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'ongoing', 'completed', 'cancelled')),
  created_by UUID REFERENCES public.profiles(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create event_registrations table
CREATE TABLE public.event_registrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  registration_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  attendance_status TEXT DEFAULT 'registered' CHECK (attendance_status IN ('registered', 'attended', 'no_show', 'cancelled')),
  notes TEXT,
  UNIQUE(event_id, user_id)
);

-- Create donations table
CREATE TABLE public.donations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  donor_id UUID REFERENCES public.profiles(id),
  amount DECIMAL(12,2) NOT NULL CHECK (amount > 0),
  currency TEXT DEFAULT 'KES',
  donation_type donation_type NOT NULL,
  payment_method payment_method NOT NULL,
  reference_number TEXT UNIQUE,
  transaction_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_anonymous BOOLEAN DEFAULT FALSE,
  purpose TEXT,
  campaign_id UUID,
  receipt_issued BOOLEAN DEFAULT FALSE,
  receipt_number TEXT,
  notes TEXT,
  recorded_by UUID REFERENCES public.profiles(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create ministries table
CREATE TABLE public.ministries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
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

-- Create ministry_members table
CREATE TABLE public.ministry_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  ministry_id UUID REFERENCES public.ministries(id) ON DELETE CASCADE NOT NULL,
  member_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  role TEXT DEFAULT 'member',
  joined_date DATE DEFAULT CURRENT_DATE,
  is_active BOOLEAN DEFAULT TRUE,
  UNIQUE(ministry_id, member_id)
);

-- Create financial_accounts table
CREATE TABLE public.financial_accounts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  account_name TEXT NOT NULL UNIQUE,
  account_type TEXT NOT NULL CHECK (account_type IN ('checking', 'savings', 'petty_cash', 'investment')),
  bank_name TEXT,
  account_number TEXT,
  current_balance DECIMAL(12,2) DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create financial_transactions table
CREATE TABLE public.financial_transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  account_id UUID REFERENCES public.financial_accounts(id) NOT NULL,
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('income', 'expense')),
  amount DECIMAL(12,2) NOT NULL CHECK (amount > 0),
  description TEXT NOT NULL,
  category TEXT,
  reference_number TEXT,
  transaction_date DATE NOT NULL DEFAULT CURRENT_DATE,
  recorded_by UUID REFERENCES public.profiles(id) NOT NULL,
  approved_by UUID REFERENCES public.profiles(id),
  approval_status TEXT DEFAULT 'pending' CHECK (approval_status IN ('pending', 'approved', 'rejected')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create audit_logs table for security tracking
CREATE TABLE public.audit_logs (
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

-- Create church_settings table
CREATE TABLE public.church_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key TEXT NOT NULL UNIQUE,
  setting_value TEXT,
  setting_type TEXT DEFAULT 'text' CHECK (setting_type IN ('text', 'number', 'boolean', 'json')),
  description TEXT,
  is_public BOOLEAN DEFAULT FALSE,
  updated_by UUID REFERENCES public.profiles(id),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default church settings
INSERT INTO public.church_settings (setting_key, setting_value, setting_type, description, is_public) VALUES
('church_name', 'Living Rock Church', 'text', 'Official church name', true),
('church_address', '', 'text', 'Church physical address', true),
('church_phone', '', 'text', 'Church contact phone', true),
('church_email', '', 'text', 'Church contact email', true),
('sunday_service_time', '09:00', 'text', 'Sunday service time', true),
('currency', 'KES', 'text', 'Default currency', false),
('fiscal_year_start', '01-01', 'text', 'Fiscal year start (MM-DD)', false);

-- Enable Row Level Security on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ministries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ministry_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.church_settings ENABLE ROW LEVEL SECURITY;

-- Create function to check user roles
CREATE OR REPLACE FUNCTION public.get_user_role(user_uuid UUID)
RETURNS user_role
LANGUAGE SQL
SECURITY DEFINER
STABLE
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

-- Create function to check if user has specific role
CREATE OR REPLACE FUNCTION public.has_role(user_uuid UUID, required_role user_role)
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = user_uuid 
    AND role = required_role 
    AND is_active = true
  );
$$;

-- Create function to check if user is admin or clergy
CREATE OR REPLACE FUNCTION public.is_admin_or_clergy(user_uuid UUID)
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = user_uuid 
    AND role IN ('system_admin', 'clergy') 
    AND is_active = true
  );
$$;

-- Create RLS policies for profiles table
CREATE POLICY "Users can view all profiles" ON public.profiles
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "System can insert profiles" ON public.profiles
  FOR INSERT WITH CHECK (true);

-- Create RLS policies for user_roles table
CREATE POLICY "Users can view all roles" ON public.user_roles
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "System admins can manage roles" ON public.user_roles
  FOR ALL USING (public.has_role(auth.uid(), 'system_admin'));

-- Create RLS policies for members table
CREATE POLICY "Users can view member info" ON public.members
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins and clergy can manage members" ON public.members
  FOR ALL USING (public.is_admin_or_clergy(auth.uid()));

-- Create RLS policies for events table
CREATE POLICY "Users can view events" ON public.events
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Clergy and admins can manage events" ON public.events
  FOR ALL USING (public.is_admin_or_clergy(auth.uid()));

-- Create RLS policies for event_registrations table
CREATE POLICY "Users can view registrations" ON public.event_registrations
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can register for events" ON public.event_registrations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own registrations" ON public.event_registrations
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Clergy can manage all registrations" ON public.event_registrations
  FOR ALL USING (public.is_admin_or_clergy(auth.uid()));

-- Create RLS policies for donations table
CREATE POLICY "Treasurers can view all donations" ON public.donations
  FOR SELECT USING (public.has_role(auth.uid(), 'treasurer') OR public.has_role(auth.uid(), 'system_admin'));

CREATE POLICY "Treasurers can manage donations" ON public.donations
  FOR ALL USING (public.has_role(auth.uid(), 'treasurer') OR public.has_role(auth.uid(), 'system_admin'));

-- Create RLS policies for financial tables (treasurer access)
CREATE POLICY "Treasurers can manage financial accounts" ON public.financial_accounts
  FOR ALL USING (public.has_role(auth.uid(), 'treasurer') OR public.has_role(auth.uid(), 'system_admin'));

CREATE POLICY "Treasurers can manage financial transactions" ON public.financial_transactions
  FOR ALL USING (public.has_role(auth.uid(), 'treasurer') OR public.has_role(auth.uid(), 'system_admin'));

-- Create RLS policies for ministries
CREATE POLICY "Users can view ministries" ON public.ministries
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Clergy can manage ministries" ON public.ministries
  FOR ALL USING (public.is_admin_or_clergy(auth.uid()));

CREATE POLICY "Users can view ministry members" ON public.ministry_members
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Clergy can manage ministry members" ON public.ministry_members
  FOR ALL USING (public.is_admin_or_clergy(auth.uid()));

-- Create RLS policies for audit logs (admin only)
CREATE POLICY "Admins can view audit logs" ON public.audit_logs
  FOR SELECT USING (public.has_role(auth.uid(), 'system_admin'));

CREATE POLICY "System can insert audit logs" ON public.audit_logs
  FOR INSERT WITH CHECK (true);

-- Create RLS policies for church settings
CREATE POLICY "Users can view public settings" ON public.church_settings
  FOR SELECT USING (is_public = true OR public.is_admin_or_clergy(auth.uid()));

CREATE POLICY "Admins can manage settings" ON public.church_settings
  FOR ALL USING (public.has_role(auth.uid(), 'system_admin'));

-- Create trigger function for updating updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_members_updated_at BEFORE UPDATE ON public.members
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON public.events
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_ministries_updated_at BEFORE UPDATE ON public.ministries
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_financial_accounts_updated_at BEFORE UPDATE ON public.financial_accounts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  membership_num TEXT;
BEGIN
  -- Generate membership number
  membership_num := 'LRC' || LPAD(EXTRACT(year FROM NOW())::TEXT, 4, '0') || 
                   LPAD((SELECT COALESCE(MAX(RIGHT(membership_number, 4)::INTEGER), 0) + 1 
                         FROM public.members)::TEXT, 4, '0');

  -- Insert into profiles
  INSERT INTO public.profiles (id, first_name, last_name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'first_name', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'last_name', ''),
    NEW.email
  );

  -- Insert into members
  INSERT INTO public.members (user_id, membership_number)
  VALUES (NEW.id, membership_num);

  -- Assign default member role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'member');

  RETURN NEW;
END;
$$;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function for audit logging
CREATE OR REPLACE FUNCTION public.log_audit_event()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    INSERT INTO public.audit_logs (user_id, action, table_name, record_id, old_values)
    VALUES (auth.uid(), TG_OP, TG_TABLE_NAME, OLD.id, to_jsonb(OLD));
    RETURN OLD;
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO public.audit_logs (user_id, action, table_name, record_id, old_values, new_values)
    VALUES (auth.uid(), TG_OP, TG_TABLE_NAME, NEW.id, to_jsonb(OLD), to_jsonb(NEW));
    RETURN NEW;
  ELSIF TG_OP = 'INSERT' THEN
    INSERT INTO public.audit_logs (user_id, action, table_name, record_id, new_values)
    VALUES (auth.uid(), TG_OP, TG_TABLE_NAME, NEW.id, to_jsonb(NEW));
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$$;

-- Create audit triggers for sensitive tables
CREATE TRIGGER audit_user_roles AFTER INSERT OR UPDATE OR DELETE ON public.user_roles
  FOR EACH ROW EXECUTE FUNCTION public.log_audit_event();

CREATE TRIGGER audit_donations AFTER INSERT OR UPDATE OR DELETE ON public.donations
  FOR EACH ROW EXECUTE FUNCTION public.log_audit_event();

CREATE TRIGGER audit_financial_transactions AFTER INSERT OR UPDATE OR DELETE ON public.financial_transactions
  FOR EACH ROW EXECUTE FUNCTION public.log_audit_event();
