import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Shield, 
  Bell, 
  Save, 
  Edit, 
  Camera,
  Key,
  Eye,
  EyeOff
} from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';
import { useUserRole } from '@/hooks/useUserRole';
import { useToast } from '@/hooks/use-toast';
import PasswordStrengthIndicator from '@/components/ui/PasswordStrengthIndicator';
import { validatePasswordComplete } from '@/utils/passwordValidation';

const UserProfile = () => {
  const { user, changePassword } = useAuth();
  const { role } = useUserRole();
  const { toast } = useToast();

  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [profileData, setProfileData] = useState({
    firstName: user?.user_metadata?.first_name || "John",
    lastName: user?.user_metadata?.last_name || "Doe",
    email: user?.email || "",
    phone: "+254 712 345 678",
    address: "123 Faith Street, Nairobi, Kenya",
    dateOfBirth: "1990-01-15",
    gender: "male",
    membershipNumber: "LRC20240123",
    joinDate: "2024-01-15",
    emergencyContact: {
      name: "Jane Doe",
      phone: "+254 723 456 789",
      relationship: "Spouse"
    }
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

  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: "members",
    showPhone: true,
    showAddress: false,
    showEmail: true,
    allowContact: true,
    showAttendance: true,
    showGiving: false
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const handleSaveProfile = () => {
    console.log('Saving profile data:', profileData);
    setIsEditing(false);
    // In a real app, this would save to the database
  };

  const handleSaveNotifications = () => {
    console.log('Saving notification settings:', notificationSettings);
    // In a real app, this would save to the database
  };

  const handleSavePrivacy = () => {
    console.log('Saving privacy settings:', privacySettings);
    // In a real app, this would save to the database
  };

  const handleChangePassword = async () => {
    // Validate password
    const validation = validatePasswordComplete(
      passwordData.newPassword, 
      passwordData.confirmPassword, 
      {
        email: user?.email,
        firstName: profileData.firstName,
        lastName: profileData.lastName
      }
    );

    if (!validation.isValid) {
      toast({
        title: "Password Validation Failed",
        description: validation.errors.join(", "),
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await changePassword(passwordData.currentPassword, passwordData.newPassword);
      
      if (!error) {
        // Clear password fields after successful change
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: ""
        });
      }
    } catch (error) {
      console.error('Error changing password:', error);
    }
  };

  const getRoleDisplayName = (role) => {
    switch (role) {
      case "system_admin": return "System Administrator";
      case "clergy": return "Clergy";
      case "treasurer": return "Treasurer";
      case "secretary": return "Secretary";
      case "member": return "Member";
      default: return "Member";
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "system_admin": return "bg-red-100 text-red-800";
      case "clergy": return "bg-purple-100 text-purple-800";
      case "treasurer": return "bg-green-100 text-green-800";
      case "secretary": return "bg-blue-100 text-blue-800";
      case "member": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">My Profile</h1>
          <p className="text-muted-foreground">Manage your personal information and preferences</p>
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveProfile}>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Information */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4 mb-6">
                <Avatar className="h-20 w-20">
                  <AvatarImage src="/placeholder-avatar.jpg" />
                  <AvatarFallback className="text-lg">
                    {profileData.firstName.charAt(0)}{profileData.lastName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-semibold">
                    {profileData.firstName} {profileData.lastName}
                  </h3>
                  <Badge className={getRoleColor(role || 'member')}>
                    {getRoleDisplayName(role || 'member')}
                  </Badge>
                  <p className="text-sm text-muted-foreground mt-1">
                    Member since {profileData.joinDate}
                  </p>
                </div>
                {isEditing && (
                  <Button variant="outline" size="sm">
                    <Camera className="h-4 w-4 mr-2" />
                    Change Photo
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={profileData.firstName}
                    onChange={(e) => setProfileData(prev => ({ ...prev, firstName: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={profileData.lastName}
                    onChange={(e) => setProfileData(prev => ({ ...prev, lastName: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={profileData.phone}
                    onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={profileData.dateOfBirth}
                    onChange={(e) => setProfileData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select 
                    value={profileData.gender} 
                    onValueChange={(value) => setProfileData(prev => ({ ...prev, gender: value }))}
                    disabled={!isEditing}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  value={profileData.address}
                  onChange={(e) => setProfileData(prev => ({ ...prev, address: e.target.value }))}
                  disabled={!isEditing}
                  rows={3}
                />
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-3">Emergency Contact</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="emergencyName">Contact Name</Label>
                    <Input
                      id="emergencyName"
                      value={profileData.emergencyContact.name}
                      onChange={(e) => setProfileData(prev => ({ 
                        ...prev, 
                        emergencyContact: { ...prev.emergencyContact, name: e.target.value }
                      }))}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="emergencyPhone">Contact Phone</Label>
                    <Input
                      id="emergencyPhone"
                      value={profileData.emergencyContact.phone}
                      onChange={(e) => setProfileData(prev => ({ 
                        ...prev, 
                        emergencyContact: { ...prev.emergencyContact, phone: e.target.value }
                      }))}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="emergencyRelationship">Relationship</Label>
                    <Input
                      id="emergencyRelationship"
                      value={profileData.emergencyContact.relationship}
                      onChange={(e) => setProfileData(prev => ({ 
                        ...prev, 
                        emergencyContact: { ...prev.emergencyContact, relationship: e.target.value }
                      }))}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Change Password */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                Change Password
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <div className="relative">
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
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <div className="relative">
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
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                />
              </div>
              
              {/* Password Strength Indicator */}
              {passwordData.newPassword && (
                <PasswordStrengthIndicator
                  password={passwordData.newPassword}
                  confirmPassword={passwordData.confirmPassword}
                  userInfo={{
                    email: user?.email,
                    firstName: profileData.firstName,
                    lastName: profileData.lastName
                  }}
                />
              )}
              
              <Button 
                onClick={handleChangePassword}
                disabled={!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
              >
                Change Password
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Settings Sidebar */}
        <div className="space-y-6">
          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Email Notifications</Label>
                    <p className="text-xs text-muted-foreground">Receive notifications via email</p>
                  </div>
                  <Switch
                    checked={notificationSettings.emailNotifications}
                    onCheckedChange={(checked) => 
                      setNotificationSettings(prev => ({ ...prev, emailNotifications: checked }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">SMS Notifications</Label>
                    <p className="text-xs text-muted-foreground">Receive notifications via SMS</p>
                  </div>
                  <Switch
                    checked={notificationSettings.smsNotifications}
                    onCheckedChange={(checked) => 
                      setNotificationSettings(prev => ({ ...prev, smsNotifications: checked }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Push Notifications</Label>
                    <p className="text-xs text-muted-foreground">Receive push notifications</p>
                  </div>
                  <Switch
                    checked={notificationSettings.pushNotifications}
                    onCheckedChange={(checked) => 
                      setNotificationSettings(prev => ({ ...prev, pushNotifications: checked }))
                    }
                  />
                </div>
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
              </div>
              <Button onClick={handleSaveNotifications} className="w-full">
                Save Notification Settings
              </Button>
            </CardContent>
          </Card>

          {/* Privacy Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Privacy Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Profile Visibility</Label>
                <Select 
                  value={privacySettings.profileVisibility}
                  onValueChange={(value) => setPrivacySettings(prev => ({ ...prev, profileVisibility: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Public</SelectItem>
                    <SelectItem value="members">Church Members Only</SelectItem>
                    <SelectItem value="private">Private</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Show Phone Number</Label>
                  </div>
                  <Switch
                    checked={privacySettings.showPhone}
                    onCheckedChange={(checked) => 
                      setPrivacySettings(prev => ({ ...prev, showPhone: checked }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Show Address</Label>
                  </div>
                  <Switch
                    checked={privacySettings.showAddress}
                    onCheckedChange={(checked) => 
                      setPrivacySettings(prev => ({ ...prev, showAddress: checked }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Show Email</Label>
                  </div>
                  <Switch
                    checked={privacySettings.showEmail}
                    onCheckedChange={(checked) => 
                      setPrivacySettings(prev => ({ ...prev, showEmail: checked }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Allow Contact</Label>
                  </div>
                  <Switch
                    checked={privacySettings.allowContact}
                    onCheckedChange={(checked) => 
                      setPrivacySettings(prev => ({ ...prev, allowContact: checked }))
                    }
                  />
                </div>
              </div>
              <Button onClick={handleSavePrivacy} className="w-full">
                Save Privacy Settings
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UserProfile; 