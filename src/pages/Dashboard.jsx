
import React from 'react';
import { useUserRole } from '@/hooks/useUserRole';
import SystemDashboard from '@/components/admin/SystemDashboard';
import ClergyDashboard from '@/components/admin/ClergyDashboard';
import TreasurerDashboard from '@/components/admin/TreasurerDashboard';
import SecretaryDashboard from '@/components/admin/SecretaryDashboard';
import UserDashboard from '@/components/admin/UserDashboard';
import EnhancedDashboard from '@/components/dashboard/EnhancedDashboard';
import DashboardRedirect from '@/components/auth/DashboardRedirect';

const Dashboard = () => {
  const { role, loading } = useUserRole();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Use the enhanced dashboard for all users with role-based content filtering
  return <EnhancedDashboard />;
};

export default Dashboard;
