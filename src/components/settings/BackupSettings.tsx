
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, Upload, Database, HardDrive, Cloud, Shield, Play, RefreshCw } from "lucide-react";

const BackupSettings = () => {
  const [backupSettings, setBackupSettings] = useState({
    autoBackup: true,
    frequency: "daily",
    time: "02:00",
    retentionDays: 30,
    compressBackups: true,
    encryptBackups: true,
    includeLogs: false,
    cloudBackup: true
  });

  const [cloudSettings, setCloudSettings] = useState({
    provider: "aws",
    bucket: "church-backups",
    region: "us-east-1",
    encryption: true
  });

  const backupHistory = [
    {
      id: 1,
      date: "2024-06-09 02:00",
      type: "Automatic",
      size: "245 MB",
      status: "Completed",
      duration: "3m 45s",
      location: "Local + Cloud"
    },
    {
      id: 2,
      date: "2024-06-08 02:00",
      type: "Automatic",
      size: "243 MB",
      status: "Completed",
      duration: "3m 32s",
      location: "Local + Cloud"
    },
    {
      id: 3,
      date: "2024-06-07 14:30",
      type: "Manual",
      size: "241 MB",
      status: "Completed",
      duration: "2m 15s",
      location: "Local"
    },
    {
      id: 4,
      date: "2024-06-07 02:00",
      type: "Automatic",
      size: "240 MB",
      status: "Failed",
      duration: "-",
      location: "-"
    },
    {
      id: 5,
      date: "2024-06-06 02:00",
      type: "Automatic",
      size: "238 MB",
      status: "Completed",
      duration: "4m 12s",
      location: "Local + Cloud"
    }
  ];

  const storageStats = [
    { label: "Total Backups", value: "156", icon: Database },
    { label: "Storage Used", value: "15.2 GB", icon: HardDrive },
    { label: "Cloud Storage", value: "12.8 GB", icon: Cloud },
    { label: "Success Rate", value: "98.7%", icon: Shield }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed": return "bg-green-100 text-green-800";
      case "Failed": return "bg-red-100 text-red-800";
      case "In Progress": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const handleBackupNow = () => {
    console.log("Starting manual backup...");
    // In a real app, this would trigger a backup
  };

  const handleRestore = (backupId: number) => {
    console.log(`Restoring from backup ${backupId}...`);
    // In a real app, this would restore from the selected backup
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Backup & Data Management</h3>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleBackupNow}>
            <Play className="h-4 w-4 mr-2" />
            Backup Now
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Download Backup
          </Button>
        </div>
      </div>

      {/* Storage Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {storageStats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <stat.icon className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-lg font-bold">{stat.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Backup Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Database className="h-4 w-4" />
            Backup Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Automatic Backup</Label>
                  <p className="text-sm text-muted-foreground">Enable scheduled automatic backups</p>
                </div>
                <Switch 
                  checked={backupSettings.autoBackup}
                  onCheckedChange={(checked) => 
                    setBackupSettings(prev => ({ ...prev, autoBackup: checked }))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Backup Frequency</Label>
                <Select 
                  value={backupSettings.frequency} 
                  onValueChange={(value) => setBackupSettings(prev => ({ ...prev, frequency: value }))}
                >
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

              <div className="space-y-2">
                <Label>Backup Time</Label>
                <Input 
                  type="time"
                  value={backupSettings.time}
                  onChange={(e) => setBackupSettings(prev => ({ ...prev, time: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label>Retention Period (days)</Label>
                <Input 
                  type="number"
                  value={backupSettings.retentionDays}
                  onChange={(e) => setBackupSettings(prev => ({ ...prev, retentionDays: parseInt(e.target.value) }))}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Compress Backups</Label>
                  <p className="text-sm text-muted-foreground">Reduce backup file size</p>
                </div>
                <Switch 
                  checked={backupSettings.compressBackups}
                  onCheckedChange={(checked) => 
                    setBackupSettings(prev => ({ ...prev, compressBackups: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Encrypt Backups</Label>
                  <p className="text-sm text-muted-foreground">Encrypt backup files for security</p>
                </div>
                <Switch 
                  checked={backupSettings.encryptBackups}
                  onCheckedChange={(checked) => 
                    setBackupSettings(prev => ({ ...prev, encryptBackups: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Include System Logs</Label>
                  <p className="text-sm text-muted-foreground">Include log files in backups</p>
                </div>
                <Switch 
                  checked={backupSettings.includeLogs}
                  onCheckedChange={(checked) => 
                    setBackupSettings(prev => ({ ...prev, includeLogs: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Cloud Backup</Label>
                  <p className="text-sm text-muted-foreground">Store backups in cloud storage</p>
                </div>
                <Switch 
                  checked={backupSettings.cloudBackup}
                  onCheckedChange={(checked) => 
                    setBackupSettings(prev => ({ ...prev, cloudBackup: checked }))
                  }
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cloud Storage Settings */}
      {backupSettings.cloudBackup && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Cloud className="h-4 w-4" />
              Cloud Storage Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Cloud Provider</Label>
                <Select 
                  value={cloudSettings.provider} 
                  onValueChange={(value) => setCloudSettings(prev => ({ ...prev, provider: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="aws">Amazon S3</SelectItem>
                    <SelectItem value="gcp">Google Cloud Storage</SelectItem>
                    <SelectItem value="azure">Azure Blob Storage</SelectItem>
                    <SelectItem value="dropbox">Dropbox</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Storage Bucket/Container</Label>
                <Input 
                  value={cloudSettings.bucket}
                  onChange={(e) => setCloudSettings(prev => ({ ...prev, bucket: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label>Region</Label>
                <Select 
                  value={cloudSettings.region} 
                  onValueChange={(value) => setCloudSettings(prev => ({ ...prev, region: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="us-east-1">US East (N. Virginia)</SelectItem>
                    <SelectItem value="us-west-2">US West (Oregon)</SelectItem>
                    <SelectItem value="eu-west-1">Europe (Ireland)</SelectItem>
                    <SelectItem value="ap-southeast-1">Asia Pacific (Singapore)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Server-Side Encryption</Label>
                  <p className="text-sm text-muted-foreground">Enable cloud encryption</p>
                </div>
                <Switch 
                  checked={cloudSettings.encryption}
                  onCheckedChange={(checked) => 
                    setCloudSettings(prev => ({ ...prev, encryption: checked }))
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Current Backup Status */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Current Backup Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span>Last Backup: June 9, 2024 at 2:00 AM</span>
              <Badge className="bg-green-100 text-green-800">Completed</Badge>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Next Scheduled Backup</span>
                <span>June 10, 2024 at 2:00 AM</span>
              </div>
              <Progress value={75} className="h-2" />
              <p className="text-xs text-muted-foreground">18 hours remaining</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Backup History */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Backup History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date & Time</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {backupHistory.map((backup) => (
                <TableRow key={backup.id}>
                  <TableCell className="font-medium">{backup.date}</TableCell>
                  <TableCell>{backup.type}</TableCell>
                  <TableCell>{backup.size}</TableCell>
                  <TableCell>{backup.duration}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(backup.status)}>
                      {backup.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{backup.location}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleRestore(backup.id)}
                        disabled={backup.status !== "Completed"}
                      >
                        <Upload className="h-3 w-3 mr-1" />
                        Restore
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-3 w-3 mr-1" />
                        Download
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default BackupSettings;
