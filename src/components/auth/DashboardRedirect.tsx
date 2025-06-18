import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useUserRole } from '@/hooks/useUserRole';

const DashboardRedirect = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { role, loading: roleLoading } = useUserRole();

  useEffect(() => {
    if (authLoading || roleLoading) return;

    if (!user) {
      navigate('/auth');
      return;
    }

    // Redirect to appropriate dashboard based on role
    const dashboardRoutes: Record<string, string> = {
      system_admin: '/admin-dashboard',
      clergy: '/clergy-dashboard',
      treasurer: '/treasurer-dashboard',
      secretary: '/secretary-dashboard',
      member: '/user-dashboard'
    };

    const targetRoute = dashboardRoutes[role || 'member'] || '/user-dashboard';
    navigate(targetRoute);
  }, [user, role, authLoading, roleLoading, navigate]);

  // Show loading while determining redirect
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-xiracom-blue"></div>
    </div>
  );
};

export default DashboardRedirect; 