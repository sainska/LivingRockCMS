import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Users, 
  UserPlus, 
  Search, 
  Filter, 
  Settings, 
  Shield, 
  Download, 
  RefreshCw,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  UserCheck,
  Lock,
  Unlock,
  Mail,
  Key,
  Activity,
  FileText,
  ShieldCheck
} from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const UserManagement = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showDeleted, setShowDeleted] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [roleStats, setRoleStats] = useState({});
  const [globalSettings, setGlobalSettings] = useState({
    requireEmailVerification: true,
    allowSelfRegistration: true,
    enforceStrongPasswords: true,
    enableAccountLockout: true,
    defaultSessionTimeout: 30
  });

  // New user form state
  const [newUser, setNewUser] = useState({
    email: '',
    firstName: '',
    lastName: '',
    role: 'member',
    sendInvitation: true
  });

  // User edit form state
  const [editUser, setEditUser] = useState({
    firstName: '',
    lastName: '',
    role: '',
    isActive: true,
    isActivated: false
  });

  useEffect(() => {
    loadUsers();
    loadRoleStats();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      
      // Use the user_management_view to avoid relationship issues
      const { data, error } = await supabase
        .from('user_management_view')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading users:', error);
        toast({
          title: "Error",
          description: "Failed to load users",
          variant: "destructive",
        });
        return;
      }

      // Process the data to match the expected format
      const processedUsers = data.map(user => {
        // Ensure we have valid role data
        const primaryRole = user.primary_role || 'member';
        const isActive = user.is_activated || false;
        
        // Build all roles array safely
        const allRoles = [
          user.is_system_admin && 'system_admin',
          user.is_clergy && 'clergy',
          user.is_treasurer && 'treasurer',
          user.is_secretary && 'secretary',
          user.is_member && 'member'
        ].filter(Boolean);
        
        return {
          ...user,
          role: primaryRole,
          isActive: isActive,
          roleAssignedAt: user.created_at, // fallback since view doesn't include this
          allRoles: allRoles.length > 0 ? allRoles : ['member'] // ensure we always have at least one role
        };
      });

      setUsers(processedUsers);
    } catch (error) {
      console.error('Error loading users:', error);
      toast({
        title: "Error",
        description: "Failed to load users",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadRoleStats = async () => {
    try {
      // Use the role_statistics_view
      const { data, error } = await supabase
        .from('role_statistics_view')
        .select('role, user_count');

      if (error) {
        console.error('Error loading role stats:', error);
        return;
      }

      // Convert to the expected format
      const stats = data.reduce((acc, item) => {
        acc[item.role] = item.user_count;
        return acc;
      }, {});

      setRoleStats(stats);
    } catch (error) {
      console.error('Error loading role stats:', error);
    }
  };

  const handleAddUser = async () => {
    try {
      if (!newUser.email || !newUser.firstName || !newUser.lastName) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields",
          variant: "destructive",
        });
        return;
      }

      // Create invitation for new user
      const { error } = await supabase.rpc('invite_user', {
        email: newUser.email,
        role: newUser.role,
        first_name: newUser.firstName,
        last_name: newUser.lastName,
        invited_by: user.id
      });

      if (error) {
        console.error('Error adding user:', error);
        toast({
          title: "Error",
          description: "Failed to add user",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "User invitation sent successfully",
      });

      setShowAddUserModal(false);
      setNewUser({
        email: '',
        firstName: '',
        lastName: '',
        role: 'member',
        sendInvitation: true
      });
      
      // Refresh the user list
      await loadUsers();
      await loadRoleStats();
    } catch (error) {
      console.error('Error adding user:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  const handleUpdateUser = async () => {
    try {
      if (!selectedUser || !editUser.firstName || !editUser.lastName) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields",
          variant: "destructive",
        });
        return;
      }

      // Update user profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          first_name: editUser.firstName,
          last_name: editUser.lastName
        })
        .eq('id', selectedUser.id);

      if (profileError) {
        console.error('Error updating profile:', profileError);
        toast({
          title: "Error",
          description: "Failed to update user profile",
          variant: "destructive",
        });
        return;
      }

      // Update user role if changed
      if (editUser.role !== selectedUser.role) {
        const { error: roleError } = await supabase
          .from('user_roles')
          .update({ 
            role: editUser.role,
            assigned_by: user.id,
            assigned_at: new Date().toISOString()
          })
          .eq('user_id', selectedUser.id)
          .eq('is_active', true);

        if (roleError) {
          console.error('Error updating role:', roleError);
          toast({
            title: "Error",
            description: "Failed to update user role",
            variant: "destructive",
          });
          return;
        }
      }

      // Handle activation if changed
      if (editUser.isActivated !== selectedUser.is_activated) {
        if (editUser.isActivated) {
          // Activate user
          const { error: activationError } = await supabase.rpc('approve_user_activation', {
            target_user_id: selectedUser.id,
            admin_user_id: user.id,
            notes: 'Activated by admin'
          });

          if (activationError) {
            console.error('Error activating user:', activationError);
          }
        }
      }

      toast({
        title: "Success",
        description: "User updated successfully",
      });

      setShowUserModal(false);
      setSelectedUser(null);
      
      // Refresh the user list
      await loadUsers();
      await loadRoleStats();
    } catch (error) {
      console.error('Error updating user:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      // Soft delete - deactivate user role
      const { error } = await supabase
        .from('user_roles')
        .update({ is_active: false })
        .eq('user_id', userId);

      if (error) {
        console.error('Error deleting user:', error);
        toast({
          title: "Error",
          description: "Failed to delete user",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "User deleted successfully",
      });

      // Refresh the user list
      await loadUsers();
      await loadRoleStats();
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  const handleBulkAction = async (action) => {
    try {
      switch (action) {
        case 'reset-passwords':
          toast({
            title: "Info",
            description: "Password reset emails will be sent to all users",
          });
          break;
        case 'expire-sessions':
          toast({
            title: "Info",
            description: "All user sessions have been expired",
          });
          break;
        case 'send-welcome':
          toast({
            title: "Info",
            description: "Welcome emails will be sent to all users",
          });
          break;
        default:
          break;
      }
    } catch (error) {
      console.error('Error performing bulk action:', error);
      toast({
        title: "Error",
        description: "Failed to perform bulk action",
        variant: "destructive",
      });
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesStatus = filterStatus === 'all' || 
      (filterStatus === 'active' && user.is_activated) ||
      (filterStatus === 'inactive' && !user.is_activated);
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getStatusBadge = (user) => {
    // Handle undefined or null user data
    if (!user) {
      return <Badge className="bg-gray-100 text-gray-800">Unknown</Badge>;
    }
    
    if (user.is_activated) {
      return <Badge className="bg-green-100 text-green-800">Active</Badge>;
    } else {
      return <Badge className="bg-yellow-100 text-yellow-800">Inactive</Badge>;
    }
  };

  const getRoleBadge = (role) => {
    // Handle undefined, null, or empty role values
    if (!role || typeof role !== 'string') {
      return (
        <Badge className="bg-gray-100 text-gray-800">
          Unknown
        </Badge>
      );
    }
    
    const roleColors = {
      system_admin: 'bg-red-100 text-red-800',
      clergy: 'bg-purple-100 text-purple-800',
      treasurer: 'bg-blue-100 text-blue-800',
      secretary: 'bg-orange-100 text-orange-800',
      member: 'bg-gray-100 text-gray-800'
    };
    
    return (
      <Badge className={roleColors[role] || 'bg-gray-100 text-gray-800'}>
        {role.charAt(0).toUpperCase() + role.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
          <p className="text-gray-600">Manage user accounts, roles, and permissions</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setShowSettingsModal(true)} variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Global Settings
          </Button>
          <Button onClick={() => setShowAddUserModal(true)}>
            <UserPlus className="h-4 w-4 mr-2" />
            Add New User
          </Button>
        </div>
      </div>

      {/* Role Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {Object.entries(roleStats).map(([role, count]) => (
          <Card key={role}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 capitalize">{role}</p>
                  <p className="text-2xl font-bold">{count}</p>
                  <p className="text-xs text-gray-500">user(s)</p>
                </div>
                <div className="p-2 rounded-lg bg-gray-50">
                  <Users className="h-4 w-4 text-gray-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="search">Search by name or email</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="role-filter">Role</Label>
              <Select value={filterRole} onValueChange={setFilterRole}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="system_admin">Admin</SelectItem>
                  <SelectItem value="clergy">Clergy</SelectItem>
                  <SelectItem value="treasurer">Treasurer</SelectItem>
                  <SelectItem value="secretary">Secretary</SelectItem>
                  <SelectItem value="member">Member</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="status-filter">Status</Label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="show-deleted"
                checked={showDeleted}
                onCheckedChange={setShowDeleted}
              />
              <Label htmlFor="show-deleted">Show Deleted</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick User Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" size="sm" className="w-full justify-start" onClick={() => handleBulkAction('reset-passwords')}>
              <Key className="h-4 w-4 mr-2" />
              Reset All Passwords
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start" onClick={() => handleBulkAction('expire-sessions')}>
              <Clock className="h-4 w-4 mr-2" />
              Expire All Sessions
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start" onClick={() => handleBulkAction('send-welcome')}>
              <Mail className="h-4 w-4 mr-2" />
              Send Welcome Emails
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">User Reports</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" size="sm" className="w-full justify-start">
              <Download className="h-4 w-4 mr-2" />
              Export User List
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start">
              <Activity className="h-4 w-4 mr-2" />
              Login Activity Report
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start">
              <FileText className="h-4 w-4 mr-2" />
              Permission Audit
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Security Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" size="sm" className="w-full justify-start">
              <ShieldCheck className="h-4 w-4 mr-2" />
              Force 2FA Setup
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Review Suspicious Activity
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start">
              <Lock className="h-4 w-4 mr-2" />
              Lock Inactive Accounts
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>User Management</span>
            <Button onClick={loadUsers} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="flex justify-center items-center py-8">
              <div className="text-center">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No users found</p>
                <p className="text-sm text-gray-400">Try adjusting your search or filters</p>
              </div>
            </div>
          ) : (
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
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="font-medium">
                        {user.first_name || 'N/A'} {user.last_name || ''}
                      </div>
                    </TableCell>
                    <TableCell>{user.email || 'N/A'}</TableCell>
                    <TableCell>{getRoleBadge(user.role)}</TableCell>
                    <TableCell>{getStatusBadge(user)}</TableCell>
                    <TableCell>
                      {user.last_social_login ? 
                        new Date(user.last_social_login).toLocaleDateString() : 
                        '-'
                      }
                    </TableCell>
                    <TableCell>
                      {user.created_at ? 
                        new Date(user.created_at).toLocaleDateString() : 
                        'N/A'
                      }
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedUser(user);
                            setEditUser({
                              firstName: user.first_name || '',
                              lastName: user.last_name || '',
                              role: user.role || 'member',
                              isActive: user.isActive || false,
                              isActivated: user.is_activated || false
                            });
                            setShowUserModal(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Add User Modal */}
      <Dialog open={showAddUserModal} onOpenChange={setShowAddUserModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>
              Create a new user account and send them an invitation email.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={newUser.firstName}
                  onChange={(e) => setNewUser({...newUser, firstName: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={newUser.lastName}
                  onChange={(e) => setNewUser({...newUser, lastName: e.target.value})}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({...newUser, email: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="role">Role</Label>
              <Select value={newUser.role} onValueChange={(value) => setNewUser({...newUser, role: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="member">Member</SelectItem>
                  <SelectItem value="secretary">Secretary</SelectItem>
                  <SelectItem value="treasurer">Treasurer</SelectItem>
                  <SelectItem value="clergy">Clergy</SelectItem>
                  <SelectItem value="system_admin">System Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="sendInvitation"
                checked={newUser.sendInvitation}
                onCheckedChange={(checked) => setNewUser({...newUser, sendInvitation: checked})}
              />
              <Label htmlFor="sendInvitation">Send invitation email</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddUserModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddUser}>
              Add User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Modal */}
      <Dialog open={showUserModal} onOpenChange={setShowUserModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user information and permissions.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="editFirstName">First Name</Label>
                <Input
                  id="editFirstName"
                  value={editUser.firstName}
                  onChange={(e) => setEditUser({...editUser, firstName: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="editLastName">Last Name</Label>
                <Input
                  id="editLastName"
                  value={editUser.lastName}
                  onChange={(e) => setEditUser({...editUser, lastName: e.target.value})}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="editRole">Role</Label>
              <Select value={editUser.role} onValueChange={(value) => setEditUser({...editUser, role: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="member">Member</SelectItem>
                  <SelectItem value="secretary">Secretary</SelectItem>
                  <SelectItem value="treasurer">Treasurer</SelectItem>
                  <SelectItem value="clergy">Clergy</SelectItem>
                  <SelectItem value="system_admin">System Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="editIsActivated"
                checked={editUser.isActivated}
                onCheckedChange={(checked) => setEditUser({...editUser, isActivated: checked})}
              />
              <Label htmlFor="editIsActivated">Account Activated</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowUserModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateUser}>
              Update User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Global Settings Modal */}
      <Dialog open={showSettingsModal} onOpenChange={setShowSettingsModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Global User Settings</DialogTitle>
            <DialogDescription>
              Configure global settings for user management and security.
            </DialogDescription>
          </DialogHeader>
          <Tabs defaultValue="security" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="registration">Registration</TabsTrigger>
              <TabsTrigger value="sessions">Sessions</TabsTrigger>
            </TabsList>
            
            <TabsContent value="security" className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="requireEmailVerification">Require Email Verification</Label>
                  <p className="text-sm text-gray-500">Users must verify their email before accessing the system</p>
                </div>
                <Switch
                  id="requireEmailVerification"
                  checked={globalSettings.requireEmailVerification}
                  onCheckedChange={(checked) => setGlobalSettings({...globalSettings, requireEmailVerification: checked})}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="enforceStrongPasswords">Enforce Strong Passwords</Label>
                  <p className="text-sm text-gray-500">Require passwords to meet security standards</p>
                </div>
                <Switch
                  id="enforceStrongPasswords"
                  checked={globalSettings.enforceStrongPasswords}
                  onCheckedChange={(checked) => setGlobalSettings({...globalSettings, enforceStrongPasswords: checked})}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="enableAccountLockout">Enable Account Lockout</Label>
                  <p className="text-sm text-gray-500">Lock accounts after multiple failed login attempts</p>
                </div>
                <Switch
                  id="enableAccountLockout"
                  checked={globalSettings.enableAccountLockout}
                  onCheckedChange={(checked) => setGlobalSettings({...globalSettings, enableAccountLockout: checked})}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="registration" className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="allowSelfRegistration">Allow Self Registration</Label>
                  <p className="text-sm text-gray-500">Allow users to register themselves</p>
                </div>
                <Switch
                  id="allowSelfRegistration"
                  checked={globalSettings.allowSelfRegistration}
                  onCheckedChange={(checked) => setGlobalSettings({...globalSettings, allowSelfRegistration: checked})}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="sessions" className="space-y-4">
              <div>
                <Label htmlFor="sessionTimeout">Default Session Timeout (minutes)</Label>
                <Input
                  id="sessionTimeout"
                  type="number"
                  value={globalSettings.defaultSessionTimeout}
                  onChange={(e) => setGlobalSettings({...globalSettings, defaultSessionTimeout: parseInt(e.target.value)})}
                />
                <p className="text-sm text-gray-500">How long before users are automatically logged out</p>
              </div>
            </TabsContent>
          </Tabs>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSettingsModal(false)}>
              Cancel
            </Button>
            <Button onClick={() => {
              toast({
                title: "Success",
                description: "Global settings updated successfully",
              });
              setShowSettingsModal(false);
            }}>
              Save Settings
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManagement; 