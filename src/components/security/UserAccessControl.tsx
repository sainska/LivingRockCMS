
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { UserPlus, Edit, Trash2, Shield, Key } from "lucide-react";

const UserAccessControl = () => {
  const [users, setUsers] = useState([
    {
      id: 1,
      name: "John Pastor",
      email: "pastor@church.com",
      role: "Clergy",
      status: "Active",
      lastLogin: "2024-06-09 09:30",
      permissions: ["Full Access"]
    },
    {
      id: 2,
      name: "Mary Treasurer",
      email: "treasurer@church.com", 
      role: "Treasurer",
      status: "Active",
      lastLogin: "2024-06-09 08:15",
      permissions: ["Financial Management", "Reports"]
    },
    {
      id: 3,
      name: "Sarah Secretary",
      email: "secretary@church.com",
      role: "Secretary",
      status: "Active",
      lastLogin: "2024-06-08 16:45",
      permissions: ["Member Management", "Communication"]
    },
    {
      id: 4,
      name: "David Admin",
      email: "admin@church.com",
      role: "Admin",
      status: "Active",
      lastLogin: "2024-06-09 07:20",
      permissions: ["System Settings", "User Management"]
    },
    {
      id: 5,
      name: "Grace Member",
      email: "grace@church.com",
      role: "Member",
      status: "Inactive",
      lastLogin: "2024-06-01 10:00",
      permissions: ["Basic Access"]
    }
  ]);

  const roles = [
    {
      name: "Clergy",
      description: "Full access to all church management features",
      permissions: ["Full Access", "Member Management", "Financial Management", "Events", "Ministry", "Communication", "Reports", "Security", "Settings"]
    },
    {
      name: "Admin",
      description: "System administration and user management",
      permissions: ["System Settings", "User Management", "Security", "Reports"]
    },
    {
      name: "Treasurer",
      description: "Financial management and reporting access",
      permissions: ["Financial Management", "Reports", "Member Management"]
    },
    {
      name: "Secretary",
      description: "Member and communication management",
      permissions: ["Member Management", "Communication", "Events", "Reports"]
    },
    {
      name: "Member",
      description: "Basic access to member features",
      permissions: ["Basic Access", "Events"]
    }
  ];

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

  return (
    <div className="space-y-6">
      {/* User Management Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">User Access Control</h3>
        <Button>
          <UserPlus className="h-4 w-4 mr-2" />
          Add New User
        </Button>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Shield className="h-4 w-4" />
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
                    <Badge className={getStatusColor(user.status)}>
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{user.lastLogin}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button variant="outline" size="sm">
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

      {/* Role Permissions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Key className="h-4 w-4" />
            Role Permissions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {roles.map((role, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-medium">{role.name}</h4>
                    <p className="text-sm text-muted-foreground">{role.description}</p>
                  </div>
                  <Button variant="outline" size="sm">
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {role.permissions.map((permission, permIndex) => (
                    <Badge key={permIndex} variant="outline">
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
          <CardTitle className="text-base">Quick Security Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-medium">Bulk User Management</h4>
              <div className="flex gap-2">
                <Select>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Select action" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="activate">Activate Users</SelectItem>
                    <SelectItem value="deactivate">Deactivate Users</SelectItem>
                    <SelectItem value="reset">Reset Passwords</SelectItem>
                    <SelectItem value="expire">Expire Sessions</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline">Apply</Button>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium">Security Policies</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Force password reset for all users</span>
                  <Button variant="outline" size="sm">Execute</Button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Lock all inactive accounts</span>
                  <Button variant="outline" size="sm">Execute</Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserAccessControl;
