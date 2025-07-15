
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserRole } from '@/hooks/useUserRole';
import { Navigate } from 'react-router-dom';
import WelcomeDashboard from '@/components/dashboard/WelcomeDashboard';

const Dashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const { role, loading: roleLoading } = useUserRole();

  if (authLoading || roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-xiracom-blue"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Redirect to role-specific dashboard
  const dashboardRoutes = {
    system_admin: '/admin-dashboard',
    clergy: '/clergy-dashboard',
    treasurer: '/treasurer-dashboard',
    secretary: '/secretary-dashboard',
    member: '/user-dashboard'
  };

  const targetRoute = dashboardRoutes[role || 'member'];
  
  if (targetRoute && window.location.pathname === '/') {
    return <Navigate to={targetRoute} replace />;
  }

  return <WelcomeDashboard />;
};

export default Dashboard;
