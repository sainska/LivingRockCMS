
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const DashboardRedirect = () => {
  const navigate = useNavigate();
  const { user, loading, role } = useAuth();

  useEffect(() => {
    console.log('DashboardRedirect: Auth state', { user: !!user, loading, role });
    
    if (loading) {
      console.log('DashboardRedirect: Still loading...');
      return;
    }

    if (!user) {
      console.log('DashboardRedirect: No user, redirecting to auth');
      navigate('/auth');
      return;
    }

    // User is authenticated, redirect to dashboard
    console.log('DashboardRedirect: User authenticated, redirecting to dashboard');
    navigate('/dashboard');
  }, [user, loading, role, navigate]);

  // Show loading while determining redirect
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Show nothing while redirecting
  return null;
};

export default DashboardRedirect;
