
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Calendar,
  Heart,
  BookOpen,
  Users,
  Bell,
  MessageSquare,
  Church,
  User,
  Clock,
  MapPin,
  Settings
} from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';
import { useUserRole } from '@/hooks/useUserRole';
import { useEvents } from '@/hooks/useEvents';
import { usePrayerRequests } from '@/hooks/usePrayerRequests';
import { useNotifications } from '@/hooks/useNotifications';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import MemberMessages from '../member/MemberMessages';

const UserDashboard = () => {
  const { user } = useAuth();
  const { profile } = useUserRole();
  const { events, loading: eventsLoading } = useEvents();
  const { prayerRequests, loading: prayerLoading } = usePrayerRequests();
  const { notifications, unreadCount } = useNotifications();
  const navigate = useNavigate();

  const [announcements, setAnnouncements] = useState([]);
  const [urgentAlerts, setUrgentAlerts] = useState([]);

  useEffect(() => {
    // Fetch announcements
    supabase
      .from('announcements')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5)
      .then(({ data }) => setAnnouncements(data || []));
    // Fetch urgent alerts
    supabase
      .from('system_notifications')
      .select('*')
      .eq('notification_type', 'urgent')
      .order('created_at', { ascending: false })
      .limit(5)
      .then(({ data }) => setUrgentAlerts(data || []));
  }, []);

  const upcomingEvents = events
    .filter(event => new Date(event.start_date) > new Date())
    .slice(0, 5);

  const recentPrayerRequests = prayerRequests
    .filter(request => request.status === 'active' && !request.is_anonymous)
    .slice(0, 3);

  const recentNotifications = notifications.slice(0, 3);

  const userMetrics = [
    {
      title: "Upcoming Events",
      value: upcomingEvents.length,
      change: "Next 30 days",
      icon: Calendar,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Prayer Requests",
      value: recentPrayerRequests.length,
      change: "Active requests",
      icon: Heart,
      color: "text-red-600",
      bgColor: "bg-red-50"
    },
    {
      title: "Notifications",
      value: unreadCount,
      change: "Unread messages",
      icon: Bell,
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    },
    {
      title: "Community",
      value: "Active",
      change: "Member status",
      icon: Users,
      color: "text-green-600",
      bgColor: "bg-green-50"
    }
  ];

  if (eventsLoading || prayerLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">
            Welcome, {profile?.first_name || 'Member'}!
          </h1>
          <p className="text-muted-foreground">Living Rock Church - Member Portal</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => navigate('/events')}>
            <Calendar className="h-4 w-4 mr-2" />
            View Events
          </Button>
          <Button variant="outline" onClick={() => navigate('/profile')}>
            <User className="h-4 w-4 mr-2" />
            My Profile
          </Button>
          <Button variant="outline" onClick={() => navigate('/') }>
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* User Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {userMetrics.map((metric, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{metric.title}</p>
                  <p className="text-2xl font-bold">{metric.value}</p>
                  <p className="text-xs text-muted-foreground">{metric.change}</p>
                </div>
                <div className={`p-3 rounded-lg ${metric.bgColor}`}>
                  <metric.icon className={`h-6 w-6 ${metric.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Events */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Upcoming Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingEvents.length > 0 ? (
                upcomingEvents.map((event) => (
                  <div key={event.id} className="p-3 rounded-lg border">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium">{event.title}</h4>
                      <Badge variant="outline" className="capitalize">
                        {event.event_type}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {format(new Date(event.start_date), 'MMM dd, yyyy HH:mm')}
                      </div>
                      {event.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {event.location}
                        </div>
                      )}
                    </div>
                    {event.description && (
                      <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                        {event.description}
                      </p>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-muted-foreground">No upcoming events</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Prayer Requests */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5" />
              Community Prayer Requests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentPrayerRequests.length > 0 ? (
                recentPrayerRequests.map((request) => (
                  <div key={request.id} className="p-3 rounded-lg border">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium line-clamp-1">{request.title}</h4>
                      {request.is_urgent && (
                        <Badge variant="destructive">Urgent</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {request.description}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {format(new Date(request.created_at), 'MMM dd, yyyy')}
                    </p>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-muted-foreground">No active prayer requests</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Notifications */}
      {recentNotifications.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Recent Notifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentNotifications.map((notification) => (
                <div key={notification.id} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                  <div className={`p-2 rounded-full ${
                    notification.notification_type === 'urgent' ? 'bg-red-100 text-red-600' :
                    notification.notification_type === 'warning' ? 'bg-yellow-100 text-yellow-600' :
                    notification.notification_type === 'success' ? 'bg-green-100 text-green-600' :
                    'bg-blue-100 text-blue-600'
                  }`}>
                    <Bell className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{notification.title}</p>
                    <p className="text-sm text-muted-foreground">{notification.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {format(new Date(notification.created_at), 'MMM dd, yyyy HH:mm')}
                    </p>
                  </div>
                  {!notification.is_read && (
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Button 
              variant="outline" 
              className="h-20 flex-col gap-2"
              onClick={() => navigate('/events')}
            >
              <Calendar className="h-6 w-6" />
              View Events
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex-col gap-2"
              onClick={() => navigate('/prayers')}
            >
              <Heart className="h-6 w-6" />
              Prayer Requests
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex-col gap-2"
              onClick={() => navigate('/sermons')}
            >
              <BookOpen className="h-6 w-6" />
              Sermons
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex-col gap-2"
              onClick={() => navigate('/profile')}
            >
              <User className="h-6 w-6" />
              My Profile
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Messages */}
      <Card>
        <CardHeader>
          <CardTitle>Messages</CardTitle>
        </CardHeader>
        <CardContent>
          <MemberMessages role="user" />
        </CardContent>
      </Card>

      {/* Communication Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Announcements</CardTitle>
          </CardHeader>
          <CardContent>
            {announcements.length === 0 ? <div className="text-gray-400">No announcements.</div> :
              announcements.map(a => (
                <div key={a.id} className="mb-3 p-2 rounded bg-blue-50">
                  <div className="font-semibold">{a.title}</div>
                  <div className="text-xs text-gray-500">{a.created_at ? new Date(a.created_at).toLocaleString() : ''}</div>
                  <div className="text-sm">{a.content}</div>
                </div>
              ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Messages</CardTitle>
          </CardHeader>
          <CardContent>
            <MemberMessages role="user" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Urgent Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            {urgentAlerts.length === 0 ? <div className="text-gray-400">No urgent alerts.</div> :
              urgentAlerts.map(alert => (
                <div key={alert.id} className="mb-3 p-2 rounded bg-gradient-to-r from-red-100 to-red-200">
                  <div className="font-semibold text-red-700">{alert.title || 'Urgent Alert'}</div>
                  <div className="text-xs text-gray-500">{alert.created_at ? new Date(alert.created_at).toLocaleString() : ''}</div>
                  <div className="text-sm">{alert.message}</div>
                </div>
              ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserDashboard;
