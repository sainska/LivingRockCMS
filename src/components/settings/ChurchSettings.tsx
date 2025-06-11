
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Church, MapPin, Phone, Mail, Globe, Save } from "lucide-react";

const ChurchSettings = () => {
  const [churchInfo, setChurchInfo] = useState({
    name: "Living Rock Church",
    denomination: "Non-denominational",
    address: "123 Faith Avenue, Nairobi, Kenya",
    phone: "+254 700 123 456",
    email: "info@livingrockchurch.org",
    website: "www.livingrockchurch.org",
    pastor: "Pastor John Kimani",
    establishedYear: "1995",
    mission: "To make disciples of Jesus Christ who are committed to growing in their faith and serving others.",
    vision: "A community where everyone can find hope, healing, and purpose through Jesus Christ."
  });

  const [serviceSettings, setServiceSettings] = useState({
    sundayMorning: "09:00",
    sundayEvening: "18:00",
    wednesdayService: "19:00",
    prayerMeeting: "06:00",
    enableOnlineServices: true,
    enableLiveStreaming: true
  });

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    weeklyReports: true,
    eventReminders: true
  });

  const handleSave = () => {
    console.log("Saving church settings:", { churchInfo, serviceSettings, notifications });
    // In a real app, this would save to the database
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Church Information</h3>
        <Button onClick={handleSave}>
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>

      {/* Basic Church Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Church className="h-4 w-4" />
            Basic Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Church Name</Label>
              <Input 
                value={churchInfo.name}
                onChange={(e) => setChurchInfo(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Denomination</Label>
              <Select value={churchInfo.denomination} onValueChange={(value) => setChurchInfo(prev => ({ ...prev, denomination: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Non-denominational">Non-denominational</SelectItem>
                  <SelectItem value="Baptist">Baptist</SelectItem>
                  <SelectItem value="Methodist">Methodist</SelectItem>
                  <SelectItem value="Presbyterian">Presbyterian</SelectItem>
                  <SelectItem value="Pentecostal">Pentecostal</SelectItem>
                  <SelectItem value="Anglican">Anglican</SelectItem>
                  <SelectItem value="Catholic">Catholic</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Pastor</Label>
              <Input 
                value={churchInfo.pastor}
                onChange={(e) => setChurchInfo(prev => ({ ...prev, pastor: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Established Year</Label>
              <Input 
                type="number"
                value={churchInfo.establishedYear}
                onChange={(e) => setChurchInfo(prev => ({ ...prev, establishedYear: e.target.value }))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Contact Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Address</Label>
            <Textarea 
              value={churchInfo.address}
              onChange={(e) => setChurchInfo(prev => ({ ...prev, address: e.target.value }))}
              rows={2}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Phone Number
              </Label>
              <Input 
                value={churchInfo.phone}
                onChange={(e) => setChurchInfo(prev => ({ ...prev, phone: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email Address
              </Label>
              <Input 
                type="email"
                value={churchInfo.email}
                onChange={(e) => setChurchInfo(prev => ({ ...prev, email: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Website
              </Label>
              <Input 
                value={churchInfo.website}
                onChange={(e) => setChurchInfo(prev => ({ ...prev, website: e.target.value }))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mission & Vision */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Mission & Vision</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Mission Statement</Label>
            <Textarea 
              value={churchInfo.mission}
              onChange={(e) => setChurchInfo(prev => ({ ...prev, mission: e.target.value }))}
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Vision Statement</Label>
            <Textarea 
              value={churchInfo.vision}
              onChange={(e) => setChurchInfo(prev => ({ ...prev, vision: e.target.value }))}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Service Times */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Service Times</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Sunday Morning Service</Label>
              <Input 
                type="time"
                value={serviceSettings.sundayMorning}
                onChange={(e) => setServiceSettings(prev => ({ ...prev, sundayMorning: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Sunday Evening Service</Label>
              <Input 
                type="time"
                value={serviceSettings.sundayEvening}
                onChange={(e) => setServiceSettings(prev => ({ ...prev, sundayEvening: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Wednesday Service</Label>
              <Input 
                type="time"
                value={serviceSettings.wednesdayService}
                onChange={(e) => setServiceSettings(prev => ({ ...prev, wednesdayService: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Prayer Meeting</Label>
              <Input 
                type="time"
                value={serviceSettings.prayerMeeting}
                onChange={(e) => setServiceSettings(prev => ({ ...prev, prayerMeeting: e.target.value }))}
              />
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Enable Online Services</Label>
                <p className="text-sm text-muted-foreground">Allow members to attend services online</p>
              </div>
              <Switch 
                checked={serviceSettings.enableOnlineServices}
                onCheckedChange={(checked) => setServiceSettings(prev => ({ ...prev, enableOnlineServices: checked }))}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Enable Live Streaming</Label>
                <p className="text-sm text-muted-foreground">Stream services live on social media</p>
              </div>
              <Switch 
                checked={serviceSettings.enableLiveStreaming}
                onCheckedChange={(checked) => setServiceSettings(prev => ({ ...prev, enableLiveStreaming: checked }))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Notification Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Email Notifications</Label>
                <p className="text-sm text-muted-foreground">Send notifications via email</p>
              </div>
              <Switch 
                checked={notifications.emailNotifications}
                onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, emailNotifications: checked }))}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">SMS Notifications</Label>
                <p className="text-sm text-muted-foreground">Send notifications via SMS</p>
              </div>
              <Switch 
                checked={notifications.smsNotifications}
                onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, smsNotifications: checked }))}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Push Notifications</Label>
                <p className="text-sm text-muted-foreground">Send push notifications to mobile devices</p>
              </div>
              <Switch 
                checked={notifications.pushNotifications}
                onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, pushNotifications: checked }))}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Weekly Reports</Label>
                <p className="text-sm text-muted-foreground">Send weekly summary reports</p>
              </div>
              <Switch 
                checked={notifications.weeklyReports}
                onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, weeklyReports: checked }))}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Event Reminders</Label>
                <p className="text-sm text-muted-foreground">Send reminders for upcoming events</p>
              </div>
              <Switch 
                checked={notifications.eventReminders}
                onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, eventReminders: checked }))}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChurchSettings;
