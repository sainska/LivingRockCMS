-- Complete 2FA Fix - Run this in your Supabase SQL Editor
-- This fixes the "null value in column method" error

-- Step 1: Drop and recreate the two_factor_codes table with proper constraints
DROP TABLE IF EXISTS two_factor_codes CASCADE;

CREATE TABLE two_factor_codes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    code VARCHAR(6) NOT NULL,
    method VARCHAR(10) NOT NULL DEFAULT 'email' CHECK (method IN ('email', 'phone')),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    used_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ip_address INET,
    user_agent TEXT,
    is_valid BOOLEAN DEFAULT true
);

-- Step 2: Create a robust generate_2fa_code function
CREATE OR REPLACE FUNCTION generate_2fa_code(
    user_email TEXT,
    method VARCHAR(10) DEFAULT 'email'
)
RETURNS JSON AS $$
DECLARE
    user_profile RECORD;
    verification_code VARCHAR(6);
    result JSON;
    method_to_use VARCHAR(10);
BEGIN
    -- Validate and set method with proper defaults
    IF method IS NULL OR method = '' OR method NOT IN ('email', 'phone') THEN
        method_to_use := 'email';
    ELSE
        method_to_use := method;
    END IF;

    -- Check if user exists
    SELECT id, email, two_factor_enabled, two_factor_method, phone
    INTO user_profile
    FROM profiles
    WHERE email = user_email
    LIMIT 1;

    IF user_profile IS NULL THEN
        result := json_build_object('success', false, 'message', 'User not found');
        RETURN result;
    END IF;

    -- Generate 6-digit verification code
    verification_code := LPAD(FLOOR(RANDOM() * 1000000)::TEXT, 6, '0');

    -- Invalidate any existing codes for this user
    UPDATE two_factor_codes 
    SET is_valid = false 
    WHERE user_id = user_profile.id AND is_valid = true;

    -- Insert new verification code with explicit method value
    INSERT INTO two_factor_codes (user_id, code, method, expires_at, ip_address, user_agent)
    VALUES (
        user_profile.id,
        verification_code,
        method_to_use,  -- Explicit method value
        NOW() + INTERVAL '10 minutes',
        inet_client_addr(),
        current_setting('request.headers', true)::json->>'user-agent'
    );

    result := json_build_object(
        'success', true,
        'message', '2FA code generated successfully',
        'code', verification_code,
        'expires_at', NOW() + INTERVAL '10 minutes',
        'method', method_to_use,
        'user_id', user_profile.id
    );
    
    RETURN result;
EXCEPTION
    WHEN OTHERS THEN
        result := json_build_object('success', false, 'message', 'Database error occurred: ' || SQLERRM);
        RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 3: Create a robust verify_2fa_code function
CREATE OR REPLACE FUNCTION verify_2fa_code(
    user_email TEXT,
    code VARCHAR(6),
    method VARCHAR(10) DEFAULT 'email'
)
RETURNS JSON AS $$
DECLARE
    user_profile RECORD;
    code_record RECORD;
    result JSON;
    method_to_use VARCHAR(10);
BEGIN
    -- Validate and set method with proper defaults
    IF method IS NULL OR method = '' OR method NOT IN ('email', 'phone') THEN
        method_to_use := 'email';
    ELSE
        method_to_use := method;
    END IF;

    -- Check if user exists
    SELECT id, email, two_factor_enabled, two_factor_method
    INTO user_profile
    FROM profiles
    WHERE email = user_email
    LIMIT 1;

    IF user_profile IS NULL THEN
        result := json_build_object('success', false, 'message', 'User not found');
        RETURN result;
    END IF;

    -- Find valid verification code
    SELECT * INTO code_record
    FROM two_factor_codes
    WHERE user_id = user_profile.id 
        AND code = verify_2fa_code.code
        AND method = method_to_use  -- Use validated method
        AND is_valid = true
        AND expires_at > NOW()
        AND used_at IS NULL
    ORDER BY created_at DESC
    LIMIT 1;

    IF code_record IS NULL THEN
        result := json_build_object('success', false, 'message', 'Invalid or expired verification code');
        RETURN result;
    END IF;

    -- Mark code as used
    UPDATE two_factor_codes 
    SET used_at = NOW() 
    WHERE id = code_record.id;

    result := json_build_object(
        'success', true,
        'message', '2FA verification successful',
        'user_id', user_profile.id
    );
    
    RETURN result;
EXCEPTION
    WHEN OTHERS THEN
        result := json_build_object('success', false, 'message', 'Database error occurred: ' || SQLERRM);
        RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 4: Grant permissions
GRANT EXECUTE ON FUNCTION generate_2fa_code(TEXT, VARCHAR) TO authenticated;
GRANT EXECUTE ON FUNCTION verify_2fa_code(TEXT, VARCHAR, VARCHAR) TO authenticated;

-- Step 5: Create indexes for performance
CREATE INDEX idx_profiles_2fa_enabled ON profiles(two_factor_enabled);
CREATE INDEX idx_profiles_email_2fa ON profiles(email, two_factor_enabled);
CREATE INDEX idx_two_factor_codes_user_id ON two_factor_codes(user_id);
CREATE INDEX idx_two_factor_codes_expires_at ON two_factor_codes(expires_at);
CREATE INDEX idx_two_factor_codes_valid ON two_factor_codes(is_valid, expires_at);
CREATE INDEX idx_two_factor_codes_method ON two_factor_codes(method);

-- Step 6: Add 2FA columns to profiles if they don't exist
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS two_factor_enabled BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS two_factor_method VARCHAR(10) DEFAULT 'email' CHECK (two_factor_method IN ('email', 'phone')),
ADD COLUMN IF NOT EXISTS two_factor_secret TEXT,
ADD COLUMN IF NOT EXISTS backup_codes TEXT[],
ADD COLUMN IF NOT EXISTS last_2fa_attempt TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS failed_2fa_attempts INTEGER DEFAULT 0;

-- Step 7: Test the functions (optional - you can run this to verify)
-- SELECT generate_2fa_code('test@example.com', 'email'); 