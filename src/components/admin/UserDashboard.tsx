
import React from 'react';
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

const UserDashboard = () => {
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
      ministry: "Youth Ministry",
      role: "Member",
      nextMeeting: "2024-06-18",
      upcomingEvent: "Youth Conference"
    },
    {
      ministry: "Worship Team",
      role: "Vocalist",
      nextMeeting: "2024-06-15",
      upcomingEvent: "Sunday Service"
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High": return "bg-red-100 text-red-800";
      case "Medium": return "bg-yellow-100 text-yellow-800";
      case "Low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Welcome, {memberInfo.name}!</h1>
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
                      <Button size="sm" variant="outline">
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
              My Ministry Involvement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {ministryActivities.map((activity, index) => (
                <div key={index} className="p-3 rounded-lg border">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium">{activity.ministry}</h4>
                    <Badge variant="outline">
                      {activity.role}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Next Meeting: {activity.nextMeeting}
                  </p>
                  <p className="text-sm text-blue-600">
                    Upcoming: {activity.upcomingEvent}
                  </p>
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
            <Button className="h-16 flex-col gap-2">
              <Gift className="h-5 w-5" />
              Make Donation
            </Button>
            <Button variant="outline" className="h-16 flex-col gap-2">
              <Calendar className="h-5 w-5" />
              Event Registration
            </Button>
            <Button variant="outline" className="h-16 flex-col gap-2">
              <MessageCircle className="h-5 w-5" />
              Prayer Request
            </Button>
            <Button variant="outline" className="h-16 flex-col gap-2">
              <Users className="h-5 w-5" />
              My Profile
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserDashboard;
