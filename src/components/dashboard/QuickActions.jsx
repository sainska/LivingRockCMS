
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Users, Calendar, DollarSign, MessageCircle, FileText, Settings, Bell, User, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUserRole } from "@/hooks/useUserRole";
import { useToast } from "@/components/ui/use-toast";

const QuickActions = () => {
  const navigate = useNavigate();
  const { role } = useUserRole();
  const { toast } = useToast();

  const handleQuickAction = (action) => {
    console.log(`Quick action triggered: ${action}`);
    
    try {
      switch (action) {
        case 'add-member':
          console.log('Navigating to add member...');
          navigate('/members');
          toast({
            title: "Navigation",
            description: "Opening member management"
          });
          break;
        case 'new-event':
          console.log('Navigating to create event...');
          navigate('/events');
          toast({
            title: "Navigation",
            description: "Opening event management"
          });
          break;
        case 'record-donation':
          console.log('Navigating to record donation...');
          navigate('/finances');
          toast({
            title: "Navigation",
            description: "Opening financial management"
          });
          break;
        case 'send-message':
          console.log('Navigating to communication...');
          navigate('/communication');
          toast({
            title: "Navigation",
            description: "Opening communication center"
          });
          break;
        case 'view-reports':
          console.log('Navigating to reports...');
          navigate('/reports');
          toast({
            title: "Navigation",
            description: "Opening reports dashboard"
          });
          break;
        case 'manage-settings':
          console.log('Navigating to settings...');
          navigate('/settings');
          toast({
            title: "Navigation",
            description: "Opening system settings"
          });
          break;
        case 'view-notifications':
          console.log('Navigating to notifications...');
          navigate('/notifications');
          toast({
            title: "Navigation",
            description: "Opening notifications"
          });
          break;
        case 'user-profile':
          console.log('Navigating to user profile...');
          navigate('/profile');
          toast({
            title: "Navigation",
            description: "Opening user profile"
          });
          break;
        case 'security-overview':
          console.log('Navigating to security...');
          navigate('/security');
          toast({
            title: "Navigation",
            description: "Opening security dashboard"
          });
          break;
        default:
          console.log('Action not implemented:', action);
          toast({
            title: "Coming Soon",
            description: "This feature is being developed",
            variant: "default"
          });
      }
    } catch (error) {
      console.error('Error handling quick action:', error);
      toast({
        title: "Error",
        description: "Failed to perform action",
        variant: "destructive"
      });
    }
  };

  // Define quick actions based on user role
  const getQuickActions = () => {
    const baseActions = [
      {
        id: 'new-event',
        label: 'New Event',
        icon: Calendar,
        description: 'Create a new church event'
      },
      {
        id: 'send-message',
        label: 'Send Message',
        icon: MessageCircle,
        description: 'Send communication to members'
      },
      {
        id: 'view-notifications',
        label: 'Notifications',
        icon: Bell,
        description: 'View all notifications'
      },
      {
        id: 'user-profile',
        label: 'My Profile',
        icon: User,
        description: 'Manage your profile'
      }
    ];

    const adminActions = [
      {
        id: 'add-member',
        label: 'Add Member',
        icon: Users,
        description: 'Add new church member'
      },
      {
        id: 'record-donation',
        label: 'Record Donation',
        icon: DollarSign,
        description: 'Record financial donation'
      },
      {
        id: 'view-reports',
        label: 'View Reports',
        icon: FileText,
        description: 'Access system reports'
      },
      {
        id: 'manage-settings',
        label: 'Settings',
        icon: Settings,
        description: 'Manage system settings'
      }
    ];

    const securityActions = [
      {
        id: 'security-overview',
        label: 'Security',
        icon: Shield,
        description: 'Security overview'
      }
    ];

    // Return actions based on role
    if (role === 'system_admin') {
      return [...baseActions, ...adminActions, ...securityActions];
    } else if (role === 'clergy') {
      return [...baseActions, ...adminActions];
    } else if (role === 'treasurer') {
      return [...baseActions, { id: 'record-donation', label: 'Record Donation', icon: DollarSign, description: 'Record financial donation' }, { id: 'view-reports', label: 'View Reports', icon: FileText, description: 'Access financial reports' }];
    } else if (role === 'secretary') {
      return [...baseActions, { id: 'add-member', label: 'Add Member', icon: Users, description: 'Add new church member' }, { id: 'view-reports', label: 'View Reports', icon: FileText, description: 'Access member reports' }];
    } else {
      // Member role - limited actions
      return baseActions.filter(action => action.id !== 'view-notifications');
    }
  };

  const quickActions = getQuickActions();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-xiracom-blue">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((action) => {
            const IconComponent = action.icon;
            return (
              <Button 
                key={action.id}
                variant="outline" 
                className="h-20 flex flex-col gap-2 hover:bg-xiracom-blue hover:text-white transition-colors group"
                onClick={() => handleQuickAction(action.id)}
                title={action.description}
              >
                <IconComponent className="h-5 w-5 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-medium">{action.label}</span>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
