import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserRole } from '@/hooks/useUserRole';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Church, 
  Users, 
  Calendar, 
  DollarSign, 
  FileText, 
  Settings,
  User,
  Heart,
  BookOpen,
  Bell
} from 'lucide-react';

const WelcomeDashboard = () => {
  const { user } = useAuth();
  const { role, profile, loading } = useUserRole();

  const getRoleInfo = (userRole) => {
    const roleInfo = {
      system_admin: {
        title: 'System Administrator',
        description: 'Full system access and management',
        color: 'bg-red-100 text-red-800',
        icon: <Settings className="w-5 h-5" />
      },
      clergy: {
        title: 'Clergy',
        description: 'Spiritual leadership and pastoral care',
        color: 'bg-purple-100 text-purple-800',
        icon: <Church className="w-5 h-5" />
      },
      treasurer: {
        title: 'Treasurer',
        description: 'Financial management and oversight',
        color: 'bg-green-100 text-green-800',
        icon: <DollarSign className="w-5 h-5" />
      },
      secretary: {
        title: 'Secretary',
        description: 'Administrative and communication tasks',
        color: 'bg-blue-100 text-blue-800',
        icon: <FileText className="w-5 h-5" />
      },
      member: {
        title: 'Member',
        description: 'Active church community participant',
        color: 'bg-gray-100 text-gray-800',
        icon: <User className="w-5 h-5" />
      }
    };
    return roleInfo[userRole] || roleInfo.member;
  };

  const getQuickActions = (userRole) => {
    const actions = {
      system_admin: [
        { title: 'User Management', icon: <Users className="w-5 h-5" />, href: '/admin/users' },
        { title: 'System Settings', icon: <Settings className="w-5 h-5" />, href: '/admin/settings' },
        { title: 'Security Logs', icon: <FileText className="w-5 h-5" />, href: '/admin/security' },
        { title: 'Reports', icon: <FileText className="w-5 h-5" />, href: '/reports' }
      ],
      clergy: [
        { title: 'Sermons', icon: <BookOpen className="w-5 h-5" />, href: '/sermons' },
        { title: 'Pastoral Visits', icon: <Heart className="w-5 h-5" />, href: '/visits' },
        { title: 'Events', icon: <Calendar className="w-5 h-5" />, href: '/events' },
        { title: 'Prayer Requests', icon: <Heart className="w-5 h-5" />, href: '/prayers' }
      ],
      treasurer: [
        { title: 'Donations', icon: <DollarSign className="w-5 h-5" />, href: '/donations' },
        { title: 'Expenses', icon: <DollarSign className="w-5 h-5" />, href: '/expenses' },
        { title: 'Budget', icon: <FileText className="w-5 h-5" />, href: '/budget' },
        { title: 'Financial Reports', icon: <FileText className="w-5 h-5" />, href: '/financial-reports' }
      ],
      secretary: [
        { title: 'Communications', icon: <Bell className="w-5 h-5" />, href: '/communications' },
        { title: 'Members', icon: <Users className="w-5 h-5" />, href: '/members' },
        { title: 'Events', icon: <Calendar className="w-5 h-5" />, href: '/events' },
        { title: 'Reports', icon: <FileText className="w-5 h-5" />, href: '/reports' }
      ],
      member: [
        { title: 'Events', icon: <Calendar className="w-5 h-5" />, href: '/events' },
        { title: 'Prayer Requests', icon: <Heart className="w-5 h-5" />, href: '/prayers' },
        { title: 'Sermons', icon: <BookOpen className="w-5 h-5" />, href: '/sermons' },
        { title: 'Profile', icon: <User className="w-5 h-5" />, href: '/profile' }
      ]
    };
    return actions[userRole] || actions.member;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-xiracom-blue"></div>
      </div>
    );
  }

  const roleInfo = getRoleInfo(role);
  const quickActions = getQuickActions(role);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Welcome Header */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-xiracom-blue rounded-full flex items-center justify-center">
                <Church className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Welcome, {profile?.first_name && profile?.last_name ? `${profile.first_name} ${profile.last_name}` : profile?.first_name || 'Member'}!
                </h1>
                <p className="text-gray-600 mt-1">
                  Living Rock Church - Member Portal
                </p>
              </div>
            </div>
            <Badge className={roleInfo.color}>
              <span className="flex items-center space-x-1">
                {roleInfo.icon}
                <span>{roleInfo.title}</span>
              </span>
            </Badge>
          </div>
        </div>

        {/* Role Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              {roleInfo.icon}
              <span>Your Role: {roleInfo.title}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">{roleInfo.description}</p>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="h-20 flex flex-col items-center justify-center space-y-2"
                  onClick={() => window.location.href = action.href}
                >
                  {action.icon}
                  <span className="text-sm">{action.title}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">Profile created successfully</p>
                  <p className="text-xs text-gray-500">Welcome to Living Rock Church!</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Bell className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">System notifications enabled</p>
                  <p className="text-xs text-gray-500">You'll receive important updates</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Church Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Church className="w-5 h-5" />
              <span>Church Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold">Living Rock Church</h4>
                <p className="text-sm text-gray-600">P.O. Box 123, Eldoret, Kenya</p>
                <p className="text-sm text-gray-600">+254700000000</p>
                <p className="text-sm text-gray-600">info@livingrockchurch.org</p>
              </div>
              <div>
                <h4 className="font-semibold">Service Times</h4>
                <p className="text-sm text-gray-600">Sunday: 9:00 AM - 12:00 PM</p>
                <p className="text-sm text-gray-600">Wednesday: 7:00 PM - 9:00 PM</p>
                <p className="text-sm text-gray-600">Friday: 6:00 PM - 8:00 PM</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WelcomeDashboard;
