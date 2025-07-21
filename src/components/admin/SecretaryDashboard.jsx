import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SecretaryMembers from '@/components/secretary/SecretaryMembers';
import SecretaryEvents from '@/components/secretary/SecretaryEvents';
import SecretaryMinistries from '@/components/secretary/SecretaryMinistries';
import SecretaryCommunication from '@/components/secretary/SecretaryCommunication';
import SecretaryPastoralCare from '@/components/secretary/SecretaryPastoralCare';
import SecretaryReports from '@/components/secretary/SecretaryReports';
import SecretaryTools from '@/components/secretary/SecretaryTools';
import { Outlet } from 'react-router-dom';

const SecretaryDashboard = () => {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Secretary Dashboard</h1>
      <Outlet />
    </div>
  );
};

export default SecretaryDashboard;
