
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import DashboardStats from '@/components/dashboard/DashboardStats';
import QuickActions from '@/components/dashboard/QuickActions';
import UpcomingEvents from '@/components/dashboard/UpcomingEvents';
import RecentDonations from '@/components/dashboard/RecentDonations';
import WelcomeDashboard from '@/components/dashboard/WelcomeDashboard';

const Dashboard = () => {
  const { user, profile, role } = useAuth();

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
