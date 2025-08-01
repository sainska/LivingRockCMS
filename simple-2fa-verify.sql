-- Simple 2FA Verification Function - Fix for ambiguous column reference
-- Run this in your Supabase SQL Editor

-- Drop the existing function if it exists
DROP FUNCTION IF EXISTS verify_2fa_code(TEXT, VARCHAR, VARCHAR);

-- Create a simplified verify function
CREATE OR REPLACE FUNCTION verify_2fa_code(
    user_email TEXT,
    verification_code VARCHAR(6),
    method VARCHAR(10) DEFAULT 'email'
)
RETURNS JSON AS $$
DECLARE
    user_profile RECORD;
    code_record RECORD;
    result JSON;
BEGIN
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

    -- Find valid verification code with explicit table aliases
    SELECT tfc.* INTO code_record
    FROM two_factor_codes tfc
    WHERE tfc.user_id = user_profile.id 
        AND tfc.code = verification_code
        AND tfc.method = COALESCE(method, 'email')
        AND tfc.is_valid = true
        AND tfc.expires_at > NOW()
        AND tfc.used_at IS NULL
    ORDER BY tfc.created_at DESC
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

-- Grant permissions
GRANT EXECUTE ON FUNCTION verify_2fa_code(TEXT, VARCHAR, VARCHAR) TO authenticated;

-- Test the function (optional)
-- SELECT verify_2fa_code('test@example.com', '123456', 'email'); 