import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import UserProfile from '@/components/user/UserProfile';
import MemberMinistries from '@/components/member/MemberMinistries';
import MemberAttendance from '@/components/member/MemberAttendance';
import MemberGiving from '@/components/member/MemberGiving';
import MemberPastoralCare from '@/components/member/MemberPastoralCare';
import MemberMessages from '@/components/member/MemberMessages';
import MemberSettings from '@/components/member/MemberSettings';
import MemberBadges from '@/components/member/MemberBadges';
import MemberSurveys from '@/components/member/MemberSurveys';
import MemberMobileIntegration from '@/components/member/MemberMobileIntegration';
import { useAuth } from '@/contexts/AuthContext';
import { Outlet } from 'react-router-dom';

const MemberDashboard = () => {
  const { user } = useAuth();
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Member Dashboard</h1>
      <Outlet />
    </div>
  );
};

export default MemberDashboard; 