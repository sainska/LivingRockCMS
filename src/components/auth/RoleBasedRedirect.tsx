
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useUserRole } from '@/hooks/useUserRole';

const RoleBasedRedirect = () => {
  const { user } = useAuth();
  const { role, loading } = useUserRole();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && !loading && role) {
      // Redirect based on actual user role from database
      switch (role) {
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
  }, [user, role, loading, navigate]);

  return null;
};

export default RoleBasedRedirect;
