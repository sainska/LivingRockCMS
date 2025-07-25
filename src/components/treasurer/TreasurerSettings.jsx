import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

const TreasurerSettings = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState({
    email: '',
    phone: '',
    exportFormat: 'csv',
  });
  const [notifications, setNotifications] = useState({
    largeTransaction: true,
    approvalNeeded: true,
    monthlyReport: true,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) fetchSettings();
  }, [user]);

  const fetchSettings = async () => {
    setLoading(true);
    const userId = user?.id;
    if (!userId) return setLoading(false);
    const { data: profileData } = await supabase.from('profiles').select('*').eq('id', userId).single();
    if (profileData) {
      setProfile({
        email: profileData.email || '',
        phone: profileData.phone || '',
        exportFormat: profileData.export_format || 'csv',
      });
    }
    const { data: notifData } = await supabase.from('treasurer_notifications').select('*').eq('user_id', userId).single();
    if (notifData) {
      setNotifications({
        largeTransaction: notifData.large_transaction,
        approvalNeeded: notifData.approval_needed,
        monthlyReport: notifData.monthly_report,
      });
    }
    setLoading(false);
  };

  const saveProfile = async () => {
    setSaving(true);
    const userId = user?.id;
    if (!userId) return;
    const { error } = await supabase.from('profiles').update({
      email: profile.email,
      phone: profile.phone,
      export_format: profile.exportFormat,
    }).eq('id', userId);
    if (error) toast.error('Failed to save profile');
    else toast.success('Profile saved');
    setSaving(false);
  };

  const saveNotifications = async () => {
    setSaving(true);
    const userId = user?.id;
    if (!userId) return;
    const { error } = await supabase.from('treasurer_notifications').upsert({
      user_id: userId,
      large_transaction: notifications.largeTransaction,
      approval_needed: notifications.approvalNeeded,
      monthly_report: notifications.monthlyReport,
    });
    if (error) toast.error('Failed to save notifications');
    else toast.success('Notifications saved');
    setSaving(false);
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Treasurer Settings</h2>
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
            <Label>Export Format</Label>
            <select value={profile.exportFormat} onChange={e => setProfile(p => ({ ...p, exportFormat: e.target.value }))} className="border rounded px-2 py-1">
              <option value="csv">CSV</option>
              <option value="xlsx">Excel (XLSX)</option>
            </select>
          </div>
          <Button onClick={saveProfile} disabled={saving}>Save Profile</Button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Notification Preferences</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Large Transaction Alerts</Label>
            <Switch checked={notifications.largeTransaction} onCheckedChange={v => setNotifications(n => ({ ...n, largeTransaction: v }))} />
          </div>
          <div className="flex items-center justify-between">
            <Label>Approval Needed Alerts</Label>
            <Switch checked={notifications.approvalNeeded} onCheckedChange={v => setNotifications(n => ({ ...n, approvalNeeded: v }))} />
          </div>
          <div className="flex items-center justify-between">
            <Label>Monthly Report Emails</Label>
            <Switch checked={notifications.monthlyReport} onCheckedChange={v => setNotifications(n => ({ ...n, monthlyReport: v }))} />
          </div>
          <Button onClick={saveNotifications} disabled={saving}>Save Notifications</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default TreasurerSettings; 