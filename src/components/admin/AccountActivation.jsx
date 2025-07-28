import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  Users, 
  CheckCircle, 
  XCircle, 
  Clock, 
  UserCheck, 
  UserX, 
  RefreshCw,
  Search,
  Filter,
  Eye,
  MessageSquare
} from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const AccountActivation = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [pendingUsers, setPendingUsers] = useState([]);
  const [activationStats, setActivationStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [approvalNotes, setApprovalNotes] = useState('');
  const [rejectionNotes, setRejectionNotes] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showApprovalDialog, setShowApprovalDialog] = useState(false);
  const [showRejectionDialog, setShowRejectionDialog] = useState(false);
  const [showUserDetails, setShowUserDetails] = useState(false);

  useEffect(() => {
    loadPendingUsers();
    loadActivationStats();
  }, []);

  const loadPendingUsers = async () => {
    try {
      setLoading(true);
      
      // Get pending activations using the function
      const { data, error } = await supabase.rpc('get_pending_activations');
      
      if (error) {
        console.error('Error loading pending users:', error);
        toast({
          title: "Error",
          description: "Failed to load pending users",
          variant: "destructive",
        });
        return;
      }

      setPendingUsers(data || []);
    } catch (error) {
      console.error('Error loading pending users:', error);
      toast({
        title: "Error",
        description: "Failed to load pending users",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadActivationStats = async () => {
    try {
      const { data, error } = await supabase.rpc('get_activation_stats');
      
      if (error) {
        console.error('Error loading activation stats:', error);
        return;
      }

      setActivationStats(data || {});
    } catch (error) {
      console.error('Error loading activation stats:', error);
    }
  };

  const handleApproveUser = async () => {
    if (!selectedUser || !user) return;

    try {
      const { data, error } = await supabase.rpc('approve_user_activation', {
        target_user_id: selectedUser.user_id,
        admin_user_id: user.id,
        notes: approvalNotes
      });

      if (error) {
        console.error('Error approving user:', error);
        toast({
          title: "Error",
          description: "Failed to approve user activation",
          variant: "destructive",
        });
        return;
      }

      if (data.success) {
        toast({
          title: "Success",
          description: "User activation approved successfully",
        });
        
        // Refresh data
        await loadPendingUsers();
        await loadActivationStats();
        
        // Close dialog and reset
        setShowApprovalDialog(false);
        setSelectedUser(null);
        setApprovalNotes('');
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to approve user activation",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error approving user:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  const handleRejectUser = async () => {
    if (!selectedUser || !user) return;

    try {
      const { data, error } = await supabase.rpc('reject_user_activation', {
        target_user_id: selectedUser.user_id,
        admin_user_id: user.id,
        notes: rejectionNotes
      });

      if (error) {
        console.error('Error rejecting user:', error);
        toast({
          title: "Error",
          description: "Failed to reject user activation",
          variant: "destructive",
        });
        return;
      }

      if (data.success) {
        toast({
          title: "Success",
          description: "User activation rejected",
        });
        
        // Refresh data
        await loadPendingUsers();
        await loadActivationStats();
        
        // Close dialog and reset
        setShowRejectionDialog(false);
        setSelectedUser(null);
        setRejectionNotes('');
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to reject user activation",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error rejecting user:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  const filteredUsers = pendingUsers.filter(user => {
    const matchesSearch = 
      user.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || 
      (filterStatus === 'social' && user.social_provider) ||
      (filterStatus === 'email' && !user.social_provider);
    
    return matchesSearch && matchesFilter;
  });

  const getRegistrationMethodIcon = (socialProvider) => {
    if (socialProvider) {
      switch (socialProvider.toLowerCase()) {
        case 'google':
          return '🔍';
        case 'facebook':
          return '📘';
        case 'whatsapp':
          return '📱';
        default:
          return '🌐';
      }
    }
    return '📧';
  };

  const getRegistrationMethodText = (socialProvider) => {
    if (socialProvider) {
      return `${socialProvider.charAt(0).toUpperCase() + socialProvider.slice(1)} Login`;
    }
    return 'Email Registration';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Account Activation</h2>
          <p className="text-gray-600">Manage new user account approvals</p>
        </div>
        <Button onClick={loadPendingUsers} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold">{activationStats.total_users || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <UserCheck className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Activated</p>
                <p className="text-2xl font-bold">{activationStats.activated_users || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-8 w-8 text-yellow-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold">{activationStats.pending_users || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-8 w-8 text-emerald-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Activation Rate</p>
                <p className="text-2xl font-bold">{activationStats.activation_rate || 0}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="search">Search Users</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="filter">Filter by Type</Label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  <SelectItem value="social">Social Login</SelectItem>
                  <SelectItem value="email">Email Registration</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pending Users Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Pending Activations ({filteredUsers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No pending activations found</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Registration Method</TableHead>
                  <TableHead>Requested</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((pendingUser) => (
                  <TableRow key={pendingUser.user_id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {pendingUser.first_name} {pendingUser.last_name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {pendingUser.email}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="text-lg">
                          {getRegistrationMethodIcon(pendingUser.social_provider)}
                        </span>
                        <Badge variant="outline">
                          {getRegistrationMethodText(pendingUser.social_provider)}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {new Date(pendingUser.requested_at).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(pendingUser.requested_at).toLocaleTimeString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      {pendingUser.activation_notes ? (
                        <div className="max-w-xs truncate text-sm text-gray-600">
                          {pendingUser.activation_notes}
                        </div>
                      ) : (
                        <span className="text-gray-400 text-sm">No notes</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedUser(pendingUser);
                            setShowUserDetails(true);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedUser(pendingUser);
                            setShowApprovalDialog(true);
                          }}
                        >
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedUser(pendingUser);
                            setShowRejectionDialog(true);
                          }}
                        >
                          <XCircle className="h-4 w-4 text-red-600" />
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

      {/* Approval Dialog */}
      <Dialog open={showApprovalDialog} onOpenChange={setShowApprovalDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve User Activation</DialogTitle>
            <DialogDescription>
              Approve {selectedUser?.first_name} {selectedUser?.last_name}'s account activation request.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="approval-notes">Approval Notes (Optional)</Label>
              <Textarea
                id="approval-notes"
                placeholder="Add any notes about this approval..."
                value={approvalNotes}
                onChange={(e) => setApprovalNotes(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowApprovalDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleApproveUser} className="bg-green-600 hover:bg-green-700">
              <CheckCircle className="h-4 w-4 mr-2" />
              Approve Activation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rejection Dialog */}
      <Dialog open={showRejectionDialog} onOpenChange={setShowRejectionDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject User Activation</DialogTitle>
            <DialogDescription>
              Reject {selectedUser?.first_name} {selectedUser?.last_name}'s account activation request.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="rejection-notes">Rejection Reason (Required)</Label>
              <Textarea
                id="rejection-notes"
                placeholder="Please provide a reason for rejection..."
                value={rejectionNotes}
                onChange={(e) => setRejectionNotes(e.target.value)}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRejectionDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleRejectUser} 
              className="bg-red-600 hover:bg-red-700"
              disabled={!rejectionNotes.trim()}
            >
              <XCircle className="h-4 w-4 mr-2" />
              Reject Activation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* User Details Dialog */}
      <Dialog open={showUserDetails} onOpenChange={setShowUserDetails}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>
              Detailed information about {selectedUser?.first_name} {selectedUser?.last_name}
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Full Name</Label>
                  <p className="text-sm font-medium">
                    {selectedUser.first_name} {selectedUser.last_name}
                  </p>
                </div>
                <div>
                  <Label>Email</Label>
                  <p className="text-sm font-medium">{selectedUser.email}</p>
                </div>
                <div>
                  <Label>Registration Method</Label>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">
                      {getRegistrationMethodIcon(selectedUser.social_provider)}
                    </span>
                    <Badge variant="outline">
                      {getRegistrationMethodText(selectedUser.social_provider)}
                    </Badge>
                  </div>
                </div>
                <div>
                  <Label>Requested At</Label>
                  <p className="text-sm font-medium">
                    {new Date(selectedUser.requested_at).toLocaleString()}
                  </p>
                </div>
              </div>
              {selectedUser.activation_notes && (
                <div>
                  <Label>Notes</Label>
                  <p className="text-sm text-gray-600">{selectedUser.activation_notes}</p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowUserDetails(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AccountActivation; 