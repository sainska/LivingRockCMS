import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Settings, Database, Shield, Globe, HardDrive, Zap, Save } from "lucide-react";

const SystemSettings = () => {
  const [systemConfig, setSystemConfig] = useState({
    systemName: "Living Rock Church Management System",
    version: "2.1.4",
    environment: "Production",
    timezone: "Africa/Nairobi",
    language: "English",
    currency: "KSH",
    dateFormat: "DD/MM/YYYY",
    maintenanceMode: false,
    debugMode: false
  });

  const [performanceSettings, setPerformanceSettings] = useState({
    sessionTimeout: 30,
    maxUploadSize: 50,
    enableCaching: true,
    enableCompression: true,
    autoBackup: true,
    backupFrequency: "daily"
  });

  const [securitySettings, setSecuritySettings] = useState({
    forceHttps: true,
    enableTwoFactor: true,
    passwordMinLength: 8,
    passwordExpiry: 90,
    maxLoginAttempts: 3,
    lockoutDuration: 30
  });

  const systemStatus = [
    { component: "Database", status: "Online", uptime: "99.9%" },
    { component: "Web Server", status: "Online", uptime: "99.8%" },
    { component: "Email Service", status: "Online", uptime: "98.7%" },
    { component: "Backup System", status: "Online", uptime: "99.5%" },
    { component: "Security Monitor", status: "Online", uptime: "100%" }
  ];

  const getStatusColor = (status) => {
    return status === "Online" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
  };

  const handleSave = () => {
    console.log("Saving system settings:", { systemConfig, performanceSettings, securitySettings });
    // In a real app, this would save to the database
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">System Configuration</h3>
        <Button onClick={handleSave}>
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>

      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Zap className="h-4 w-4" />
            System Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {systemStatus.map((component, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium">{component.component}</h4>
                  <Badge className={getStatusColor(component.status)}>
                    {component.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">Uptime: {component.uptime}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Basic System Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Basic Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>System Name</Label>
              <Input 
                value={systemConfig.systemName}
                onChange={(e) => setSystemConfig(prev => ({ ...prev, systemName: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Environment</Label>
              <Select value={systemConfig.environment} onValueChange={(value) => setSystemConfig(prev => ({ ...prev, environment: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Production">Production</SelectItem>
                  <SelectItem value="Staging">Staging</SelectItem>
                  <SelectItem value="Development">Development</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Timezone</Label>
              <Select value={systemConfig.timezone} onValueChange={(value) => setSystemConfig(prev => ({ ...prev, timezone: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Africa/Nairobi">Africa/Nairobi (EAT)</SelectItem>
                  <SelectItem value="UTC">UTC</SelectItem>
                  <SelectItem value="America/New_York">America/New_York (EST)</SelectItem>
                  <SelectItem value="Europe/London">Europe/London (GMT)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Language</Label>
              <Select value={systemConfig.language} onValueChange={(value) => setSystemConfig(prev => ({ ...prev, language: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="English">English</SelectItem>
                  <SelectItem value="Swahili">Kiswahili</SelectItem>
                  <SelectItem value="French">Français</SelectItem>
                  <SelectItem value="Spanish">Español</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Currency</Label>
              <Select value={systemConfig.currency} onValueChange={(value) => setSystemConfig(prev => ({ ...prev, currency: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="KSH">KSH (Kenyan Shilling)</SelectItem>
                  <SelectItem value="USD">USD (US Dollar)</SelectItem>
                  <SelectItem value="EUR">EUR (Euro)</SelectItem>
                  <SelectItem value="GBP">GBP (British Pound)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Date Format</Label>
              <Select value={systemConfig.dateFormat} onValueChange={(value) => setSystemConfig(prev => ({ ...prev, dateFormat: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                  <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                  <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Maintenance Mode</Label>
                <p className="text-sm text-muted-foreground">Enable maintenance mode to restrict access</p>
              </div>
              <Switch 
                checked={systemConfig.maintenanceMode}
                onCheckedChange={(checked) => setSystemConfig(prev => ({ ...prev, maintenanceMode: checked }))}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Debug Mode</Label>
                <p className="text-sm text-muted-foreground">Enable detailed error logging</p>
              </div>
              <Switch 
                checked={systemConfig.debugMode}
                onCheckedChange={(checked) => setSystemConfig(prev => ({ ...prev, debugMode: checked }))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <HardDrive className="h-4 w-4" />
            Performance Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Session Timeout (minutes)</Label>
              <Input 
                type="number"
                value={performanceSettings.sessionTimeout}
                onChange={(e) => setPerformanceSettings(prev => ({ ...prev, sessionTimeout: parseInt(e.target.value) }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Max Upload Size (MB)</Label>
              <Input 
                type="number"
                value={performanceSettings.maxUploadSize}
                onChange={(e) => setPerformanceSettings(prev => ({ ...prev, maxUploadSize: parseInt(e.target.value) }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Backup Frequency</Label>
              <Select value={performanceSettings.backupFrequency} onValueChange={(value) => setPerformanceSettings(prev => ({ ...prev, backupFrequency: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hourly">Hourly</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Enable Caching</Label>
                <p className="text-sm text-muted-foreground">Cache frequently accessed data for better performance</p>
              </div>
              <Switch 
                checked={performanceSettings.enableCaching}
                onCheckedChange={(checked) => setPerformanceSettings(prev => ({ ...prev, enableCaching: checked }))}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Enable Compression</Label>
                <p className="text-sm text-muted-foreground">Compress data to reduce bandwidth usage</p>
              </div>
              <Switch 
                checked={performanceSettings.enableCompression}
                onCheckedChange={(checked) => setPerformanceSettings(prev => ({ ...prev, enableCompression: checked }))}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Auto Backup</Label>
                <p className="text-sm text-muted-foreground">Automatically backup data at scheduled intervals</p>
              </div>
              <Switch 
                checked={performanceSettings.autoBackup}
                onCheckedChange={(checked) => setPerformanceSettings(prev => ({ ...prev, autoBackup: checked }))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Security Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Password Min Length</Label>
              <Input 
                type="number"
                value={securitySettings.passwordMinLength}
                onChange={(e) => setSecuritySettings(prev => ({ ...prev, passwordMinLength: parseInt(e.target.value) }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Password Expiry (days)</Label>
              <Input 
                type="number"
                value={securitySettings.passwordExpiry}
                onChange={(e) => setSecuritySettings(prev => ({ ...prev, passwordExpiry: parseInt(e.target.value) }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Max Login Attempts</Label>
              <Input 
                type="number"
                value={securitySettings.maxLoginAttempts}
                onChange={(e) => setSecuritySettings(prev => ({ ...prev, maxLoginAttempts: parseInt(e.target.value) }))}
              />
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Force HTTPS</Label>
                <p className="text-sm text-muted-foreground">Redirect all HTTP traffic to HTTPS</p>
              </div>
              <Switch 
                checked={securitySettings.forceHttps}
                onCheckedChange={(checked) => setSecuritySettings(prev => ({ ...prev, forceHttps: checked }))}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Enable Two-Factor Authentication</Label>
                <p className="text-sm text-muted-foreground">Require 2FA for admin accounts</p>
              </div>
              <Switch 
                checked={securitySettings.enableTwoFactor}
                onCheckedChange={(checked) => setSecuritySettings(prev => ({ ...prev, enableTwoFactor: checked }))}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SystemSettings;
