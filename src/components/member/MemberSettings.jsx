import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { 
  Shield, 
  Bell, 
  Eye, 
  EyeOff, 
  Key,
  User,
  Lock,
  Smartphone,
  Mail,
  Save,
  AlertTriangle,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
  MessageSquare
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const MemberSettings = () => {
  const { user } = useAuth();
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: 'members',
    showPhone: true,
    showAddress: false,
    showEmail: true,
    allowContact: true,
    showAttendance: true,
    showGiving: false
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    eventReminders: true,
    prayerRequests: true,
    weeklyNewsletter: false,
    ministryUpdates: true,
    financialReports: false
  });

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorEnabled: false,
    sessionTimeout: '24h',
    loginNotifications: true
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const handleSavePrivacy = () => {
    // Mock API call
    console.log('Saving privacy settings:', privacySettings);
    // In real app, this would make an API call
  };

  const handleSaveNotifications = () => {
    // Mock API call
    console.log('Saving notification settings:', notificationSettings);
    // In real app, this would make an API call
  };

  const handleSaveSecurity = () => {
    // Mock API call
    console.log('Saving security settings:', securitySettings);
    // In real app, this would make an API call
  };

  const handleChangePassword = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      console.error('Passwords do not match');
      return;
    }
    console.log('Changing password...');
    // In real app, this would call the auth service
  };

  const toggleTwoFactor = () => {
    setSecuritySettings(prev => ({
      ...prev,
      twoFactorEnabled: !prev.twoFactorEnabled
    }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">System Settings</h2>
        <p className="text-muted-foreground">Manage your privacy, notifications, and security preferences</p>
      </div>

      <Tabs defaultValue="privacy" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="privacy">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Privacy Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label>Profile Visibility</Label>
                <Select 
                  value={privacySettings.profileVisibility}
                  onValueChange={(value) => setPrivacySettings(prev => ({ ...prev, profileVisibility: value }))}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Public</SelectItem>
                    <SelectItem value="members">Church Members Only</SelectItem>
                    <SelectItem value="private">Private</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Information Visibility</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <Label className="text-sm font-medium">Show Phone Number</Label>
                        <p className="text-xs text-muted-foreground">Allow other members to see your phone number</p>
                      </div>
                    </div>
                    <Switch
                      checked={privacySettings.showPhone}
                      onCheckedChange={(checked) => 
                        setPrivacySettings(prev => ({ ...prev, showPhone: checked }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <Label className="text-sm font-medium">Show Address</Label>
                        <p className="text-xs text-muted-foreground">Allow other members to see your address</p>
                      </div>
                    </div>
                    <Switch
                      checked={privacySettings.showAddress}
                      onCheckedChange={(checked) => 
                        setPrivacySettings(prev => ({ ...prev, showAddress: checked }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <Label className="text-sm font-medium">Show Email</Label>
                        <p className="text-xs text-muted-foreground">Allow other members to see your email</p>
                      </div>
                    </div>
                    <Switch
                      checked={privacySettings.showEmail}
                      onCheckedChange={(checked) => 
                        setPrivacySettings(prev => ({ ...prev, showEmail: checked }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <Label className="text-sm font-medium">Allow Contact</Label>
                        <p className="text-xs text-muted-foreground">Allow other members to contact you</p>
                      </div>
                    </div>
                    <Switch
                      checked={privacySettings.allowContact}
                      onCheckedChange={(checked) => 
                        setPrivacySettings(prev => ({ ...prev, allowContact: checked }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <Label className="text-sm font-medium">Show Attendance</Label>
                        <p className="text-xs text-muted-foreground">Allow leaders to see your attendance records</p>
                      </div>
                    </div>
                    <Switch
                      checked={privacySettings.showAttendance}
                      onCheckedChange={(checked) => 
                        setPrivacySettings(prev => ({ ...prev, showAttendance: checked }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <Label className="text-sm font-medium">Show Giving</Label>
                        <p className="text-xs text-muted-foreground">Allow leaders to see your giving records</p>
                      </div>
                    </div>
                    <Switch
                      checked={privacySettings.showGiving}
                      onCheckedChange={(checked) => 
                        setPrivacySettings(prev => ({ ...prev, showGiving: checked }))
                      }
                    />
                  </div>
                </div>
              </div>

              <Button onClick={handleSavePrivacy} className="w-full">
                <Save className="h-4 w-4 mr-2" />
                Save Privacy Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-medium">Notification Channels</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <Label className="text-sm font-medium">Email Notifications</Label>
                        <p className="text-xs text-muted-foreground">Receive notifications via email</p>
                      </div>
                    </div>
                    <Switch
                      checked={notificationSettings.emailNotifications}
                      onCheckedChange={(checked) => 
                        setNotificationSettings(prev => ({ ...prev, emailNotifications: checked }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Smartphone className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <Label className="text-sm font-medium">SMS Notifications</Label>
                        <p className="text-xs text-muted-foreground">Receive notifications via SMS</p>
                      </div>
                    </div>
                    <Switch
                      checked={notificationSettings.smsNotifications}
                      onCheckedChange={(checked) => 
                        setNotificationSettings(prev => ({ ...prev, smsNotifications: checked }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bell className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <Label className="text-sm font-medium">Push Notifications</Label>
                        <p className="text-xs text-muted-foreground">Receive push notifications</p>
                      </div>
                    </div>
                    <Switch
                      checked={notificationSettings.pushNotifications}
                      onCheckedChange={(checked) => 
                        setNotificationSettings(prev => ({ ...prev, pushNotifications: checked }))
                      }
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Notification Types</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">Event Reminders</Label>
                      <p className="text-xs text-muted-foreground">Get reminded about upcoming events</p>
                    </div>
                    <Switch
                      checked={notificationSettings.eventReminders}
                      onCheckedChange={(checked) => 
                        setNotificationSettings(prev => ({ ...prev, eventReminders: checked }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">Prayer Requests</Label>
                      <p className="text-xs text-muted-foreground">Receive prayer request updates</p>
                    </div>
                    <Switch
                      checked={notificationSettings.prayerRequests}
                      onCheckedChange={(checked) => 
                        setNotificationSettings(prev => ({ ...prev, prayerRequests: checked }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">Ministry Updates</Label>
                      <p className="text-xs text-muted-foreground">Receive ministry-related updates</p>
                    </div>
                    <Switch
                      checked={notificationSettings.ministryUpdates}
                      onCheckedChange={(checked) => 
                        setNotificationSettings(prev => ({ ...prev, ministryUpdates: checked }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">Weekly Newsletter</Label>
                      <p className="text-xs text-muted-foreground">Receive weekly church newsletter</p>
                    </div>
                    <Switch
                      checked={notificationSettings.weeklyNewsletter}
                      onCheckedChange={(checked) => 
                        setNotificationSettings(prev => ({ ...prev, weeklyNewsletter: checked }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">Financial Reports</Label>
                      <p className="text-xs text-muted-foreground">Receive financial giving reports</p>
                    </div>
                    <Switch
                      checked={notificationSettings.financialReports}
                      onCheckedChange={(checked) => 
                        setNotificationSettings(prev => ({ ...prev, financialReports: checked }))
                      }
                    />
                  </div>
                </div>
              </div>

              <Button onClick={handleSaveNotifications} className="w-full">
                <Save className="h-4 w-4 mr-2" />
                Save Notification Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  Security Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <Label className="text-sm font-medium">Two-Factor Authentication</Label>
                        <p className="text-xs text-muted-foreground">Add an extra layer of security to your account</p>
                      </div>
                    </div>
                    <Switch
                      checked={securitySettings.twoFactorEnabled}
                      onCheckedChange={toggleTwoFactor}
                    />
                  </div>

                  <div>
                    <Label>Session Timeout</Label>
                    <Select 
                      value={securitySettings.sessionTimeout}
                      onValueChange={(value) => setSecuritySettings(prev => ({ ...prev, sessionTimeout: value }))}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1h">1 Hour</SelectItem>
                        <SelectItem value="8h">8 Hours</SelectItem>
                        <SelectItem value="24h">24 Hours</SelectItem>
                        <SelectItem value="7d">7 Days</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">Login Notifications</Label>
                      <p className="text-xs text-muted-foreground">Get notified of new login attempts</p>
                    </div>
                    <Switch
                      checked={securitySettings.loginNotifications}
                      onCheckedChange={(checked) => 
                        setSecuritySettings(prev => ({ ...prev, loginNotifications: checked }))
                      }
                    />
                  </div>
                </div>

                <Button onClick={handleSaveSecurity} className="w-full">
                  <Save className="h-4 w-4 mr-2" />
                  Save Security Settings
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="h-5 w-5" />
                  Change Password
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <div className="relative mt-2">
                    <Input
                      id="currentPassword"
                      type={showPassword ? "text" : "password"}
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="newPassword">New Password</Label>
                  <div className="relative mt-2">
                    <Input
                      id="newPassword"
                      type={showNewPassword ? "text" : "password"}
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    className="mt-2"
                  />
                </div>

                <Button onClick={handleChangePassword} className="w-full">
                  Change Password
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MemberSettings; 