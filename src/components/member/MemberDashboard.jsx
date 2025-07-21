import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Users, 
  Calendar, 
  DollarSign, 
  Bell, 
  TrendingUp, 
  Heart,
  MessageSquare,
  UserCheck,
  Target,
  Clock,
  MapPin,
  Activity
} from 'lucide-react';
import { useMemberDashboard } from '@/hooks/useMemberDashboard';
import { useUserRole } from '@/hooks/useUserRole';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

const MemberDashboard = () => {
  const { role } = useUserRole();
  const { memberData, loading, error } = useMemberDashboard(role?.userId);
  const navigate = useNavigate();

  if (loading) {
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

  if (error) {
    return (
      <div className="p-6">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-6">
            <p className="text-red-600">Error loading dashboard: {error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { profile, memberInfo, roles, ministries, attendance, giving, messages, announcements, upcomingEvents } = memberData;

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          Welcome back, {profile?.first_name || 'Member'}!
        </h1>
        <p className="text-blue-100">
          Here's your personal dashboard with all your church activities and information.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ministries</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ministries.length}</div>
            <p className="text-xs text-muted-foreground">
              Active ministries
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{attendance.stats.attendanceRate}%</div>
            <p className="text-xs text-muted-foreground">
              {attendance.stats.presentCount} of {attendance.stats.totalEvents} events
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Given</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              KES {Number(giving.stats.totalGiven).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              KES {Number(giving.stats.monthlyGiven).toLocaleString()} this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Messages</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{messages.length}</div>
            <p className="text-xs text-muted-foreground">
              {messages.filter(m => !m.is_read).length} unread
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* My Ministries */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              My Ministries
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {ministries.length > 0 ? (
              ministries.map((ministry) => (
                <div key={ministry.ministry_id} className="p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium">{ministry.ministries.name}</p>
                      <p className="text-sm text-muted-foreground">{ministry.ministries.description}</p>
                    </div>
                    <Badge variant="outline" className="capitalize">
                      {ministry.role}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{ministry.ministries.meeting_time}</span>
                    <MapPin className="h-3 w-3 ml-2" />
                    <span>{ministry.ministries.location}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-center py-4">No ministries joined yet</p>
            )}
          </CardContent>
        </Card>

        {/* Recent Giving */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Recent Giving
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {giving.transactions.length > 0 ? (
              giving.transactions.slice(0, 5).map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium capitalize">
                      {transaction.financial_accounts?.name || 'General'}
                    </p>
                    <p className="text-sm text-muted-foreground capitalize">
                      {transaction.financial_accounts?.account_type}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">
                      KES {Number(transaction.amount).toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(transaction.date), 'MMM dd')}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-center py-4">No recent giving records</p>
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

        {/* Recent Messages */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Recent Messages
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {messages.length > 0 ? (
              messages.slice(0, 5).map((message) => (
                <div key={message.id} className="p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-medium">{message.subject || 'No Subject'}</p>
                      <p className="text-sm text-muted-foreground">
                        From: {message.profiles?.first_name} {message.profiles?.last_name}
                      </p>
                    </div>
                    {!message.is_read && (
                      <Badge variant="destructive" className="text-xs">
                        New
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {format(new Date(message.created_at), 'MMM dd, HH:mm')}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-center py-4">No messages</p>
            )}
          </CardContent>
        </Card>

        {/* Attendance Progress */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="h-5 w-5" />
              Attendance Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Overall Attendance</span>
                <span>{attendance.stats.attendanceRate}%</span>
              </div>
              <Progress value={attendance.stats.attendanceRate} className="h-2" />
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-green-600">{attendance.stats.presentCount}</p>
                <p className="text-xs text-muted-foreground">Present</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-yellow-600">{attendance.stats.lateCount}</p>
                <p className="text-xs text-muted-foreground">Late</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-red-600">{attendance.stats.absentCount}</p>
                <p className="text-xs text-muted-foreground">Absent</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Announcements */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Recent Announcements
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {announcements.length > 0 ? (
              announcements.map((announcement) => (
                <div key={announcement.id} className="p-3 bg-muted/50 rounded-lg">
                  <p className="font-medium">{announcement.title}</p>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {announcement.content}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {format(new Date(announcement.created_at), 'MMM dd, yyyy')}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-center py-4">No recent announcements</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <Button 
              variant="outline" 
              className="h-20 flex flex-col gap-2"
              onClick={() => navigate('/member/profile')}
            >
              <UserCheck className="h-6 w-6" />
              <span>Update Profile</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex flex-col gap-2"
              onClick={() => navigate('/member/ministries')}
            >
              <Users className="h-6 w-6" />
              <span>Join Ministry</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex flex-col gap-2"
              onClick={() => navigate('/member/giving')}
            >
              <DollarSign className="h-6 w-6" />
              <span>Make Donation</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex flex-col gap-2"
              onClick={() => navigate('/member/messages')}
            >
              <MessageSquare className="h-6 w-6" />
              <span>View Messages</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MemberDashboard; 