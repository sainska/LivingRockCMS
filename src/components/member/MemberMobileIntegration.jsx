import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

const fetchPreferences = async (userId) => {
  const { data, error } = await supabase.from('notification_preferences').select('*').eq('user_id', userId).single();
  if (error && error.code !== 'PGRST116') throw error;
  return data;
};

const MemberMobileIntegration = ({ userId }) => {
  const queryClient = useQueryClient();
  const { data: prefs, isLoading } = useQuery(['notification_preferences', userId], () => fetchPreferences(userId), { enabled: !!userId });
  const [localPrefs, setLocalPrefs] = useState({ push: false, sms: false, email: false });

  React.useEffect(() => {
    if (prefs) setLocalPrefs({ push: prefs.push, sms: prefs.sms, email: prefs.email });
  }, [prefs]);

  const updateMutation = useMutation(async (newPrefs) => {
    const { data, error } = await supabase.from('notification_preferences').upsert({ user_id: userId, ...newPrefs });
    if (error) throw error;
    return data;
  }, {
    onSuccess: () => { queryClient.invalidateQueries(['notification_preferences', userId]); }
  });

  const handleChange = (key, value) => {
    setLocalPrefs(prev => ({ ...prev, [key]: value }));
    updateMutation.mutate({ ...localPrefs, [key]: value });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Mobile Integration & Notifications</h2>
      <Card>
        <CardHeader><CardTitle>Notification Preferences</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Push Notifications</Label>
            <Switch checked={!!localPrefs.push} onCheckedChange={v => handleChange('push', v)} />
          </div>
          <div className="flex items-center justify-between">
            <Label>SMS Notifications</Label>
            <Switch checked={!!localPrefs.sms} onCheckedChange={v => handleChange('sms', v)} />
          </div>
          <div className="flex items-center justify-between">
            <Label>Email Notifications</Label>
            <Switch checked={!!localPrefs.email} onCheckedChange={v => handleChange('email', v)} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MemberMobileIntegration; 