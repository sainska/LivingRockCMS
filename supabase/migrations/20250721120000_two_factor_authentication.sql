-- Two-Factor Authentication Migration
-- This migration adds 2FA support to the profiles table

-- Add 2FA fields to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS two_factor_enabled BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS two_factor_method VARCHAR(10) DEFAULT 'email' CHECK (two_factor_method IN ('email', 'phone')),
ADD COLUMN IF NOT EXISTS two_factor_secret TEXT,
ADD COLUMN IF NOT EXISTS backup_codes TEXT[];

-- Create function to enable 2FA for a user
CREATE OR REPLACE FUNCTION enable_2fa_for_user(
    user_email TEXT,
    method VARCHAR(10) DEFAULT 'email'
)
RETURNS JSON AS $$
DECLARE
    user_profile RECORD;
    result JSON;
BEGIN
    -- Check if user exists
    SELECT id, email, two_factor_enabled
    INTO user_profile
    FROM profiles
    WHERE email = user_email
    LIMIT 1;

    IF user_profile IS NULL THEN
        result := json_build_object('success', false, 'message', 'User not found');
        RETURN result;
    END IF;

    -- Check if 2FA is already enabled
    IF user_profile.two_factor_enabled = true THEN
        result := json_build_object('success', false, 'message', '2FA is already enabled for this user');
        RETURN result;
    END IF;

    -- Enable 2FA
    UPDATE profiles 
    SET 
        two_factor_enabled = true,
        two_factor_method = method,
        updated_at = NOW()
    WHERE email = user_email;

    result := json_build_object(
        'success', true, 
        'message', '2FA enabled successfully',
        'method', method,
        'user_id', user_profile.id
    );
    
    RETURN result;
EXCEPTION
    WHEN OTHERS THEN
        result := json_build_object('success', false, 'message', 'Database error occurred');
        RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to disable 2FA for a user
CREATE OR REPLACE FUNCTION disable_2fa_for_user(user_email TEXT)
RETURNS JSON AS $$
DECLARE
    user_profile RECORD;
    result JSON;
BEGIN
    -- Check if user exists
    SELECT id, email, two_factor_enabled
    INTO user_profile
    FROM profiles
    WHERE email = user_email
    LIMIT 1;

    IF user_profile IS NULL THEN
        result := json_build_object('success', false, 'message', 'User not found');
        RETURN result;
    END IF;

    -- Check if 2FA is already disabled
    IF user_profile.two_factor_enabled = false THEN
        result := json_build_object('success', false, 'message', '2FA is already disabled for this user');
        RETURN result;
    END IF;

    -- Disable 2FA
    UPDATE profiles 
    SET 
        two_factor_enabled = false,
        two_factor_method = 'email',
        two_factor_secret = NULL,
        backup_codes = NULL,
        updated_at = NOW()
    WHERE email = user_email;

    result := json_build_object(
        'success', true, 
        'message', '2FA disabled successfully',
        'user_id', user_profile.id
    );
    
    RETURN result;
EXCEPTION
    WHEN OTHERS THEN
        result := json_build_object('success', false, 'message', 'Database error occurred');
        RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get 2FA status for a user
CREATE OR REPLACE FUNCTION get_2fa_status(user_email TEXT)
RETURNS JSON AS $$
DECLARE
    user_profile RECORD;
    result JSON;
BEGIN
    -- Get user profile
    SELECT id, email, two_factor_enabled, two_factor_method, phone
    INTO user_profile
    FROM profiles
    WHERE email = user_email
    LIMIT 1;

    IF user_profile IS NULL THEN
        result := json_build_object('success', false, 'message', 'User not found');
        RETURN result;
    END IF;

    result := json_build_object(
        'success', true,
        'user_id', user_profile.id,
        'email', user_profile.email,
        'two_factor_enabled', user_profile.two_factor_enabled,
        'two_factor_method', user_profile.two_factor_method,
        'has_phone', user_profile.phone IS NOT NULL,
        'phone', user_profile.phone
    );
    
    RETURN result;
EXCEPTION
    WHEN OTHERS THEN
        result := json_build_object('success', false, 'message', 'Database error occurred');
        RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant permissions
GRANT EXECUTE ON FUNCTION enable_2fa_for_user(TEXT, VARCHAR) TO authenticated;
GRANT EXECUTE ON FUNCTION disable_2fa_for_user(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION get_2fa_status(TEXT) TO authenticated;

-- Add RLS policies for 2FA functions
CREATE POLICY "Users can manage their own 2FA" ON profiles
    FOR UPDATE USING (auth.email() = email);

CREATE POLICY "Users can view their own 2FA status" ON profiles
    FOR SELECT USING (auth.email() = email);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_2fa_enabled ON profiles(two_factor_enabled);
CREATE INDEX IF NOT EXISTS idx_profiles_email_2fa ON profiles(email, two_factor_enabled); 