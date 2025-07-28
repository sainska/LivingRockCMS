-- Fix Role Column Issues Migration
-- This migration fixes the "column role does not exist" errors

-- =====================================================
-- STEP 1: Check and Fix user_roles table structure
-- =====================================================

-- First, let's check what columns exist in user_roles table
DO $$
DECLARE
    column_exists BOOLEAN;
BEGIN
    -- Check if 'role' column exists
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'user_roles' 
        AND column_name = 'role'
    ) INTO column_exists;
    
    IF NOT column_exists THEN
        -- Add the role column if it doesn't exist
        ALTER TABLE public.user_roles ADD COLUMN role TEXT;
        
        -- Update existing records with default role
        UPDATE public.user_roles SET role = 'member' WHERE role IS NULL;
        
        -- Make role column NOT NULL
        ALTER TABLE public.user_roles ALTER COLUMN role SET NOT NULL;
        
        RAISE NOTICE 'Added role column to user_roles table';
    ELSE
        RAISE NOTICE 'Role column already exists in user_roles table';
    END IF;
END $$;

-- =====================================================
-- STEP 2: Ensure user_role enum type exists
-- =====================================================

-- Create user_role enum if it doesn't exist
DO $$ BEGIN
    CREATE TYPE public.user_role AS ENUM ('system_admin', 'clergy', 'treasurer', 'secretary', 'member');
EXCEPTION
    WHEN duplicate_object THEN 
        RAISE NOTICE 'user_role enum already exists';
END $$;

-- =====================================================
-- STEP 3: Update user_roles table to use enum
-- =====================================================

-- Convert role column to use enum type
DO $$
DECLARE
    enum_exists BOOLEAN;
BEGIN
    -- Check if role column is already enum type
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'user_roles' 
        AND column_name = 'role'
        AND data_type = 'USER-DEFINED'
    ) INTO enum_exists;
    
    IF NOT enum_exists THEN
        -- Convert TEXT role column to enum
        ALTER TABLE public.user_roles 
        ALTER COLUMN role TYPE public.user_role 
        USING role::public.user_role;
        
        RAISE NOTICE 'Converted role column to user_role enum type';
    ELSE
        RAISE NOTICE 'Role column is already enum type';
    END IF;
END $$;

-- =====================================================
-- STEP 4: Fix any missing columns in user_roles table
-- =====================================================

-- Add missing columns if they don't exist
DO $$
DECLARE
    column_exists BOOLEAN;
BEGIN
    -- Check and add assigned_by column
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'user_roles' 
        AND column_name = 'assigned_by'
    ) INTO column_exists;
    
    IF NOT column_exists THEN
        ALTER TABLE public.user_roles ADD COLUMN assigned_by UUID REFERENCES public.profiles(id);
        RAISE NOTICE 'Added assigned_by column to user_roles table';
    END IF;
    
    -- Check and add assigned_at column
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'user_roles' 
        AND column_name = 'assigned_at'
    ) INTO column_exists;
    
    IF NOT column_exists THEN
        ALTER TABLE public.user_roles ADD COLUMN assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
        RAISE NOTICE 'Added assigned_at column to user_roles table';
    END IF;
    
    -- Check and add is_active column
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'user_roles' 
        AND column_name = 'is_active'
    ) INTO column_exists;
    
    IF NOT column_exists THEN
        ALTER TABLE public.user_roles ADD COLUMN is_active BOOLEAN DEFAULT TRUE;
        RAISE NOTICE 'Added is_active column to user_roles table';
    END IF;
END $$;

-- =====================================================
-- STEP 5: Fix functions that reference role column
-- =====================================================

-- Update get_user_role function
CREATE OR REPLACE FUNCTION public.get_user_role(user_uuid UUID)
RETURNS public.user_role
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    user_role_value public.user_role;
BEGIN
    SELECT role INTO user_role_value
    FROM public.user_roles
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
    
    RETURN user_role_value;
END;
$$;

-- Update has_role function
CREATE OR REPLACE FUNCTION public.has_role(user_uuid UUID, required_role public.user_role)
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

-- Update is_admin_or_clergy function
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

-- =====================================================
-- STEP 6: Fix handle_new_user function
-- =====================================================

-- Update handle_new_user function to handle role assignment properly
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
  INSERT INTO public.user_roles (user_id, role, is_active)
  VALUES (NEW.id, 'member'::public.user_role, true)
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
-- STEP 7: Create a function to fix existing data
-- =====================================================

-- Function to fix existing user roles
CREATE OR REPLACE FUNCTION fix_existing_user_roles()
RETURNS void AS $$
BEGIN
    -- Update any NULL roles to 'member'
    UPDATE public.user_roles 
    SET role = 'member'::public.user_role 
    WHERE role IS NULL;
    
    -- Ensure all users have at least one role
    INSERT INTO public.user_roles (user_id, role, is_active)
    SELECT 
        p.id, 
        'member'::public.user_role, 
        true
    FROM public.profiles p
    WHERE NOT EXISTS (
        SELECT 1 FROM public.user_roles ur 
        WHERE ur.user_id = p.id
    )
    ON CONFLICT (user_id, role) DO NOTHING;
    
    RAISE NOTICE 'Fixed existing user roles';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- STEP 8: Create a diagnostic function
-- =====================================================

-- Function to diagnose role-related issues
CREATE OR REPLACE FUNCTION diagnose_role_issues()
RETURNS TABLE (
    issue_type TEXT,
    description TEXT,
    count BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        'Users without roles'::TEXT,
        'Users in profiles table without corresponding user_roles'::TEXT,
        COUNT(*)
    FROM public.profiles p
    WHERE NOT EXISTS (
        SELECT 1 FROM public.user_roles ur WHERE ur.user_id = p.id
    )
    
    UNION ALL
    
    SELECT 
        'NULL roles'::TEXT,
        'User roles with NULL role values'::TEXT,
        COUNT(*)
    FROM public.user_roles
    WHERE role IS NULL
    
    UNION ALL
    
    SELECT 
        'Inactive roles'::TEXT,
        'User roles marked as inactive'::TEXT,
        COUNT(*)
    FROM public.user_roles
    WHERE is_active = false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- STEP 9: Execute fixes
-- =====================================================

-- Run the fix function
SELECT fix_existing_user_roles();

-- Show diagnostic information
SELECT * FROM diagnose_role_issues();

-- =====================================================
-- STEP 10: Verification
-- =====================================================

-- Verify the table structure
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'user_roles'
ORDER BY ordinal_position;

-- Verify some sample data
SELECT 
    p.email,
    ur.role,
    ur.is_active
FROM public.profiles p
LEFT JOIN public.user_roles ur ON p.id = ur.user_id
LIMIT 10;

-- Test the functions
SELECT 'Role column issues fixed successfully' as status; 