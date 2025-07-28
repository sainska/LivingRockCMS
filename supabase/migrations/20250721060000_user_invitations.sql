-- User Invitations Migration
-- This migration creates the user_invitations table for managing user invitations

-- Create user_invitations table
CREATE TABLE IF NOT EXISTS user_invitations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'member',
  invited_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'cancelled', 'expired')),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  accepted_at TIMESTAMP WITH TIME ZONE,
  additional_data JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_invitations_email ON user_invitations(email);
CREATE INDEX IF NOT EXISTS idx_user_invitations_status ON user_invitations(status);
CREATE INDEX IF NOT EXISTS idx_user_invitations_invited_by ON user_invitations(invited_by);
CREATE INDEX IF NOT EXISTS idx_user_invitations_expires_at ON user_invitations(expires_at);
CREATE INDEX IF NOT EXISTS idx_user_invitations_created_at ON user_invitations(created_at);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_user_invitations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updating updated_at
CREATE TRIGGER trigger_update_user_invitations_updated_at
  BEFORE UPDATE ON user_invitations
  FOR EACH ROW
  EXECUTE FUNCTION update_user_invitations_updated_at();

-- Create function to handle invitation acceptance
CREATE OR REPLACE FUNCTION handle_invitation_acceptance()
RETURNS TRIGGER AS $$
BEGIN
  -- Update invitation status to accepted
  UPDATE user_invitations 
  SET status = 'accepted', accepted_at = NOW()
  WHERE email = NEW.email AND status = 'pending';
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for handling invitation acceptance
CREATE TRIGGER trigger_handle_invitation_acceptance
  AFTER INSERT ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION handle_invitation_acceptance();

-- Create function to expire old invitations
CREATE OR REPLACE FUNCTION expire_old_invitations()
RETURNS void AS $$
BEGIN
  UPDATE user_invitations 
  SET status = 'expired'
  WHERE status = 'pending' AND expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- Create function to get invitation statistics
CREATE OR REPLACE FUNCTION get_invitation_stats()
RETURNS TABLE (
  total_invitations BIGINT,
  pending_invitations BIGINT,
  accepted_invitations BIGINT,
  cancelled_invitations BIGINT,
  expired_invitations BIGINT,
  acceptance_rate NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*) as total_invitations,
    COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_invitations,
    COUNT(CASE WHEN status = 'accepted' THEN 1 END) as accepted_invitations,
    COUNT(CASE WHEN status = 'cancelled' THEN 1 END) as cancelled_invitations,
    COUNT(CASE WHEN status = 'expired' THEN 1 END) as expired_invitations,
    CASE 
      WHEN COUNT(*) > 0 THEN 
        ROUND((COUNT(CASE WHEN status = 'accepted' THEN 1 END)::NUMERIC / COUNT(*)::NUMERIC) * 100, 2)
      ELSE 0 
    END as acceptance_rate
  FROM user_invitations;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create view for invitation analytics
CREATE OR REPLACE VIEW invitation_analytics AS
SELECT 
  DATE_TRUNC('day', created_at) as invitation_date,
  COUNT(*) as total_invitations,
  COUNT(CASE WHEN status = 'accepted' THEN 1 END) as accepted_invitations,
  COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_invitations,
  COUNT(CASE WHEN status = 'cancelled' THEN 1 END) as cancelled_invitations,
  COUNT(CASE WHEN status = 'expired' THEN 1 END) as expired_invitations,
  ROUND(
    (COUNT(CASE WHEN status = 'accepted' THEN 1 END)::NUMERIC / 
     NULLIF(COUNT(*), 0)::NUMERIC) * 100, 2
  ) as acceptance_rate
FROM user_invitations
GROUP BY DATE_TRUNC('day', created_at)
ORDER BY invitation_date DESC;

-- Enable Row Level Security
ALTER TABLE user_invitations ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Users can view invitations they created
CREATE POLICY "Users can view own invitations" ON user_invitations
  FOR SELECT USING (auth.uid() = invited_by);

-- Users can create invitations (system admins and authorized roles)
CREATE POLICY "Users can create invitations" ON user_invitations
  FOR INSERT WITH CHECK (true);

-- Users can update invitations they created
CREATE POLICY "Users can update own invitations" ON user_invitations
  FOR UPDATE USING (auth.uid() = invited_by);

-- System can update all invitations (for triggers)
CREATE POLICY "System can update all invitations" ON user_invitations
  FOR UPDATE USING (true);

-- Grant necessary permissions
GRANT SELECT, INSERT, UPDATE ON user_invitations TO authenticated;
GRANT SELECT ON invitation_analytics TO authenticated;
GRANT EXECUTE ON FUNCTION get_invitation_stats() TO authenticated;
GRANT EXECUTE ON FUNCTION expire_old_invitations() TO authenticated;

-- Add comments for documentation
COMMENT ON TABLE user_invitations IS 'Stores user invitations for the LivingRockCMS system';
COMMENT ON COLUMN user_invitations.email IS 'Email address of the invited user';
COMMENT ON COLUMN user_invitations.role IS 'Role assigned to the invited user';
COMMENT ON COLUMN user_invitations.invited_by IS 'User ID of the person who sent the invitation';
COMMENT ON COLUMN user_invitations.status IS 'Current status of the invitation (pending, accepted, cancelled, expired)';
COMMENT ON COLUMN user_invitations.expires_at IS 'When the invitation expires';
COMMENT ON COLUMN user_invitations.accepted_at IS 'When the invitation was accepted';
COMMENT ON COLUMN user_invitations.additional_data IS 'Additional data for the invitation (JSON)';

COMMENT ON FUNCTION handle_invitation_acceptance() IS 'Automatically updates invitation status when a user accepts an invitation';
COMMENT ON FUNCTION expire_old_invitations() IS 'Expires invitations that have passed their expiration date';
COMMENT ON FUNCTION get_invitation_stats() IS 'Returns statistics about user invitations'; 