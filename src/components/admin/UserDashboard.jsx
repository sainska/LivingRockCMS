import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Calendar,
  Heart,
  BookOpen,
  Users,
  Church,
  Gift,
  MessageCircle,
  Bell,
  UserCheck,
  Clock
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useState, useEffect } from 'react';
import { useUserRole } from '@/hooks/useUserRole';

const UserDashboard = () => {
  const navigate = useNavigate();
  const { role, profile, loading } = useUserRole();

  const memberInfo = {
    name: "John Doe",
    membershipNumber: "LRC20240123",
    joinDate: "January 15, 2024",
    status: "Active",
    ministry: "Youth Ministry"
  };

  const personalMetrics = [
    {
      title: "Service Attendance",
      value: "92%",
      change: "Last 3 months",
      icon: Church,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Bible Studies Attended",
      value: "18",
      change: "This year",
      icon: BookOpen,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Ministry Involvement",
      value: "2",
      change: "Active ministries",
      icon: Heart,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      title: "Giving Record",
      value: "KSh 45,000",
      change: "This year",
      icon: Gift,
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    }
  ];

  const upcomingEvents = [
    {
      id: 1,
      title: "Sunday Morning Service",
      date: "2024-06-16",
      time: "9:00 AM",
      location: "Main Sanctuary",
      registered: true
    },
    {
      id: 2,
      title: "Youth Conference",
      date: "2024-06-22",
      time: "6:00 PM",
      location: "Conference Hall",
      registered: false
    },
    {
      id: 3,
      title: "Bible Study",
      date: "2024-06-19",
      time: "7:00 PM",
      location: "Small Hall",
      registered: true
    }
  ];

  const ministryActivities = [
    {
      id: 1,
      ministry: "Youth Ministry",
      role: "Member",
      nextMeeting: "2024-06-20",
      status: "Active"
    },
    {
      id: 2,
      ministry: "Prayer Team",
      role: "Coordinator",
      nextMeeting: "2024-06-18",
      status: "Active"
    }
  ];

  const announcements = [
    {
      title: "Church Building Fund Drive",
      content: "Join us in raising funds for the new church building project.",
      date: "2024-06-10",
      priority: "High"
    },
    {
      title: "Youth Conference Registration",
      content: "Register now for the upcoming youth conference on June 22nd.",
      date: "2024-06-08",
      priority: "Medium"
    },
    {
      title: "New Bible Study Groups",
      content: "New small group Bible studies starting this month.",
      date: "2024-06-05",
      priority: "Low"
    }
  ];

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High": return "bg-red-100 text-red-800";
      case "Medium": return "bg-yellow-100 text-yellow-800";
      case "Low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const handleQuickAction = (action) => {
    switch (action) {
      case 'donation':
        navigate('/donations'); // Navigate to donation page
        break;
      case 'event-registration':
        navigate('/events'); // Navigate to events page
        break;
      case 'prayer-request':
        // Open prayer request modal (example implementation)
        setShowPrayerRequestModal(true);
        break;
      case 'profile':
        navigate('/profile'); // Navigate to profile page
        break;
      default:
        console.log('Action not implemented:', action);
    }
  };

  const handleEventRegistration = (eventId) => {
    console.log('Registering for event:', eventId);
    // Implement event registration logic
  };

  const [personalInfo, setPersonalInfo] = useState({ first_name: '', last_name: '', email: '', phone: '' });
  const [saveStatus, setSaveStatus] = useState('');
  const [milestones, setMilestones] = useState([]);
  const [milestonesLoading, setMilestonesLoading] = useState(true);
  const [showPrayerRequestModal, setShowPrayerRequestModal] = useState(false);
  const [prayerRequestText, setPrayerRequestText] = useState('');
  const [prayerRequestStatus, setPrayerRequestStatus] = useState('');

  useEffect(() => {
    if (profile) {
      setPersonalInfo({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        email: profile.email || '',
        phone: profile.phone || ''
      });
    }
  }, [profile]);

  useEffect(() => {
    if (!profile) return;
    setMilestonesLoading(true);
    const fetchMilestones = async () => {
      const { data, error } = await supabase
        .from('milestones')
        .select('*')
        .eq('member_id', profile.id)
        .order('date', { ascending: false });
      setMilestones(data || []);
      setMilestonesLoading(false);
    };
    fetchMilestones();
  }, [profile]);

  const handleSavePersonalInfo = async (e) => {
    e.preventDefault();
    setSaveStatus('');
    const { error } = await supabase
      .from('profiles')
      .update({
        first_name: personalInfo.first_name,
        last_name: personalInfo.last_name,
        email: personalInfo.email,
        phone: personalInfo.phone
      })
      .eq('id', profile.id);
    if (error) {
      setSaveStatus('Error saving changes');
    } else {
      setSaveStatus('Changes saved successfully');
    }
  };

  const handlePrayerRequestSubmit = async (e) => {
    e.preventDefault();
    setPrayerRequestStatus('');
    // Save prayer request to Supabase
    const { error } = await supabase
      .from('prayer_requests')
      .insert({
        member_id: profile.id,
        request: prayerRequestText,
        created_at: new Date().toISOString()
      });
    if (error) {
      setPrayerRequestStatus('Error submitting request');
    } else {
      setPrayerRequestStatus('Request submitted successfully');
      setPrayerRequestText('');
      setTimeout(() => setShowPrayerRequestModal(false), 1500);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-xiracom-blue"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">
            Welcome, {profile?.first_name && profile?.last_name ? `${profile.first_name} ${profile.last_name}` : profile?.first_name || 'Member'}!
          </h1>
          <p className="text-muted-foreground">Living Rock Church - Member Portal</p>
        </div>
        <div className="text-right">
          <Badge className="bg-green-100 text-green-800">
            {memberInfo.status} Member
          </Badge>
          <p className="text-sm text-muted-foreground mt-1">
            {memberInfo.membershipNumber}
          </p>
        </div>
      </div>

      {/* Member Info Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Member Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Name</p>
              <p className="font-medium">{profile?.first_name && profile?.last_name ? `${profile.first_name} ${profile.last_name}` : profile?.first_name || 'Member'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Membership Number</p>
              <p className="font-medium">{profile?.membership_number || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Join Date</p>
              <p className="font-medium">{profile?.join_date ? new Date(profile.join_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <Badge className="bg-green-100 text-green-800">{profile?.status || 'Active'}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personal Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {personalMetrics.map((metric, index) => (
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
              {upcomingEvents.map((event) => (
                <div key={event.id} className="flex items-center justify-between p-3 rounded-lg border">
                  <div>
                    <p className="font-medium">{event.title}</p>
                    <p className="text-sm text-muted-foreground">
                      <Clock className="h-3 w-3 inline mr-1" />
                      {event.date} at {event.time}
                    </p>
                    <p className="text-xs text-muted-foreground">{event.location}</p>
                  </div>
                  <div className="text-right">
                    {event.registered ? (
                      <Badge className="bg-green-100 text-green-800">
                        <UserCheck className="h-3 w-3 mr-1" />
                        Registered
                      </Badge>
                    ) : (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleEventRegistration(event.id)}
                      >
                        Register
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Ministry Activities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5" />
              Ministry Activities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {ministryActivities.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-3 rounded-lg border">
                  <div>
                    <p className="font-medium">{activity.ministry}</p>
                    <p className="text-sm text-muted-foreground">Role: {activity.role}</p>
                    <p className="text-xs text-muted-foreground">
                      Next meeting: {activity.nextMeeting}
                    </p>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800">{activity.status}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Church Announcements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Church Announcements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {announcements.map((announcement, index) => (
              <div key={index} className="p-4 rounded-lg border">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium">{announcement.title}</h4>
                  <div className="flex items-center gap-2">
                    <Badge className={getPriorityColor(announcement.priority)}>
                      {announcement.priority}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{announcement.date}</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{announcement.content}</p>
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Button 
              className="h-16 flex-col gap-2"
              onClick={() => handleQuickAction('donation')}
            >
              <Gift className="h-5 w-5" />
              Make Donation
            </Button>
            <Button 
              variant="outline" 
              className="h-16 flex-col gap-2"
              onClick={() => handleQuickAction('event-registration')}
            >
              <Calendar className="h-5 w-5" />
              Event Registration
            </Button>
            <Button 
              variant="outline" 
              className="h-16 flex-col gap-2"
              onClick={() => handleQuickAction('prayer-request')}
            >
              <MessageCircle className="h-5 w-5" />
              Prayer Request
            </Button>
            <Button 
              variant="outline" 
              className="h-16 flex-col gap-2"
              onClick={() => handleQuickAction('profile')}
            >
              <Users className="h-5 w-5" />
              My Profile
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Member Profile Sections (Tabs) */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Member Profile Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="personal" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="personal">Personal Info</TabsTrigger>
              <TabsTrigger value="milestones">Milestones</TabsTrigger>
              <TabsTrigger value="groups">Groups & Ministries</TabsTrigger>
            </TabsList>
            <TabsContent value="personal">
              {profile ? (
                <form className="space-y-4" onSubmit={handleSavePersonalInfo}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-muted-foreground">First Name</label>
                      <input type="text" className="input input-bordered w-full" value={personalInfo.first_name} onChange={e => setPersonalInfo({ ...personalInfo, first_name: e.target.value })} />
                    </div>
                    <div>
                      <label className="block text-sm text-muted-foreground">Last Name</label>
                      <input type="text" className="input input-bordered w-full" value={personalInfo.last_name} onChange={e => setPersonalInfo({ ...personalInfo, last_name: e.target.value })} />
                    </div>
                    <div>
                      <label className="block text-sm text-muted-foreground">Email</label>
                      <input type="email" className="input input-bordered w-full" value={personalInfo.email} onChange={e => setPersonalInfo({ ...personalInfo, email: e.target.value })} />
                    </div>
                    <div>
                      <label className="block text-sm text-muted-foreground">Phone</label>
                      <input type="text" className="input input-bordered w-full" value={personalInfo.phone || ''} onChange={e => setPersonalInfo({ ...personalInfo, phone: e.target.value })} />
                    </div>
                  </div>
                  <button type="submit" className="btn btn-primary mt-4">Save Changes</button>
                  {saveStatus && <p className="text-green-600 mt-2">{saveStatus}</p>}
                </form>
              ) : (
                <div>Loading personal info...</div>
              )}
            </TabsContent>
            <TabsContent value="milestones">
              {milestonesLoading ? (
                <div>Loading milestones...</div>
              ) : milestones.length === 0 ? (
                <div>No milestones recorded yet.</div>
              ) : (
                <div className="space-y-4">
                  {milestones.map((milestone, idx) => {
                    return (
                      <div key={idx} className="p-4 border rounded-lg flex justify-between items-center">
                        <div>
                          <p className="font-semibold">{milestone.type}</p>
                          <p className="text-sm text-muted-foreground">{milestone.date ? new Date(milestone.date).toLocaleDateString() : ''}</p>
                        </div>
                        {milestone.certificate_url && (
                          <a href={milestone.certificate_url} target="_blank" rel="noopener noreferrer" className="btn btn-outline">Download Certificate</a>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </TabsContent>
            <TabsContent value="groups">
              {/* Groups & Ministries Section */}
              <GroupsAndMinistriesSection />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {showPrayerRequestModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Submit Prayer Request</h2>
            <form onSubmit={handlePrayerRequestSubmit} className="space-y-4">
              <textarea className="input input-bordered w-full" rows={4} placeholder="Your prayer request..." value={prayerRequestText} onChange={e => setPrayerRequestText(e.target.value)} />
              <div className="flex justify-end gap-2">
                <button type="button" className="btn btn-outline" onClick={() => setShowPrayerRequestModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Submit</button>
              </div>
            </form>
            {prayerRequestStatus && <p className="text-green-600 mt-2">{prayerRequestStatus}</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;

function GroupsAndMinistriesSection() {
  const { user } = useAuth();
  const [myMinistries, setMyMinistries] = useState([]);
  const [allMinistries, setAllMinistries] = useState([]);
  const [upcomingActivities, setUpcomingActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    const fetchMinistries = async () => {
      // Fetch all ministries
      const { data: ministries } = await supabase
        .from('ministries')
        .select('*')
        .eq('is_active', true)
        .order('name', { ascending: true });
      setAllMinistries(ministries || []);

      // Fetch member's ministry memberships
      const { data: memberships } = await supabase
        .from('ministry_members')
        .select('*, ministries(*)')
        .eq('member_id', user.id)
        .eq('is_active', true);
      setMyMinistries(memberships || []);

      // Fetch upcoming activities for member's ministries (using meeting_day/time/location for now)
      const ministryIds = (memberships || []).map(m => m.ministry_id);
      const upcoming = (ministries || [])
        .filter(m => ministryIds.includes(m.id))
        .map(m => ({
          id: m.id,
          name: m.name,
          meeting_day: m.meeting_day,
          meeting_time: m.meeting_time,
          meeting_location: m.meeting_location
        }));
      setUpcomingActivities(upcoming);
      setLoading(false);
    };
    fetchMinistries();
  }, [user]);

  const handleJoinMinistry = async (ministryId) => {
    // Placeholder: implement join logic
    alert('Request to join ministry: ' + ministryId);
  };

  if (loading) return <div>Loading ministries...</div>;

  // Ministries the member is not in
  const myMinistryIds = myMinistries.map(m => m.ministry_id);
  const availableMinistries = allMinistries.filter(m => !myMinistryIds.includes(m.id));

  return (
    <div className="space-y-8">
      {/* My Ministries */}
      <div>
        <h3 className="text-lg font-semibold mb-2">My Ministries</h3>
        {myMinistries.length === 0 ? (
          <div className="text-muted-foreground">You are not in any ministries yet.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myMinistries.map(m => (
              <Card key={m.ministry_id}>
                <CardContent className="p-4">
                  <div className="font-medium text-xiracom-blue">{m.ministries?.name}</div>
                  <div className="text-sm text-muted-foreground">Role: {m.role || 'Member'}</div>
                  <div className="text-xs text-muted-foreground">Joined: {m.joined_date || 'N/A'}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
      {/* Available Ministries */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Available Ministries</h3>
        {availableMinistries.length === 0 ? (
          <div className="text-muted-foreground">No other ministries available.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {availableMinistries.map(m => (
              <Card key={m.id}>
                <CardContent className="p-4 flex justify-between items-center">
                  <div>
                    <div className="font-medium">{m.name}</div>
                    <div className="text-xs text-muted-foreground">{m.description}</div>
                  </div>
                  <Button size="sm" onClick={() => handleJoinMinistry(m.id)}>Join</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
      {/* Upcoming Ministry Activities */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Upcoming Ministry Activities</h3>
        {upcomingActivities.length === 0 ? (
          <div className="text-muted-foreground">No upcoming activities found.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {upcomingActivities.map(a => (
              <Card key={a.id}>
                <CardContent className="p-4">
                  <div className="font-medium">{a.name}</div>
                  <div className="text-sm text-muted-foreground">Meeting: {a.meeting_day || 'N/A'} {a.meeting_time ? `at ${a.meeting_time}` : ''}</div>
                  <div className="text-xs text-muted-foreground">Location: {a.meeting_location || 'N/A'}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
