-- Bulk 2FA System with 100,000 Pre-generated Codes
-- Run this in your Supabase SQL Editor

-- Step 1: Drop existing tables if they exist
DROP TABLE IF EXISTS twofa_codes CASCADE;
DROP TABLE IF EXISTS twofa_usage_logs CASCADE;

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

-- Step 6: Drop existing functions first to avoid return type conflicts
-- Drop all existing 2FA functions to avoid signature conflicts
DROP FUNCTION IF EXISTS assign_2fa_code(TEXT, UUID) CASCADE;
DROP FUNCTION IF EXISTS assign_2fa_code(TEXT) CASCADE;
DROP FUNCTION IF EXISTS verify_and_use_2fa_code(TEXT, VARCHAR, UUID) CASCADE;
DROP FUNCTION IF EXISTS verify_and_use_2fa_code(TEXT, VARCHAR) CASCADE;
DROP FUNCTION IF EXISTS get_2fa_system_stats() CASCADE;
DROP FUNCTION IF EXISTS cleanup_expired_2fa_codes() CASCADE;
DROP FUNCTION IF EXISTS cleanup_expired_2fa_codes(VOID) CASCADE;

-- Alternative: Drop all functions with these names (more aggressive approach)
-- This will remove any existing functions with these names regardless of signature
DO $$
BEGIN
    -- Drop assign_2fa_code functions
    DROP FUNCTION IF EXISTS assign_2fa_code(TEXT, UUID);
    DROP FUNCTION IF EXISTS assign_2fa_code(TEXT);
    EXCEPTION WHEN OTHERS THEN NULL;
END $$;

DO $$
BEGIN
    -- Drop verify_and_use_2fa_code functions
    DROP FUNCTION IF EXISTS verify_and_use_2fa_code(TEXT, VARCHAR, UUID);
    DROP FUNCTION IF EXISTS verify_and_use_2fa_code(TEXT, VARCHAR);
    EXCEPTION WHEN OTHERS THEN NULL;
END $$;

DO $$
BEGIN
    -- Drop get_2fa_system_stats functions
    DROP FUNCTION IF EXISTS get_2fa_system_stats();
    EXCEPTION WHEN OTHERS THEN NULL;
END $$;

DO $$
BEGIN
    -- Drop cleanup_expired_2fa_codes functions
    DROP FUNCTION IF EXISTS cleanup_expired_2fa_codes();
    DROP FUNCTION IF EXISTS cleanup_expired_2fa_codes(VOID);
    EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- Step 7: Function to assign a random unused code to a user
CREATE OR REPLACE FUNCTION assign_2fa_code(
    user_email TEXT,
    account_id UUID DEFAULT NULL
)
RETURNS JSON AS $$
DECLARE
    available_code RECORD;
    result JSON;
BEGIN
    -- Check if user exists in profiles
    IF NOT EXISTS (SELECT 1 FROM profiles WHERE email = user_email) THEN
        result := json_build_object('success', false, 'message', 'User not found');
        RETURN result;
    END IF;
    
    -- Get account_id if not provided
    IF account_id IS NULL THEN
        SELECT id INTO account_id FROM profiles WHERE email = user_email LIMIT 1;
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
        user_email = assign_2fa_code.user_email,
        account_id = assign_2fa_code.account_id,
        is_assigned = true,
        assigned_at = NOW()
    WHERE id = available_code.id;
    
    -- Log the assignment
    INSERT INTO twofa_usage_logs (code_id, user_email, account_id, action_type, ip_address, user_agent)
    VALUES (
        available_code.id,
        assign_2fa_code.user_email,
        assign_2fa_code.account_id,
        'assigned',
        inet_client_addr(),
        current_setting('request.headers', true)::json->>'user-agent'
    );
    
    result := json_build_object(
        'success', true,
        'message', '2FA code assigned successfully',
        'code', available_code.code,
        'user_email', user_email,
        'account_id', account_id,
        'expires_at', NOW() + INTERVAL '10 minutes'
    );
    
    RETURN result;
EXCEPTION
    WHEN OTHERS THEN
        result := json_build_object('success', false, 'message', 'Database error occurred: ' || SQLERRM);
        RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 8: Function to verify and use a 2FA code
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

-- Step 9: Function to get system statistics
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

-- Step 10: Function to clean up expired assigned codes
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

-- Step 11: Grant permissions
GRANT EXECUTE ON FUNCTION assign_2fa_code(TEXT, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION verify_and_use_2fa_code(TEXT, VARCHAR, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_2fa_system_stats() TO authenticated;
GRANT EXECUTE ON FUNCTION cleanup_expired_2fa_codes() TO authenticated;

-- Step 12: Create a scheduled job to clean up expired codes (optional)
-- This would need to be set up in your Supabase dashboard under Database > Functions
-- You can call cleanup_expired_2fa_codes() every 5 minutes

-- Step 13: Verify the setup
SELECT 
    'Setup Complete' as status,
    COUNT(*) as total_codes_generated,
    COUNT(*) FILTER (WHERE is_used = false AND is_assigned = false) as available_codes
FROM twofa_codes; 