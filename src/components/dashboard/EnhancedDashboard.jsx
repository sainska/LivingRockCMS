
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  Calendar, 
  DollarSign, 
  Bell, 
  TrendingUp, 
  Heart,
  MessageSquare,
  Home,
  UserCheck,
  Target
} from 'lucide-react';
import { useChurchData } from '@/hooks/useChurchData';
import { useNotifications } from '@/hooks/useNotifications';
import { useDonations } from '@/hooks/useDonations';
import { useEvents } from '@/hooks/useEvents';
import { usePrayerRequests } from '@/hooks/usePrayerRequests';
import { format } from 'date-fns';

const EnhancedDashboard = () => {
  const { stats, loading: statsLoading } = useChurchData();
  const { notifications, unreadCount } = useNotifications();
  const { donations } = useDonations();
  const { events } = useEvents();
  const { prayerRequests } = usePrayerRequests();

  const recentDonations = donations.slice(0, 5);
  const upcomingEvents = events
    .filter(event => new Date(event.start_date) > new Date())
    .slice(0, 3);
  const recentNotifications = notifications.slice(0, 3);
  const activePrayerRequests = prayerRequests
    .filter(request => request.status === 'active')
    .slice(0, 3);

  if (statsLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-8 bg-muted rounded mb-2"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total_members || 0}</div>
            <p className="text-xs text-muted-foreground">
              +{stats?.new_members_this_month || 0} this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Donations</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              KES {stats?.monthly_donations?.toLocaleString() || '0'}
            </div>
            <p className="text-xs text-muted-foreground">
              Total: KES {stats?.total_donations?.toLocaleString() || '0'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.upcoming_events || 0}</div>
            <p className="text-xs text-muted-foreground">Next 30 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Notifications</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{unreadCount}</div>
            <p className="text-xs text-muted-foreground">Unread messages</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Recent Donations */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Recent Donations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentDonations.length > 0 ? (
              recentDonations.map((donation) => (
                <div key={donation.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium">
                      {donation.is_anonymous ? 'Anonymous' : 
                       donation.profiles ? `${donation.profiles.first_name} ${donation.profiles.last_name}` : 'Unknown'}
                    </p>
                    <p className="text-sm text-muted-foreground capitalize">
                      {donation.donation_type}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">
                      KES {donation.amount.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(donation.donation_date), 'MMM dd')}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-center py-4">No recent donations</p>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Upcoming Events
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingEvents.length > 0 ? (
              upcomingEvents.map((event) => (
                <div key={event.id} className="p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium">{event.title}</p>
                      <p className="text-sm text-muted-foreground">{event.location}</p>
                    </div>
                    <Badge variant="outline" className="capitalize">
                      {event.event_type}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {format(new Date(event.start_date), 'MMM dd, yyyy - HH:mm')}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-center py-4">No upcoming events</p>
            )}
          </CardContent>
        </Card>

        {/* Prayer Requests */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5" />
              Active Prayer Requests
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {activePrayerRequests.length > 0 ? (
              activePrayerRequests.map((request) => (
                <div key={request.id} className="p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-medium line-clamp-1">{request.title}</p>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {request.description}
                      </p>
                    </div>
                    {request.is_urgent && (
                      <Badge variant="destructive" className="ml-2">
                        Urgent
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {format(new Date(request.created_at), 'MMM dd, yyyy')}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-center py-4">No active prayer requests</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Notifications */}
      {recentNotifications.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
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
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Users className="h-6 w-6" />
              Add Member
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Calendar className="h-6 w-6" />
              Create Event
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <DollarSign className="h-6 w-6" />
              Record Donation
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <UserCheck className="h-6 w-6" />
              Take Attendance
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedDashboard;
