-- Fix for 2FA method column null constraint violation
-- Run this in your Supabase SQL Editor

-- Step 1: Update the generate_2fa_code function to handle method parameter properly
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
    -- Validate and set method
    IF method IS NULL OR method = '' THEN
        method_to_use := 'email';
    ELSE
        method_to_use := method;
    END IF;
    
    -- Ensure method is valid
    IF method_to_use NOT IN ('email', 'phone') THEN
        method_to_use := 'email';
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
        method_to_use,  -- Use the validated method
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

-- Step 2: Update the verify_2fa_code function to handle method parameter properly
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
    -- Validate and set method
    IF method IS NULL OR method = '' THEN
        method_to_use := 'email';
    ELSE
        method_to_use := method;
    END IF;
    
    -- Ensure method is valid
    IF method_to_use NOT IN ('email', 'phone') THEN
        method_to_use := 'email';
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
        AND method = method_to_use  -- Use the validated method
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

-- Step 3: Clean up any existing invalid records (optional)
DELETE FROM two_factor_codes WHERE method IS NULL;

-- Step 4: Verify the functions are updated
SELECT 
    proname as function_name,
    prosrc as function_source
FROM pg_proc 
WHERE proname IN ('generate_2fa_code', 'verify_2fa_code'); 