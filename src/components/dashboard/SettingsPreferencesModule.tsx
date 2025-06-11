
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Settings, User, Bell, Shield, Palette, Globe } from "lucide-react";

const SettingsPreferencesModule = () => {
  const settingsCategories = [
    {
      id: "account",
      title: "Account Settings",
      icon: User,
      description: "Manage your login details and personal information",
      items: ["Change password", "Update email", "Two-factor authentication"]
    },
    {
      id: "notifications",
      title: "Communication Preferences",
      icon: Bell,
      description: "Control how you receive church communications",
      items: ["SMS notifications", "Email alerts", "Push notifications"]
    },
    {
      id: "privacy",
      title: "Privacy & Security",
      icon: Shield,
      description: "Control your privacy and security settings",
      items: ["Profile visibility", "Contact preferences", "Data sharing"]
    },
    {
      id: "appearance",
      title: "Appearance",
      icon: Palette,
      description: "Customize the look and feel of your dashboard",
      items: ["Dark/Light mode", "Color theme", "Font size"]
    },
    {
      id: "language",
      title: "Language & Region",
      icon: Globe,
      description: "Set your preferred language and regional settings",
      items: ["Language preference", "Date format", "Time zone"]
    }
  ];

  const currentSettings = {
    theme: "Light Mode",
    notifications: {
      email: true,
      sms: true,
      push: false
    },
    language: "English",
    timezone: "East Africa Time (EAT)"
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-xiracom-blue">Settings & Preferences</h2>
        <Button variant="outline">
          <Settings className="h-4 w-4 mr-2" />
          Reset to Default
        </Button>
      </div>

      {/* Current Settings Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Current Settings Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-3 border rounded-lg">
              <p className="font-semibold">Theme</p>
              <p className="text-sm text-muted-foreground">{currentSettings.theme}</p>
            </div>
            <div className="p-3 border rounded-lg">
              <p className="font-semibold">Language</p>
              <p className="text-sm text-muted-foreground">{currentSettings.language}</p>
            </div>
            <div className="p-3 border rounded-lg">
              <p className="font-semibold">Email Alerts</p>
              <Badge variant={currentSettings.notifications.email ? "default" : "secondary"}>
                {currentSettings.notifications.email ? "Enabled" : "Disabled"}
              </Badge>
            </div>
            <div className="p-3 border rounded-lg">
              <p className="font-semibold">SMS Alerts</p>
              <Badge variant={currentSettings.notifications.sms ? "default" : "secondary"}>
                {currentSettings.notifications.sms ? "Enabled" : "Disabled"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Settings Categories */}
      <div className="grid gap-6">
        {settingsCategories.map((category) => {
          const IconComponent = category.icon;
          return (
            <Card key={category.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-xiracom-blue rounded-lg flex items-center justify-center">
                    <IconComponent className="h-5 w-5 text-white" />
                  </div>
                  {category.title}
                </CardTitle>
                <p className="text-muted-foreground">{category.description}</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {category.items.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <span className="font-medium">{item}</span>
                      <Button size="sm" variant="outline">
                        Configure
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Theme Toggle */}
            <div className="space-y-3">
              <h4 className="font-semibold">Appearance Theme</h4>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1">
                  ☀️ Light Mode
                </Button>
                <Button variant="outline" className="flex-1">
                  🌙 Dark Mode
                </Button>
              </div>
            </div>

            {/* Language Selection */}
            <div className="space-y-3">
              <h4 className="font-semibold">Language</h4>
              <Button variant="outline" className="w-full justify-start">
                🌐 English (Current)
              </Button>
            </div>

            {/* Notification Toggles */}
            <div className="space-y-3">
              <h4 className="font-semibold">Notifications</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span>Email Notifications</span>
                  <Button size="sm" variant={currentSettings.notifications.email ? "default" : "outline"}>
                    {currentSettings.notifications.email ? "On" : "Off"}
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <span>SMS Alerts</span>
                  <Button size="sm" variant={currentSettings.notifications.sms ? "default" : "outline"}>
                    {currentSettings.notifications.sms ? "On" : "Off"}
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <span>Push Notifications</span>
                  <Button size="sm" variant={currentSettings.notifications.push ? "default" : "outline"}>
                    {currentSettings.notifications.push ? "On" : "Off"}
                  </Button>
                </div>
              </div>
            </div>

            {/* Data & Privacy */}
            <div className="space-y-3">
              <h4 className="font-semibold">Data & Privacy</h4>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  Download My Data
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Privacy Settings
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Account Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-red-600">Account Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg">
              <div>
                <p className="font-semibold text-red-600">Deactivate Account</p>
                <p className="text-sm text-muted-foreground">
                  Temporarily disable your account access
                </p>
              </div>
              <Button variant="outline" className="border-red-500 text-red-500 hover:bg-red-50">
                Deactivate
              </Button>
            </div>
            <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg">
              <div>
                <p className="font-semibold text-red-600">Delete Account</p>
                <p className="text-sm text-muted-foreground">
                  Permanently delete your account and all data
                </p>
              </div>
              <Button variant="outline" className="border-red-500 text-red-500 hover:bg-red-50">
                Delete
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Help & Support */}
      <Card>
        <CardHeader>
          <CardTitle>Help & Support</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-20 flex-col">
              <Settings className="h-6 w-6 mb-2" />
              User Guide
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <User className="h-6 w-6 mb-2" />
              Contact Support
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Globe className="h-6 w-6 mb-2" />
              FAQ
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPreferencesModule;
