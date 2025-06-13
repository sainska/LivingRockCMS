
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Shield,
  AlertTriangle,
  CheckCircle,
  Users,
  Lock,
  Eye,
  Activity,
  Database,
  Globe,
  Key
} from "lucide-react";

const SecurityOverview = () => {
  const securityMetrics = [
    {
      title: "Security Score",
      value: "94/100",
      status: "high",
      icon: Shield,
      description: "Overall security rating"
    },
    {
      title: "Active Threats",
      value: "0",
      status: "success",
      icon: AlertTriangle,
      description: "No active threats detected"
    },
    {
      title: "Failed Logins",
      value: "3",
      status: "warning",
      icon: Lock,
      description: "Last 24 hours"
    },
    {
      title: "Active Sessions",
      value: "47",
      status: "normal",
      icon: Users,
      description: "Current user sessions"
    }
  ];

  const securityEvents = [
    {
      time: "5 minutes ago",
      type: "success",
      event: "Successful admin login",
      user: "admin@church.com",
      ip: "192.168.1.100"
    },
    {
      time: "1 hour ago",
      type: "warning", 
      event: "Failed login attempt",
      user: "unknown@domain.com",
      ip: "45.123.45.67"
    },
    {
      time: "2 hours ago",
      type: "info",
      event: "Password reset request",
      user: "user@church.com", 
      ip: "192.168.1.105"
    },
    {
      time: "3 hours ago",
      type: "success",
      event: "Two-factor authentication enabled",
      user: "pastor@church.com",
      ip: "192.168.1.102"
    }
  ];

  const securityChecks = [
    { name: "SSL/TLS Certificate", status: "valid", score: 100 },
    { name: "Password Policy", status: "strong", score: 95 },
    { name: "Two-Factor Authentication", status: "enabled", score: 90 },
    { name: "Data Encryption", status: "active", score: 100 },
    { name: "Access Controls", status: "configured", score: 85 },
    { name: "Backup Security", status: "encrypted", score: 95 }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success": case "valid": case "strong": case "enabled": case "active": case "configured": case "encrypted":
        return "bg-green-100 text-green-800";
      case "warning": 
        return "bg-yellow-100 text-yellow-800";
      case "error": case "failed":
        return "bg-red-100 text-red-800";
      case "high":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case "warning": return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case "error": return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case "info": return <Eye className="h-4 w-4 text-blue-600" />;
      default: return <CheckCircle className="h-4 w-4 text-green-600" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Security Overview</h2>
        <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
          <Shield className="h-3 w-3" />
          System Secure
        </Badge>
      </div>

      {/* Security Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {securityMetrics.map((metric, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{metric.title}</p>
                  <p className="text-2xl font-bold">{metric.value}</p>
                  <p className="text-xs text-muted-foreground">{metric.description}</p>
                </div>
                <metric.icon className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Security Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {securityChecks.map((check, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    {check.name === "SSL/TLS Certificate" && <Globe className="h-4 w-4" />}
                    {check.name === "Password Policy" && <Key className="h-4 w-4" />}
                    {check.name === "Two-Factor Authentication" && <Shield className="h-4 w-4" />}
                    {check.name === "Data Encryption" && <Lock className="h-4 w-4" />}
                    {check.name === "Access Controls" && <Users className="h-4 w-4" />}
                    {check.name === "Backup Security" && <Database className="h-4 w-4" />}
                    <span className="font-medium">{check.name}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">{check.score}%</span>
                  <Badge className={getStatusColor(check.status)}>
                    {check.status}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Security Events */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Recent Security Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {securityEvents.map((event, index) => (
                <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
                  {getEventIcon(event.type)}
                  <div className="flex-1">
                    <p className="text-sm font-medium">{event.event}</p>
                    <p className="text-xs text-muted-foreground">
                      {event.user} • {event.ip} • {event.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Security Score Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security Score Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold">Overall Security Score</span>
              <span className="text-2xl font-bold text-blue-600">94/100</span>
            </div>
            <Progress value={94} className="h-3" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {securityChecks.map((check, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-sm">{check.name}</span>
                  <div className="flex items-center gap-2">
                    <Progress value={check.score} className="w-20 h-2" />
                    <span className="text-sm font-medium">{check.score}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SecurityOverview;
