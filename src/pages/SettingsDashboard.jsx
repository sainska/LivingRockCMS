import React from 'react';
import { useUserRole } from '@/hooks/useUserRole';
import MemberSettings from '@/components/member/MemberSettings';
import SecretarySettings from '@/components/secretary/SecretarySettings';
import TreasurerSettings from '@/components/treasurer/TreasurerSettings';
import ClergySettings from '@/components/clergy/ClergySettings';
import SystemSettings from '@/components/settings/SystemSettings';

const SettingsDashboard = () => {
  const { role, loading } = useUserRole();

  if (loading) {
    return <div className="p-8 text-center">Loading settings...</div>;
  }

  switch (role) {
    case 'member':
      return <MemberSettings />;
    case 'treasurer':
      return <TreasurerSettings />;
    case 'secretary':
      return <SecretarySettings />;
    case 'clergy':
      return <ClergySettings />;
    case 'system_admin':
      return <SystemSettings />;
    default:
      return <div className="p-8 text-center">Settings for your role are coming soon.</div>;
  }
};

export default SettingsDashboard; 