import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { QrCode, Shield, Users, Clock, AlertTriangle, CheckCircle } from "lucide-react";

const CheckInSecurity = () => {
  const [checkInSettings, setCheckInSettings] = useState({
    requireParentAuth: true,
    emergencyContactVerification: true,
    photoVerification: false,
    backgroundCheckRequired: true,
    visitorScreening: true
  });

  const checkInSessions = [
    {
      id: 1,
      child: "Emma Johnson",
      parent: "Sarah Johnson",
      checkInTime: "09:15 AM",
      checkOutTime: "-",
      status: "Checked In",
      guardian: "Verified Parent",
      notes: "Regular member"
    },
    {
      id: 2,
      child: "Michael Brown",
      parent: "David Brown",
      checkInTime: "09:22 AM", 
      checkOutTime: "-",
      status: "Checked In",
      guardian: "Authorized Pickup",
      notes: "Uncle authorized for pickup"
    },
    {
      id: 3,
      child: "Grace Wilson",
      parent: "Mary Wilson",
      checkInTime: "09:18 AM",
      checkOutTime: "11:45 AM",
      status: "Checked Out",
      guardian: "Verified Parent",
      notes: "Left early due to illness"
    },
    {
      id: 4,
      child: "Samuel Davis",
      parent: "Robert Davis",
      checkInTime: "09:30 AM",
      checkOutTime: "-",
      status: "Checked In",
      guardian: "Pending Verification",
      notes: "New family - verification in progress"
    }
  ];

  const securityIncidents = [
    {
      id: 1,
      type: "Unauthorized Pickup Attempt",
      child: "Emma Johnson",
      time: "11:20 AM",
      severity: "high",
      resolved: false,
      details: "Non-authorized person attempted pickup"
    },
    {
      id: 2,
      type: "Missing Check-out",
      child: "Michael Brown",
      time: "12:15 PM",
      severity: "medium",
      resolved: true,
      details: "Child found in playground, parent notified"
    }
  ];

  const volunteerList = [
    {
      name: "Pastor John",
      role: "Children's Ministry Leader",
      backgroundCheck: "Completed",
      lastUpdate: "2024-01-15",
      status: "Active"
    },
    {
      name: "Sarah Teaching",
      role: "Sunday School Teacher",
      backgroundCheck: "Completed",
      lastUpdate: "2024-02-10",
      status: "Active"
    },
    {
      name: "Mike Helper",
      role: "Volunteer Assistant",
      backgroundCheck: "Pending",
      lastUpdate: "2024-06-01",
      status: "Restricted"
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "Checked In": return "bg-green-100 text-green-800";
      case "Checked Out": return "bg-gray-100 text-gray-800";
      case "Pending": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "high": return "bg-red-100 text-red-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Secure Check-in System</h3>
        <Button>
          <QrCode className="h-4 w-4 mr-2" />
          Generate Check-in Code
        </Button>
      </div>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Check-in Security Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Parent Authorization Required</Label>
                  <p className="text-sm text-muted-foreground">Require parent verification for check-in</p>
                </div>
                <Switch 
                  checked={checkInSettings.requireParentAuth}
                  onCheckedChange={(checked) => 
                    setCheckInSettings(prev => ({ ...prev, requireParentAuth: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Emergency Contact Verification</Label>
                  <p className="text-sm text-muted-foreground">Verify emergency contacts are current</p>
                </div>
                <Switch 
                  checked={checkInSettings.emergencyContactVerification}
                  onCheckedChange={(checked) => 
                    setCheckInSettings(prev => ({ ...prev, emergencyContactVerification: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Photo Verification</Label>
                  <p className="text-sm text-muted-foreground">Take photos during check-in process</p>
                </div>
                <Switch 
                  checked={checkInSettings.photoVerification}
                  onCheckedChange={(checked) => 
                    setCheckInSettings(prev => ({ ...prev, photoVerification: checked }))
                  }
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Background Check Required</Label>
                  <p className="text-sm text-muted-foreground">Require background checks for volunteers</p>
                </div>
                <Switch 
                  checked={checkInSettings.backgroundCheckRequired}
                  onCheckedChange={(checked) => 
                    setCheckInSettings(prev => ({ ...prev, backgroundCheckRequired: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Visitor Screening</Label>
                  <p className="text-sm text-muted-foreground">Additional screening for first-time visitors</p>
                </div>
                <Switch 
                  checked={checkInSettings.visitorScreening}
                  onCheckedChange={(checked) => 
                    setCheckInSettings(prev => ({ ...prev, visitorScreening: checked }))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Security Code Length</Label>
                <Input type="number" defaultValue={6} min={4} max={10} />
              </div>

              <div className="space-y-2">
                <Label>Session Timeout (minutes)</Label>
                <Input type="number" defaultValue={15} min={5} max={60} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Check-ins */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Users className="h-4 w-4" />
            Current Check-in Sessions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Child Name</TableHead>
                <TableHead>Parent/Guardian</TableHead>
                <TableHead>Check-in Time</TableHead>
                <TableHead>Check-out Time</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Guardian Status</TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {checkInSessions.map((session) => (
                <TableRow key={session.id}>
                  <TableCell className="font-medium">{session.child}</TableCell>
                  <TableCell>{session.parent}</TableCell>
                  <TableCell>{session.checkInTime}</TableCell>
                  <TableCell>{session.checkOutTime}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(session.status)}>
                      {session.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{session.guardian}</TableCell>
                  <TableCell className="max-w-xs truncate">{session.notes}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Security Incidents */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Security Incidents
          </CardTitle>
        </CardHeader>
        <CardContent>
          {securityIncidents.length > 0 ? (
            <div className="space-y-3">
              {securityIncidents.map((incident) => (
                <div key={incident.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className={`h-5 w-5 ${incident.severity === 'high' ? 'text-red-600' : 'text-yellow-600'}`} />
                    <div>
                      <p className="font-medium">{incident.type}</p>
                      <p className="text-sm text-muted-foreground">
                        {incident.child} • {incident.time}
                      </p>
                      <p className="text-sm">{incident.details}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getSeverityColor(incident.severity)}>
                      {incident.severity}
                    </Badge>
                    {incident.resolved ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <Button variant="outline" size="sm">Resolve</Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-4">No security incidents reported today</p>
          )}
        </CardContent>
      </Card>

      {/* Volunteer Background Checks */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Volunteer Security Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Background Check</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {volunteerList.map((volunteer, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{volunteer.name}</TableCell>
                  <TableCell>{volunteer.role}</TableCell>
                  <TableCell>
                    <Badge className={volunteer.backgroundCheck === "Completed" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}>
                      {volunteer.backgroundCheck}
                    </Badge>
                  </TableCell>
                  <TableCell>{volunteer.lastUpdate}</TableCell>
                  <TableCell>
                    <Badge className={volunteer.status === "Active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                      {volunteer.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">View Details</Button>
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

export default CheckInSecurity;
