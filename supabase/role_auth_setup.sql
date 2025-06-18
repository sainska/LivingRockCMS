-- =====================================================
-- Living Rock CMS - User Role Authentication Setup
-- =====================================================
-- This script sets up the complete role-based authentication system
-- Run this in your Supabase SQL editor

-- =====================================================
-- 1. ENSURE ENUM TYPES EXIST
-- =====================================================

-- Create user_role enum if it doesn't exist
DO $$ BEGIN
    CREATE TYPE public.user_role AS ENUM ('system_admin', 'clergy', 'treasurer', 'secretary', 'member');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create member_status enum if it doesn't exist
DO $$ BEGIN
    CREATE TYPE public.member_status AS ENUM ('active', 'inactive', 'deceased', 'transferred');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- =====================================================
-- 2. ENSURE TABLES EXIST
-- =====================================================

-- Create profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.profiles (
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

-- Create user_roles table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    role user_role NOT NULL,
    assigned_by UUID REFERENCES public.profiles(id),
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE,
    UNIQUE(user_id, role)
);

-- =====================================================
-- 3. CREATE OR REPLACE FUNCTIONS
-- =====================================================

-- Function to get user role
CREATE OR REPLACE FUNCTION public.get_user_role(user_uuid UUID)
RETURNS user_role
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    user_role_value user_role;
BEGIN
    SELECT role INTO user_role_value
    FROM public.user_roles
    WHERE user_id = user_uuid AND is_active = true
    LIMIT 1;
    
    RETURN user_role_value;
END;
$$;

-- Function to check if user has specific role
CREATE OR REPLACE FUNCTION public.has_role(user_uuid UUID, required_role user_role)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.user_roles
        WHERE user_id = user_uuid 
        AND role = required_role 
        AND is_active = true
    );
END;
$$;

-- Function to check if user is admin or clergy
CREATE OR REPLACE FUNCTION public.is_admin_or_clergy(user_uuid UUID)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.user_roles
        WHERE user_id = user_uuid 
        AND role IN ('system_admin', 'clergy')
        AND is_active = true
    );
END;
$$;

-- Function to handle new user registration (auto-assign member role)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
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
$$;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

-- =====================================================
-- 4. CREATE OR REPLACE TRIGGERS
-- =====================================================

-- Trigger for new user registration
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Trigger for updating profiles updated_at
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =====================================================
-- 5. ENABLE ROW LEVEL SECURITY (RLS)
-- =====================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 6. CREATE RLS POLICIES
-- =====================================================

-- Profiles policies
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
CREATE POLICY "Admins can view all profiles" ON public.profiles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.user_roles 
            WHERE user_id = auth.uid() 
            AND role = 'system_admin' 
            AND is_active = true
        )
    );

-- User roles policies
DROP POLICY IF EXISTS "Users can view own roles" ON public.user_roles;
CREATE POLICY "Users can view own roles" ON public.user_roles
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can manage all roles" ON public.user_roles;
CREATE POLICY "Admins can manage all roles" ON public.user_roles
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.user_roles 
            WHERE user_id = auth.uid() 
            AND role = 'system_admin' 
            AND is_active = true
        )
    );

-- =====================================================
-- 7. CREATE INDEXES FOR PERFORMANCE
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_active ON public.user_roles(is_active);
CREATE INDEX IF NOT EXISTS idx_user_roles_role ON public.user_roles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);

-- =====================================================
-- 8. INSERT DEFAULT SYSTEM ADMIN (OPTIONAL)
-- =====================================================
-- Uncomment and modify the email below to create a default system admin
-- Make sure to replace 'admin@livingrockchurch.org' with the actual admin email

/*
INSERT INTO public.user_roles (user_id, role, is_active)
SELECT id, 'system_admin', true
FROM auth.users
WHERE email = 'admin@livingrockchurch.org'
ON CONFLICT (user_id, role) DO NOTHING;
*/

-- =====================================================
-- 9. VERIFICATION QUERIES
-- =====================================================

-- Test the functions (run these to verify everything works)
-- SELECT public.get_user_role('your-user-uuid-here');
-- SELECT public.has_role('your-user-uuid-here', 'member');
-- SELECT public.is_admin_or_clergy('your-user-uuid-here');

-- =====================================================
-- 10. CLEANUP (OPTIONAL - Remove old data if needed)
-- =====================================================

-- If you need to clean up any existing data without roles:
/*
UPDATE public.user_roles 
SET is_active = false 
WHERE user_id IN (
    SELECT id FROM auth.users 
    WHERE created_at < NOW() - INTERVAL '1 day'
    AND id NOT IN (SELECT user_id FROM public.user_roles WHERE is_active = true)
);
*/

-- =====================================================
-- SETUP COMPLETE
-- =====================================================

-- This script sets up:
-- 1. User role authentication system
-- 2. Auto-assignment of 'member' role for new registrations
-- 3. Role-based access control functions
-- 4. Row Level Security policies
-- 5. Performance indexes
-- 6. Audit triggers

-- After running this script:
-- - New users will automatically get 'member' role
-- - System admins can assign other roles via admin interface
-- - All routes are protected by role-based access control
-- - Database is optimized for performance 