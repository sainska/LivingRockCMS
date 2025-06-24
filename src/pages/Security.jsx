import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, Lock, Users, Eye, AlertTriangle, Key, Settings, Activity } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import UserAccessControl from "@/components/security/UserAccessControl";
import DataProtection from "@/components/security/DataProtection";
import SecurityLogs from "@/components/security/SecurityLogs";
import CheckInSecurity from "@/components/security/CheckInSecurity";

const Security = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: true,
    sessionTimeout: 30,
    passwordExpiry: 90,
    loginAttempts: 3
  });

  const securityMetrics = [
    {
      title: "Active Users",
      value: "156",
      status: "normal",
      icon: Users,
      color: "text-blue-600"
    },
    {
      title: "Failed Logins",
      value: "3",
      status: "warning",
      icon: AlertTriangle,
      color: "text-yellow-600"
    },
    {
      title: "Security Score",
      value: "98%",
      status: "good",
      icon: Shield,
      color: "text-green-600"
    },
    {
      title: "Data Encrypted",
      value: "100%",
      status: "good",
      icon: Lock,
      color: "text-green-600"
    }
  ];

  const recentSecurityEvents = [
    {
      event: "Failed login attempt",
      user: "unknown@example.com",
      time: "2 minutes ago",
      severity: "medium",
      ip: "192.168.1.100"
    },
    {
      event: "Password changed",
      user: "admin@church.com",
      time: "1 hour ago",
      severity: "low",
      ip: "192.168.1.50"
    },
    {
      event: "New user registration",
      user: "john.doe@email.com",
      time: "3 hours ago",
      severity: "low",
      ip: "192.168.1.75"
    },
    {
      event: "Admin access granted",
      user: "treasurer@church.com",
      time: "5 hours ago",
      severity: "high",
      ip: "192.168.1.25"
    }
  ];

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "high": return "bg-red-100 text-red-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Security & Privacy</h1>
        <Button variant="outline">
          <Settings className="h-4 w-4 mr-2" />
          Security Settings
        </Button>
      </div>

      {/* Security Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {securityMetrics.map((metric, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{metric.title}</p>
                  <p className="text-2xl font-bold">{metric.value}</p>
                  <Badge className={
                    metric.status === 'good' ? 'bg-green-100 text-green-800' :
                    metric.status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }>
                    {metric.status}
                  </Badge>
                </div>
                <metric.icon className={`h-8 w-8 ${metric.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Security Tabs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="access">Access Control</TabsTrigger>
              <TabsTrigger value="data">Data Protection</TabsTrigger>
              <TabsTrigger value="logs">Security Logs</TabsTrigger>
              <TabsTrigger value="checkin">Check-in Security</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <div className="space-y-6">
                {/* Security Settings */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Security Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm font-medium">Two-Factor Authentication</Label>
                        <p className="text-sm text-muted-foreground">Require 2FA for all admin accounts</p>
                      </div>
                      <Switch 
                        checked={securitySettings.twoFactorAuth}
                        onCheckedChange={(checked) => 
                          setSecuritySettings(prev => ({ ...prev, twoFactorAuth: checked }))
                        }
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Session Timeout (minutes)</Label>
                        <Input 
                          type="number" 
                          value={securitySettings.sessionTimeout}
                          onChange={(e) => 
                            setSecuritySettings(prev => ({ ...prev, sessionTimeout: parseInt(e.target.value) }))
                          }
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Password Expiry (days)</Label>
                        <Input 
                          type="number" 
                          value={securitySettings.passwordExpiry}
                          onChange={(e) => 
                            setSecuritySettings(prev => ({ ...prev, passwordExpiry: parseInt(e.target.value) }))
                          }
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Max Login Attempts</Label>
                        <Input 
                          type="number" 
                          value={securitySettings.loginAttempts}
                          onChange={(e) => 
                            setSecuritySettings(prev => ({ ...prev, loginAttempts: parseInt(e.target.value) }))
                          }
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Security Events */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Activity className="h-4 w-4" />
                      Recent Security Events
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Event</TableHead>
                          <TableHead>User</TableHead>
                          <TableHead>Time</TableHead>
                          <TableHead>IP Address</TableHead>
                          <TableHead>Severity</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {recentSecurityEvents.map((event, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">{event.event}</TableCell>
                            <TableCell>{event.user}</TableCell>
                            <TableCell>{event.time}</TableCell>
                            <TableCell>{event.ip}</TableCell>
                            <TableCell>
                              <Badge className={getSeverityColor(event.severity)}>
                                {event.severity}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="access">
              <UserAccessControl />
            </TabsContent>

            <TabsContent value="data">
              <DataProtection />
            </TabsContent>

            <TabsContent value="logs">
              <SecurityLogs />
            </TabsContent>

            <TabsContent value="checkin">
              <CheckInSecurity />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Security;
