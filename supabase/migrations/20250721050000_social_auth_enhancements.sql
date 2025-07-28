-- Social Authentication Enhancements Migration
-- This migration adds support for social authentication providers

-- Add social authentication fields to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS social_provider VARCHAR(50);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS social_id VARCHAR(255);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT FALSE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_social_login TIMESTAMP WITH TIME ZONE;

-- Create index for social authentication lookups
CREATE INDEX IF NOT EXISTS idx_profiles_social ON profiles(social_provider, social_id);
CREATE INDEX IF NOT EXISTS idx_profiles_email_verified ON profiles(email_verified);

-- Create function to handle social authentication user creation
CREATE OR REPLACE FUNCTION handle_social_auth_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Set email_verified to true for social auth users
  NEW.email_verified = TRUE;
  NEW.last_social_login = NOW();
  
  -- Insert default role for social users if not exists
  INSERT INTO user_roles (user_id, role, created_at)
  VALUES (NEW.id, 'member', NOW())
  ON CONFLICT (user_id) DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for social authentication
DROP TRIGGER IF EXISTS trigger_social_auth_user ON profiles;
CREATE TRIGGER trigger_social_auth_user
  BEFORE INSERT ON profiles
  FOR EACH ROW
  WHEN (NEW.social_provider IS NOT NULL)
  EXECUTE FUNCTION handle_social_auth_user();

-- Create function to update social login timestamp
CREATE OR REPLACE FUNCTION update_social_login()
RETURNS TRIGGER AS $$
BEGIN
  -- Update last_social_login when user signs in via social auth
  IF NEW.social_provider IS NOT NULL AND OLD.social_provider IS NOT NULL THEN
    NEW.last_social_login = NOW();
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updating social login timestamp
DROP TRIGGER IF EXISTS trigger_update_social_login ON profiles;
CREATE TRIGGER trigger_update_social_login
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  WHEN (NEW.social_provider IS NOT NULL)
  EXECUTE FUNCTION update_social_login();

-- Create view for social authentication analytics
CREATE OR REPLACE VIEW social_auth_analytics AS
SELECT 
  social_provider,
  COUNT(*) as total_users,
  COUNT(CASE WHEN last_social_login > NOW() - INTERVAL '30 days' THEN 1 END) as active_last_30_days,
  COUNT(CASE WHEN last_social_login > NOW() - INTERVAL '7 days' THEN 1 END) as active_last_7_days,
  AVG(EXTRACT(EPOCH FROM (NOW() - created_at))/86400) as avg_days_since_registration
FROM profiles 
WHERE social_provider IS NOT NULL
GROUP BY social_provider;

-- Add RLS policies for social authentication fields
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policy for users to read their own social auth data
CREATE POLICY "Users can read own social auth data" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- Policy for users to update their own social auth data
CREATE POLICY "Users can update own social auth data" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Policy for system to insert social auth data
CREATE POLICY "System can insert social auth data" ON profiles
  FOR INSERT WITH CHECK (true);

-- Create function to get social auth statistics
CREATE OR REPLACE FUNCTION get_social_auth_stats()
RETURNS TABLE (
  provider VARCHAR(50),
  total_users BIGINT,
  active_users_30d BIGINT,
  active_users_7d BIGINT,
  avg_registration_age NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    sa.social_provider,
    sa.total_users,
    sa.active_last_30_days,
    sa.active_last_7_days,
    sa.avg_days_since_registration
  FROM social_auth_analytics sa;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT SELECT ON social_auth_analytics TO authenticated;
GRANT EXECUTE ON FUNCTION get_social_auth_stats() TO authenticated;

-- Add comments for documentation
COMMENT ON COLUMN profiles.social_provider IS 'The social authentication provider (google, facebook, whatsapp)';
COMMENT ON COLUMN profiles.social_id IS 'The unique identifier from the social provider';
COMMENT ON COLUMN profiles.avatar_url IS 'URL to the user''s profile picture from social provider';
COMMENT ON COLUMN profiles.email_verified IS 'Whether the user''s email has been verified (true for social auth)';
COMMENT ON COLUMN profiles.last_social_login IS 'Timestamp of the last social authentication login';

COMMENT ON FUNCTION handle_social_auth_user() IS 'Handles automatic role assignment and email verification for social auth users';
COMMENT ON FUNCTION update_social_login() IS 'Updates the last_social_login timestamp when users sign in via social auth';
COMMENT ON FUNCTION get_social_auth_stats() IS 'Returns statistics about social authentication usage'; 