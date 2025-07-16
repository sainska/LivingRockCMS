
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, Users, Calendar, DollarSign, MessageSquare, 
  Heart, Church, BookOpen, Settings, BarChart3, Shield, 
  UserCheck, FileText, Headphones, Briefcase
} from 'lucide-react';

const Sidebar = () => {
  const { role } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    {
      title: 'Dashboard',
      icon: LayoutDashboard,
      path: '/dashboard',
      roles: ['system_admin', 'clergy', 'treasurer', 'secretary', 'member']
    },
    {
      title: 'Members',
      icon: Users,
      path: '/members',
      roles: ['system_admin', 'clergy', 'secretary']
    },
    {
      title: 'Events',
      icon: Calendar,
      path: '/events',
      roles: ['system_admin', 'clergy', 'secretary', 'member']
    },
    {
      title: 'Finances',
      icon: DollarSign,
      path: '/finances',
      roles: ['system_admin', 'treasurer']
    },
    {
      title: 'Communication',
      icon: MessageSquare,
      path: '/communication',
      roles: ['system_admin', 'clergy', 'secretary']
    },
    {
      title: 'Prayer Requests',
      icon: Heart,
      path: '/prayer-requests',
      roles: ['system_admin', 'clergy', 'member']
    },
    {
      title: 'Ministries',
      icon: Church,
      path: '/ministries',
      roles: ['system_admin', 'clergy', 'member']
    },
    {
      title: 'Bible Study',
      icon: BookOpen,
      path: '/bible-study',
      roles: ['system_admin', 'clergy', 'member']
    },
    {
      title: 'Sermons',
      icon: Headphones,
      path: '/sermons',
      roles: ['system_admin', 'clergy', 'member']
    },
    {
      title: 'Volunteers',
      icon: UserCheck,
      path: '/volunteers',
      roles: ['system_admin', 'secretary']
    },
    {
      title: 'Staff',
      icon: Briefcase,
      path: '/staff',
      roles: ['system_admin']
    },
    {
      title: 'Reports',
      icon: BarChart3,
      path: '/reports',
      roles: ['system_admin', 'clergy', 'treasurer']
    },
    {
      title: 'Church Info',
      icon: FileText,
      path: '/church-info',
      roles: ['system_admin', 'clergy', 'secretary', 'member']
    },
    {
      title: 'Security',
      icon: Shield,
      path: '/security',
      roles: ['system_admin']
    },
    {
      title: 'Settings',
      icon: Settings,
      path: '/settings',
      roles: ['system_admin', 'clergy']
    }
  ];

  const filteredMenuItems = menuItems.filter(item => 
    item.roles.includes(role) || role === 'system_admin'
  );

  const isActive = (path) => {
    return location.pathname === path || 
           (path !== '/dashboard' && location.pathname.startsWith(path));
  };

  return (
    <aside className="fixed left-0 top-16 bottom-0 w-64 bg-white border-r border-gray-200 overflow-y-auto">
      <nav className="p-4 space-y-2">
        {filteredMenuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                "w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors",
                isActive(item.path)
                  ? "bg-blue-50 text-blue-600 border border-blue-200"
                  : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="font-medium">{item.title}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
