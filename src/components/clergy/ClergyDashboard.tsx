
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Calendar, 
  Heart, 
  BookOpen, 
  MessageSquare, 
  Phone,
  Bell,
  TrendingUp,
  Clock,
  MapPin
} from "lucide-react";

const ClergyDashboard = () => {
  const todaysSchedule = [
    { time: "09:00", activity: "Morning Prayer", location: "Sanctuary" },
    { time: "10:30", activity: "Sunday Service", location: "Main Hall" },
    { time: "14:00", activity: "Youth Meeting", location: "Youth Center" },
    { time: "16:00", activity: "Home Visit - Mrs. Kamau", location: "Kiambu" },
    { time: "18:00", activity: "Bible Study", location: "Fellowship Hall" }
  ];

  const pastoralCare = [
    { name: "John Mwangi", type: "Hospital Visit", priority: "Urgent", date: "Today" },
    { name: "Mary Wanjiku", type: "Grief Counseling", priority: "High", date: "Tomorrow" },
    { name: "Peter Kamau", type: "Marriage Counseling", priority: "Medium", date: "This Week" },
    { name: "Grace Njeri", type: "Prayer Request", priority: "Low", date: "This Week" }
  ];

  const upcomingEvents = [
    { name: "Youth Conference", date: "June 15-16", attendees: 45 },
    { name: "Women's Retreat", date: "June 22", attendees: 32 },
    { name: "Elder's Meeting", date: "June 18", attendees: 12 },
    { name: "Baptism Ceremony", date: "June 25", attendees: 8 }
  ];

  const sermonPrep = [
    { title: "Faith in Action", series: "Living Faith", status: "In Progress", date: "June 11" },
    { title: "God's Grace", series: "Living Faith", status: "Draft", date: "June 18" },
    { title: "Community Love", series: "Living Faith", status: "Planning", date: "June 25" }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Urgent": return "bg-red-100 text-red-800";
      case "High": return "bg-orange-100 text-orange-800";
      case "Medium": return "bg-yellow-100 text-yellow-800";
      case "Low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "In Progress": return "bg-blue-100 text-blue-800";
      case "Draft": return "bg-yellow-100 text-yellow-800";
      case "Planning": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Welcome, Pastor John</h1>
          <p className="text-muted-foreground">Sunday, June 11, 2024 - Living Rock Church</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Bell className="h-4 w-4 mr-2" />
            Notifications (3)
          </Button>
          <Button>
            <MessageSquare className="h-4 w-4 mr-2" />
            Quick Message
          </Button>
        </div>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Members</p>
                <p className="text-2xl font-bold">342</p>
                <p className="text-xs text-green-600">+12 this month</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-full">
                <Heart className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pastoral Care</p>
                <p className="text-2xl font-bold">18</p>
                <p className="text-xs text-orange-600">4 urgent</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-full">
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">This Week's Events</p>
                <p className="text-2xl font-bold">8</p>
                <p className="text-xs text-blue-600">5 today</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-yellow-100 rounded-full">
                <BookOpen className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Sermon Prep</p>
                <p className="text-2xl font-bold">3</p>
                <p className="text-xs text-purple-600">1 in progress</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Schedule */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Today's Schedule
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {todaysSchedule.map((item, index) => (
                <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm font-medium text-blue-600 min-w-[60px]">
                    {item.time}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{item.activity}</p>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {item.location}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pastoral Care Needs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5" />
              Pastoral Care Needs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pastoralCare.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-muted-foreground">{item.type}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getPriorityColor(item.priority)}>
                      {item.priority}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{item.date}</span>
                  </div>
                </div>
              ))}
            </div>
            <Button className="w-full mt-4" variant="outline">
              View All Care Requests
            </Button>
          </CardContent>
        </Card>
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
            <div className="space-y-3">
              {upcomingEvents.map((event, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div>
                    <p className="font-medium">{event.name}</p>
                    <p className="text-sm text-muted-foreground">{event.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{event.attendees} attendees</p>
                    <p className="text-xs text-muted-foreground">registered</p>
                  </div>
                </div>
              ))}
            </div>
            <Button className="w-full mt-4" variant="outline">
              Manage Events
            </Button>
          </CardContent>
        </Card>

        {/* Sermon Preparation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Sermon Preparation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {sermonPrep.map((sermon, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{sermon.title}</p>
                    <p className="text-sm text-muted-foreground">{sermon.series}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(sermon.status)}>
                      {sermon.status}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{sermon.date}</span>
                  </div>
                </div>
              ))}
            </div>
            <Button className="w-full mt-4" variant="outline">
              Sermon Library
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Users className="h-6 w-6" />
              Member Directory
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Heart className="h-6 w-6" />
              Pastoral Care
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <BookOpen className="h-6 w-6" />
              Sermon Notes
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Phone className="h-6 w-6" />
              Emergency Contacts
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClergyDashboard;
