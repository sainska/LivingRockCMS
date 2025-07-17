
import React from 'react';
import UserAccessControl from '@/components/security/UserAccessControl';
import SecurityOverview from '@/components/security/SecurityOverview';
import RealTimeSecurityLogs from '@/components/security/RealTimeSecurityLogs';
import DataProtection from '@/components/security/DataProtection';
import CheckInSecurity from '@/components/security/CheckInSecurity';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUserRole } from '@/hooks/useUserRole';

const Security = () => {
  const { role } = useUserRole();

  // Only system admins can access security features
  if (role !== 'system_admin') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-muted-foreground">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <Tabs defaultValue="access-control" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="access-control">Access Control</TabsTrigger>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="logs">Security Logs</TabsTrigger>
          <TabsTrigger value="data-protection">Data Protection</TabsTrigger>
          <TabsTrigger value="check-in">Check-in Security</TabsTrigger>
        </TabsList>
        
        <TabsContent value="access-control">
          <UserAccessControl />
        </TabsContent>
        
        <TabsContent value="overview">
          <SecurityOverview />
        </TabsContent>
        
        <TabsContent value="logs">
          <RealTimeSecurityLogs />
        </TabsContent>
        
        <TabsContent value="data-protection">
          <DataProtection />
        </TabsContent>
        
        <TabsContent value="check-in">
          <CheckInSecurity />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Security;
