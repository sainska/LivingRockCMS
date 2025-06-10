import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { UserPlus, Edit, Trash2, Shield, Key, Users, Settings } from "lucide-react";

const UserManagement = () => {
  const [users, setUsers] = useState([
    {
      id: 1,
      name: "Pastor John Kimani",
      email: "pastor@livingrock.org",
      role: "Clergy",
      status: "Active",
      lastLogin: "2024-06-09 09:30",
      createdDate: "2024-01-15"
    },
    {
      id: 2,
      name: "Mary Wanjiku",
      email: "treasurer@livingrock.org", 
      role: "Treasurer",
      status: "Active",
      lastLogin: "2024-06-09 08:15",
      createdDate: "2024-01-20"
    },
    {
      id: 3,
      name: "Sarah Muthoni",
      email: "secretary@livingrock.org",
      role: "Secretary",
      status: "Active",
      lastLogin: "2024-06-08 16:45",
      createdDate: "2024-02-10"
    },
    {
      id: 4,
      name: "David Kiprotich",
      email: "admin@livingrock.org",
      role: "Admin",
      status: "Active",
      lastLogin: "2024-06-09 07:20",
      createdDate: "2024-01-25"
    },
    {
      id: 5,
      name: "Grace Nyambura",
      email: "grace@email.com",
      role: "Member",
      status: "Inactive",
      lastLogin: "2024-06-01 10:00",
      createdDate: "2024-03-15"
    }
  ]);

  const [rolePermissions, setRolePermissions] = useState({
    Clergy: ["Full Access"],
    Admin: ["System Settings", "User Management", "Security", "Reports"],
    Treasurer: ["Financial Management", "Reports", "Member Management"],
    Secretary: ["Member Management", "Communication", "Events", "Reports"],
    Member: ["Basic Access", "Events"]
  });

  const [globalSettings, setGlobalSettings] = useState({
    requireEmailVerification: true,
    allowSelfRegistration: false,
    enforceStrongPasswords: true,
    enableAccountLockout: true,
    sessionTimeout: 30
  });

  const getStatusColor = (status: string) => {
    return status === "Active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "Clergy": return "bg-purple-100 text-purple-800";
      case "Admin": return "bg-blue-100 text-blue-800";
      case "Treasurer": return "bg-green-100 text-green-800";
      case "Secretary": return "bg-yellow-100 text-yellow-800";
      case "Member": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const handleDeleteUser = (userId: number) => {
    setUsers(users.filter(user => user.id !== userId));
  };

  const handleStatusToggle = (userId: number) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, status: user.status === "Active" ? "Inactive" : "Active" }
        : user
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">User Management</h3>
        <Button>
          <UserPlus className="h-4 w-4 mr-2" />
          Add New User
        </Button>
      </div>

      {/* Global User Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Global User Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Require Email Verification</Label>
                  <p className="text-sm text-muted-foreground">Users must verify email before access</p>
                </div>
                <Switch 
                  checked={globalSettings.requireEmailVerification}
                  onCheckedChange={(checked) => 
                    setGlobalSettings(prev => ({ ...prev, requireEmailVerification: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Allow Self Registration</Label>
                  <p className="text-sm text-muted-foreground">Allow users to register themselves</p>
                </div>
                <Switch 
                  checked={globalSettings.allowSelfRegistration}
                  onCheckedChange={(checked) => 
                    setGlobalSettings(prev => ({ ...prev, allowSelfRegistration: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Enforce Strong Passwords</Label>
                  <p className="text-sm text-muted-foreground">Require complex password requirements</p>
                </div>
                <Switch 
                  checked={globalSettings.enforceStrongPasswords}
                  onCheckedChange={(checked) => 
                    setGlobalSettings(prev => ({ ...prev, enforceStrongPasswords: checked }))
                  }
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Enable Account Lockout</Label>
                  <p className="text-sm text-muted-foreground">Lock accounts after failed login attempts</p>
                </div>
                <Switch 
                  checked={globalSettings.enableAccountLockout}
                  onCheckedChange={(checked) => 
                    setGlobalSettings(prev => ({ ...prev, enableAccountLockout: checked }))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Default Session Timeout (minutes)</Label>
                <Input 
                  type="number"
                  value={globalSettings.sessionTimeout}
                  onChange={(e) => 
                    setGlobalSettings(prev => ({ ...prev, sessionTimeout: parseInt(e.target.value) }))
                  }
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Users className="h-4 w-4" />
            User Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge className={getRoleColor(user.role)}>
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(user.status)}>
                        {user.status}
                      </Badge>
                      <Switch
                        checked={user.status === "Active"}
                        onCheckedChange={() => handleStatusToggle(user.id)}
                      />
                    </div>
                  </TableCell>
                  <TableCell>{user.lastLogin}</TableCell>
                  <TableCell>{user.createdDate}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Role Management */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Key className="h-4 w-4" />
            Role & Permission Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(rolePermissions).map(([role, permissions]) => (
              <div key={role} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-medium flex items-center gap-2">
                      <Badge className={getRoleColor(role)}>
                        {role}
                      </Badge>
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {users.filter(user => user.role === role).length} user(s) with this role
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {permissions.map((permission, index) => (
                    <Badge key={index} variant="outline">
                      {permission}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Quick User Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-3">
              <h4 className="font-medium">Bulk Actions</h4>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  Reset All Passwords
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Expire All Sessions
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Send Welcome Emails
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium">User Reports</h4>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  Export User List
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Login Activity Report
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Permission Audit
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium">Security Actions</h4>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  Force 2FA Setup
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Review Suspicious Activity
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Lock Inactive Accounts
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManagement;
