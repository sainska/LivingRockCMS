
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Plus, Users, Calendar, DollarSign, MessageSquare, 
  Heart, FileText, UserPlus, Mail
} from 'lucide-react';

const QuickActions = ({ role }) => {
  const navigate = useNavigate();

  const getQuickActions = (userRole) => {
    const actions = [];

    // Common actions for all roles
    actions.push({
      title: 'View Events',
      description: 'Check upcoming church events',
      icon: Calendar,
      action: () => navigate('/events'),
      color: 'bg-blue-500'
    });

    actions.push({
      title: 'Prayer Request',
      description: 'Submit a prayer request',
      icon: Heart,
      action: () => navigate('/prayer-requests'),
      color: 'bg-red-500'
    });

    // Role-specific actions
    if (userRole === 'system_admin') {
      actions.push(
        {
          title: 'Add Member',
          description: 'Register new church member',
          icon: UserPlus,
          action: () => navigate('/members?action=add'),
          color: 'bg-green-500'
        },
        {
          title: 'View Reports',
          description: 'Generate system reports',
          icon: FileText,
          action: () => navigate('/reports'),
          color: 'bg-purple-500'
        }
      );
    }

    if (userRole === 'clergy' || userRole === 'system_admin') {
      actions.push(
        {
          title: 'Create Event',
          description: 'Schedule new church event',
          icon: Plus,
          action: () => navigate('/events?action=create'),
          color: 'bg-indigo-500'
        },
        {
          title: 'Send Message',
          description: 'Communicate with members',
          icon: Mail,
          action: () => navigate('/communication'),
          color: 'bg-orange-500'
        }
      );
    }

    if (userRole === 'treasurer' || userRole === 'system_admin') {
      actions.push({
        title: 'Add Donation',
        description: 'Record new donation',
        icon: DollarSign,
        action: () => navigate('/finances?action=add-donation'),
        color: 'bg-emerald-500'
      });
    }

    if (userRole === 'secretary' || userRole === 'system_admin') {
      actions.push({
        title: 'Member Directory',
        description: 'View all church members',
        icon: Users,
        action: () => navigate('/members'),
        color: 'bg-cyan-500'
      });
    }

    return actions.slice(0, 6); // Limit to 6 actions
  };

  const quickActions = getQuickActions(role);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Plus className="h-5 w-5" />
          <span>Quick Actions</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Button
                key={index}
                variant="outline"
                className="h-auto p-4 flex flex-col items-start space-y-2 hover:shadow-md transition-shadow"
                onClick={action.action}
              >
                <div className={`p-2 rounded-lg ${action.color} text-white`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-sm">{action.title}</h3>
                  <p className="text-xs text-gray-500">{action.description}</p>
                </div>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
