
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Users,
  Calendar,
  Mail,
  FileText,
  Phone,
  UserPlus,
  MessageSquare,
  Bell,
  Clock,
  CheckCircle
} from "lucide-react";

const SecretaryDashboard = () => {
  const membershipMetrics = [
    {
      title: "Total Members",
      value: "1,247",
      change: "+23 this month",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "New Members (This Month)",
      value: "23",
      change: "+15.2%",
      icon: UserPlus,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Upcoming Events",
      value: "8",
      change: "Next 30 days",
      icon: Calendar,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      title: "Pending Communications",
      value: "5",
      change: "Needs attention",
      icon: Mail,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50"
    }
  ];

  const recentMembers = [
    {
      id: 1,
      name: "Grace Nyambura",
      phone: "+254 712 345 678",
      joinDate: "2024-06-05",
      status: "Active",
      membershipNumber: "LRC20240156"
    },
    {
      id: 2,
      name: "Peter Kimani",
      phone: "+254 722 567 890",
      joinDate: "2024-06-03",
      status: "Pending",
      membershipNumber: "LRC20240155"
    },
    {
      id: 3,
      name: "Mary Wanjiku",
      phone: "+254 733 789 012",
      joinDate: "2024-06-01",
      status: "Active",
      membershipNumber: "LRC20240154"
    }
  ];

  const upcomingEvents = [
    {
      id: 1,
      title: "Youth Conference",
      date: "2024-06-15",
      time: "9:00 AM",
      location: "Main Sanctuary",
      attendees: 150,
      maxAttendees: 200
    },
    {
      id: 2,
      title: "Women's Fellowship",
      date: "2024-06-18",
      time: "2:00 PM",
      location: "Conference Hall",
      attendees: 85,
      maxAttendees: 100
    },
    {
      id: 3,
      title: "Bible Study",
      date: "2024-06-20",
      time: "7:00 PM",
      location: "Small Hall",
      attendees: 45,
      maxAttendees: 60
    }
  ];

  const communicationTasks = [
    { task: "Send Sunday service reminder", priority: "High", dueDate: "Today" },
    { task: "Youth event invitation", priority: "Medium", dueDate: "Tomorrow" },
    { task: "Monthly newsletter", priority: "Low", dueDate: "This week" },
    { task: "Birthday wishes", priority: "Medium", dueDate: "Today" }
  ];

  const getStatusColor = (status: string) => {
    return status === "Active" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800";
  };

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
          <h1 className="text-3xl font-bold">Secretary Dashboard</h1>
          <p className="text-muted-foreground">Living Rock Church - Administrative Portal</p>
        </div>
        <div className="flex gap-2">
          <Button>
            <Mail className="h-4 w-4 mr-2" />
            Send Communication
          </Button>
          <Button variant="outline">
            <FileText className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
        </div>
      </div>

      {/* Membership Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {membershipMetrics.map((metric, index) => (
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
        {/* Recent Members */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Recent Members
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentMembers.map((member) => (
                <div key={member.id} className="flex items-center justify-between p-3 rounded-lg border">
                  <div>
                    <p className="font-medium">{member.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {member.membershipNumber} • {member.phone}
                    </p>
                    <p className="text-xs text-muted-foreground">Joined: {member.joinDate}</p>
                  </div>
                  <Badge className={getStatusColor(member.status)}>
                    {member.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

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
                <div key={event.id} className="p-3 rounded-lg border">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium">{event.title}</h4>
                    <Badge variant="outline">
                      {event.date}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    <Clock className="h-3 w-3 inline mr-1" />
                    {event.time} • {event.location}
                  </p>
                  <div className="mt-2">
                    <div className="flex justify-between text-xs mb-1">
                      <span>Attendance</span>
                      <span>{event.attendees}/{event.maxAttendees}</span>
                    </div>
                    <Progress value={(event.attendees / event.maxAttendees) * 100} className="h-2" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Communication Tasks */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Communication Tasks
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {communicationTasks.map((task, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center gap-3">
                  <Bell className="h-4 w-4 text-blue-600" />
                  <div>
                    <p className="font-medium">{task.task}</p>
                    <p className="text-sm text-muted-foreground">Due: {task.dueDate}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getPriorityColor(task.priority)}>
                    {task.priority}
                  </Badge>
                  <Button size="sm" variant="outline">
                    <CheckCircle className="h-3 w-3" />
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
          <CardTitle>Quick Administrative Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Button className="h-16 flex-col gap-2">
              <UserPlus className="h-5 w-5" />
              Add New Member
            </Button>
            <Button variant="outline" className="h-16 flex-col gap-2">
              <Calendar className="h-5 w-5" />
              Schedule Event
            </Button>
            <Button variant="outline" className="h-16 flex-col gap-2">
              <Mail className="h-5 w-5" />
              Send Newsletter
            </Button>
            <Button variant="outline" className="h-16 flex-col gap-2">
              <Phone className="h-5 w-5" />
              Contact Directory
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SecretaryDashboard;
