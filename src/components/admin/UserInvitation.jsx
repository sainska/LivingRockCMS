import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  UserPlus, 
  Mail, 
  Users, 
  Clock, 
  CheckCircle, 
  XCircle, 
  RefreshCw,
  Trash2,
  Eye,
  Calendar
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { sendInvitationEmail } from '@/utils/emailService';

const UserInvitation = () => {
  const { inviteUser, getInvitations, cancelInvitation, resendInvitation, user } = useAuth();
  const { toast } = useToast();

  const [invitationData, setInvitationData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    role: 'member'
  });
  const [invitations, setInvitations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingInvitations, setIsLoadingInvitations] = useState(true);

  const roles = [
    { value: 'member', label: 'Member', description: 'Regular church member' },
    { value: 'secretary', label: 'Secretary', description: 'Church secretary with administrative access' },
    { value: 'treasurer', label: 'Treasurer', description: 'Financial management access' },
    { value: 'clergy', label: 'Clergy', description: 'Pastoral and spiritual leadership access' },
    { value: 'system_admin', label: 'System Administrator', description: 'Full system access' }
  ];

  useEffect(() => {
    loadInvitations();
  }, []);

  const loadInvitations = async () => {
    setIsLoadingInvitations(true);
    try {
      const { data, error } = await getInvitations();
      if (!error) {
        setInvitations(data || []);
      }
    } catch (error) {
      console.error('Error loading invitations:', error);
    } finally {
      setIsLoadingInvitations(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!invitationData.email || !invitationData.firstName || !invitationData.lastName) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await inviteUser(
        invitationData.email,
        invitationData.role,
        invitationData.firstName,
        invitationData.lastName
      );

      if (!error && data) {
        // Send invitation email
        const inviter = {
          first_name: user?.user_metadata?.first_name || 'Admin',
          last_name: user?.user_metadata?.last_name || 'User',
          role: 'Administrator'
        };

        const emailResult = await sendInvitationEmail(data, data.invitationUrl, inviter);
        
        if (emailResult.success) {
          toast({
            title: "Invitation Sent",
            description: `Invitation sent to ${invitationData.email} for role: ${invitationData.role}`,
          });
        } else {
          toast({
            title: "Invitation Created",
            description: `Invitation created but email sending failed. Please send the invitation URL manually: ${data.invitationUrl}`,
            variant: "destructive",
          });
        }

        // Reset form
        setInvitationData({
          email: '',
          firstName: '',
          lastName: '',
          role: 'member'
        });
        
        // Reload invitations
        await loadInvitations();
      }
    } catch (error) {
      console.error('Error sending invitation:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelInvitation = async (invitationId) => {
    const confirmed = window.confirm('Are you sure you want to cancel this invitation?');
    if (!confirmed) return;

    try {
      const { error } = await cancelInvitation(invitationId);
      if (!error) {
        await loadInvitations();
      }
    } catch (error) {
      console.error('Error cancelling invitation:', error);
    }
  };

  const handleResendInvitation = async (invitationId) => {
    try {
      const { error } = await resendInvitation(invitationId);
      if (!error) {
        await loadInvitations();
      }
    } catch (error) {
      console.error('Error resending invitation:', error);
    }
  };

  const getStatusBadge = (status, expiresAt) => {
    const isExpired = new Date(expiresAt) < new Date();
    
    if (status === 'accepted') {
      return <Badge className="bg-green-100 text-green-800">Accepted</Badge>;
    } else if (status === 'cancelled') {
      return <Badge className="bg-red-100 text-red-800">Cancelled</Badge>;
    } else if (isExpired) {
      return <Badge className="bg-gray-100 text-gray-800">Expired</Badge>;
    } else {
      return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRoleLabel = (role) => {
    const roleObj = roles.find(r => r.value === role);
    return roleObj ? roleObj.label : role;
  };

  return (
    <div className="space-y-6">
      {/* Invite New User */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Invite New User
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  value={invitationData.firstName}
                  onChange={(e) => setInvitationData(prev => ({ ...prev, firstName: e.target.value }))}
                  placeholder="Enter first name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  value={invitationData.lastName}
                  onChange={(e) => setInvitationData(prev => ({ ...prev, lastName: e.target.value }))}
                  placeholder="Enter last name"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={invitationData.email}
                onChange={(e) => setInvitationData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="Enter email address"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="role">Role *</Label>
              <Select
                value={invitationData.role}
                onValueChange={(value) => setInvitationData(prev => ({ ...prev, role: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role.value} value={role.value}>
                      <div>
                        <div className="font-medium">{role.label}</div>
                        <div className="text-sm text-gray-500">{role.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Sending Invitation...
                </>
              ) : (
                <>
                  <Mail className="h-4 w-4 mr-2" />
                  Send Invitation
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Separator />

      {/* Invitations List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Pending Invitations
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingInvitations ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="h-6 w-6 animate-spin" />
            </div>
          ) : invitations.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Mail className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No invitations sent yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {invitations.map((invitation) => (
                <div
                  key={invitation.id}
                  className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div>
                          <h4 className="font-medium">
                            {invitation.first_name} {invitation.last_name}
                          </h4>
                          <p className="text-sm text-gray-600">{invitation.email}</p>
                        </div>
                        {getStatusBadge(invitation.status, invitation.expires_at)}
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {getRoleLabel(invitation.role)}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Expires: {formatDate(invitation.expires_at)}
                        </div>
                        {invitation.invited_by_user && (
                          <div className="flex items-center gap-1">
                            <UserPlus className="h-3 w-3" />
                            Invited by: {invitation.invited_by_user.first_name} {invitation.invited_by_user.last_name}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {invitation.status === 'pending' && new Date(invitation.expires_at) > new Date() && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleResendInvitation(invitation.id)}
                          >
                            <RefreshCw className="h-4 w-4 mr-1" />
                            Resend
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCancelInvitation(invitation.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Cancel
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UserInvitation; 