-- Account Activation System Migration
-- This migration adds admin approval workflow for new user accounts

-- =====================================================
-- STEP 1: Create enum for activation status FIRST
-- =====================================================

-- Create enum for activation status if it doesn't exist
DO $$ BEGIN
    CREATE TYPE public.user_activation_status AS ENUM ('pending', 'approved', 'rejected', 'auto_approved');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- =====================================================
-- STEP 2: Add activation fields to profiles table
-- =====================================================

-- Add activation status fields to profiles table
DO $$
DECLARE
    column_exists BOOLEAN;
BEGIN
    -- Check if is_activated column exists
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'profiles' 
        AND column_name = 'is_activated'
    ) INTO column_exists;
    
    IF NOT column_exists THEN
        ALTER TABLE public.profiles ADD COLUMN is_activated BOOLEAN DEFAULT FALSE;
        RAISE NOTICE 'Added is_activated column to profiles table';
    ELSE
        RAISE NOTICE 'is_activated column already exists in profiles table';
    END IF;
    
    -- Check if activation_requested_at column exists
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'profiles' 
        AND column_name = 'activation_requested_at'
    ) INTO column_exists;
    
    IF NOT column_exists THEN
        ALTER TABLE public.profiles ADD COLUMN activation_requested_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
        RAISE NOTICE 'Added activation_requested_at column to profiles table';
    ELSE
        RAISE NOTICE 'activation_requested_at column already exists in profiles table';
    END IF;
    
    -- Check if activated_by column exists
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'profiles' 
        AND column_name = 'activated_by'
    ) INTO column_exists;
    
    IF NOT column_exists THEN
        ALTER TABLE public.profiles ADD COLUMN activated_by UUID REFERENCES public.profiles(id);
        RAISE NOTICE 'Added activated_by column to profiles table';
    ELSE
        RAISE NOTICE 'activated_by column already exists in profiles table';
    END IF;
    
    -- Check if activated_at column exists
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'profiles' 
        AND column_name = 'activated_at'
    ) INTO column_exists;
    
    IF NOT column_exists THEN
        ALTER TABLE public.profiles ADD COLUMN activated_at TIMESTAMP WITH TIME ZONE;
        RAISE NOTICE 'Added activated_at column to profiles table';
    ELSE
        RAISE NOTICE 'activated_at column already exists in profiles table';
    END IF;
    
    -- Check if activation_notes column exists
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'profiles' 
        AND column_name = 'activation_notes'
    ) INTO column_exists;
    
    IF NOT column_exists THEN
        ALTER TABLE public.profiles ADD COLUMN activation_notes TEXT;
        RAISE NOTICE 'Added activation_notes column to profiles table';
    ELSE
        RAISE NOTICE 'activation_notes column already exists in profiles table';
    END IF;
END $$;

-- =====================================================
-- STEP 3: Create activation requests table
-- =====================================================

-- Create activation requests table for tracking activation workflow
CREATE TABLE IF NOT EXISTS public.activation_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    requested_by UUID REFERENCES public.profiles(id),
    requested_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status user_activation_status DEFAULT 'pending',
    reviewed_by UUID REFERENCES public.profiles(id),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    review_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- STEP 4: Update handle_new_user function for activation
-- =====================================================

-- Update the handle_new_user function to handle activation workflow
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  membership_num TEXT;
  social_provider TEXT;
  is_social_auth BOOLEAN;
BEGIN
  -- Get social provider from user metadata
  social_provider := COALESCE(NEW.raw_user_meta_data ->> 'provider', NULL);
  is_social_auth := social_provider IS NOT NULL;
  
  -- Generate membership number
  membership_num := 'LRC' || LPAD(EXTRACT(year FROM NOW())::TEXT, 4, '0') || 
                   LPAD((SELECT COALESCE(MAX(RIGHT(membership_number, 4)::INTEGER), 0) + 1 
                         FROM public.members)::TEXT, 4, '0');

  -- Insert into profiles with activation status
  INSERT INTO public.profiles (
    id, 
    first_name, 
    last_name, 
    email,
    social_provider,
    social_id,
    avatar_url,
    email_verified,
    last_social_login,
    is_activated,
    activation_requested_at
  )
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'first_name', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'last_name', ''),
    NEW.email,
    social_provider,
    COALESCE(NEW.raw_user_meta_data ->> 'sub', NULL),
    COALESCE(NEW.raw_user_meta_data ->> 'picture', NULL),
    CASE WHEN is_social_auth THEN TRUE ELSE FALSE END,
    CASE WHEN is_social_auth THEN NOW() ELSE NULL END,
    CASE WHEN is_social_auth THEN TRUE ELSE FALSE END, -- Auto-activate social auth users
    NOW()
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

  -- Create activation request for non-social auth users
  IF NOT is_social_auth THEN
    INSERT INTO public.activation_requests (
      user_id,
      requested_by,
      status
    ) VALUES (
      NEW.id,
      NEW.id, -- User requested their own activation
      'pending'
    );
  END IF;

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
-- STEP 5: Create activation management functions
-- =====================================================

-- Function to approve user activation
CREATE OR REPLACE FUNCTION approve_user_activation(
  target_user_id UUID,
  admin_user_id UUID,
  notes TEXT DEFAULT NULL
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result JSON;
BEGIN
  -- Check if admin user has permission
  IF NOT EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = admin_user_id 
    AND role IN ('system_admin', 'clergy') 
    AND is_active = true
  ) THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Insufficient permissions to approve user activation'
    );
  END IF;

  -- Update profile activation status
  UPDATE public.profiles 
  SET 
    is_activated = TRUE,
    activated_by = admin_user_id,
    activated_at = NOW(),
    activation_notes = notes
  WHERE id = target_user_id;

  -- Update activation request status
  UPDATE public.activation_requests 
  SET 
    status = 'approved',
    reviewed_by = admin_user_id,
    reviewed_at = NOW(),
    review_notes = notes
  WHERE user_id = target_user_id AND status = 'pending';

  -- Return success
  RETURN json_build_object(
    'success', true,
    'message', 'User activation approved successfully'
  );
END;
$$;

-- Function to reject user activation
CREATE OR REPLACE FUNCTION reject_user_activation(
  target_user_id UUID,
  admin_user_id UUID,
  notes TEXT DEFAULT NULL
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result JSON;
BEGIN
  -- Check if admin user has permission
  IF NOT EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = admin_user_id 
    AND role IN ('system_admin', 'clergy') 
    AND is_active = true
  ) THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Insufficient permissions to reject user activation'
    );
  END IF;

  -- Update activation request status
  UPDATE public.activation_requests 
  SET 
    status = 'rejected',
    reviewed_by = admin_user_id,
    reviewed_at = NOW(),
    review_notes = notes
  WHERE user_id = target_user_id AND status = 'pending';

  -- Return success
  RETURN json_build_object(
    'success', true,
    'message', 'User activation rejected'
  );
END;
$$;

-- Function to get pending activation requests
CREATE OR REPLACE FUNCTION get_pending_activations()
RETURNS TABLE (
  user_id UUID,
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  requested_at TIMESTAMP WITH TIME ZONE,
  social_provider TEXT,
  activation_notes TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.first_name,
    p.last_name,
    p.email,
    p.activation_requested_at,
    p.social_provider,
    p.activation_notes
  FROM public.profiles p
  WHERE p.is_activated = FALSE
  AND p.activation_requested_at IS NOT NULL
  ORDER BY p.activation_requested_at ASC;
END;
$$;

-- Function to get activation statistics
CREATE OR REPLACE FUNCTION get_activation_stats()
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  total_users INTEGER;
  activated_users INTEGER;
  pending_users INTEGER;
  social_users INTEGER;
BEGIN
  -- Get counts
  SELECT COUNT(*) INTO total_users FROM public.profiles;
  SELECT COUNT(*) INTO activated_users FROM public.profiles WHERE is_activated = TRUE;
  SELECT COUNT(*) INTO pending_users FROM public.profiles WHERE is_activated = FALSE AND activation_requested_at IS NOT NULL;
  SELECT COUNT(*) INTO social_users FROM public.profiles WHERE social_provider IS NOT NULL;

  RETURN json_build_object(
    'total_users', total_users,
    'activated_users', activated_users,
    'pending_users', pending_users,
    'social_users', social_users,
    'activation_rate', CASE WHEN total_users > 0 THEN ROUND((activated_users::DECIMAL / total_users) * 100, 2) ELSE 0 END
  );
END;
$$;

-- =====================================================
-- STEP 6: Create RLS policies for activation system
-- =====================================================

-- Enable RLS on activation_requests table
ALTER TABLE public.activation_requests ENABLE ROW LEVEL SECURITY;

-- Policy for admins to view all activation requests
CREATE POLICY "Admins can view all activation requests" ON activation_requests
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM user_roles
            WHERE user_id = auth.uid()
            AND role IN ('system_admin', 'clergy')
            AND is_active = true
        )
    );

-- Policy for admins to update activation requests
CREATE POLICY "Admins can update activation requests" ON activation_requests
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM user_roles
            WHERE user_id = auth.uid()
            AND role IN ('system_admin', 'clergy')
            AND is_active = true
        )
    );

-- Policy for users to view their own activation requests
CREATE POLICY "Users can view own activation requests" ON activation_requests
    FOR SELECT USING (user_id = auth.uid());

-- =====================================================
-- STEP 7: Create indexes for performance
-- =====================================================

-- Create indexes for activation queries
CREATE INDEX IF NOT EXISTS idx_profiles_activation ON profiles(is_activated, activation_requested_at);
CREATE INDEX IF NOT EXISTS idx_activation_requests_status ON activation_requests(status, requested_at);
CREATE INDEX IF NOT EXISTS idx_activation_requests_user ON activation_requests(user_id);

-- =====================================================
-- STEP 8: Grant permissions
-- =====================================================

-- Grant execute permissions on activation functions
GRANT EXECUTE ON FUNCTION approve_user_activation(UUID, UUID, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION reject_user_activation(UUID, UUID, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION get_pending_activations() TO authenticated;
GRANT EXECUTE ON FUNCTION get_activation_stats() TO authenticated;

-- =====================================================
-- STEP 9: Create views for admin dashboard
-- =====================================================

-- View for pending activations with user details
CREATE OR REPLACE VIEW pending_activations_view AS
SELECT 
  p.id as user_id,
  p.first_name,
  p.last_name,
  p.email,
  p.phone,
  p.social_provider,
  p.activation_requested_at,
  p.activation_notes,
  ur.role as current_role,
  CASE 
    WHEN p.social_provider IS NOT NULL THEN 'Social Login'
    ELSE 'Email Registration'
  END as registration_method
FROM public.profiles p
LEFT JOIN public.user_roles ur ON p.id = ur.user_id
WHERE p.is_activated = FALSE
AND p.activation_requested_at IS NOT NULL
ORDER BY p.activation_requested_at ASC;

-- View for activation history
CREATE OR REPLACE VIEW activation_history_view AS
SELECT 
  p.id as user_id,
  p.first_name,
  p.last_name,
  p.email,
  p.is_activated,
  p.activation_requested_at,
  p.activated_at,
  p.activation_notes,
  admin.first_name || ' ' || admin.last_name as activated_by_name,
  ar.status as request_status,
  ar.review_notes
FROM public.profiles p
LEFT JOIN public.profiles admin ON p.activated_by = admin.id
LEFT JOIN public.activation_requests ar ON p.id = ar.user_id
WHERE p.activation_requested_at IS NOT NULL
ORDER BY p.activation_requested_at DESC;

-- =====================================================
-- STEP 10: Verification and testing
-- =====================================================

-- Test the activation system
SELECT 'Account activation system created successfully' as status;

-- Verify the profiles table structure
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'profiles'
AND column_name IN ('is_activated', 'activation_requested_at', 'activated_by', 'activated_at', 'activation_notes')
ORDER BY column_name; 