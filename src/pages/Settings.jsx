
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUserRole } from '@/hooks/useUserRole';
import ProfileSettings from '@/components/settings/ProfileSettings';

const Settings = () => {
  const { role } = useUserRole();

  return (
    <div className="container mx-auto py-6">
      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="church">Church Settings</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <ProfileSettings />
        </TabsContent>
        
        <TabsContent value="church">
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Church Settings</h2>
            <p className="text-muted-foreground">Church configuration settings coming soon...</p>
          </div>
        </TabsContent>
        
        <TabsContent value="system">
          {role === 'system_admin' ? (
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4">System Administration</h2>
              <p className="text-muted-foreground">System administration features coming soon...</p>
            </div>
          ) : (
            <div className="p-6 text-center">
              <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
              <p className="text-muted-foreground">You don't have permission to access system settings.</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="security">
          {role === 'system_admin' ? (
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4">Security Settings</h2>
              <p className="text-muted-foreground">Security configuration features coming soon...</p>
            </div>
          ) : (
            <div className="p-6 text-center">
              <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
              <p className="text-muted-foreground">You don't have permission to access security settings.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
