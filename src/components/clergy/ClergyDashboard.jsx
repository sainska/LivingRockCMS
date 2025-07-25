import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Users, 
  Calendar, 
  Heart, 
  Bell, 
  MessageSquare,
  UserCheck,
  Target,
  Clock,
  MapPin,
  Activity,
  Phone,
  Mail,
  Home,
  TrendingUp,
  Megaphone,
  AlertTriangle
} from 'lucide-react';
import { useClergyDashboard } from '@/hooks/useClergyDashboard';
import { useUserRole } from '@/hooks/useUserRole';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import MemberMessages from '../member/MemberMessages';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

const ClergyDashboard = () => {
  const { role } = useUserRole();
  const { clergyData, loading, error } = useClergyDashboard(role?.userId);
  const navigate = useNavigate();
  const [announcements, setAnnouncements] = useState([]);
  const [announcementsError, setAnnouncementsError] = useState(null);
  const [announcementsLoading, setAnnouncementsLoading] = useState(true);
  const [urgentAlerts, setUrgentAlerts] = useState([]);
  const [urgentAlertsError, setUrgentAlertsError] = useState(null);
  const [urgentAlertsLoading, setUrgentAlertsLoading] = useState(true);

  useEffect(() => {
    setAnnouncementsLoading(true);
    setAnnouncementsError(null);
    supabase
      .from('announcements')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5)
      .then(({ data, error }) => {
        if (error) {
          setAnnouncementsError(error.message);
          setAnnouncements([]);
        } else {
          setAnnouncements(data || []);
        }
        setAnnouncementsLoading(false);
      });
    setUrgentAlertsLoading(true);
    setUrgentAlertsError(null);
    supabase
      .from('system_notifications')
      .select('*')
      .eq('notification_type', 'urgent')
      .order('created_at', { ascending: false })
      .limit(5)
      .then(({ data, error }) => {
        if (error) {
          setUrgentAlertsError(error.message);
          setUrgentAlerts([]);
        } else {
          setUrgentAlerts(data || []);
        }
        setUrgentAlertsLoading(false);
      });
  }, []);

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
            <p className="text-red-600">Error loading clergy dashboard: {error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { 
    profile, 
    ministries, 
    pastoralVisits, 
    counselingSessions, 
    memberRequests, 
    attendanceStats, 
    memberActivity, 
    upcomingEvents, 
    announcements: dashboardAnnouncements // Renamed to avoid conflict
  } = clergyData;

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          Welcome, {profile?.first_name || 'Pastor'} {profile?.last_name || ''}!
        </h1>
        <p className="text-purple-100">
          Your pastoral care dashboard with ministry oversight and member care.
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ministries Led</CardTitle>
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
            <CardTitle className="text-sm font-medium">Pastoral Visits</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pastoralVisits.total}</div>
            <p className="text-xs text-muted-foreground">
              {pastoralVisits.thisMonth} this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Counseling Sessions</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{counselingSessions.total}</div>
            <p className="text-xs text-muted-foreground">
              {counselingSessions.thisMonth} this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{attendanceStats.attendanceRate}%</div>
            <p className="text-xs text-muted-foreground">
              Overall church attendance
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
                <div key={ministry.id} className="p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium">{ministry.name}</p>
                      <p className="text-sm text-muted-foreground">{ministry.description}</p>
                    </div>
                    <Badge variant="outline" className="capitalize">
                      Leader
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{ministry.meeting_time}</span>
                    <MapPin className="h-3 w-3 ml-2" />
                    <span>{ministry.location}</span>
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground">
                    {ministry.ministry_members?.length || 0} members
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-center py-4">No ministries assigned</p>
            )}
          </CardContent>
        </Card>

        {/* Recent Pastoral Visits */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5" />
              Recent Pastoral Visits
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {pastoralVisits.all.length > 0 ? (
              pastoralVisits.all.slice(0, 5).map((visit) => (
                <div key={visit.id} className="p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium">
                        {visit.profiles?.first_name} {visit.profiles?.last_name}
                      </p>
                      <p className="text-sm text-muted-foreground">{visit.purpose}</p>
                    </div>
                    {visit.follow_up_required && (
                      <Badge variant="destructive" className="text-xs">
                        Follow-up
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>{format(new Date(visit.visit_date), 'MMM dd, yyyy')}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-center py-4">No recent visits</p>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Counseling Sessions */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Upcoming Counseling
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {counselingSessions.upcoming.length > 0 ? (
              counselingSessions.upcoming.map((session) => (
                <div key={session.id} className="p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium">
                        {session.profiles?.first_name} {session.profiles?.last_name}
                      </p>
                      <p className="text-sm text-muted-foreground">{session.topic}</p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {session.duration_minutes}min
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>{format(new Date(session.session_date), 'MMM dd, yyyy')}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-center py-4">No upcoming sessions</p>
            )}
          </CardContent>
        </Card>

        {/* Members Needing Follow-up */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="h-5 w-5" />
              Follow-up Required
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {memberRequests.length > 0 ? (
              memberRequests.slice(0, 5).map((member, index) => (
                <div key={index} className="p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium">
                        {member.first_name} {member.last_name}
                      </p>
                      <p className="text-sm text-muted-foreground">{member.visitPurpose}</p>
                    </div>
                    <Badge variant="destructive" className="text-xs">
                      Follow-up
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                    <Phone className="h-3 w-3" />
                    <span>{member.phone}</span>
                    <Mail className="h-3 w-3 ml-2" />
                    <span>{member.email}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-center py-4">No follow-ups needed</p>
            )}
          </CardContent>
        </Card>

        {/* Attendance Overview */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Attendance Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Overall Attendance</span>
                <span>{attendanceStats.attendanceRate}%</span>
              </div>
              <Progress value={attendanceStats.attendanceRate} className="h-2" />
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-green-600">{attendanceStats.presentCount}</p>
                <p className="text-xs text-muted-foreground">Present</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-yellow-600">{attendanceStats.lateCount}</p>
                <p className="text-xs text-muted-foreground">Late</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-red-600">{attendanceStats.absentCount}</p>
                <p className="text-xs text-muted-foreground">Absent</p>
              </div>
            </div>
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
      </div>

      {/* Member Activity Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Member Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {memberActivity.slice(0, 6).map((member) => (
              <div key={member.id} className="p-4 border rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
                    {member.first_name?.[0]}{member.last_name?.[0]}
                  </div>
                  <div>
                    <p className="font-medium">
                      {member.first_name} {member.last_name}
                    </p>
                    <p className="text-sm text-muted-foreground">{member.email}</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <Badge variant={member.members?.status === 'active' ? 'default' : 'secondary'}>
                      {member.members?.status || 'Unknown'}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Ministries:</span>
                    <span>{member.ministry_members?.length || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Attendance:</span>
                    <span>{member.attendance_records?.length || 0} events</span>
                  </div>
                </div>
                <div className="mt-3 flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    <Phone className="h-3 w-3 mr-1" />
                    Call
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    <Mail className="h-3 w-3 mr-1" />
                    Email
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

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
              onClick={() => navigate('/clergy/visits')}
            >
              <Heart className="h-6 w-6" />
              <span>Schedule Visit</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex flex-col gap-2"
              onClick={() => navigate('/clergy/counseling')}
            >
              <MessageSquare className="h-6 w-6" />
              <span>Counseling</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex flex-col gap-2"
              onClick={() => navigate('/clergy/members')}
            >
              <Users className="h-6 w-6" />
              <span>Member Care</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex flex-col gap-2"
              onClick={() => navigate('/clergy/ministries')}
            >
              <Target className="h-6 w-6" />
              <span>Ministries</span>
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
          <MemberMessages role="clergy" />
        </CardContent>
      </Card>

      {/* Communication Section */}
      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Mail className="h-6 w-6 text-blue-500" /> Communication
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Announcements Card */}
          <Card className="border-blue-200 shadow-md">
            <CardHeader className="flex items-center gap-2 bg-blue-50 rounded-t">
              <Megaphone className="h-5 w-5 text-blue-600" />
              <CardTitle className="text-blue-700">Announcements</CardTitle>
            </CardHeader>
            <CardContent>
              {announcementsLoading ? <div className="text-gray-400">Loading...</div> :
               announcementsError ? <div className="text-red-500">{announcementsError}</div> :
               announcements.length === 0 ? <div className="text-gray-400">No announcements.</div> :
                 announcements.map(a => (
                   <div key={a.id} className="mb-3 p-2 rounded bg-blue-100">
                     <div className="font-semibold text-blue-800">{a.title}</div>
                     <div className="text-xs text-gray-500">{a.created_at ? new Date(a.created_at).toLocaleString() : ''}</div>
                     <div className="text-sm">{a.content}</div>
                   </div>
                 ))}
              <Button className="mt-2 w-full" variant="outline" onClick={() => navigate('/clergy/announcements')}>View All Announcements</Button>
            </CardContent>
          </Card>
          {/* Messages Card */}
          <Card className="border-green-200 shadow-md">
            <CardHeader className="flex items-center gap-2 bg-green-50 rounded-t">
              <Mail className="h-5 w-5 text-green-600" />
              <CardTitle className="text-green-700">Messages</CardTitle>
            </CardHeader>
            <CardContent>
              <MemberMessages role="clergy" />
              <Button className="mt-2 w-full" variant="outline" onClick={() => navigate('/clergy/messages')}>Open Full Messages</Button>
            </CardContent>
          </Card>
          {/* Urgent Alerts Card */}
          <Card className="border-red-200 shadow-md">
            <CardHeader className="flex items-center gap-2 bg-red-50 rounded-t">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <CardTitle className="text-red-700">Urgent Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              {urgentAlertsLoading ? <div className="text-gray-400">Loading...</div> :
               urgentAlertsError ? <div className="text-red-500">{urgentAlertsError}</div> :
               urgentAlerts.length === 0 ? <div className="text-gray-400">No urgent alerts.</div> :
                 urgentAlerts.map(alert => (
                   <div key={alert.id} className="mb-3 p-2 rounded bg-gradient-to-r from-red-100 to-red-200">
                     <div className="font-semibold text-red-700">{alert.title || 'Urgent Alert'}</div>
                     <div className="text-xs text-gray-500">{alert.created_at ? new Date(alert.created_at).toLocaleString() : ''}</div>
                     <div className="text-sm">{alert.message}</div>
                   </div>
                 ))}
              <Button className="mt-2 w-full" variant="outline" onClick={() => navigate('/clergy/alerts')}>View All Alerts</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ClergyDashboard; 