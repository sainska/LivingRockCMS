
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, Settings as SettingsIcon, AlertTriangle, Lock } from "lucide-react";
import SystemSettings from "@/components/settings/SystemSettings";
import ChurchSettings from "@/components/settings/ChurchSettings";
import UserManagement from "@/components/settings/UserManagement";
import BackupSettings from "@/components/settings/BackupSettings";
import IntegrationSettings from "@/components/settings/IntegrationSettings";

const Settings = () => {
  const [userRole, setUserRole] = useState<string>("Member"); // This would come from authentication context
  const [activeTab, setActiveTab] = useState("church");

  // Simulate checking user role - in real app this would come from auth context
  useEffect(() => {
    // Simulating treasurer role for demonstration
    // In a real app, this would be fetched from your authentication system
    const simulatedUserRole = "Treasurer"; // Change this to test different roles
    setUserRole(simulatedUserRole);
  }, []);

  // Check if user has treasurer privileges
  const isTreasurer = userRole === "Treasurer" || userRole === "Clergy" || userRole === "Admin";

  if (!isTreasurer) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">System Settings</h1>
        
        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-8 text-center">
            <div className="mb-4">
              <Lock className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-muted-foreground mb-2">Access Restricted</h2>
              <p className="text-muted-foreground mb-4">
                This section is restricted to church treasurers and administrators only.
              </p>
            </div>
            
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Access Denied:</strong> You need treasurer-level permissions to access system settings. 
                Please contact your church administrator if you need access to this section.
              </AlertDescription>
            </Alert>
            
            <div className="mt-6 text-sm text-muted-foreground">
              <p>Your current role: <strong>{userRole}</strong></p>
              <p>Required role: <strong>Treasurer, Clergy, or Admin</strong></p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">System Settings</h1>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Shield className="h-4 w-4" />
          <span>Treasurer Access Level</span>
        </div>
      </div>

      {/* Access confirmation */}
      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          <strong>Treasurer Access Granted:</strong> You have full access to all system settings. 
          Please use these settings responsibly as they affect the entire church management system.
        </AlertDescription>
      </Alert>

      {/* Settings Tabs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SettingsIcon className="h-5 w-5" />
            Church Management Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="church">Church Info</TabsTrigger>
              <TabsTrigger value="system">System</TabsTrigger>
              <TabsTrigger value="users">User Management</TabsTrigger>
              <TabsTrigger value="backup">Backup & Data</TabsTrigger>
              <TabsTrigger value="integrations">Integrations</TabsTrigger>
            </TabsList>

            <TabsContent value="church">
              <ChurchSettings />
            </TabsContent>

            <TabsContent value="system">
              <SystemSettings />
            </TabsContent>

            <TabsContent value="users">
              <UserManagement />
            </TabsContent>

            <TabsContent value="backup">
              <BackupSettings />
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
