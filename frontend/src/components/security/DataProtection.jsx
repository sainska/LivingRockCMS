import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Shield, Database, Download, Upload, Lock, AlertTriangle } from "lucide-react";

const DataProtection = () => {
  const [encryptionSettings, setEncryptionSettings] = useState({
    databaseEncryption: true,
    fileEncryption: true,
    transmissionEncryption: true,
    backupEncryption: true
  });

  const [complianceSettings, setComplianceSettings] = useState({
    gdprCompliance: true,
    dataRetention: true,
    auditLogging: true,
    accessLogging: true
  });

  const dataCategories = [
    {
      category: "Member Information",
      records: 1247,
      encrypted: 1247,
      backupStatus: "Completed",
      lastBackup: "2024-06-09 02:00",
      encryptionLevel: "AES-256"
    },
    {
      category: "Financial Records",
      records: 8542,
      encrypted: 8542,
      backupStatus: "Completed",
      lastBackup: "2024-06-09 02:15",
      encryptionLevel: "AES-256"
    },
    {
      category: "Communication Data",
      records: 3456,
      encrypted: 3456,
      backupStatus: "In Progress",
      lastBackup: "2024-06-09 01:45",
      encryptionLevel: "AES-256"
    },
    {
      category: "Event Records",
      records: 892,
      encrypted: 892,
      backupStatus: "Completed",
      lastBackup: "2024-06-09 02:30",
      encryptionLevel: "AES-256"
    }
  ];

  const complianceMetrics = [
    { metric: "Data Encryption", status: "100%", color: "text-green-600" },
    { metric: "GDPR Compliance", status: "Compliant", color: "text-green-600" },
    { metric: "Backup Status", status: "Current", color: "text-green-600" },
    { metric: "Access Controls", status: "Active", color: "text-green-600" }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed": return "bg-green-100 text-green-800";
      case "In Progress": return "bg-yellow-100 text-yellow-800";
      case "Failed": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Data Protection & Compliance</h3>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Compliance Report
          </Button>
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Backup Now
          </Button>
        </div>
      </div>

      {/* Compliance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {complianceMetrics.map((metric, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">{metric.metric}</p>
                <p className={`text-lg font-bold ${metric.color}`}>{metric.status}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Encryption Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Lock className="h-4 w-4" />
            Encryption Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Database Encryption</Label>
                  <p className="text-sm text-muted-foreground">Encrypt all database content</p>
                </div>
                <Switch 
                  checked={encryptionSettings.databaseEncryption}
                  onCheckedChange={(checked) => 
                    setEncryptionSettings(prev => ({ ...prev, databaseEncryption: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">File Encryption</Label>
                  <p className="text-sm text-muted-foreground">Encrypt uploaded files and documents</p>
                </div>
                <Switch 
                  checked={encryptionSettings.fileEncryption}
                  onCheckedChange={(checked) => 
                    setEncryptionSettings(prev => ({ ...prev, fileEncryption: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Data Transmission</Label>
                  <p className="text-sm text-muted-foreground">Encrypt data in transit (SSL/TLS)</p>
                </div>
                <Switch 
                  checked={encryptionSettings.transmissionEncryption}
                  onCheckedChange={(checked) => 
                    setEncryptionSettings(prev => ({ ...prev, transmissionEncryption: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Backup Encryption</Label>
                  <p className="text-sm text-muted-foreground">Encrypt all backup files</p>
                </div>
                <Switch 
                  checked={encryptionSettings.backupEncryption}
                  onCheckedChange={(checked) => 
                    setEncryptionSettings(prev => ({ ...prev, backupEncryption: checked }))
                  }
                />
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Encryption Status</h4>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Database Encryption</span>
                    <span>100%</span>
                  </div>
                  <Progress value={100} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>File Encryption</span>
                    <span>100%</span>
                  </div>
                  <Progress value={100} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Backup Encryption</span>
                    <span>100%</span>
                  </div>
                  <Progress value={100} className="h-2" />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Categories */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Database className="h-4 w-4" />
            Data Categories & Protection Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {dataCategories.map((category, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-medium">{category.category}</h4>
                    <p className="text-sm text-muted-foreground">
                      {category.records.toLocaleString()} records • {category.encryptionLevel} encryption
                    </p>
                  </div>
                  <Badge className={getStatusColor(category.backupStatus)}>
                    {category.backupStatus}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Total Records:</span>
                    <p className="font-medium">{category.records.toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Encrypted:</span>
                    <p className="font-medium text-green-600">{category.encrypted.toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Last Backup:</span>
                    <p className="font-medium">{category.lastBackup}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Encryption:</span>
                    <p className="font-medium">{category.encryptionLevel}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* GDPR Compliance */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Shield className="h-4 w-4" />
            GDPR & Compliance Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">GDPR Compliance</Label>
                  <p className="text-sm text-muted-foreground">Enable GDPR data protection features</p>
                </div>
                <Switch 
                  checked={complianceSettings.gdprCompliance}
                  onCheckedChange={(checked) => 
                    setComplianceSettings(prev => ({ ...prev, gdprCompliance: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Data Retention Policy</Label>
                  <p className="text-sm text-muted-foreground">Automatically manage data lifecycle</p>
                </div>
                <Switch 
                  checked={complianceSettings.dataRetention}
                  onCheckedChange={(checked) => 
                    setComplianceSettings(prev => ({ ...prev, dataRetention: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Audit Logging</Label>
                  <p className="text-sm text-muted-foreground">Log all data access and modifications</p>
                </div>
                <Switch 
                  checked={complianceSettings.auditLogging}
                  onCheckedChange={(checked) => 
                    setComplianceSettings(prev => ({ ...prev, auditLogging: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Access Logging</Label>
                  <p className="text-sm text-muted-foreground">Track user access to sensitive data</p>
                </div>
                <Switch 
                  checked={complianceSettings.accessLogging}
                  onCheckedChange={(checked) => 
                    setComplianceSettings(prev => ({ ...prev, accessLogging: checked }))
                  }
                />
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Compliance Tools</h4>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <Download className="h-4 w-4 mr-2" />
                  Generate Data Export (Right to Portability)
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Process Data Deletion Request
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Shield className="h-4 w-4 mr-2" />
                  Run Compliance Audit
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DataProtection;
