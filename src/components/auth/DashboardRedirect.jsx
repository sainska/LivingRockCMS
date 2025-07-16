
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const DashboardRedirect = () => {
  const navigate = useNavigate();
  const { user, loading, role } = useAuth();

  useEffect(() => {
    console.log('DashboardRedirect: Auth state check', { 
      user: !!user, 
      loading, 
      role,
      userEmail: user?.email 
    });
    
    if (loading) {
      console.log('DashboardRedirect: Still loading auth state...');
      return;
    }

    if (!user) {
      console.log('DashboardRedirect: No user found, redirecting to auth');
      navigate('/auth', { replace: true });
      return;
    }

    // User is authenticated, redirect to dashboard
    console.log('DashboardRedirect: User authenticated, redirecting to dashboard');
    navigate('/dashboard', { replace: true });
  }, [user, loading, role, navigate]);

  // Show loading while determining redirect
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  );
};

export default DashboardRedirect;
