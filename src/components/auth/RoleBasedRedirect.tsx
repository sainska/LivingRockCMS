
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const RoleBasedRedirect = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      // This would typically check the user's role from the database
      // For now, we'll use a simple role check
      // In a real implementation, you'd fetch the user's role from user_roles table
      
      // Example role checking logic (this should be replaced with actual role fetching)
      const userRole = getUserRole(user.email);
      
      switch (userRole) {
        case 'system_admin':
          navigate('/');
          break;
        case 'treasurer':
          navigate('/treasurer-dashboard');
          break;
        case 'secretary':
          navigate('/secretary-dashboard');
          break;
        case 'clergy':
          navigate('/clergy-dashboard');
          break;
        default:
          navigate('/user-dashboard');
      }
    }
  }, [user, navigate]);

  return null;
};

// This is a temporary function - in reality, you'd fetch this from Supabase
const getUserRole = (email: string) => {
  // This is just for demonstration - replace with actual role fetching
  if (email?.includes('admin')) return 'system_admin';
  if (email?.includes('treasurer')) return 'treasurer';
  if (email?.includes('secretary')) return 'secretary';
  if (email?.includes('pastor') || email?.includes('clergy')) return 'clergy';
  return 'member';
};

export default RoleBasedRedirect;
