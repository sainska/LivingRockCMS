
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, Settings as SettingsIcon, AlertTriangle, Lock, LayoutDashboard, Database, Users, Activity, Eye } from "lucide-react";
import AdminDashboard from "@/components/admin/AdminDashboard";
import SystemDashboard from "@/components/admin/SystemDashboard";
import SystemSettings from "@/components/settings/SystemSettings";
import ChurchSettings from "@/components/settings/ChurchSettings";
import UserManagement from "@/components/settings/UserManagement";
import BackupSettings from "@/components/settings/BackupSettings";
import IntegrationSettings from "@/components/settings/IntegrationSettings";
import SecurityOverview from "@/components/security/SecurityOverview";
import UserAccessControl from "@/components/security/UserAccessControl";
import DataProtection from "@/components/security/DataProtection";
import SecurityLogs from "@/components/security/SecurityLogs";
import CheckInSecurity from "@/components/security/CheckInSecurity";

const Settings = () => {
  const [userRole, setUserRole] = useState<string>("Member");
  const [activeTab, setActiveTab] = useState("admin-dashboard");

  // Simulate checking user role - in real app this would come from auth context
  useEffect(() => {
    // Simulating admin role for demonstration
    const simulatedUserRole = "Admin"; // Change this to test different roles
    setUserRole(simulatedUserRole);
  }, []);

  // Check if user has admin privileges
  const isAdmin = userRole === "Admin" || userRole === "Clergy";

  if (!isAdmin) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">System Administration</h1>
        
        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-8 text-center">
            <div className="mb-4">
              <Lock className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-muted-foreground mb-2">Access Restricted</h2>
              <p className="text-muted-foreground mb-4">
                This section is restricted to system administrators only.
              </p>
            </div>
            
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Access Denied:</strong> You need administrator-level permissions to access system administration. 
                Please contact your system administrator if you need access to this section.
              </AlertDescription>
            </Alert>
            
            <div className="mt-6 text-sm text-muted-foreground">
              <p>Your current role: <strong>{userRole}</strong></p>
              <p>Required role: <strong>Admin or Clergy</strong></p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">System Administration</h1>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Shield className="h-4 w-4" />
          <span>Admin Access Level</span>
        </div>
      </div>

      {/* Access confirmation */}
      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          <strong>Admin Access Granted:</strong> You have full access to all system administration features. 
          Please use these settings responsibly as they affect the entire church management system.
        </AlertDescription>
      </Alert>

      {/* Admin Dashboard Tabs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SettingsIcon className="h-5 w-5" />
            Living Rock Church - System Administration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-6 lg:grid-cols-12 gap-1">
              <TabsTrigger value="admin-dashboard" className="text-xs">
                <LayoutDashboard className="h-3 w-3 mr-1" />
                Admin
              </TabsTrigger>
              <TabsTrigger value="system-dashboard" className="text-xs">
                <Activity className="h-3 w-3 mr-1" />
                System
              </TabsTrigger>
              <TabsTrigger value="church" className="text-xs">Church</TabsTrigger>
              <TabsTrigger value="system-overview" className="text-xs">Overview</TabsTrigger>
              <TabsTrigger value="users" className="text-xs">
                <Users className="h-3 w-3 mr-1" />
                Users
              </TabsTrigger>
              <TabsTrigger value="backup" className="text-xs">
                <Database className="h-3 w-3 mr-1" />
                Backup
              </TabsTrigger>
              <TabsTrigger value="security-overview" className="text-xs">
                <Shield className="h-3 w-3 mr-1" />
                Security
              </TabsTrigger>
              <TabsTrigger value="access-control" className="text-xs">Access</TabsTrigger>
              <TabsTrigger value="data-protection" className="text-xs">Data</TabsTrigger>
              <TabsTrigger value="security-logs" className="text-xs">
                <Eye className="h-3 w-3 mr-1" />
                Logs
              </TabsTrigger>
              <TabsTrigger value="checkin-security" className="text-xs">Check-in</TabsTrigger>
              <TabsTrigger value="integrations" className="text-xs">Integrations</TabsTrigger>
            </TabsList>

            <TabsContent value="admin-dashboard">
              <AdminDashboard />
            </TabsContent>

            <TabsContent value="system-dashboard">
              <SystemDashboard />
            </TabsContent>

            <TabsContent value="church">
              <ChurchSettings />
            </TabsContent>

            <TabsContent value="system-overview">
              <SystemSettings />
            </TabsContent>

            <TabsContent value="users">
              <UserManagement />
            </TabsContent>

            <TabsContent value="backup">
              <BackupSettings />
            </TabsContent>

            <TabsContent value="security-overview">
              <SecurityOverview />
            </TabsContent>

            <TabsContent value="access-control">
              <UserAccessControl />
            </TabsContent>

            <TabsContent value="data-protection">
              <DataProtection />
            </TabsContent>

            <TabsContent value="security-logs">
              <SecurityLogs />
            </TabsContent>

            <TabsContent value="checkin-security">
              <CheckInSecurity />
            </TabsContent>

            <TabsContent value="integrations">
              <IntegrationSettings />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
