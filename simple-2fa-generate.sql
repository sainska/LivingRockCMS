-- Simple 2FA Code Generation Function
-- Run this in your Supabase SQL Editor

-- Drop the existing function if it exists
DROP FUNCTION IF EXISTS generate_2fa_code(TEXT, VARCHAR);

-- Create a simplified generate function
CREATE OR REPLACE FUNCTION generate_2fa_code(
    user_email TEXT,
    method VARCHAR(10) DEFAULT 'email'
)
RETURNS JSON AS $$
DECLARE
    user_profile RECORD;
    verification_code VARCHAR(6);
    result JSON;
BEGIN
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

    -- Insert new verification code
    INSERT INTO two_factor_codes (user_id, code, method, expires_at, ip_address, user_agent)
    VALUES (
        user_profile.id,
        verification_code,
        COALESCE(method, 'email'),
        NOW() + INTERVAL '10 minutes',
        inet_client_addr(),
        current_setting('request.headers', true)::json->>'user-agent'
    );

    result := json_build_object(
        'success', true,
        'message', '2FA code generated successfully',
        'code', verification_code,
        'expires_at', NOW() + INTERVAL '10 minutes',
        'method', COALESCE(method, 'email'),
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
GRANT EXECUTE ON FUNCTION generate_2fa_code(TEXT, VARCHAR) TO authenticated;

-- Test the function (optional)
-- SELECT generate_2fa_code('test@example.com', 'email'); 