import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const ClergySettings = () => {
  const [profile, setProfile] = useState({
    email: '',
    phone: '',
    defaultMinistry: '',
  });
  const [notifications, setNotifications] = useState({
    prayerRequests: true,
    eventReminders: true,
    ministryUpdates: true,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    // Fetch profile and notification settings from Supabase
    const userId = supabase.auth.user()?.id;
    if (!userId) return setLoading(false);
    const { data: profileData } = await supabase.from('profiles').select('*').eq('id', userId).single();
    if (profileData) {
      setProfile({
        email: profileData.email || '',
        phone: profileData.phone || '',
        defaultMinistry: profileData.default_ministry || '',
      });
    }
    const { data: notifData } = await supabase.from('clergy_notifications').select('*').eq('user_id', userId).single();
    if (notifData) {
      setNotifications({
        prayerRequests: notifData.prayer_requests,
        eventReminders: notifData.event_reminders,
        ministryUpdates: notifData.ministry_updates,
      });
    }
    setLoading(false);
  };

  const saveProfile = async () => {
    setSaving(true);
    const userId = supabase.auth.user()?.id;
    if (!userId) return;
    const { error } = await supabase.from('profiles').update({
      email: profile.email,
      phone: profile.phone,
      default_ministry: profile.defaultMinistry,
    }).eq('id', userId);
    if (error) toast.error('Failed to save profile');
    else toast.success('Profile saved');
    setSaving(false);
  };

  const saveNotifications = async () => {
    setSaving(true);
    const userId = supabase.auth.user()?.id;
    if (!userId) return;
    const { error } = await supabase.from('clergy_notifications').upsert({
      user_id: userId,
      prayer_requests: notifications.prayerRequests,
      event_reminders: notifications.eventReminders,
      ministry_updates: notifications.ministryUpdates,
    });
    if (error) toast.error('Failed to save notifications');
    else toast.success('Notifications saved');
    setSaving(false);
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Clergy Settings</h2>
      <Card>
        <CardHeader><CardTitle>Profile</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Email</Label>
            <Input value={profile.email} onChange={e => setProfile(p => ({ ...p, email: e.target.value }))} />
          </div>
          <div>
            <Label>Phone</Label>
            <Input value={profile.phone} onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))} />
          </div>
          <div>
            <Label>Default Ministry</Label>
            <Input value={profile.defaultMinistry} onChange={e => setProfile(p => ({ ...p, defaultMinistry: e.target.value }))} />
          </div>
          <Button onClick={saveProfile} disabled={saving}>Save Profile</Button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Notification Preferences</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Prayer Request Alerts</Label>
            <Switch checked={notifications.prayerRequests} onCheckedChange={v => setNotifications(n => ({ ...n, prayerRequests: v }))} />
          </div>
          <div className="flex items-center justify-between">
            <Label>Event Reminders</Label>
            <Switch checked={notifications.eventReminders} onCheckedChange={v => setNotifications(n => ({ ...n, eventReminders: v }))} />
          </div>
          <div className="flex items-center justify-between">
            <Label>Ministry Updates</Label>
            <Switch checked={notifications.ministryUpdates} onCheckedChange={v => setNotifications(n => ({ ...n, ministryUpdates: v }))} />
          </div>
          <Button onClick={saveNotifications} disabled={saving}>Save Notifications</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClergySettings; 