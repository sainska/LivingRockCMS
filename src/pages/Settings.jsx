
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, Lock, AlertTriangle } from "lucide-react";
import { useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Settings = () => {
  const [userRole, setUserRole] = useState("Member");
  const location = useLocation();

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
          Use the sidebar navigation to access specific administrative modules.
        </AlertDescription>
      </Alert>

      {/* Admin Navigation Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-2">General Administration</h3>
            <div className="space-y-2 text-sm">
              <Link to="/" className="block text-blue-600 hover:underline">Admin Dashboard</Link>
              <Link to="/system-dashboard" className="block text-blue-600 hover:underline">System Dashboard</Link>
              <Link to="/system-overview" className="block text-blue-600 hover:underline">System Overview</Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-2">Church & User Management</h3>
            <div className="space-y-2 text-sm">
              <Link to="/church-info" className="block text-blue-600 hover:underline">Church Information</Link>
              <Link to="/users" className="block text-blue-600 hover:underline">User Management</Link>
              <Link to="/backup" className="block text-blue-600 hover:underline">Backup & Data Management</Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-2">Security & Access</h3>
            <div className="space-y-2 text-sm">
              <Link to="/security-overview" className="block text-blue-600 hover:underline">Security Overview</Link>
              <Link to="/access-control" className="block text-blue-600 hover:underline">Access Control</Link>
              <Link to="/data-protection" className="block text-blue-600 hover:underline">Data Protection</Link>
              <Link to="/security-logs" className="block text-blue-600 hover:underline">Security Logs</Link>
              <Link to="/checkin-security" className="block text-blue-600 hover:underline">Check-in Security</Link>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 lg:col-span-1">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-2">System Integration</h3>
            <div className="space-y-2 text-sm">
              <Link to="/integrations" className="block text-blue-600 hover:underline">Integrations</Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
