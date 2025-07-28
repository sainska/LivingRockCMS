-- =====================================================
-- Living Rock CMS - Registration System SQL Updates
-- =====================================================
-- This script addresses potential issues with the registration system
-- and ensures all database functions work correctly

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
-- 2. ENSURE PROFILES TABLE HAS CORRECT STRUCTURE
-- =====================================================

-- Update profiles table to ensure it has all necessary columns
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS date_of_birth DATE,
ADD COLUMN IF NOT EXISTS gender TEXT CHECK (gender IN ('male', 'female')),
ADD COLUMN IF NOT EXISTS address TEXT,
ADD COLUMN IF NOT EXISTS city TEXT,
ADD COLUMN IF NOT EXISTS country TEXT DEFAULT 'Kenya',
ADD COLUMN IF NOT EXISTS profile_image_url TEXT,
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- =====================================================
-- 3. ENSURE USER_ROLES TABLE HAS CORRECT STRUCTURE
-- =====================================================

-- Update user_roles table to ensure it has all necessary columns
ALTER TABLE public.user_roles 
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- =====================================================
-- 4. UPDATE HANDLE_NEW_USER FUNCTION
-- =====================================================

-- Create or replace the handle_new_user function with improved error handling
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Insert profile with error handling
    BEGIN
        INSERT INTO public.profiles (id, first_name, last_name, email)
        VALUES (
            NEW.id,
            COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
            COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
            NEW.email
        );
    EXCEPTION
        WHEN unique_violation THEN
            -- Profile already exists, update it instead
            UPDATE public.profiles 
            SET 
                first_name = COALESCE(NEW.raw_user_meta_data->>'first_name', first_name),
                last_name = COALESCE(NEW.raw_user_meta_data->>'last_name', last_name),
                email = NEW.email,
                updated_at = NOW()
            WHERE id = NEW.id;
        WHEN OTHERS THEN
            -- Log the error but don't fail the registration
            RAISE WARNING 'Error creating profile for user %: %', NEW.id, SQLERRM;
    END;
    
    -- Auto-assign member role with error handling
    BEGIN
        INSERT INTO public.user_roles (user_id, role, is_active)
        VALUES (NEW.id, 'member', true);
    EXCEPTION
        WHEN unique_violation THEN
            -- Role already exists, update it to active
            UPDATE public.user_roles 
            SET is_active = true, assigned_at = NOW()
            WHERE user_id = NEW.id AND role = 'member';
        WHEN OTHERS THEN
            -- Log the error but don't fail the registration
            RAISE WARNING 'Error assigning role for user %: %', NEW.id, SQLERRM;
    END;
    
    RETURN NEW;
END;
$$;

-- =====================================================
-- 5. UPDATE GET_USER_ROLE FUNCTION
-- =====================================================

-- Create or replace the get_user_role function with improved logic
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

-- =====================================================
-- 6. CREATE OR REPLACE TRIGGERS
-- =====================================================

-- Drop and recreate the trigger to ensure it's properly set up
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create trigger for updating profiles updated_at
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =====================================================
-- 7. ENSURE RLS POLICIES ARE CORRECT
-- =====================================================

-- Enable RLS on tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies and recreate them
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "System can insert profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;

-- Create updated policies
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "System can insert profiles" ON public.profiles
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view all profiles" ON public.profiles
    FOR SELECT USING (auth.uid() IS NOT NULL);

-- User roles policies
DROP POLICY IF EXISTS "Users can view own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can view all roles" ON public.user_roles;
DROP POLICY IF EXISTS "System can insert roles" ON public.user_roles;

CREATE POLICY "Users can view own roles" ON public.user_roles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view all roles" ON public.user_roles
    FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "System can insert roles" ON public.user_roles
    FOR INSERT WITH CHECK (true);

-- =====================================================
-- 8. CREATE INDEXES FOR PERFORMANCE
-- =====================================================

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_id ON public.profiles(id);
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_active ON public.user_roles(is_active);
CREATE INDEX IF NOT EXISTS idx_user_roles_role ON public.user_roles(role);

-- =====================================================
-- 9. CREATE HELPER FUNCTIONS
-- =====================================================

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
-- 10. VERIFICATION QUERIES
-- =====================================================

-- Test queries to verify everything is working
-- Uncomment and run these to test:

/*
-- Test the functions
SELECT public.get_user_role('your-user-uuid-here');
SELECT public.has_role('your-user-uuid-here', 'member');
SELECT public.is_admin_or_clergy('your-user-uuid-here');

-- Check if tables exist and have correct structure
SELECT table_name, column_name, data_type 
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name IN ('profiles', 'user_roles')
ORDER BY table_name, ordinal_position;

-- Check if triggers exist
SELECT trigger_name, event_manipulation, event_object_table
FROM information_schema.triggers
WHERE trigger_schema = 'public'
AND event_object_table = 'users';

-- Check if policies exist
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE schemaname = 'public'
AND tablename IN ('profiles', 'user_roles');
*/

-- =====================================================
-- 11. CLEANUP OLD DATA (OPTIONAL)
-- =====================================================

-- If you need to clean up any orphaned records
/*
-- Remove orphaned user_roles records
DELETE FROM public.user_roles 
WHERE user_id NOT IN (SELECT id FROM auth.users);

-- Remove orphaned profiles records
DELETE FROM public.profiles 
WHERE id NOT IN (SELECT id FROM auth.users);

-- Update any profiles without roles to have member role
INSERT INTO public.user_roles (user_id, role, is_active)
SELECT p.id, 'member', true
FROM public.profiles p
WHERE p.id NOT IN (SELECT user_id FROM public.user_roles WHERE is_active = true)
ON CONFLICT (user_id, role) DO NOTHING;
*/

-- =====================================================
-- SETUP COMPLETE
-- =====================================================

-- This script ensures:
-- 1. All necessary enum types exist
-- 2. Tables have correct structure with all required columns
-- 3. handle_new_user function has proper error handling
-- 4. All triggers are properly set up
-- 5. RLS policies are correctly configured
-- 6. Performance indexes are created
-- 7. Helper functions are available

-- After running this script, the registration system should work correctly
-- and handle edge cases gracefully. 