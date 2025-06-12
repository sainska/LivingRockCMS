
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  User, 
  Bell, 
  Shield, 
  Calendar, 
  BookOpen, 
  Users, 
  Heart,
  Settings
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ClergySettings = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("profile");

  const handleSaveSettings = (section: string) => {
    toast({
      title: "Settings saved",
      description: `Your ${section} settings have been updated successfully.`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Settings className="h-6 w-6" />
        <h1 className="text-3xl font-bold">Clergy Settings</h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="ministry">Ministry</TabsTrigger>
          <TabsTrigger value="pastoral">Pastoral Care</TabsTrigger>
          <TabsTrigger value="sermons">Sermons</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Information
              </CardTitle>
              <CardDescription>
                Update your personal details and ministry information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" placeholder="John" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" placeholder="Smith" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">Ministry Title</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your title" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pastor">Pastor</SelectItem>
                    <SelectItem value="associate-pastor">Associate Pastor</SelectItem>
                    <SelectItem value="youth-pastor">Youth Pastor</SelectItem>
                    <SelectItem value="worship-leader">Worship Leader</SelectItem>
                    <SelectItem value="elder">Elder</SelectItem>
                    <SelectItem value="deacon">Deacon</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="john.smith@livingrock.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" type="tel" placeholder="(555) 123-4567" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Ministry Bio</Label>
                <Textarea 
                  id="bio" 
                  placeholder="Share about your ministry background and calling..."
                  rows={4}
                />
              </div>
              <Button onClick={() => handleSaveSettings("profile")}>
                Save Profile
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Preferences
              </CardTitle>
              <CardDescription>
                Configure how you receive notifications for ministry activities
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Pastoral Care Requests</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified when new pastoral care requests are submitted
                  </p>
                </div>
                <Switch />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Member Updates</Label>
                  <p className="text-sm text-muted-foreground">
                    Notifications for member profile changes and updates
                  </p>
                </div>
                <Switch />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Event Reminders</Label>
                  <p className="text-sm text-muted-foreground">
                    Reminders for upcoming ministry events and meetings
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Sermon Deadlines</Label>
                  <p className="text-sm text-muted-foreground">
                    Reminders for sermon preparation and submission deadlines
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <Button onClick={() => handleSaveSettings("notifications")}>
                Save Notification Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ministry" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Ministry Configuration
              </CardTitle>
              <CardDescription>
                Configure your ministry areas and responsibilities
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Primary Ministry Areas</Label>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">Pastoral Care</Badge>
                  <Badge variant="secondary">Youth Ministry</Badge>
                  <Badge variant="secondary">Worship</Badge>
                  <Badge variant="outline">+ Add Area</Badge>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="availableHours">Available Ministry Hours</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select availability" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full-time">Full Time (40+ hours)</SelectItem>
                    <SelectItem value="part-time">Part Time (20-39 hours)</SelectItem>
                    <SelectItem value="volunteer">Volunteer (Flexible)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="officeHours">Office Hours</Label>
                <Input id="officeHours" placeholder="Monday-Friday, 9:00 AM - 5:00 PM" />
              </div>
              <Button onClick={() => handleSaveSettings("ministry")}>
                Save Ministry Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pastoral" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5" />
                Pastoral Care Settings
              </CardTitle>
              <CardDescription>
                Configure pastoral care preferences and workflows
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Auto-assign Requests</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically assign pastoral care requests to you
                  </p>
                </div>
                <Switch />
              </div>
              <Separator />
              <div className="space-y-2">
                <Label htmlFor="responseTime">Expected Response Time</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select response time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="immediate">Within 2 hours</SelectItem>
                    <SelectItem value="same-day">Same day</SelectItem>
                    <SelectItem value="next-day">Within 24 hours</SelectItem>
                    <SelectItem value="weekly">Within a week</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="specialties">Care Specialties</Label>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">Grief Counseling</Badge>
                  <Badge variant="secondary">Marriage Counseling</Badge>
                  <Badge variant="secondary">Youth Counseling</Badge>
                  <Badge variant="outline">+ Add Specialty</Badge>
                </div>
              </div>
              <Button onClick={() => handleSaveSettings("pastoral care")}>
                Save Pastoral Care Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sermons" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Sermon Management
              </CardTitle>
              <CardDescription>
                Configure sermon preparation and delivery preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="defaultSeries">Default Sermon Series</Label>
                <Input id="defaultSeries" placeholder="Current sermon series name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="preparationTime">Preparation Lead Time</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select preparation time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-week">1 Week</SelectItem>
                    <SelectItem value="2-weeks">2 Weeks</SelectItem>
                    <SelectItem value="1-month">1 Month</SelectItem>
                    <SelectItem value="3-months">3 Months</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Share Sermon Notes</Label>
                  <p className="text-sm text-muted-foreground">
                    Make sermon notes available to congregation
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <Button onClick={() => handleSaveSettings("sermons")}>
                Save Sermon Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security & Privacy
              </CardTitle>
              <CardDescription>
                Manage your account security and privacy settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input id="currentPassword" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input id="newPassword" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input id="confirmPassword" type="password" />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">
                    Add an extra layer of security to your account
                  </p>
                </div>
                <Switch />
              </div>
              <Button onClick={() => handleSaveSettings("security")}>
                Update Security Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ClergySettings;
