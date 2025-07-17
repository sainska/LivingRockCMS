
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { User, Bell, Shield, Save } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const ProfileSettings = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: 'Kenya',
    gender: '',
    date_of_birth: '',
    marital_status: '',
    occupation: '',
    emergency_contact_name: '',
    emergency_contact_phone: ''
  });

  const [notificationPrefs, setNotificationPrefs] = useState({
    email_notifications: true,
    sms_notifications: true,
    whatsapp_notifications: true,
    event_reminders: true,
    donation_receipts: true,
    prayer_updates: true,
    newsletter: true
  });

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchNotificationPreferences();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setProfile({
          first_name: data.first_name || '',
          last_name: data.last_name || '',
          email: data.email || '',
          phone: data.phone || '',
          address: data.address || '',
          city: data.city || '',
          country: data.country || 'Kenya',
          gender: data.gender || '',
          date_of_birth: data.date_of_birth || '',
          marital_status: data.marital_status || '',
          occupation: data.occupation || '',
          emergency_contact_name: data.emergency_contact_name || '',
          emergency_contact_phone: data.emergency_contact_phone || ''
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile');
    }
  };

  const fetchNotificationPreferences = async () => {
    try {
      const { data, error } = await supabase
        .from('notification_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setNotificationPrefs({
          email_notifications: data.email_notifications,
          sms_notifications: data.sms_notifications,
          whatsapp_notifications: data.whatsapp_notifications,
          event_reminders: data.event_reminders,
          donation_receipts: data.donation_receipts,
          prayer_updates: data.prayer_updates,
          newsletter: data.newsletter
        });
      }
    } catch (error) {
      console.error('Error fetching notification preferences:', error);
    }
  };

  const handleProfileChange = (field, value) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNotificationChange = (field, value) => {
    setNotificationPrefs(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const saveProfile = async () => {
    if (!user) return;

    try {
      setIsSaving(true);

      // Update profile
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          ...profile,
          updated_at: new Date().toISOString()
        });

      if (profileError) throw profileError;

      // Update notification preferences
      const { error: notifError } = await supabase
        .from('notification_preferences')
        .upsert({
          user_id: user.id,
          ...notificationPrefs,
          updated_at: new Date().toISOString()
        });

      if (notifError) throw notifError;

      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Profile Settings</h1>
          <p className="text-muted-foreground">Manage your personal information and preferences</p>
        </div>
        <Button onClick={saveProfile} disabled={isSaving}>
          <Save className="h-4 w-4 mr-2" />
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="first_name">First Name</Label>
              <Input
                id="first_name"
                value={profile.first_name}
                onChange={(e) => handleProfileChange('first_name', e.target.value)}
                placeholder="Enter your first name"
              />
            </div>
            <div>
              <Label htmlFor="last_name">Last Name</Label>
              <Input
                id="last_name"
                value={profile.last_name}
                onChange={(e) => handleProfileChange('last_name', e.target.value)}
                placeholder="Enter your last name"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={profile.email}
                readOnly
                className="bg-muted"
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={profile.phone}
                onChange={(e) => handleProfileChange('phone', e.target.value)}
                placeholder="Enter your phone number"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="gender">Gender</Label>
              <Select value={profile.gender} onValueChange={(value) => handleProfileChange('gender', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="date_of_birth">Date of Birth</Label>
              <Input
                id="date_of_birth"
                type="date"
                value={profile.date_of_birth}
                onChange={(e) => handleProfileChange('date_of_birth', e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="marital_status">Marital Status</Label>
              <Select value={profile.marital_status} onValueChange={(value) => handleProfileChange('marital_status', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select marital status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="single">Single</SelectItem>
                  <SelectItem value="married">Married</SelectItem>
                  <SelectItem value="divorced">Divorced</SelectItem>
                  <SelectItem value="widowed">Widowed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="occupation">Occupation</Label>
              <Input
                id="occupation"
                value={profile.occupation}
                onChange={(e) => handleProfileChange('occupation', e.target.value)}
                placeholder="Enter your occupation"
              />
            </div>
          </div>

          <Separator />

          <div>
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={profile.address}
              onChange={(e) => handleProfileChange('address', e.target.value)}
              placeholder="Enter your address"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={profile.city}
                onChange={(e) => handleProfileChange('city', e.target.value)}
                placeholder="Enter your city"
              />
            </div>
            <div>
              <Label htmlFor="country">Country</Label>
              <Select value={profile.country} onValueChange={(value) => handleProfileChange('country', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Kenya">Kenya</SelectItem>
                  <SelectItem value="Uganda">Uganda</SelectItem>
                  <SelectItem value="Tanzania">Tanzania</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="emergency_contact_name">Emergency Contact Name</Label>
              <Input
                id="emergency_contact_name"
                value={profile.emergency_contact_name}
                onChange={(e) => handleProfileChange('emergency_contact_name', e.target.value)}
                placeholder="Enter emergency contact name"
              />
            </div>
            <div>
              <Label htmlFor="emergency_contact_phone">Emergency Contact Phone</Label>
              <Input
                id="emergency_contact_phone"
                value={profile.emergency_contact_phone}
                onChange={(e) => handleProfileChange('emergency_contact_phone', e.target.value)}
                placeholder="Enter emergency contact phone"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notification Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notification Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Email Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive updates via email</p>
              </div>
              <Switch
                checked={notificationPrefs.email_notifications}
                onCheckedChange={(value) => handleNotificationChange('email_notifications', value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>SMS Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive updates via SMS</p>
              </div>
              <Switch
                checked={notificationPrefs.sms_notifications}
                onCheckedChange={(value) => handleNotificationChange('sms_notifications', value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>WhatsApp Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive updates via WhatsApp</p>
              </div>
              <Switch
                checked={notificationPrefs.whatsapp_notifications}
                onCheckedChange={(value) => handleNotificationChange('whatsapp_notifications', value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Event Reminders</Label>
                <p className="text-sm text-muted-foreground">Get reminders for upcoming events</p>
              </div>
              <Switch
                checked={notificationPrefs.event_reminders}
                onCheckedChange={(value) => handleNotificationChange('event_reminders', value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Donation Receipts</Label>
                <p className="text-sm text-muted-foreground">Receive donation confirmations</p>
              </div>
              <Switch
                checked={notificationPrefs.donation_receipts}
                onCheckedChange={(value) => handleNotificationChange('donation_receipts', value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Prayer Updates</Label>
                <p className="text-sm text-muted-foreground">Get prayer request updates</p>
              </div>
              <Switch
                checked={notificationPrefs.prayer_updates}
                onCheckedChange={(value) => handleNotificationChange('prayer_updates', value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Newsletter</Label>
                <p className="text-sm text-muted-foreground">Receive church newsletter</p>
              </div>
              <Switch
                checked={notificationPrefs.newsletter}
                onCheckedChange={(value) => handleNotificationChange('newsletter', value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileSettings;
