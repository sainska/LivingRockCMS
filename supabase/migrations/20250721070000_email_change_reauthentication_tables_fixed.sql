-- Migration: Email Change and Reauthentication Tables (FIXED)
-- Description: Creates tables for managing email change requests and reauthentication requests
-- Date: 2025-07-21
-- Fixed: Corrected role column reference in RLS policies

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Email Change Requests Table
CREATE TABLE IF NOT EXISTS email_change_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    old_email TEXT NOT NULL,
    new_email TEXT NOT NULL,
    confirmation_token TEXT NOT NULL UNIQUE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'expired', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    confirmed_at TIMESTAMP WITH TIME ZONE,
    cancelled_at TIMESTAMP WITH TIME ZONE,
    cancelled_by UUID REFERENCES auth.users(id),
    cancellation_reason TEXT
);

-- Reauthentication Requests Table
CREATE TABLE IF NOT EXISTS reauthentication_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    action_type TEXT NOT NULL,
    reauth_token TEXT NOT NULL UNIQUE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'expired', 'cancelled')),
    ip_address TEXT,
    device_info TEXT,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    cancelled_at TIMESTAMP WITH TIME ZONE,
    cancelled_by UUID REFERENCES auth.users(id),
    cancellation_reason TEXT
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_email_change_requests_user_id ON email_change_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_email_change_requests_token ON email_change_requests(confirmation_token);
CREATE INDEX IF NOT EXISTS idx_email_change_requests_status ON email_change_requests(status);
CREATE INDEX IF NOT EXISTS idx_email_change_requests_expires_at ON email_change_requests(expires_at);

CREATE INDEX IF NOT EXISTS idx_reauth_requests_user_id ON reauthentication_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_reauth_requests_token ON reauthentication_requests(reauth_token);
CREATE INDEX IF NOT EXISTS idx_reauth_requests_status ON reauthentication_requests(status);
CREATE INDEX IF NOT EXISTS idx_reauth_requests_expires_at ON reauthentication_requests(expires_at);
CREATE INDEX IF NOT EXISTS idx_reauth_requests_action_type ON reauthentication_requests(action_type);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_email_change_requests_updated_at 
    BEFORE UPDATE ON email_change_requests 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reauth_requests_updated_at 
    BEFORE UPDATE ON reauthentication_requests 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to expire old email change requests
CREATE OR REPLACE FUNCTION expire_old_email_change_requests()
RETURNS void AS $$
BEGIN
    UPDATE email_change_requests 
    SET status = 'expired', updated_at = NOW()
    WHERE status = 'pending' AND expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- Function to expire old reauthentication requests
CREATE OR REPLACE FUNCTION expire_old_reauth_requests()
RETURNS void AS $$
BEGIN
    UPDATE reauthentication_requests 
    SET status = 'expired', updated_at = NOW()
    WHERE status = 'pending' AND expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- Function to handle email change confirmation
CREATE OR REPLACE FUNCTION confirm_email_change(token TEXT)
RETURNS TABLE(success BOOLEAN, message TEXT, old_email TEXT, new_email TEXT) AS $$
DECLARE
    request_record email_change_requests%ROWTYPE;
    user_record auth.users%ROWTYPE;
BEGIN
    -- Find the email change request
    SELECT * INTO request_record 
    FROM email_change_requests 
    WHERE confirmation_token = token AND status = 'pending';
    
    IF NOT FOUND THEN
        RETURN QUERY SELECT FALSE, 'Invalid or expired token', NULL::TEXT, NULL::TEXT;
        RETURN;
    END IF;
    
    -- Check if token is expired
    IF request_record.expires_at < NOW() THEN
        UPDATE email_change_requests 
        SET status = 'expired', updated_at = NOW()
        WHERE id = request_record.id;
        RETURN QUERY SELECT FALSE, 'Token has expired', NULL::TEXT, NULL::TEXT;
        RETURN;
    END IF;
    
    -- Check if new email already exists
    SELECT * INTO user_record 
    FROM auth.users 
    WHERE email = request_record.new_email;
    
    IF FOUND THEN
        UPDATE email_change_requests 
        SET status = 'cancelled', 
            cancelled_at = NOW(), 
            cancellation_reason = 'New email already exists',
            updated_at = NOW()
        WHERE id = request_record.id;
        RETURN QUERY SELECT FALSE, 'New email address already exists', NULL::TEXT, NULL::TEXT;
        RETURN;
    END IF;
    
    -- Update user email in auth.users
    UPDATE auth.users 
    SET email = request_record.new_email,
        updated_at = NOW()
    WHERE id = request_record.user_id;
    
    -- Update profile email
    UPDATE profiles 
    SET email = request_record.new_email,
        updated_at = NOW()
    WHERE id = request_record.user_id;
    
    -- Mark request as confirmed
    UPDATE email_change_requests 
    SET status = 'confirmed', 
        confirmed_at = NOW(),
        updated_at = NOW()
    WHERE id = request_record.id;
    
    RETURN QUERY SELECT TRUE, 'Email changed successfully', request_record.old_email, request_record.new_email;
END;
$$ LANGUAGE plpgsql;

-- Function to handle reauthentication confirmation
CREATE OR REPLACE FUNCTION confirm_reauthentication(token TEXT)
RETURNS TABLE(success BOOLEAN, message TEXT, action_type TEXT) AS $$
DECLARE
    request_record reauthentication_requests%ROWTYPE;
BEGIN
    -- Find the reauthentication request
    SELECT * INTO request_record 
    FROM reauthentication_requests 
    WHERE reauth_token = token AND status = 'pending';
    
    IF NOT FOUND THEN
        RETURN QUERY SELECT FALSE, 'Invalid or expired token', NULL::TEXT;
        RETURN;
    END IF;
    
    -- Check if token is expired
    IF request_record.expires_at < NOW() THEN
        UPDATE reauthentication_requests 
        SET status = 'expired', updated_at = NOW()
        WHERE id = request_record.id;
        RETURN QUERY SELECT FALSE, 'Token has expired', NULL::TEXT;
        RETURN;
    END IF;
    
    -- Mark request as completed
    UPDATE reauthentication_requests 
    SET status = 'completed', 
        completed_at = NOW(),
        updated_at = NOW()
    WHERE id = request_record.id;
    
    RETURN QUERY SELECT TRUE, 'Reauthentication successful', request_record.action_type;
END;
$$ LANGUAGE plpgsql;

-- Function to get email change statistics
CREATE OR REPLACE FUNCTION get_email_change_stats(user_uuid UUID DEFAULT NULL)
RETURNS TABLE(
    total_requests BIGINT,
    pending_requests BIGINT,
    confirmed_requests BIGINT,
    expired_requests BIGINT,
    cancelled_requests BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*) as total_requests,
        COUNT(*) FILTER (WHERE status = 'pending') as pending_requests,
        COUNT(*) FILTER (WHERE status = 'confirmed') as confirmed_requests,
        COUNT(*) FILTER (WHERE status = 'expired') as expired_requests,
        COUNT(*) FILTER (WHERE status = 'cancelled') as cancelled_requests
    FROM email_change_requests
    WHERE user_uuid IS NULL OR user_id = user_uuid;
END;
$$ LANGUAGE plpgsql;

-- Function to get reauthentication statistics
CREATE OR REPLACE FUNCTION get_reauth_stats(user_uuid UUID DEFAULT NULL)
RETURNS TABLE(
    total_requests BIGINT,
    pending_requests BIGINT,
    completed_requests BIGINT,
    expired_requests BIGINT,
    cancelled_requests BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*) as total_requests,
        COUNT(*) FILTER (WHERE status = 'pending') as pending_requests,
        COUNT(*) FILTER (WHERE status = 'completed') as completed_requests,
        COUNT(*) FILTER (WHERE status = 'expired') as expired_requests,
        COUNT(*) FILTER (WHERE status = 'cancelled') as cancelled_requests
    FROM reauthentication_requests
    WHERE user_uuid IS NULL OR user_id = user_uuid;
END;
$$ LANGUAGE plpgsql;

-- View for email change analytics
CREATE OR REPLACE VIEW email_change_analytics AS
SELECT 
    DATE(created_at) as request_date,
    COUNT(*) as total_requests,
    COUNT(*) FILTER (WHERE status = 'confirmed') as successful_changes,
    COUNT(*) FILTER (WHERE status = 'expired') as expired_requests,
    COUNT(*) FILTER (WHERE status = 'cancelled') as cancelled_requests,
    ROUND(
        (COUNT(*) FILTER (WHERE status = 'confirmed')::DECIMAL / COUNT(*)) * 100, 2
    ) as success_rate
FROM email_change_requests
GROUP BY DATE(created_at)
ORDER BY request_date DESC;

-- View for reauthentication analytics
CREATE OR REPLACE VIEW reauthentication_analytics AS
SELECT 
    DATE(created_at) as request_date,
    action_type,
    COUNT(*) as total_requests,
    COUNT(*) FILTER (WHERE status = 'completed') as successful_reauth,
    COUNT(*) FILTER (WHERE status = 'expired') as expired_requests,
    COUNT(*) FILTER (WHERE status = 'cancelled') as cancelled_requests,
    ROUND(
        (COUNT(*) FILTER (WHERE status = 'completed')::DECIMAL / COUNT(*)) * 100, 2
    ) as success_rate
FROM reauthentication_requests
GROUP BY DATE(created_at), action_type
ORDER BY request_date DESC, action_type;

-- Row Level Security (RLS) Policies

-- Email Change Requests RLS
ALTER TABLE email_change_requests ENABLE ROW LEVEL SECURITY;

-- Users can only see their own email change requests
CREATE POLICY "Users can view own email change requests" ON email_change_requests
    FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own email change requests
CREATE POLICY "Users can create own email change requests" ON email_change_requests
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own pending email change requests
CREATE POLICY "Users can update own pending email change requests" ON email_change_requests
    FOR UPDATE USING (auth.uid() = user_id AND status = 'pending');

-- Admins can view all email change requests (FIXED: Use user_roles table instead of profiles.role)
CREATE POLICY "Admins can view all email change requests" ON email_change_requests
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM user_roles 
            WHERE user_id = auth.uid() 
            AND role IN ('system_admin', 'clergy')
            AND is_active = true
        )
    );

-- Reauthentication Requests RLS
ALTER TABLE reauthentication_requests ENABLE ROW LEVEL SECURITY;

-- Users can only see their own reauthentication requests
CREATE POLICY "Users can view own reauthentication requests" ON reauthentication_requests
    FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own reauthentication requests
CREATE POLICY "Users can create own reauthentication requests" ON reauthentication_requests
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own pending reauthentication requests
CREATE POLICY "Users can update own pending reauthentication requests" ON reauthentication_requests
    FOR UPDATE USING (auth.uid() = user_id AND status = 'pending');

-- Admins can view all reauthentication requests (FIXED: Use user_roles table instead of profiles.role)
CREATE POLICY "Admins can view all reauthentication requests" ON reauthentication_requests
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM user_roles 
            WHERE user_id = auth.uid() 
            AND role IN ('system_admin', 'clergy')
            AND is_active = true
        )
    );

-- Scheduled job to expire old requests (if using pg_cron extension)
-- Uncomment if pg_cron is available:
-- SELECT cron.schedule('expire-email-change-requests', '0 */6 * * *', 'SELECT expire_old_email_change_requests();');
-- SELECT cron.schedule('expire-reauth-requests', '*/15 * * * *', 'SELECT expire_old_reauth_requests();');

-- Insert sample data for testing (optional)
-- INSERT INTO email_change_requests (user_id, old_email, new_email, confirmation_token, expires_at)
-- VALUES (
--     '00000000-0000-0000-0000-000000000000',
--     'old@example.com',
--     'new@example.com',
--     'sample-token-123',
--     NOW() + INTERVAL '24 hours'
-- );

-- INSERT INTO reauthentication_requests (user_id, action_type, reauth_token, expires_at)
-- VALUES (
--     '00000000-0000-0000-0000-000000000000',
--     'password_change',
--     'sample-reauth-token-123',
--     NOW() + INTERVAL '30 minutes'
-- );

-- Verification query to ensure everything was created correctly
SELECT 'Email change and reauthentication tables created successfully' as status; 