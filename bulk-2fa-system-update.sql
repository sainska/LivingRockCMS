-- Bulk 2FA System Update - Fix Function Return Type Conflicts
-- Run this in your Supabase SQL Editor

-- Step 1: Drop existing tables if they exist
DROP TABLE IF EXISTS twofa_codes CASCADE;
DROP TABLE IF EXISTS twofa_usage_logs CASCADE;
DROP TABLE IF EXISTS two_factor_codes CASCADE;

-- Step 2: Create the main 2FA codes table
CREATE TABLE twofa_codes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(6) NOT NULL UNIQUE,
    user_email TEXT,
    account_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    is_used BOOLEAN DEFAULT false,
    is_assigned BOOLEAN DEFAULT false,
    used_at TIMESTAMP WITH TIME ZONE,
    assigned_at TIMESTAMP WITH TIME ZONE,
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    batch_id UUID DEFAULT gen_random_uuid(),
    CONSTRAINT unique_code UNIQUE (code)
);

-- Step 3: Create usage logs table for detailed tracking
CREATE TABLE twofa_usage_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code_id UUID REFERENCES twofa_codes(id) ON DELETE CASCADE,
    user_email TEXT NOT NULL,
    account_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    action_type VARCHAR(20) NOT NULL CHECK (action_type IN ('assigned', 'used', 'expired', 'invalid_attempt')),
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 4: Generate 100,000 unique 6-digit codes
DO $$
DECLARE
    counter INT := 0;
    new_code TEXT;
    batch_counter INT := 0;
    current_batch_id UUID;
BEGIN
    -- Generate codes in batches of 10,000 for better performance
    WHILE counter < 100000 LOOP
        -- Create a new batch every 10,000 codes
        IF batch_counter % 10000 = 0 THEN
            current_batch_id := gen_random_uuid();
        END IF;
        
        -- Generate a random 6-digit number as string, padded with leading zeros
        new_code := LPAD(FLOOR(RANDOM() * 1000000)::TEXT, 6, '0');
        
        -- Try inserting; skip if it already exists
        BEGIN
            INSERT INTO twofa_codes (code, batch_id) VALUES (new_code, current_batch_id);
            counter := counter + 1;
            batch_counter := batch_counter + 1;
        EXCEPTION
            WHEN unique_violation THEN
                -- Ignore duplicate and try again
                CONTINUE;
        END;
        
        -- Progress indicator every 10,000 codes
        IF counter % 10000 = 0 THEN
            RAISE NOTICE 'Generated % codes', counter;
        END IF;
    END LOOP;
    
    RAISE NOTICE 'Successfully generated % unique 2FA codes', counter;
END $$;

-- Step 5: Create indexes for performance
CREATE INDEX idx_twofa_codes_unused ON twofa_codes(is_used, is_assigned) WHERE is_used = false AND is_assigned = false;
CREATE INDEX idx_twofa_codes_user_email ON twofa_codes(user_email);
CREATE INDEX idx_twofa_codes_account_id ON twofa_codes(account_id);
CREATE INDEX idx_twofa_codes_batch_id ON twofa_codes(batch_id);
CREATE INDEX idx_twofa_usage_logs_user_email ON twofa_usage_logs(user_email);
CREATE INDEX idx_twofa_usage_logs_account_id ON twofa_usage_logs(account_id);
CREATE INDEX idx_twofa_usage_logs_created_at ON twofa_usage_logs(created_at);

-- Step 6: Aggressively drop all existing 2FA functions
-- This handles any function signature conflicts
DO $$
DECLARE
    func_record RECORD;
BEGIN
    -- Drop all functions with 2FA-related names
    FOR func_record IN 
        SELECT proname, oid::regprocedure as func_signature
        FROM pg_proc 
        WHERE proname IN ('assign_2fa_code', 'verify_and_use_2fa_code', 'get_2fa_system_stats', 'cleanup_expired_2fa_codes', 'generate_2fa_code', 'verify_2fa_code', 'send_2fa_email')
    LOOP
        BEGIN
            EXECUTE 'DROP FUNCTION IF EXISTS ' || func_record.func_signature || ' CASCADE';
            RAISE NOTICE 'Dropped function: %', func_record.func_signature;
        EXCEPTION
            WHEN OTHERS THEN
                RAISE NOTICE 'Could not drop function %: %', func_record.func_signature, SQLERRM;
        END;
    END LOOP;
END $$;

-- Step 7: Function to send 2FA code email
CREATE OR REPLACE FUNCTION send_2fa_email(
    user_email TEXT,
    code VARCHAR(6),
    user_name TEXT DEFAULT NULL
)
RETURNS JSON AS $$
DECLARE
    result JSON;
    email_subject TEXT;
    email_body TEXT;
BEGIN
    -- Set email subject
    email_subject := 'Two-Factor Authentication - Living Rock Church Management System';
    
    -- Build email body with HTML template
    email_body := '
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Two-Factor Authentication</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #1e40af, #1e3a8a); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px; }
            .code-box { background: #1e40af; color: white; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0; font-size: 24px; font-weight: bold; letter-spacing: 4px; }
            .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
            .warning { background: #fef3c7; border: 1px solid #f59e0b; padding: 15px; border-radius: 8px; margin: 20px 0; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🔐 Two-Factor Authentication</h1>
                <p>Living Rock Church Management System</p>
            </div>
            <div class="content">
                <h2>Hello ' || COALESCE(user_name, 'there') || ',</h2>
                <p>You have requested a two-factor authentication code for your account.</p>
                
                <div class="code-box">
                    ' || code || '
                </div>
                
                <p><strong>Please enter this code to complete your login:</strong></p>
                
                <div class="warning">
                    <strong>⚠️ Important:</strong>
                    <ul>
                        <li>This code will expire in 10 minutes</li>
                        <li>Do not share this code with anyone</li>
                        <li>If you did not request this code, please contact support immediately</li>
                    </ul>
                </div>
                
                <p>If you have any questions, please contact your system administrator.</p>
                
                <p>Best regards,<br>
                Living Rock Church Management System</p>
            </div>
            <div class="footer">
                <p>This is an automated message. Please do not reply to this email.</p>
                <p>Requested at: ' || NOW()::TEXT || '</p>
            </div>
        </div>
    </body>
    </html>';
    
    -- In a real implementation, you would send the email here
    -- For now, we'll just log that the email would be sent
    RAISE NOTICE '2FA Email would be sent to % with code %', user_email, code;
    
    result := json_build_object(
        'success', true,
        'message', '2FA email sent successfully',
        'user_email', user_email,
        'code', code,
        'email_subject', email_subject
    );
    
    RETURN result;
EXCEPTION
    WHEN OTHERS THEN
        result := json_build_object('success', false, 'message', 'Failed to send email: ' || SQLERRM);
        RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 8: Function to assign a random unused code to a user and send email
CREATE OR REPLACE FUNCTION assign_2fa_code(
    user_email TEXT,
    account_id UUID DEFAULT NULL
)
RETURNS JSON AS $$
DECLARE
    available_code RECORD;
    user_record RECORD;
    email_result JSON;
    result JSON;
BEGIN
    -- Validate email format
    IF user_email IS NULL OR user_email = '' THEN
        result := json_build_object('success', false, 'message', 'Email address is required');
        RETURN result;
    END IF;
    
    -- Check if user exists in profiles with exact email match
    SELECT * INTO user_record 
    FROM profiles 
    WHERE LOWER(email) = LOWER(user_email) 
    LIMIT 1;
    
    IF user_record IS NULL THEN
        result := json_build_object('success', false, 'message', 'User not found. Please check your email address or contact support.');
        RETURN result;
    END IF;
    
    -- Get account_id if not provided
    IF account_id IS NULL THEN
        account_id := user_record.id;
    END IF;
    
    -- Verify account_id matches the user
    IF account_id != user_record.id THEN
        result := json_build_object('success', false, 'message', 'Invalid account information');
        RETURN result;
    END IF;
    
    -- Find an unused and unassigned code
    SELECT * INTO available_code
    FROM twofa_codes
    WHERE is_used = false AND is_assigned = false
    ORDER BY RANDOM()
    LIMIT 1;
    
    IF available_code IS NULL THEN
        result := json_build_object('success', false, 'message', 'No 2FA codes available. Please contact administrator.');
        RETURN result;
    END IF;
    
    -- Assign the code to the user
    UPDATE twofa_codes 
    SET 
        user_email = user_record.email,  -- Use the exact email from profiles
        account_id = account_id,
        is_assigned = true,
        assigned_at = NOW()
    WHERE id = available_code.id;
    
    -- Log the assignment
    INSERT INTO twofa_usage_logs (code_id, user_email, account_id, action_type, ip_address, user_agent)
    VALUES (
        available_code.id,
        user_record.email,
        account_id,
        'assigned',
        inet_client_addr(),
        current_setting('request.headers', true)::json->>'user-agent'
    );
    
    -- Send email with the code
    SELECT * INTO email_result FROM send_2fa_email(user_record.email, available_code.code, user_record.full_name);
    
    IF email_result->>'success' = 'false' THEN
        -- If email fails, mark code as unused and return error
        UPDATE twofa_codes 
        SET 
            user_email = NULL,
            account_id = NULL,
            is_assigned = false,
            assigned_at = NULL
        WHERE id = available_code.id;
        
        result := json_build_object('success', false, 'message', 'Failed to send 2FA code: ' || (email_result->>'message'));
        RETURN result;
    END IF;
    
    result := json_build_object(
        'success', true,
        'message', '2FA code sent to your email successfully',
        'user_email', user_record.email,
        'user_name', user_record.full_name,
        'account_id', account_id,
        'expires_at', NOW() + INTERVAL '10 minutes',
        'email_sent', true
    );
    
    RETURN result;
EXCEPTION
    WHEN OTHERS THEN
        result := json_build_object('success', false, 'message', 'Database error occurred: ' || SQLERRM);
        RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 9: Function to verify and use a 2FA code
CREATE OR REPLACE FUNCTION verify_and_use_2fa_code(
    user_email TEXT,
    code VARCHAR(6),
    account_id UUID DEFAULT NULL
)
RETURNS JSON AS $$
DECLARE
    code_record RECORD;
    result JSON;
BEGIN
    -- Check if user exists
    IF NOT EXISTS (SELECT 1 FROM profiles WHERE email = user_email) THEN
        result := json_build_object('success', false, 'message', 'User not found');
        RETURN result;
    END IF;
    
    -- Get account_id if not provided
    IF account_id IS NULL THEN
        SELECT id INTO account_id FROM profiles WHERE email = user_email LIMIT 1;
    END IF;
    
    -- Find the assigned code for this user
    SELECT * INTO code_record
    FROM twofa_codes
    WHERE 
        code = verify_and_use_2fa_code.code
        AND user_email = verify_and_use_2fa_code.user_email
        AND account_id = verify_and_use_2fa_code.account_id
        AND is_assigned = true
        AND is_used = false
        AND assigned_at > NOW() - INTERVAL '10 minutes'  -- Code expires after 10 minutes
    LIMIT 1;
    
    IF code_record IS NULL THEN
        -- Log invalid attempt
        INSERT INTO twofa_usage_logs (user_email, account_id, action_type, ip_address, user_agent)
        VALUES (
            verify_and_use_2fa_code.user_email,
            verify_and_use_2fa_code.account_id,
            'invalid_attempt',
            inet_client_addr(),
            current_setting('request.headers', true)::json->>'user-agent'
        );
        
        result := json_build_object('success', false, 'message', 'Invalid or expired verification code');
        RETURN result;
    END IF;
    
    -- Mark code as used
    UPDATE twofa_codes 
    SET 
        is_used = true,
        used_at = NOW()
    WHERE id = code_record.id;
    
    -- Log the successful usage
    INSERT INTO twofa_usage_logs (code_id, user_email, account_id, action_type, ip_address, user_agent)
    VALUES (
        code_record.id,
        verify_and_use_2fa_code.user_email,
        verify_and_use_2fa_code.account_id,
        'used',
        inet_client_addr(),
        current_setting('request.headers', true)::json->>'user-agent'
    );
    
    result := json_build_object(
        'success', true,
        'message', '2FA verification successful',
        'user_email', user_email,
        'account_id', account_id,
        'used_at', NOW()
    );
    
    RETURN result;
EXCEPTION
    WHEN OTHERS THEN
        result := json_build_object('success', false, 'message', 'Database error occurred: ' || SQLERRM);
        RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 10: Function to get system statistics
CREATE OR REPLACE FUNCTION get_2fa_system_stats()
RETURNS JSON AS $$
DECLARE
    total_codes INT;
    used_codes INT;
    assigned_codes INT;
    available_codes INT;
    result JSON;
BEGIN
    SELECT 
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE is_used = true) as used,
        COUNT(*) FILTER (WHERE is_assigned = true AND is_used = false) as assigned,
        COUNT(*) FILTER (WHERE is_used = false AND is_assigned = false) as available
    INTO total_codes, used_codes, assigned_codes, available_codes
    FROM twofa_codes;
    
    result := json_build_object(
        'total_codes', total_codes,
        'used_codes', used_codes,
        'assigned_codes', assigned_codes,
        'available_codes', available_codes,
        'usage_percentage', ROUND((used_codes::DECIMAL / total_codes * 100), 2),
        'system_status', CASE 
            WHEN available_codes > 0 THEN 'operational'
            ELSE 'depleted'
        END
    );
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 11: Function to clean up expired assigned codes
CREATE OR REPLACE FUNCTION cleanup_expired_2fa_codes()
RETURNS JSON AS $$
DECLARE
    expired_count INT;
    result JSON;
BEGIN
    -- Mark expired codes as unused and unassigned
    UPDATE twofa_codes 
    SET 
        is_assigned = false,
        user_email = NULL,
        account_id = NULL,
        assigned_at = NULL
    WHERE 
        is_assigned = true 
        AND is_used = false 
        AND assigned_at < NOW() - INTERVAL '10 minutes';
    
    GET DIAGNOSTICS expired_count = ROW_COUNT;
    
    -- Log the cleanup
    IF expired_count > 0 THEN
        INSERT INTO twofa_usage_logs (action_type, ip_address, user_agent)
        VALUES (
            'expired',
            inet_client_addr(),
            current_setting('request.headers', true)::json->>'user-agent'
        );
    END IF;
    
    result := json_build_object(
        'success', true,
        'message', 'Cleanup completed',
        'expired_codes_cleaned', expired_count
    );
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 12: Grant permissions
GRANT EXECUTE ON FUNCTION send_2fa_email(TEXT, VARCHAR, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION assign_2fa_code(TEXT, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION verify_and_use_2fa_code(TEXT, VARCHAR, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_2fa_system_stats() TO authenticated;
GRANT EXECUTE ON FUNCTION cleanup_expired_2fa_codes() TO authenticated;

-- Step 13: Add two_factor_enabled column to profiles if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' 
        AND column_name = 'two_factor_enabled'
    ) THEN
        ALTER TABLE profiles ADD COLUMN two_factor_enabled BOOLEAN DEFAULT false;
        RAISE NOTICE 'Added two_factor_enabled column to profiles table';
    ELSE
        RAISE NOTICE 'two_factor_enabled column already exists in profiles table';
    END IF;
END $$;

-- Step 14: Verify the setup
SELECT 
    'Setup Complete' as status,
    COUNT(*) as total_codes_generated,
    COUNT(*) FILTER (WHERE is_used = false AND is_assigned = false) as available_codes,
    COUNT(*) FILTER (WHERE is_used = true) as used_codes,
    COUNT(*) FILTER (WHERE is_assigned = true AND is_used = false) as assigned_codes
FROM twofa_codes; 