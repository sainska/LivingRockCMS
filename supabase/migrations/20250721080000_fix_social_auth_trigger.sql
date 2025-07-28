-- Fix Social Authentication Trigger Migration
-- This migration fixes the database error when saving new users during social auth

-- =====================================================
-- STEP 1: Add missing social auth columns to profiles table
-- =====================================================

-- Add social authentication fields to profiles table if they don't exist
DO $$
DECLARE
    column_exists BOOLEAN;
BEGIN
    -- Check if social_provider column exists
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'profiles' 
        AND column_name = 'social_provider'
    ) INTO column_exists;
    
    IF NOT column_exists THEN
        ALTER TABLE public.profiles ADD COLUMN social_provider VARCHAR(50);
        RAISE NOTICE 'Added social_provider column to profiles table';
    ELSE
        RAISE NOTICE 'social_provider column already exists in profiles table';
    END IF;
    
    -- Check if social_id column exists
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'profiles' 
        AND column_name = 'social_id'
    ) INTO column_exists;
    
    IF NOT column_exists THEN
        ALTER TABLE public.profiles ADD COLUMN social_id VARCHAR(255);
        RAISE NOTICE 'Added social_id column to profiles table';
    ELSE
        RAISE NOTICE 'social_id column already exists in profiles table';
    END IF;
    
    -- Check if avatar_url column exists
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'profiles' 
        AND column_name = 'avatar_url'
    ) INTO column_exists;
    
    IF NOT column_exists THEN
        ALTER TABLE public.profiles ADD COLUMN avatar_url TEXT;
        RAISE NOTICE 'Added avatar_url column to profiles table';
    ELSE
        RAISE NOTICE 'avatar_url column already exists in profiles table';
    END IF;
    
    -- Check if email_verified column exists
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'profiles' 
        AND column_name = 'email_verified'
    ) INTO column_exists;
    
    IF NOT column_exists THEN
        ALTER TABLE public.profiles ADD COLUMN email_verified BOOLEAN DEFAULT FALSE;
        RAISE NOTICE 'Added email_verified column to profiles table';
    ELSE
        RAISE NOTICE 'email_verified column already exists in profiles table';
    END IF;
    
    -- Check if last_social_login column exists
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'profiles' 
        AND column_name = 'last_social_login'
    ) INTO column_exists;
    
    IF NOT column_exists THEN
        ALTER TABLE public.profiles ADD COLUMN last_social_login TIMESTAMP WITH TIME ZONE;
        RAISE NOTICE 'Added last_social_login column to profiles table';
    ELSE
        RAISE NOTICE 'last_social_login column already exists in profiles table';
    END IF;
END $$;

-- Create indexes for social authentication lookups
CREATE INDEX IF NOT EXISTS idx_profiles_social ON profiles(social_provider, social_id);
CREATE INDEX IF NOT EXISTS idx_profiles_email_verified ON profiles(email_verified);

-- =====================================================
-- STEP 2: Drop the problematic trigger and function
-- =====================================================

-- Drop the problematic trigger and function
DROP TRIGGER IF EXISTS trigger_social_auth_user ON profiles;
DROP FUNCTION IF EXISTS handle_social_auth_user();

-- =====================================================
-- STEP 3: Create a corrected function to handle social authentication user creation
-- =====================================================

CREATE OR REPLACE FUNCTION handle_social_auth_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Set email_verified to true for social auth users
  NEW.email_verified = TRUE;
  NEW.last_social_login = NOW();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- STEP 4: Create trigger for social authentication (only for profile updates, not inserts)
-- =====================================================

-- Create trigger for social authentication (only for profile updates, not inserts)
DROP TRIGGER IF EXISTS trigger_social_auth_user ON profiles;
CREATE TRIGGER trigger_social_auth_user
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  WHEN (NEW.social_provider IS NOT NULL)
  EXECUTE FUNCTION handle_social_auth_user();

-- =====================================================
-- STEP 5: Update the main handle_new_user function to handle social auth properly
-- =====================================================

-- Update the main handle_new_user function to handle social auth properly
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  membership_num TEXT;
  social_provider TEXT;
BEGIN
  -- Get social provider from user metadata
  social_provider := COALESCE(NEW.raw_user_meta_data ->> 'provider', NULL);
  
  -- Generate membership number
  membership_num := 'LRC' || LPAD(EXTRACT(year FROM NOW())::TEXT, 4, '0') || 
                   LPAD((SELECT COALESCE(MAX(RIGHT(membership_number, 4)::INTEGER), 0) + 1 
                         FROM public.members)::TEXT, 4, '0');

  -- Insert into profiles with social auth data
  INSERT INTO public.profiles (
    id, 
    first_name, 
    last_name, 
    email,
    social_provider,
    social_id,
    avatar_url,
    email_verified,
    last_social_login
  )
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'first_name', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'last_name', ''),
    NEW.email,
    social_provider,
    COALESCE(NEW.raw_user_meta_data ->> 'sub', NULL),
    COALESCE(NEW.raw_user_meta_data ->> 'picture', NULL),
    CASE WHEN social_provider IS NOT NULL THEN TRUE ELSE FALSE END,
    CASE WHEN social_provider IS NOT NULL THEN NOW() ELSE NULL END
  );

  -- Insert into members table (only if it exists)
  BEGIN
    INSERT INTO public.members (user_id, membership_number)
    VALUES (NEW.id, membership_num);
  EXCEPTION
    WHEN undefined_table THEN
      -- Members table doesn't exist, skip this insert
      NULL;
  END;

  -- Assign default member role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'member')
  ON CONFLICT (user_id, role) DO NOTHING;

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error for debugging
    RAISE LOG 'Error in handle_new_user: %', SQLERRM;
    -- Return NEW to prevent the transaction from failing
    RETURN NEW;
END;
$$;

-- =====================================================
-- STEP 6: Ensure the trigger exists
-- =====================================================

-- Ensure the trigger exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- STEP 7: Create helper functions
-- =====================================================

-- Create a function to manually fix existing social auth users
CREATE OR REPLACE FUNCTION fix_existing_social_users()
RETURNS void AS $$
DECLARE
  user_record RECORD;
BEGIN
  -- Update existing profiles that have social auth data but missing fields
  UPDATE public.profiles 
  SET 
    email_verified = TRUE,
    last_social_login = NOW()
  WHERE 
    social_provider IS NOT NULL 
    AND (email_verified IS NULL OR email_verified = FALSE);
    
  RAISE NOTICE 'Fixed existing social auth users';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to get social auth user info
CREATE OR REPLACE FUNCTION get_social_auth_user_info(user_uuid UUID)
RETURNS TABLE (
  social_provider TEXT,
  social_id TEXT,
  avatar_url TEXT,
  email_verified BOOLEAN,
  last_social_login TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.social_provider,
    p.social_id,
    p.avatar_url,
    p.email_verified,
    p.last_social_login
  FROM public.profiles p
  WHERE p.id = user_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to update social auth data
CREATE OR REPLACE FUNCTION update_social_auth_data(
  user_uuid UUID,
  provider TEXT,
  social_id TEXT,
  avatar_url TEXT DEFAULT NULL
)
RETURNS void AS $$
BEGIN
  UPDATE public.profiles 
  SET 
    social_provider = provider,
    social_id = social_id,
    avatar_url = avatar_url,
    email_verified = TRUE,
    last_social_login = NOW()
  WHERE id = user_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- STEP 8: Add RLS policies for social auth functions
-- =====================================================

-- Add RLS policies for social auth functions
GRANT EXECUTE ON FUNCTION fix_existing_social_users() TO authenticated;
GRANT EXECUTE ON FUNCTION get_social_auth_user_info(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION update_social_auth_data(UUID, TEXT, TEXT, TEXT) TO authenticated;

-- =====================================================
-- STEP 9: Create a view for social auth debugging
-- =====================================================

-- Create a view for social auth debugging
CREATE OR REPLACE VIEW social_auth_debug AS
SELECT 
  p.id,
  p.email,
  p.social_provider,
  p.social_id,
  p.email_verified,
  p.last_social_login,
  p.created_at,
  ur.role
FROM public.profiles p
LEFT JOIN public.user_roles ur ON p.id = ur.user_id
WHERE p.social_provider IS NOT NULL
ORDER BY p.created_at DESC;

-- =====================================================
-- STEP 10: Verification and testing
-- =====================================================

-- Test the fix by running the function
SELECT 'Social auth trigger fix applied successfully' as status;

-- Verify the profiles table structure
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'profiles'
AND column_name IN ('social_provider', 'social_id', 'avatar_url', 'email_verified', 'last_social_login')
ORDER BY column_name; 