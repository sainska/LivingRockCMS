import React from 'react';
import { useNavigate } from 'react-router-dom';
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
  MessageCircle,
  MessageSquare,
  Clock,
  MapPin
} from "lucide-react";

const ClergyDashboard = () => {
  const navigate = useNavigate();

  const ministryMetrics = [
    {
      title: "Total Congregation",
      value: "1,247",
      change: "+23 this month",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Bible Study Groups",
      value: "12",
      change: "Active groups",
      icon: BookOpen,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Ministry Teams",
      value: "8",
      change: "Active ministries",
      icon: Heart,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      title: "Pastoral Visits",
      value: "15",
      change: "This week",
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
      topic: "Walking in Faith",
      scripture: "Hebrews 11:1-6",
      attendance: 450
    },
    {
      id: 2,
      title: "Wednesday Bible Study",
      date: "2024-06-19",
      time: "7:00 PM",
      topic: "The Power of Prayer",
      scripture: "James 5:13-18",
      attendance: 85
    },
    {
      id: 3,
      title: "Youth Service",
      date: "2024-06-22",
      time: "6:00 PM",
      topic: "Living for Christ",
      scripture: "1 Timothy 4:12",
      attendance: 120
    }
  ];

  const ministryProgress = [
    { name: "Youth Ministry", members: 145, growth: 12, percentage: 85 },
    { name: "Women's Fellowship", members: 180, growth: 8, percentage: 72 },
    { name: "Men's Brotherhood", members: 95, growth: 15, percentage: 68 },
    { name: "Children's Ministry", members: 220, growth: 20, percentage: 90 }
  ];

  const pastoralTasks = [
    {
      id: 1,
      task: "Visit Sarah Johnson",
      type: "Hospital Visit",
      priority: "High",
      dueDate: "Today",
      status: "Pending"
    },
    {
      id: 2,
      task: "Counseling Session",
      type: "Marriage Counseling",
      priority: "Medium",
      dueDate: "Tomorrow",
      status: "Scheduled"
    },
    {
      id: 3,
      task: "Prepare Sunday Sermon",
      type: "Sermon Prep",
      priority: "High",
      dueDate: "Saturday",
      status: "In Progress"
    }
  ];

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'sermon-prep':
        console.log('Opening sermon preparation...');
        break;
      case 'schedule-visit':
        console.log('Opening visit scheduler...');
        break;
      case 'counseling':
        console.log('Opening counseling center...');
        break;
      case 'ministry-overview':
        console.log('Opening ministry overview...');
        break;
      default:
        console.log('Action not implemented:', action);
    }
  };

  const handleSermonPrep = () => {
    console.log('Opening sermon preparation tools...');
    // Implement sermon preparation logic
  };

  const handleScheduleVisit = () => {
    console.log('Opening pastoral visit scheduler...');
    // Implement visit scheduling logic
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800";
      case "Medium":
        return "bg-yellow-100 text-yellow-800";
      case "Low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Scheduled":
        return "bg-blue-100 text-blue-800";
      case "In Progress":
        return "bg-purple-100 text-purple-800";
      case "Completed":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Pastoral Dashboard</h1>
          <p className="text-muted-foreground">Living Rock Church - Ministry Oversight</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleSermonPrep}>
            <BookOpen className="h-4 w-4 mr-2" />
            Sermon Prep
          </Button>
          <Button variant="outline" onClick={handleScheduleVisit}>
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
                <div key={service.id} className="p-4 rounded-lg border">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium">{service.title}</h4>
                    <Badge variant="outline">
                      <Clock className="h-3 w-3 mr-1" />
                      {service.time}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {service.date}
                  </p>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{service.topic}</p>
                    <p className="text-xs text-muted-foreground">
                      Scripture: {service.scripture}
                    </p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs text-muted-foreground">
                        Expected attendance: {service.attendance}
                      </span>
                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
                    </div>
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

      {/* Pastoral Tasks */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Pastoral Tasks
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {pastoralTasks.map((task) => (
              <div key={task.id} className="flex items-center justify-between p-3 rounded-lg border">
                <div>
                  <p className="font-medium">{task.task}</p>
                  <p className="text-sm text-muted-foreground">
                    {task.type} • Due: {task.dueDate}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Badge className={getPriorityColor(task.priority)}>
                    {task.priority}
                  </Badge>
                  <Badge className={getStatusColor(task.status)}>
                    {task.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Pastoral Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Pastoral Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Button 
              className="h-16 flex-col gap-2"
              onClick={() => handleQuickAction('sermon-prep')}
            >
              <BookOpen className="h-5 w-5" />
              Sermon Preparation
            </Button>
            <Button 
              variant="outline" 
              className="h-16 flex-col gap-2"
              onClick={() => handleQuickAction('schedule-visit')}
            >
              <Calendar className="h-5 w-5" />
              Schedule Visit
            </Button>
            <Button 
              variant="outline" 
              className="h-16 flex-col gap-2"
              onClick={() => handleQuickAction('counseling')}
            >
              <MessageSquare className="h-5 w-5" />
              Counseling Center
            </Button>
            <Button 
              variant="outline" 
              className="h-16 flex-col gap-2"
              onClick={() => handleQuickAction('ministry-overview')}
            >
              <Heart className="h-5 w-5" />
              Ministry Overview
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClergyDashboard;
