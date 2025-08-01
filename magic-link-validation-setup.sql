-- Magic Link Email Validation Setup
-- Run this SQL in your Supabase Dashboard SQL Editor

-- Function to validate email before sending magic link
CREATE OR REPLACE FUNCTION validate_magic_link_email(email_address TEXT)
RETURNS JSON AS $$
DECLARE
    user_profile RECORD;
    result JSON;
BEGIN
    -- Check if email exists in profiles table
    SELECT id, email, is_activated, first_name, last_name
    INTO user_profile
    FROM profiles
    WHERE email = email_address
    LIMIT 1;

    -- If user doesn't exist
    IF user_profile IS NULL THEN
        result := json_build_object(
            'valid', false,
            'exists', false,
            'message', 'No account found with this email address',
            'error_code', 'EMAIL_NOT_FOUND'
        );
        RETURN result;
    END IF;

    -- If user exists but account is not activated
    IF user_profile.is_activated = false THEN
        result := json_build_object(
            'valid', false,
            'exists', true,
            'activated', false,
            'message', 'This account is not yet activated. Please contact an administrator.',
            'error_code', 'ACCOUNT_NOT_ACTIVATED',
            'user_id', user_profile.id
        );
        RETURN result;
    END IF;

    -- If user exists and is activated
    result := json_build_object(
        'valid', true,
        'exists', true,
        'activated', true,
        'message', 'Email validated successfully',
        'user_id', user_profile.id,
        'first_name', user_profile.first_name,
        'last_name', user_profile.last_name
    );
    
    RETURN result;

EXCEPTION
    WHEN OTHERS THEN
        result := json_build_object(
            'valid', false,
            'exists', false,
            'message', 'Database error occurred while validating email',
            'error_code', 'DATABASE_ERROR'
        );
        RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to send magic link only to validated emails
CREATE OR REPLACE FUNCTION send_validated_magic_link(email_address TEXT, allow_signup BOOLEAN DEFAULT FALSE)
RETURNS JSON AS $$
DECLARE
    validation_result JSON;
    result JSON;
BEGIN
    -- If allow_signup is true, skip validation
    IF allow_signup THEN
        result := json_build_object(
            'success', true,
            'message', 'Magic link will be sent (signup allowed)',
            'allow_signup', true
        );
        RETURN result;
    END IF;

    -- Validate email first
    validation_result := validate_magic_link_email(email_address);
    
    -- Check if validation failed
    IF (validation_result->>'valid')::BOOLEAN = false THEN
        result := json_build_object(
            'success', false,
            'message', validation_result->>'message',
            'error_code', validation_result->>'error_code',
            'validation_result', validation_result
        );
        RETURN result;
    END IF;

    -- If validation passed, allow magic link sending
    result := json_build_object(
        'success', true,
        'message', 'Email validated successfully',
        'user_id', validation_result->>'user_id',
        'first_name', validation_result->>'first_name',
        'last_name', validation_result->>'last_name'
    );
    
    RETURN result;

EXCEPTION
    WHEN OTHERS THEN
        result := json_build_object(
            'success', false,
            'message', 'Database error occurred',
            'error_code', 'DATABASE_ERROR'
        );
        RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION validate_magic_link_email(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION send_validated_magic_link(TEXT, BOOLEAN) TO authenticated;

-- Create performance index
CREATE INDEX IF NOT EXISTS idx_profiles_email_activation ON profiles(email, is_activated);

-- Test the functions
SELECT 'Testing validate_magic_link_email with non-existent email:' as test_description;
SELECT validate_magic_link_email('nonexistent@example.com') as result;

SELECT 'Testing validate_magic_link_email with existing email:' as test_description;
SELECT validate_magic_link_email('kogoallan593@gmail.com') as result;

SELECT 'Testing send_validated_magic_link with non-existent email:' as test_description;
SELECT send_validated_magic_link('nonexistent@example.com', false) as result;

SELECT 'Testing send_validated_magic_link with existing email:' as test_description;
SELECT send_validated_magic_link('kogoallan593@gmail.com', false) as result; 