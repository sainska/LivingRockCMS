
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUserRole } from '@/hooks/useUserRole';
import MinistryDashboard from '@/components/ministry/MinistryDashboard';
import MinistryList from '@/components/ministry/MinistryList';
import MinistryMembers from '@/components/ministry/MinistryMembers';
import MinistryReports from '@/components/ministry/MinistryReports';

const Ministry = () => {
  const { role } = useUserRole();

  return (
    <div className="container mx-auto py-6">
      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="ministries">Ministries</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard">
          <MinistryDashboard />
        </TabsContent>
        
        <TabsContent value="ministries">
          <MinistryList />
        </TabsContent>
        
        <TabsContent value="members">
          <MinistryMembers />
        </TabsContent>
        
        <TabsContent value="reports">
          <MinistryReports />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Ministry;
