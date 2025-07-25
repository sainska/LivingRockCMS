import { Bell, Search, Settings, LogOut, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useUserRole } from "@/hooks/useUserRole";
import { useEffect, useState } from "react";
import { supabase } from '@/integrations/supabase/client';
import { useNotifications } from '@/hooks/useNotifications';

const Header = ({ pageTitle }) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { role } = useUserRole();
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [unreadPreviews, setUnreadPreviews] = useState([]);
  const { notifications: systemNotifications, unreadCount: unreadSystem, loading: loadingSystem } = useNotifications();
  const [eventReminders, setEventReminders] = useState([]);

  // Real-time updates for messages
  useEffect(() => {
    let subscription;
    const fetchUnread = async () => {
      if (!user) return;
      const { count, data } = await supabase
        .from('messages')
        .select('id, subject, created_at, sender:sender_id(first_name, last_name)', { count: 'exact' })
        .eq('recipient_id', user.id)
        .eq('is_read', false)
        .or('deleted_by_recipient.is.null,deleted_by_recipient.eq.false')
        .order('created_at', { ascending: false })
        .limit(5);
      setUnreadMessages(count || 0);
      setUnreadPreviews(data || []);
    };
    fetchUnread();
    // Subscribe to real-time changes
    if (user) {
      subscription = supabase
        .channel('messages-realtime-header')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'messages', filter: `recipient_id=eq.${user.id}` }, fetchUnread)
        .subscribe();
    }
    return () => {
      if (subscription) supabase.removeChannel(subscription);
    };
  }, [user]);

  // Fetch upcoming events for reminders
  useEffect(() => {
    const fetchEvents = async () => {
      if (!user) return;
      const { data } = await supabase
        .from('events')
        .select('id, title, start_date, location')
        .gte('start_date', new Date().toISOString())
        .order('start_date', { ascending: true })
        .limit(5);
      setEventReminders(data || []);
    };
    fetchEvents();
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
  };

  const getInitials = (email) => {
    return email.substring(0, 2).toUpperCase();
  };

  const getSettingsRoute = () => {
    switch (role) {
      case 'treasurer':
        return '/dashboard/treasurer/settings';
      case 'secretary':
        return '/dashboard/secretary/settings';
      case 'clergy':
        return '/dashboard/clergy/settings';
      case 'system_admin':
        return '/settings';
      default:
        return '/dashboard/member/settings';
    }
  };

  // Calculate total badge count
  const totalBadge = (unreadMessages || 0) + (unreadSystem || 0);

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200">
      <div className="flex items-center space-x-4">
        <h1 className="text-2xl font-semibold text-gray-900">{pageTitle}</h1>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search..."
            className="pl-10 pr-4 py-2 w-64"
          />
        </div>

        {/* New message notification icon */}
        <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard/member/messages')} className="relative">
          <Mail className="h-5 w-5" />
          {unreadMessages > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full px-1.5 py-0.5">{unreadMessages}</span>
          )}
        </Button>

        {/* Main notification menu (Bell) with unread badge and dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {totalBadge > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full px-1.5 py-0.5">{totalBadge}</span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 max-h-[80vh] overflow-y-auto">
            {/* Unread Messages Section */}
            <div className="px-3 py-2 font-semibold text-sm border-b">Unread Messages</div>
            {unreadPreviews.length === 0 ? (
              <div className="px-3 py-2 text-xs text-gray-500">No new messages.</div>
            ) : (
              unreadPreviews.map(msg => (
                <DropdownMenuItem key={msg.id} onClick={() => navigate('/dashboard/member/messages')} className="flex flex-col items-start cursor-pointer">
                  <span className="font-medium text-sm truncate w-full">{msg.subject}</span>
                  <span className="text-xs text-gray-500">{msg.sender ? `${msg.sender.first_name} ${msg.sender.last_name}` : 'Unknown'} &middot; {msg.created_at ? new Date(msg.created_at).toLocaleString() : ''}</span>
                </DropdownMenuItem>
              ))
            )}
            <DropdownMenuItem onClick={() => navigate('/dashboard/member/messages')} className="text-center text-blue-600 cursor-pointer font-semibold">View all messages</DropdownMenuItem>
            {/* System Notifications Section */}
            <div className="px-3 py-2 font-semibold text-sm border-b mt-2">System Alerts</div>
            {loadingSystem ? (
              <div className="px-3 py-2 text-xs text-gray-500">Loading...</div>
            ) : systemNotifications.length === 0 ? (
              <div className="px-3 py-2 text-xs text-gray-500">No system alerts.</div>
            ) : (
              systemNotifications.slice(0, 5).map(n => (
                <DropdownMenuItem key={n.id} className="flex flex-col items-start cursor-pointer">
                  <span className="font-medium text-sm truncate w-full">{n.title || n.message || 'System Alert'}</span>
                  <span className="text-xs text-gray-500">{n.created_at ? new Date(n.created_at).toLocaleString() : ''}</span>
                </DropdownMenuItem>
              ))
            )}
            {/* Event Reminders Section */}
            <div className="px-3 py-2 font-semibold text-sm border-b mt-2">Event Reminders</div>
            {eventReminders.length === 0 ? (
              <div className="px-3 py-2 text-xs text-gray-500">No upcoming events.</div>
            ) : (
              eventReminders.map(ev => (
                <DropdownMenuItem key={ev.id} className="flex flex-col items-start cursor-pointer">
                  <span className="font-medium text-sm truncate w-full">{ev.title}</span>
                  <span className="text-xs text-gray-500">{ev.start_date ? new Date(ev.start_date).toLocaleString() : ''} {ev.location && `@ ${ev.location}`}</span>
                </DropdownMenuItem>
              ))
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src="" alt={user?.email || ''} />
                <AvatarFallback>
                  {user?.email ? getInitials(user.email) : 'U'}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {user?.email || 'User'}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.email || ''}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate('/settings-dashboard')}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sign out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
