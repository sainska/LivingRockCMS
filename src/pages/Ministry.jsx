
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUserRole } from '@/hooks/useUserRole';
import MinistryDashboard from '@/components/ministry/MinistryDashboard';

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
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Ministry Management</h2>
            <p className="text-muted-foreground">Ministry management features coming soon...</p>
          </div>
        </TabsContent>
        
        <TabsContent value="members">
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Ministry Members</h2>
            <p className="text-muted-foreground">Member management features coming soon...</p>
          </div>
        </TabsContent>
        
        <TabsContent value="reports">
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Ministry Reports</h2>
            <p className="text-muted-foreground">Ministry reporting features coming soon...</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Ministry;
