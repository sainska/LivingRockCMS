import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { UserPlus, Edit, Trash2, Shield, Key, Users, Settings } from "lucide-react";
import { useProfiles } from '@/hooks/useProfiles';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { toast } from '@/hooks/use-toast';
import { saveAs } from 'file-saver';
import { Dialog as Modal, DialogContent as ModalContent, DialogHeader as ModalHeader, DialogTitle as ModalTitle, DialogFooter as ModalFooter } from '@/components/ui/dialog';
import { Dialog as ConfirmDialog, DialogContent as ConfirmContent, DialogHeader as ConfirmHeader, DialogTitle as ConfirmTitle, DialogFooter as ConfirmFooter } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';

const rolePermissionsList = {
  admin: ["System Settings", "User Management", "Security", "Reports"],
  clergy: ["Full Access"],
  treasurer: ["Financial Management", "Reports", "Member Management"],
  secretary: ["Member Management", "Communication", "Events", "Reports"],
  member: ["Basic Access", "Events"],
};

const allRoles = [
  { key: 'admin', label: 'Admin' },
  { key: 'clergy', label: 'Clergy' },
  { key: 'treasurer', label: 'Treasurer' },
  { key: 'secretary', label: 'Secretary' },
  { key: 'member', label: 'Member' },
];

const exportToCSV = (data, filename) => {
  const csvRows = [];
  // Headers
  const headers = Object.keys(data[0] || {}).join(',');
  csvRows.push(headers);
  // Rows
  for (const row of data) {
    csvRows.push(Object.values(row).map(v => `"${v ?? ''}"`).join(','));
  }
  const csvString = csvRows.join('\n');
  const blob = new Blob([csvString], { type: 'text/csv' });
  saveAs(blob, filename);
};

const handleExportUserList = () => {
  if (!profiles.length) return toast({ title: 'No users to export' });
  const data = profiles.map(p => ({
    Name: `${p.first_name} ${p.last_name}`,
    Email: p.email,
    Role: Array.isArray(p.user_roles) && p.user_roles[0]?.role ? p.user_roles[0].role : 'Member',
    Status: p.is_active ? 'Active' : 'Inactive',
    LastLogin: p.last_login || '',
    Created: p.created_at || ''
  }));
  exportToCSV(data, 'user_list.csv');
  toast({ title: 'User list exported' });
};

const handlePermissionAudit = () => {
  if (!profiles.length) return toast({ title: 'No users to export' });
  const data = profiles.map(p => ({
    Name: `${p.first_name} ${p.last_name}`,
    Email: p.email,
    Role: Array.isArray(p.user_roles) && p.user_roles[0]?.role ? p.user_roles[0].role : 'Member',
    Permissions: (rolePermissionsList[(Array.isArray(p.user_roles) && p.user_roles[0]?.role) ? p.user_roles[0].role : 'Member'] || []).join('; ')
  }));
  exportToCSV(data, 'permission_audit.csv');
  toast({ title: 'Permission audit exported' });
};

const handleLockInactiveAccounts = async () => {
  const sixtyDaysAgo = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000);
  const toLock = profiles.filter(p => p.last_login && new Date(p.last_login) < sixtyDaysAgo && p.is_active);
  if (!toLock.length) return toast({ title: 'No inactive accounts to lock' });
  for (const user of toLock) {
    await updateProfile(user.id, { is_active: false });
  }
  refetch();
  toast({ title: 'Inactive accounts locked', description: `${toLock.length} accounts locked.` });
};

const handleForce2FA = async () => {
  // If you have a require_2fa field in profiles, update it. Otherwise, show a comment.
  for (const user of profiles) {
    await updateProfile(user.id, { require_2fa: true }); // If this field does not exist, add to your schema.
  }
  refetch();
  toast({ title: '2FA setup forced for all users (demo)' });
};

const handleResetAllPasswords = async () => {
  // This will only work if you use Supabase Auth and have access to the auth API
  let count = 0;
  for (const user of profiles) {
    if (user.email) {
      try {
        // This will send a password reset email to the user
        await supabase.auth.api.resetPasswordForEmail(user.email);
        count++;
      } catch (e) {
        // Ignore errors for demo
      }
    }
  }
  toast({ title: 'Password reset emails sent', description: `${count} users processed.` });
};

const handleExpireAllSessions = async () => {
  // This requires a session_version field in your profiles table
  // Increment session_version for all users
  for (const user of profiles) {
    await updateProfile(user.id, { session_version: (user.session_version || 0) + 1 });
  }
  refetch();
  toast({ title: 'All sessions expired', description: 'All users will be required to log in again.' });
};

// --- Integration Stubs for Future Backend/Email API ---

// Send Welcome Emails
const handleSendWelcomeEmails = async () => {
  // TODO: Integrate with your email API (e.g., SendGrid, Mailgun, Supabase Edge Functions)
  // Example:
  // await fetch('/api/send-welcome-emails', { method: 'POST' });
  toast({ title: 'Send Welcome Emails', description: 'Integrate with your email API here.' });
};

// Login Activity Report
const handleLoginActivityReport = async () => {
  // TODO: Fetch login activity from your login_activity table and export as CSV
  // Example:
  // const { data, error } = await supabase.from('login_activity').select('*');
  // exportToCSV(data, 'login_activity.csv');
  toast({ title: 'Login Activity Report', description: 'Integrate with your login_activity table here.' });
};

// Review Suspicious Activity
const handleReviewSuspiciousActivity = async () => {
  // TODO: Fetch suspicious activity from your security_logs or login_activity table
  // Example:
  // const { data, error } = await supabase.from('security_logs').select('*').eq('type', 'suspicious');
  // Show in a modal or export as CSV
  toast({ title: 'Review Suspicious Activity', description: 'Integrate with your security_logs or login_activity table here.' });
};

const ROLES = [
  { value: 'all', label: 'All Roles' },
  { value: 'admin', label: 'Admin' },
  { value: 'clergy', label: 'Clergy' },
  { value: 'treasurer', label: 'Treasurer' },
  { value: 'secretary', label: 'Secretary' },
  { value: 'member', label: 'Member' },
];
const STATUSES = [
  { value: 'all', label: 'All Statuses' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
];

const USERS_PER_PAGE = 10;

const logAudit = async ({ user_id, action, target_id, target_type, details }) => {
  try {
    await supabase.from('audit_logs').insert([
      { user_id, action, target_id, target_type, details: JSON.stringify(details), created_at: new Date().toISOString() }
    ]);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('Audit log error:', e);
  }
};

// Helper to get all roles for a user
const getUserRoles = (profile) => (Array.isArray(profile.user_roles) ? profile.user_roles : []).map(r => r.role);

const ALL_ROLE_OPTIONS = [
  { value: 'admin', label: 'Admin' },
  { value: 'clergy', label: 'Clergy' },
  { value: 'treasurer', label: 'Treasurer' },
  { value: 'secretary', label: 'Secretary' },
  { value: 'member', label: 'Member' },
];

const UserManagement = () => {
  const { profiles, loading, error, updateProfile, assignRole, refetch } = useProfiles();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUser, setNewUser] = useState({
    first_name: '',
    last_name: '',
    email: '',
    role: 'member',
    is_active: true
  });
  const [adding, setAdding] = useState(false);
  const [addError, setAddError] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [modalUser, setModalUser] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingDelete, setPendingDelete] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const editFormRef = useRef();
  const [showDeleted, setShowDeleted] = useState(false);
  const [auditLogs, setAuditLogs] = useState([]);
  const { user: authUser } = useAuth();

  useEffect(() => {
    if (showUserModal && modalUser) {
      supabase.from('audit_logs').select('*').eq('target_id', modalUser.id).order('created_at', { ascending: false }).then(({ data }) => setAuditLogs(data || []));
    }
  }, [showUserModal, modalUser]);

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

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selected, setSelected] = useState([]); // array of user ids
  const [page, setPage] = useState(1);

  // Filtered and searched users
  const filteredProfiles = useMemo(() => {
    let filtered = profiles;
    if (!showDeleted) {
      filtered = filtered.filter(p => !p.deleted_at);
    }
    if (search) {
      filtered = filtered.filter(p =>
        (`${p.first_name} ${p.last_name}`.toLowerCase().includes(search.toLowerCase()) ||
         (p.email || '').toLowerCase().includes(search.toLowerCase()))
      );
    }
    if (roleFilter && roleFilter !== 'all') {
      filtered = filtered.filter(p => (Array.isArray(p.user_roles) && p.user_roles[0]?.role ? p.user_roles[0].role : 'member') === roleFilter);
    }
    if (statusFilter && statusFilter !== 'all') {
      filtered = filtered.filter(p =>
        statusFilter === 'active' ? p.is_active : !p.is_active
      );
    }
    return filtered;
  }, [profiles, search, roleFilter, statusFilter, showDeleted]);

  // Pagination
  const totalPages = Math.ceil(filteredProfiles.length / USERS_PER_PAGE) || 1;
  const pagedProfiles = filteredProfiles.slice((page - 1) * USERS_PER_PAGE, page * USERS_PER_PAGE);

  // Bulk actions
  const allOnPageSelected = pagedProfiles.length > 0 && pagedProfiles.every(p => selected.includes(p.id));
  const toggleSelectAll = () => {
    if (allOnPageSelected) {
      setSelected(selected.filter(id => !pagedProfiles.some(p => p.id === id)));
    } else {
      setSelected([...new Set([...selected, ...pagedProfiles.map(p => p.id)])]);
    }
  };
  const toggleSelect = (id) => {
    setSelected(selected.includes(id) ? selected.filter(sid => sid !== id) : [...selected, id]);
  };
  const handleBulkActivate = async (active) => {
    for (const id of selected) {
      await updateProfile(id, { is_active: active });
    }
    setSelected([]);
    refetch();
    toast({ title: `Users ${active ? 'activated' : 'deactivated'}` });
  };

  const handleBulkDelete = async () => {
    setShowConfirm(true);
    setPendingDelete(true);
  };
  const confirmBulkDelete = async () => {
    for (const id of selected) {
      await supabase.from('profiles').delete().eq('id', id);
    }
    setSelected([]);
    refetch();
    setShowConfirm(false);
    setPendingDelete(false);
    toast({ title: 'Users deleted' });
  };

  const handleExportFiltered = () => {
    if (!filteredProfiles.length) return toast({ title: 'No users to export' });
    const data = filteredProfiles.map(p => ({
      Name: `${p.first_name} ${p.last_name}`,
      Email: p.email,
      Role: Array.isArray(p.user_roles) && p.user_roles[0]?.role ? p.user_roles[0].role : 'Member',
      Status: p.is_active ? 'Active' : 'Inactive',
      LastLogin: p.last_login || '',
      Created: p.created_at || ''
    }));
    exportToCSV(data, 'filtered_users.csv');
    toast({ title: 'Filtered users exported' });
  };

  const handleGlobalSettingChange = (key, value) => {
    setGlobalSettings(prev => ({ ...prev, [key]: value }));
    // TODO: Integrate with backend
  };

  const getStatusColor = (status) => {
    return status === true || status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'clergy':
      case 'Clergy': return 'bg-purple-100 text-purple-800';
      case 'admin':
      case 'Admin': return 'bg-blue-100 text-blue-800';
      case 'treasurer':
      case 'Treasurer': return 'bg-green-100 text-green-800';
      case 'secretary':
      case 'Secretary': return 'bg-yellow-100 text-yellow-800';
      case 'member':
      case 'Member': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStatusToggle = async (userId, currentStatus) => {
    await updateProfile(userId, { is_active: !currentStatus });
    refetch();
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    setAdding(true);
    setAddError(null);
    try {
      // Insert into profiles
      const { data, error } = await supabase
        .from('profiles')
        .insert([
          {
            first_name: newUser.first_name,
            last_name: newUser.last_name,
            email: newUser.email,
            is_active: newUser.is_active,
          }
        ])
        .select()
        .single();
      if (error) throw error;
      // Assign role
      await assignRole(data.id, newUser.role);
      setShowAddModal(false);
      setNewUser({ first_name: '', last_name: '', email: '', role: 'member', is_active: true });
      refetch();
      await logAudit({ user_id: authUser?.id || null, action: 'create', target_id: data.id, target_type: 'profile', details: newUser });
    } catch (err) {
      setAddError(err.message || 'Failed to add user');
    } finally {
      setAdding(false);
    }
  };

  const openEditModal = (user) => {
    setModalUser(user);
    setEditUser({
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      role: Array.isArray(user.user_roles) && user.user_roles[0]?.role ? user.user_roles[0].role : 'member',
      is_active: user.is_active,
    });
    setShowUserModal(true);
    setEditMode(false);
  };
  const handleEditChange = (field, value) => {
    setEditUser(prev => ({ ...prev, [field]: value }));
  };
  const handleSaveEdit = async () => {
    await updateProfile(modalUser.id, {
      first_name: editUser.first_name,
      last_name: editUser.last_name,
      email: editUser.email,
      is_active: editUser.is_active,
    });
    // Assign all selected roles
    const newRoles = editUser.roles || getUserRoles(modalUser);
    for (const role of ALL_ROLE_OPTIONS.map(r => r.value)) {
      if (newRoles.includes(role)) {
        await assignRole(modalUser.id, role); // upsert (add if not exists)
      } else {
        // Remove role if it exists and is not in newRoles
        if (getUserRoles(modalUser).includes(role)) {
          await supabase.from('user_roles').delete().eq('user_id', modalUser.id).eq('role', role);
        }
      }
    }
    setShowUserModal(false);
    refetch();
    toast({ title: 'User updated' });
    await logAudit({ user_id: authUser?.id || null, action: 'update', target_id: modalUser.id, target_type: 'profile', details: editUser });
  };

  // Soft delete and restore handlers
  const handleDeleteUser = async (id) => {
    await updateProfile(id, { deleted_at: new Date().toISOString() });
    refetch();
    toast({ title: 'User deleted (soft)' });
    await logAudit({ user_id: authUser?.id || null, action: 'delete', target_id: id, target_type: 'profile', details: {} });
  };
  const handleRestoreUser = async (id) => {
    await updateProfile(id, { deleted_at: null });
    refetch();
    toast({ title: 'User restored' });
    await logAudit({ user_id: authUser?.id || null, action: 'restore', target_id: id, target_type: 'profile', details: {} });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">User Management</h3>
        <Button onClick={() => setShowAddModal(true)}>
          <UserPlus className="h-4 w-4 mr-2" />
          Add New User
        </Button>
      </div>
      {/* Add New User Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddUser} className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="First Name"
                value={newUser.first_name}
                onChange={e => setNewUser({ ...newUser, first_name: e.target.value })}
                required
              />
              <Input
                placeholder="Last Name"
                value={newUser.last_name}
                onChange={e => setNewUser({ ...newUser, last_name: e.target.value })}
                required
              />
            </div>
            <Input
              placeholder="Email"
              type="email"
              value={newUser.email}
              onChange={e => setNewUser({ ...newUser, email: e.target.value })}
              required
            />
            <Select value={newUser.role} onValueChange={role => setNewUser({ ...newUser, role })}>
              <SelectTrigger>
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="clergy">Clergy</SelectItem>
                <SelectItem value="treasurer">Treasurer</SelectItem>
                <SelectItem value="secretary">Secretary</SelectItem>
                <SelectItem value="member">Member</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex items-center gap-2">
              <Switch
                checked={newUser.is_active}
                onCheckedChange={val => setNewUser({ ...newUser, is_active: val })}
              />
              <Label>Active</Label>
            </div>
            {addError && <div className="text-red-500 text-sm">{addError}</div>}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowAddModal(false)} disabled={adding}>Cancel</Button>
              <Button type="submit" loading={adding}>Add User</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Global User Settings Card */}
      <Card>
        <CardHeader>
          <CardTitle>Global User Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
            <Label>Require Email Verification</Label>
            <Switch checked={globalSettings.requireEmailVerification} onCheckedChange={val => handleGlobalSettingChange('requireEmailVerification', val)} />
                </div>
          <div className="flex items-center justify-between">
            <Label>Allow Self Registration</Label>
            <Switch checked={globalSettings.allowSelfRegistration} onCheckedChange={val => handleGlobalSettingChange('allowSelfRegistration', val)} />
              </div>
              <div className="flex items-center justify-between">
            <Label>Enforce Strong Passwords</Label>
            <Switch checked={globalSettings.enforceStrongPasswords} onCheckedChange={val => handleGlobalSettingChange('enforceStrongPasswords', val)} />
              </div>
              <div className="flex items-center justify-between">
            <Label>Enable Account Lockout</Label>
            <Switch checked={globalSettings.enableAccountLockout} onCheckedChange={val => handleGlobalSettingChange('enableAccountLockout', val)} />
            </div>
              <div className="flex items-center justify-between">
                <Label>Default Session Timeout (minutes)</Label>
                <Input 
                  type="number"
              min={1}
                  value={globalSettings.sessionTimeout}
              onChange={e => handleGlobalSettingChange('sessionTimeout', Number(e.target.value))}
              className="w-24"
                />
          </div>
        </CardContent>
      </Card>

      {/* Role & Permission Management */}
      <Card>
        <CardHeader>
          <CardTitle>Role & Permission Management</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible>
            {allRoles.map(role => (
              <AccordionItem value={role.key} key={role.key}>
                <AccordionTrigger>
                  <div className="flex items-center gap-4">
                    <span className="font-semibold">{role.label}</span>
                    <span className="text-xs text-muted-foreground">{profiles.filter(p => (Array.isArray(p.user_roles) && p.user_roles[0]?.role ? p.user_roles[0].role : 'member') === role.key).length} user(s) with this role</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="mb-2 font-medium">Permissions:</div>
                  <ul className="mb-2 list-disc pl-6">
                    {(rolePermissionsList[role.key] || []).map(perm => (
                      <li key={perm}>{perm}</li>
                    ))}
                  </ul>
                  <Button size="sm" variant="outline">Edit</Button>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      {/* Quick User Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick User Actions</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button variant="outline" onClick={handleResetAllPasswords}>
            Reset All Passwords
          </Button>
          <Button variant="outline" onClick={handleExpireAllSessions}>
            Expire All Sessions
          </Button>
          <Button variant="outline" onClick={handleSendWelcomeEmails}>
            Send Welcome Emails
          </Button>
        </CardContent>
      </Card>
      {/* User Reports */}
      <Card>
        <CardHeader>
          <CardTitle>User Reports</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button variant="outline" onClick={handleExportUserList}>
            Export User List
          </Button>
          <Button variant="outline" onClick={handleLoginActivityReport}>
            Login Activity Report
          </Button>
          <Button variant="outline" onClick={handlePermissionAudit}>
            Permission Audit
          </Button>
        </CardContent>
      </Card>

      {/* Security Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Security Actions</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button variant="outline" onClick={handleForce2FA}>
            Force 2FA Setup
          </Button>
          <Button variant="outline" onClick={handleReviewSuspiciousActivity}>
            Review Suspicious Activity
          </Button>
          <Button variant="outline" onClick={handleLockInactiveAccounts}>
            Lock Inactive Accounts
          </Button>
        </CardContent>
      </Card>

      {/* Search and Filters */}
      <div className="flex flex-wrap gap-2 items-center mb-2">
        <Input
          placeholder="Search by name or email"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-64"
        />
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-40"><SelectValue placeholder="Role" /></SelectTrigger>
          <SelectContent>
            {ROLES.map(r => <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            {STATUSES.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
          </SelectContent>
        </Select>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={showDeleted} onChange={e => setShowDeleted(e.target.checked)} />
          Show Deleted
        </label>
        {selected.length > 0 && (
          <>
            <Button size="sm" onClick={() => handleBulkActivate(true)}>Bulk Activate</Button>
            <Button size="sm" variant="outline" onClick={() => handleBulkActivate(false)}>Bulk Deactivate</Button>
            <Button size="sm" variant="outline" onClick={handleExportFiltered}>Export Filtered Users</Button>
            {selected.length > 0 && (
              <Button size="sm" variant="destructive" onClick={handleBulkDelete}>Bulk Delete</Button>
            )}
          </>
        )}
      </div>
      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Users className="h-4 w-4" />
            User Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div>Loading...</div>
          ) : error ? (
            <div className="text-red-500">{error}</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <input type="checkbox" checked={allOnPageSelected} onChange={toggleSelectAll} />
                  </TableHead>
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
                {pagedProfiles.map(profile => (
                  <TableRow key={profile.id}>
                    <TableCell>
                      <input type="checkbox" checked={selected.includes(profile.id)} onChange={() => toggleSelect(profile.id)} />
                    </TableCell>
                    <TableCell>
                      <button className="underline text-blue-600" onClick={() => openEditModal(profile)}>
                        {profile.first_name} {profile.last_name}
                      </button>
                    </TableCell>
                    <TableCell>{profile.email}</TableCell>
                    <TableCell>
                      {getUserRoles(profile).length > 0
                        ? getUserRoles(profile).map(role => (
                            <Badge key={role} className={getRoleColor(role)}>{role}</Badge>
                          ))
                        : <Badge className={getRoleColor('member')}>Member</Badge>}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(profile.is_active)}>
                        {profile.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell>{profile.last_login ? new Date(profile.last_login).toLocaleString() : '-'}</TableCell>
                    <TableCell>{profile.created_at ? new Date(profile.created_at).toLocaleDateString() : '-'}</TableCell>
                    <TableCell>
                      {profile.deleted_at ? (
                        <Button size="sm" variant="outline" onClick={() => handleRestoreUser(profile.id)}>Restore</Button>
                      ) : (
                        <>
                          <Button size="sm" variant="outline" onClick={() => handleStatusToggle(profile.id, profile.is_active)}>
                            {profile.is_active ? 'Deactivate' : 'Activate'}
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => handleDeleteUser(profile.id)}>Delete</Button>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
          {/* Pagination */}
          <div className="flex justify-between items-center mt-4">
            <span>Page {page} of {totalPages}</span>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</Button>
              <Button size="sm" variant="outline" disabled={page === totalPages} onClick={() => setPage(page + 1)}>Next</Button>
            </div>
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
      <Modal open={showUserModal} onOpenChange={setShowUserModal}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>User Details</ModalTitle>
          </ModalHeader>
          {modalUser && (
            <form ref={editFormRef} className="space-y-2" onSubmit={e => { e.preventDefault(); handleSaveEdit(); }}>
              <div>
                <b>Name:</b> {editMode ? (
                  <>
                    <Input value={editUser.first_name} onChange={e => handleEditChange('first_name', e.target.value)} className="w-32 inline-block mr-2" />
                    <Input value={editUser.last_name} onChange={e => handleEditChange('last_name', e.target.value)} className="w-32 inline-block" />
                  </>
                ) : (
                  `${modalUser.first_name} ${modalUser.last_name}`
                )}
              </div>
              <div>
                <b>Email:</b> {editMode ? (
                  <Input value={editUser.email} onChange={e => handleEditChange('email', e.target.value)} className="w-64 inline-block" />
                ) : modalUser.email}
              </div>
              <div>
                <b>Roles:</b> {editMode ? (
                  <div className="flex flex-wrap gap-2">
                    {ALL_ROLE_OPTIONS.map(opt => (
                      <label key={opt.value} className="flex items-center gap-1">
                        <input
                          type="checkbox"
                          checked={getUserRoles(modalUser).includes(opt.value) || (editUser.roles && editUser.roles.includes(opt.value))}
                          onChange={e => {
                            let newRoles = editUser.roles || getUserRoles(modalUser);
                            if (e.target.checked) {
                              newRoles = [...new Set([...newRoles, opt.value])];
                            } else {
                              newRoles = newRoles.filter(r => r !== opt.value);
                            }
                            setEditUser(prev => ({ ...prev, roles: newRoles }));
                          }}
                        />
                        {opt.label}
                      </label>
                    ))}
                  </div>
                ) : (
                  getUserRoles(modalUser).map(role => (
                    <Badge key={role} className={getRoleColor(role)}>{role}</Badge>
                  ))
                )}
              </div>
              <div>
                <b>Status:</b> {editMode ? (
                  <Select value={editUser.is_active ? 'active' : 'inactive'} onValueChange={val => handleEditChange('is_active', val === 'active')}>
                    <SelectTrigger className="w-32"><SelectValue placeholder="Status" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (modalUser.is_active ? 'Active' : 'Inactive')}
              </div>
              <div><b>Created:</b> {modalUser.created_at ? new Date(modalUser.created_at).toLocaleDateString() : '-'}</div>
              <div><b>Last Login:</b> {modalUser.last_login ? new Date(modalUser.last_login).toLocaleString() : '-'}</div>
              <ModalFooter>
                {editMode ? (
                  <>
                    <Button type="submit">Save</Button>
                    <Button variant="outline" type="button" onClick={() => setEditMode(false)}>Cancel</Button>
                  </>
                ) : (
                  <Button variant="outline" type="button" onClick={() => setEditMode(true)}>Edit</Button>
                )}
                {modalUser && !modalUser.deleted_at && (
                  <Button variant="destructive" onClick={() => handleDeleteUser(modalUser.id)}>Delete User</Button>
                )}
                {modalUser && modalUser.deleted_at && (
                  <Button variant="outline" onClick={() => handleRestoreUser(modalUser.id)}>Restore User</Button>
                )}
                <Button variant="outline" onClick={() => setShowUserModal(false)}>Close</Button>
              </ModalFooter>
            </form>
          )}
          {modalUser && auditLogs.length > 0 && (
            <div className="mt-4">
              <b>Audit Log:</b>
              <ul className="text-xs max-h-40 overflow-y-auto">
                {auditLogs.map(log => (
                  <li key={log.id} className="mb-1">
                    [{new Date(log.created_at).toLocaleString()}] {log.action} by {log.user_id || 'system'}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </ModalContent>
      </Modal>
      <ConfirmDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <ConfirmContent>
          <ConfirmHeader>
            <ConfirmTitle>Confirm Bulk Delete</ConfirmTitle>
          </ConfirmHeader>
          <div>Are you sure you want to delete {selected.length} users? This action cannot be undone.</div>
          <ConfirmFooter>
            <Button variant="destructive" onClick={confirmBulkDelete} disabled={!pendingDelete}>Delete</Button>
            <Button variant="outline" onClick={() => { setShowConfirm(false); setPendingDelete(false); }}>Cancel</Button>
          </ConfirmFooter>
        </ConfirmContent>
      </ConfirmDialog>
    </div>
  );
};

export default UserManagement;
