
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import DashboardStats from '@/components/dashboard/DashboardStats';
import QuickActions from '@/components/dashboard/QuickActions';
import UpcomingEvents from '@/components/dashboard/UpcomingEvents';
import RecentDonations from '@/components/dashboard/RecentDonations';
import WelcomeDashboard from '@/components/dashboard/WelcomeDashboard';
import { Alert, AlertDescription } from '@/components/ui/alert';

const Dashboard = () => {
  const { user, profile, role, loading } = useAuth();

  const getRoleDisplayName = (userRole) => {
    const roleNames = {
      'system_admin': 'System Administrator',
      'clergy': 'Clergy Member',
      'treasurer': 'Treasurer',
      'secretary': 'Secretary',
      'member': 'Member'
    };
    return roleNames[userRole] || 'Member';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Alert className="max-w-md">
          <AlertDescription>
            Please log in to access your dashboard.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <WelcomeDashboard
        userName={profile?.first_name ? `${profile.first_name} ${profile.last_name}` : user?.email}
        userRole={getRoleDisplayName(role)}
      />

      {/* Dashboard Statistics */}
      <DashboardStats />

      {/* Quick Actions */}
      <QuickActions role={role} />

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Events */}
        <UpcomingEvents />

        {/* Recent Donations (for treasurers and admins) */}
        {(role === 'treasurer' || role === 'system_admin') && (
          <RecentDonations />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
