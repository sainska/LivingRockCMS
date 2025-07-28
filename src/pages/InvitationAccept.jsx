import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Church, 
  UserPlus, 
  CheckCircle, 
  XCircle, 
  Loader2, 
  Eye, 
  EyeOff,
  Calendar,
  Users,
  Shield
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const InvitationAccept = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { signUp, getUserRole, getDashboardRoute } = useAuth();
  const { toast } = useToast();

  const [invitation, setInvitation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
    phone: '',
    acceptTerms: false
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Get invitation token from URL
  const invitationToken = searchParams.get('token');
  const invitationId = searchParams.get('id');

  useEffect(() => {
    if (invitationToken || invitationId) {
      loadInvitation();
    } else {
      setError('Invalid invitation link. Please check your email for the correct link.');
      setIsLoading(false);
    }
  }, [invitationToken, invitationId]);

  const loadInvitation = async () => {
    try {
      let query = supabase.from('user_invitations');
      
      if (invitationId) {
        query = query.eq('id', invitationId);
      } else if (invitationToken) {
        // If using token-based invitation, you might need to decode the token
        // For now, we'll use the email from the token or store token in additional_data
        query = query.eq('additional_data->>token', invitationToken);
      }

      const { data, error } = await query
        .select(`
          *,
          invited_by_user:profiles!user_invitations_invited_by_fkey(
            first_name,
            last_name,
            email
          )
        `)
        .single();

      if (error) {
        console.error('Error loading invitation:', error);
        setError('Unable to load invitation. Please check your link or contact support.');
        setIsLoading(false);
        return;
      }

      if (!data) {
        setError('Invitation not found. Please check your link or contact support.');
        setIsLoading(false);
        return;
      }

      // Check if invitation is expired
      if (new Date(data.expires_at) < new Date()) {
        setError('This invitation has expired. Please contact the administrator for a new invitation.');
        setIsLoading(false);
        return;
      }

      // Check if invitation is already accepted
      if (data.status === 'accepted') {
        setError('This invitation has already been accepted.');
        setIsLoading(false);
        return;
      }

      // Check if invitation is cancelled
      if (data.status === 'cancelled') {
        setError('This invitation has been cancelled.');
        setIsLoading(false);
        return;
      }

      setInvitation(data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error in loadInvitation:', error);
      setError('An unexpected error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.acceptTerms) {
      toast({
        title: "Terms and Conditions",
        description: "Please accept the terms and conditions to continue.",
        variant: "destructive",
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match. Please try again.",
        variant: "destructive",
      });
      return;
    }

    if (formData.password.length < 8) {
      toast({
        title: "Password Too Short",
        description: "Password must be at least 8 characters long.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Create user account with invitation data
      const { error } = await signUp(
        invitation.email,
        formData.password,
        invitation.first_name,
        invitation.last_name,
        {
          role: invitation.role,
          phone: formData.phone,
          invitation_id: invitation.id,
          invited_by: invitation.invited_by
        }
      );

      if (error) {
        toast({
          title: "Registration Failed",
          description: error.message,
          variant: "destructive",
        });
        setIsProcessing(false);
        return;
      }

      // Update invitation status to accepted
      const { error: updateError } = await supabase
        .from('user_invitations')
        .update({ 
          status: 'accepted',
          accepted_at: new Date().toISOString()
        })
        .eq('id', invitation.id);

      if (updateError) {
        console.error('Error updating invitation status:', updateError);
      }

      toast({
        title: "Account Created Successfully!",
        description: `Welcome to Living Rock Church Management System as a ${getRoleLabel(invitation.role)}.`,
      });

      // Redirect to appropriate dashboard
      setTimeout(async () => {
        const userRole = await getUserRole();
        if (userRole) {
          const dashboardRoute = getDashboardRoute(userRole);
          navigate(dashboardRoute);
        } else {
          navigate("/user-dashboard");
        }
      }, 2000);

    } catch (error) {
      console.error('Error in handleSubmit:', error);
      toast({
        title: "Registration Failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
      setIsProcessing(false);
    }
  };

  const getRoleLabel = (role) => {
    const roleLabels = {
      'member': 'Member',
      'secretary': 'Secretary',
      'treasurer': 'Treasurer',
      'clergy': 'Clergy',
      'system_admin': 'System Administrator'
    };
    return roleLabels[role] || role;
  };

  const getRoleDescription = (role) => {
    const roleDescriptions = {
      'member': 'Access to view church events, manage your profile, and participate in church activities.',
      'secretary': 'Help manage member records, coordinate events, and assist with church administration.',
      'treasurer': 'Manage church finances, track donations, and maintain financial records.',
      'clergy': 'Access to pastoral care tools, member management, and spiritual guidance features.',
      'system_admin': 'Full system access for managing the church management system.'
    };
    return roleDescriptions[role] || 'You will have access to church management features based on your assigned role.';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-xiracom-blue to-xiracom-darkblue flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-8">
            <Loader2 className="h-12 w-12 animate-spin text-xiracom-blue mx-auto mb-4" />
            <h3 className="text-lg font-semibold">Loading Invitation</h3>
            <p className="text-sm text-gray-600">Please wait while we verify your invitation...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-xiracom-blue to-xiracom-darkblue flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center items-center gap-2 mb-4">
              <Church className="h-8 w-8 text-xiracom-blue" />
              <CardTitle className="text-2xl text-xiracom-blue">
                Living Rock Church
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <XCircle className="h-12 w-12 text-red-500 mx-auto" />
            <h3 className="text-lg font-semibold text-red-600">Invitation Error</h3>
            <p className="text-gray-600">{error}</p>
            <Button onClick={() => navigate('/welcome')} className="w-full">
              Go to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-xiracom-blue to-xiracom-darkblue flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="flex justify-center items-center gap-2 mb-4">
            <Church className="h-8 w-8 text-xiracom-blue" />
            <CardTitle className="text-2xl text-xiracom-blue">
              Living Rock Church
            </CardTitle>
          </div>
          <div className="space-y-2">
            <Badge className="bg-green-100 text-green-800">
              <CheckCircle className="h-3 w-3 mr-1" />
              Invitation Valid
            </Badge>
            <p className="text-sm text-gray-600">Complete your account setup</p>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Invitation Details */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-3">Invitation Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-blue-800">Name:</span>
                <p className="text-blue-700">{invitation.first_name} {invitation.last_name}</p>
              </div>
              <div>
                <span className="font-medium text-blue-800">Email:</span>
                <p className="text-blue-700">{invitation.email}</p>
              </div>
              <div>
                <span className="font-medium text-blue-800">Role:</span>
                <Badge variant="outline" className="ml-2">
                  <Users className="h-3 w-3 mr-1" />
                  {getRoleLabel(invitation.role)}
                </Badge>
              </div>
              <div>
                <span className="font-medium text-blue-800">Invited by:</span>
                <p className="text-blue-700">
                  {invitation.invited_by_user?.first_name} {invitation.invited_by_user?.last_name}
                </p>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-blue-200">
              <p className="text-sm text-blue-700">{getRoleDescription(invitation.role)}</p>
            </div>
          </div>

          <Separator />

          {/* Account Setup Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Create Password *</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="Enter your password"
                  required
                  minLength={8}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              <p className="text-xs text-gray-500">Password must be at least 8 characters long</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password *</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  placeholder="Confirm your password"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number (Optional)</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="Enter your phone number"
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="acceptTerms"
                checked={formData.acceptTerms}
                onChange={(e) => setFormData(prev => ({ ...prev, acceptTerms: e.target.checked }))}
                className="rounded border-gray-300"
                required
              />
              <Label htmlFor="acceptTerms" className="text-sm">
                I accept the <a href="/terms" className="text-xiracom-blue hover:underline">Terms and Conditions</a> and{' '}
                <a href="/privacy" className="text-xiracom-blue hover:underline">Privacy Policy</a>
              </Label>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-xiracom-blue hover:bg-xiracom-darkblue"
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating Account...
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Create Account
                </>
              )}
            </Button>
          </form>

          <Separator />

          {/* Security Notice */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-gray-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-gray-900 mb-1">Security Information</h4>
                <p className="text-sm text-gray-600">
                  Your account will be created with the role of <strong>{getRoleLabel(invitation.role)}</strong>. 
                  You can change your password and update your profile information after logging in.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InvitationAccept; 