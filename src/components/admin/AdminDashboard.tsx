import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Users, 
  Database, 
  Shield, 
  Settings, 
  Church, 
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  HardDrive,
  Globe
} from "lucide-react";

const AdminDashboard = () => {
  const navigate = useNavigate();

  // System Overview Data
  const systemStats = [
    {
      title: "Total Users",
      value: "247",
      change: "+12 this month",
      icon: Users,
      color: "text-blue-600"
    },
    {
      title: "Active Sessions",
      value: "43",
      change: "Real-time",
      icon: Activity,
      color: "text-green-600"
    },
    {
      title: "System Health",
      value: "99.8%",
      change: "Uptime",
      icon: CheckCircle,
      color: "text-emerald-600"
    },
    {
      title: "Storage Used",
      value: "15.2 GB",
      change: "of 100 GB",
      icon: HardDrive,
      color: "text-purple-600"
    }
  ];

  const recentActivity = [
    {
      action: "New user registration",
      user: "Grace Nyambura",
      time: "2 minutes ago",
      type: "user"
    },
    {
      action: "System backup completed",
      user: "System",
      time: "1 hour ago",
      type: "system"
    },
    {
      action: "Security scan completed",
      user: "System",
      time: "3 hours ago",
      type: "security"
    },
    {
      action: "Church info updated",
      user: "Pastor John Kimani",
      time: "5 hours ago",
      type: "church"
    },
    {
      action: "User role changed",
      user: "Mary Wanjiku",
      time: "1 day ago",
      type: "user"
    }
  ];

  const systemAlerts = [
    {
      level: "warning",
      message: "Backup storage is 80% full",
      time: "2 hours ago"
    },
    {
      level: "info",
      message: "System update available",
      time: "1 day ago"
    }
  ];

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'user-management':
        navigate('/users');
        break;
      case 'church-info':
        navigate('/church-info');
        break;
      case 'backup-data':
        navigate('/backup');
        break;
      case 'security-settings':
        navigate('/security-overview');
        break;
      default:
        console.log('Action not implemented:', action);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "user":
        return <Users className="h-4 w-4" />;
      case "system":
        return <Database className="h-4 w-4" />;
      case "security":
        return <Shield className="h-4 w-4" />;
      case "church":
        return <Church className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case "user":
        return "text-blue-600 bg-blue-50";
      case "system":
        return "text-green-600 bg-green-50";
      case "security":
        return "text-purple-600 bg-purple-50";
      case "church":
        return "text-orange-600 bg-orange-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getAlertColor = (level: string) => {
    switch (level) {
      case "warning": return "text-yellow-600 bg-yellow-50";
      case "error": return "text-red-600 bg-red-50";
      case "info": return "text-blue-600 bg-blue-50";
      default: return "text-gray-600 bg-gray-50";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">System Administration</h1>
          <p className="text-muted-foreground">Living Rock Church Management System</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            System Online
          </Badge>
        </div>
      </div>

      {/* System Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {systemStats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.change}</p>
                </div>
                <div className="p-3 rounded-lg bg-gray-50">
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Admin Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Quick Admin Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-3">
              <Button 
                className="justify-start h-12"
                onClick={() => handleQuickAction('user-management')}
              >
                <Users className="h-4 w-4 mr-3" />
                <div className="text-left">
                  <div className="font-medium">User Management</div>
                  <div className="text-xs text-muted-foreground">Manage user accounts and permissions</div>
                </div>
              </Button>
              
              <Button 
                variant="outline" 
                className="justify-start h-12"
                onClick={() => handleQuickAction('church-info')}
              >
                <Church className="h-4 w-4 mr-3" />
                <div className="text-left">
                  <div className="font-medium">Church Information</div>
                  <div className="text-xs text-muted-foreground">Update church details and settings</div>
                </div>
              </Button>
              
              <Button 
                variant="outline" 
                className="justify-start h-12"
                onClick={() => handleQuickAction('backup-data')}
              >
                <Database className="h-4 w-4 mr-3" />
                <div className="text-left">
                  <div className="font-medium">Backup & Data</div>
                  <div className="text-xs text-muted-foreground">Manage backups and data integrity</div>
                </div>
              </Button>
              
              <Button 
                variant="outline" 
                className="justify-start h-12"
                onClick={() => handleQuickAction('security-settings')}
              >
                <Shield className="h-4 w-4 mr-3" />
                <div className="text-left">
                  <div className="font-medium">Security Settings</div>
                  <div className="text-xs text-muted-foreground">Configure security policies</div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* System Health */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              System Health Monitor
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>CPU Usage</span>
                  <span>23%</span>
                </div>
                <Progress value={23} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Memory Usage</span>
                  <span>67%</span>
                </div>
                <Progress value={67} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Storage</span>
                  <span>15%</span>
                </div>
                <Progress value={15} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Network</span>
                  <span>12%</span>
                </div>
                <Progress value={12} className="h-2" />
              </div>
            </div>
            
            <div className="pt-2 border-t">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  Internet Connection
                </span>
                <Badge className="bg-green-100 text-green-800">Stable</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center gap-3 p-3 rounded-lg border">
                  <div className={`p-2 rounded-lg ${getActivityColor(activity.type)}`}>
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{activity.action}</p>
                    <p className="text-sm text-muted-foreground">
                      by {activity.user} • {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* System Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              System Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {systemAlerts.map((alert, index) => (
                <div key={index} className={`p-3 rounded-lg ${getAlertColor(alert.level)}`}>
                  <p className="text-sm font-medium">{alert.message}</p>
                  <p className="text-xs opacity-70">{alert.time}</p>
                </div>
              ))}
            </div>
            
            <div className="mt-4 pt-3 border-t">
              <Button variant="outline" size="sm" className="w-full">
                View All Alerts
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
