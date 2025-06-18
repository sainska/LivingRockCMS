import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Users,
  Calendar,
  Heart,
  BookOpen,
  Church,
  UserCheck,
  Activity,
  TrendingUp,
  MessageCircle
} from "lucide-react";

const ClergyDashboard = () => {
  const ministryMetrics = [
    {
      title: "Active Members",
      value: "1,247",
      change: "+5.2% this month",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Weekly Attendance",
      value: "892",
      change: "87% of capacity",
      icon: Church,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Active Ministries",
      value: "12",
      change: "All operational",
      icon: Heart,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      title: "Pastoral Visits",
      value: "28",
      change: "This month",
      icon: UserCheck,
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    }
  ];

  const upcomingServices = [
    {
      id: 1,
      title: "Sunday Morning Service",
      date: "2024-06-16",
      time: "9:00 AM",
      expectedAttendance: 950,
      sermon: "Walking in Faith"
    },
    {
      id: 2,
      title: "Midweek Bible Study",
      date: "2024-06-19",
      time: "7:00 PM",
      expectedAttendance: 320,
      sermon: "Promises of God"
    },
    {
      id: 3,
      title: "Youth Service",
      date: "2024-06-22",
      time: "6:00 PM",
      expectedAttendance: 180,
      sermon: "Purpose in Christ"
    }
  ];

  const ministryProgress = [
    { name: "Youth Ministry", members: 145, growth: 12, percentage: 85 },
    { name: "Women's Fellowship", members: 180, growth: 8, percentage: 72 },
    { name: "Men's Brotherhood", members: 95, growth: 15, percentage: 68 },
    { name: "Children's Ministry", members: 220, growth: 20, percentage: 90 }
  ];

  const pastoralCare = [
    {
      type: "Hospital Visits",
      count: 8,
      status: "Completed",
      priority: "High"
    },
    {
      type: "Home Visits",
      count: 12,
      status: "In Progress",
      priority: "Medium"
    },
    {
      type: "Counseling Sessions",
      count: 15,
      status: "Scheduled",
      priority: "High"
    },
    {
      type: "Prayer Requests",
      count: 24,
      status: "Pending",
      priority: "Medium"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed": return "bg-green-100 text-green-800";
      case "In Progress": return "bg-blue-100 text-blue-800";
      case "Scheduled": return "bg-purple-100 text-purple-800";
      case "Pending": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    return priority === "High" ? "bg-red-100 text-red-800" : "bg-yellow-100 text-yellow-800";
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Pastoral Dashboard</h1>
          <p className="text-muted-foreground">Living Rock Church - Ministry Oversight</p>
        </div>
        <div className="flex gap-2">
          <Button>
            <BookOpen className="h-4 w-4 mr-2" />
            Sermon Prep
          </Button>
          <Button variant="outline">
            <Calendar className="h-4 w-4 mr-2" />
            Schedule Visit
          </Button>
        </div>
      </div>

      {/* Ministry Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {ministryMetrics.map((metric, index) => (
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
        {/* Upcoming Services */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Church className="h-5 w-5" />
              Upcoming Services
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingServices.map((service) => (
                <div key={service.id} className="p-3 rounded-lg border">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium">{service.title}</h4>
                    <Badge variant="outline">
                      {service.date}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {service.time} • Expected: {service.expectedAttendance} attendees
                  </p>
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium">Sermon: {service.sermon}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Ministry Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Ministry Growth
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {ministryProgress.map((ministry, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{ministry.name}</span>
                    <span className="text-green-600">+{ministry.growth} this month</span>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{ministry.members} active members</span>
                    <span>{ministry.percentage}% engagement</span>
                  </div>
                  <Progress value={ministry.percentage} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pastoral Care */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5" />
            Pastoral Care Activities
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {pastoralCare.map((care, index) => (
              <div key={index} className="p-4 rounded-lg border">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium">{care.type}</h4>
                  <Badge className={getPriorityColor(care.priority)}>
                    {care.priority}
                  </Badge>
                </div>
                <p className="text-2xl font-bold text-blue-600 mb-2">{care.count}</p>
                <Badge className={getStatusColor(care.status)}>
                  {care.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Spiritual Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Recent Prayer Requests & Testimonies
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-medium text-blue-600">Prayer Requests</h4>
              <div className="space-y-2">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm">Healing for Sister Mary's recovery</p>
                  <p className="text-xs text-muted-foreground">Submitted today</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm">Job provision for youth members</p>
                  <p className="text-xs text-muted-foreground">2 days ago</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm">Traveling mercies for missions team</p>
                  <p className="text-xs text-muted-foreground">3 days ago</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium text-green-600">Testimonies</h4>
              <div className="space-y-2">
                <div className="p-3 bg-green-50 rounded-lg">
                  <p className="text-sm">New job testimony from Brother John</p>
                  <p className="text-xs text-muted-foreground">Yesterday</p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <p className="text-sm">Healing testimony from Sister Grace</p>
                  <p className="text-xs text-muted-foreground">2 days ago</p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <p className="text-sm">Breakthrough in family reconciliation</p>
                  <p className="text-xs text-muted-foreground">4 days ago</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Ministry Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Ministry Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Button className="h-16 flex-col gap-2">
              <BookOpen className="h-5 w-5" />
              Prepare Sermon
            </Button>
            <Button variant="outline" className="h-16 flex-col gap-2">
              <UserCheck className="h-5 w-5" />
              Schedule Visit
            </Button>
            <Button variant="outline" className="h-16 flex-col gap-2">
              <Heart className="h-5 w-5" />
              Prayer List
            </Button>
            <Button variant="outline" className="h-16 flex-col gap-2">
              <Activity className="h-5 w-5" />
              Ministry Reports
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClergyDashboard;
