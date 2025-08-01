
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  sendChangeEmailConfirmation, 
  sendPasswordResetEmail, 
  sendReauthenticationEmail,
  send2FAVerificationEmail
} from '@/utils/emailService';
import { send2FAVerificationSMS } from '@/utils/smsService';

const AuthContext = createContext(null);

// Simple in-memory storage for 2FA codes (temporary solution)
const twoFactorCodes = new Map();

// Clean up expired codes every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [email, codeData] of twoFactorCodes.entries()) {
    if (now > codeData.expiresAt) {
      twoFactorCodes.delete(email);
    }
  }
}, 5 * 60 * 1000); // 5 minutes

// Debug function to check stored codes
window.debug2FACodes = () => {
  console.log('Current 2FA codes:', Array.from(twoFactorCodes.entries()));
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    console.log('AuthProvider: Setting up auth state listener...');
    
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email, 'Session:', session);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Then check for existing session
    console.log('AuthProvider: Checking for existing session...');
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      console.log('AuthProvider: Session check result:', { session, error });
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const getUserRole = async () => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .rpc('get_user_role', { user_uuid: user.id });

      if (error) {
        console.error('Error fetching user role:', error);
        return 'member';
      }

      return data || 'member';
    } catch (error) {
      console.error('Error fetching user role:', error);
      return 'member';
    }
  };

  const checkUserActivation = async () => {
    if (!user) return { isActivated: false, needsActivation: false };

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('is_activated, social_provider')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error checking user activation:', error);
        return { isActivated: false, needsActivation: false };
      }

      // Social auth users are auto-activated
      const isActivated = data.is_activated || data.social_provider !== null;
      const needsActivation = !isActivated;

      return { isActivated, needsActivation };
    } catch (error) {
      console.error('Error checking user activation:', error);
      return { isActivated: false, needsActivation: false };
    }
  };

  const getDashboardRoute = (role) => {
    const dashboardRoutes = {
      system_admin: '/admin-dashboard',
      clergy: '/clergy-dashboard',
      treasurer: '/treasurer-dashboard',
      secretary: '/secretary-dashboard',
      member: '/user-dashboard'
    };

    return dashboardRoutes[role] || '/user-dashboard';
  };

  const signIn = async (email, password) => {
    console.log('AuthContext: Attempting sign in for:', email);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      console.log('AuthContext: Sign in result:', { data, error });
      
      if (error) {
        console.error('AuthContext: Sign in error:', error);
        toast({
          title: "Login Failed",
          description: error.message,
          variant: "destructive",
        });
        return { error };
      }

      // Check if 2FA is enabled for this user
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('two_factor_enabled, two_factor_method, first_name, last_name')
        .eq('email', email)
        .single();

      if (profileError) {
        console.error('AuthContext: Error checking 2FA status:', profileError);
        // Continue with normal login if we can't check 2FA status
        toast({
          title: "Login Successful",
          description: "Welcome to Living Rock Church Management System!",
        });
        return { error: null };
      }

      if (profileData?.two_factor_enabled) {
        console.log('AuthContext: 2FA is enabled, returning 2FA required status');
        return { 
          error: null, 
          requires2FA: true, 
          twoFactorMethod: profileData.two_factor_method,
          userName: `${profileData.first_name} ${profileData.last_name}`.trim() || email.split('@')[0]
        };
      }

      console.log('AuthContext: Sign in successful, user:', data.user);
      toast({
        title: "Login Successful",
        description: "Welcome to Living Rock Church Management System!",
      });
      
      return { error: null };
    } catch (error) {
      console.error('AuthContext: Unexpected sign in error:', error);
      toast({
        title: "Login Failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      return { error };
    }
  };

  const signUp = async (email, password, firstName, lastName, additionalData = {}) => {
    try {
      const redirectUrl = `${window.location.origin}/`;
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            first_name: firstName,
            last_name: lastName,
            ...additionalData // Include additional profile data
          }
        }
      });

      if (error) {
        toast({
          title: "Registration Failed",
          description: error.message,
          variant: "destructive",
        });
        return { error };
      }

      // Handle invitation-based signup
      if (additionalData.invitation_id) {
        try {
          // Update invitation status to accepted
          const { error: invitationError } = await supabase
            .from('user_invitations')
            .update({ 
              status: 'accepted',
              accepted_at: new Date().toISOString()
            })
            .eq('id', additionalData.invitation_id);

          if (invitationError) {
            console.error('Error updating invitation status:', invitationError);
          }
        } catch (invitationUpdateError) {
          console.error('Error updating invitation:', invitationUpdateError);
        }
      }

      // If additional data includes a specific role, update the user_roles table
      if (additionalData.role && additionalData.role !== 'member') {
        try {
          // Wait a moment for the trigger to create the initial profile and role
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Update the user role if it's different from the default 'member'
          const { error: roleError } = await supabase
            .from('user_roles')
            .update({ role: additionalData.role })
            .eq('user_id', data.user.id)
            .eq('role', 'member');

          if (roleError) {
            console.error('Error updating user role:', roleError);
          }
        } catch (roleUpdateError) {
          console.error('Error updating user role:', roleUpdateError);
        }
      }

      // Update profile with additional data if provided
      if (Object.keys(additionalData).length > 0) {
        try {
          const profileUpdateData = { ...additionalData };
          delete profileUpdateData.role; // Remove role from profile data
          delete profileUpdateData.invitation_id; // Remove invitation_id from profile data

          const { error: profileError } = await supabase
            .from('profiles')
            .update(profileUpdateData)
            .eq('id', data.user.id);

          if (profileError) {
            console.error('Error updating profile:', profileError);
          }
        } catch (profileUpdateError) {
          console.error('Error updating profile:', profileUpdateError);
        }
      }

      // For invitation-based signup, don't show email verification message
      if (additionalData.invitation_id) {
        toast({
          title: "Account Created Successfully!",
          description: `Welcome to Living Rock Church Management System as a ${additionalData.role || 'member'}.`,
        });
      } else {
      toast({
        title: "Registration Successful",
        description: "Please check your email to verify your account.",
      });
      }
      
      return { error: null };
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      return { error };
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Sign Out Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Signed Out",
        description: "You have been successfully signed out.",
      });
    }
  };

  const resetPassword = async (email) => {
    try {
      // First check if user exists in the profiles table
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id, email')
        .eq('email', email)
        .single();

      if (profileError) {
        // User not found in profiles table
        if (profileError.code === 'PGRST116') { // No rows returned
          toast({
            title: "User Not Found",
            description: "No account found with this email address. Please check your email or contact support.",
            variant: "destructive",
          });
          return { error: new Error("User not found") };
        } else {
          // Other database error
          console.error('Error checking user existence:', profileError);
        }
      }

      // If we reach here, user exists, proceed with password reset
      const redirectUrl = `${window.location.origin}/reset-password`;
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl,
      });

      if (error) {
        // Handle specific error cases
        if (error.message.includes("User not found") || error.message.includes("No user found")) {
          toast({
            title: "User Not Found",
            description: "No account found with this email address. Please check your email or contact support.",
            variant: "destructive",
          });
        } else {
        toast({
          title: "Password Reset Failed",
          description: error.message,
          variant: "destructive",
        });
        }
      } else {
        toast({
          title: "Password Reset Email Sent",
          description: "Please check your email for password reset instructions.",
        });
      }

      return { error };
    } catch (error) {
      toast({
        title: "Password Reset Failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      return { error };
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    try {
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "You must be logged in to change your password.",
          variant: "destructive",
        });
        return { error: new Error("User not authenticated") };
      }

      // First verify current password
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPassword,
      });

      if (signInError) {
        toast({
          title: "Current Password Incorrect",
          description: "Please enter your current password correctly.",
          variant: "destructive",
        });
        return { error: signInError };
      }

      // Update password
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        toast({
          title: "Password Change Failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Password Changed Successfully",
          description: "Your password has been updated. You will be signed out for security.",
        });
        
        // Sign out user after password change for security
        setTimeout(() => {
          signOut();
        }, 2000);
      }

      return { error };
    } catch (error) {
      toast({
        title: "Password Change Failed",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
      return { error };
    }
  };

  // Social Authentication Methods
  const signInWithGoogle = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) {
        toast({
          title: "Google Sign In Failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Redirecting to Google",
          description: "Please complete the sign-in process with Google.",
        });
      }

      return { data, error };
    } catch (error) {
      toast({
        title: "Google Sign In Failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      return { error };
    }
  };

  const signInWithFacebook = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'facebook',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        toast({
          title: "Facebook Sign In Failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Redirecting to Facebook",
          description: "Please complete the sign-in process with Facebook.",
        });
      }

      return { data, error };
    } catch (error) {
      toast({
        title: "Facebook Sign In Failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      return { error };
    }
  };

  const signInWithWhatsApp = async () => {
    try {
      // WhatsApp Business API integration would require additional setup
      // For now, we'll show a message about WhatsApp integration
      toast({
        title: "WhatsApp Sign In",
        description: "WhatsApp authentication is coming soon. Please use email or other social options for now.",
        variant: "default",
      });
      
      return { error: new Error("WhatsApp authentication not yet implemented") };
    } catch (error) {
      toast({
        title: "WhatsApp Sign In Failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      return { error };
    }
  };

  const handleSocialAuthCallback = async (provider) => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error) {
        console.error('Error getting user after social auth:', error);
        toast({
          title: "Authentication Failed",
          description: error.message,
          variant: "destructive",
        });
        return { error };
      }

      if (user) {
        // Extract user names from Google metadata
        const firstName = user.user_metadata?.given_name || user.user_metadata?.first_name || '';
        const lastName = user.user_metadata?.family_name || user.user_metadata?.last_name || '';
        const fullName = user.user_metadata?.full_name || user.user_metadata?.name || '';
        
        // Update user profile with social auth data and names
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            first_name: firstName || fullName.split(' ')[0] || '',
            last_name: lastName || fullName.split(' ').slice(1).join(' ') || '',
            social_provider: provider,
            social_id: user.user_metadata?.sub || user.id,
            avatar_url: user.user_metadata?.picture || user.user_metadata?.avatar_url,
            email_verified: true,
            last_social_login: new Date().toISOString(),
            is_activated: true // Auto-activate social auth users
          })
          .eq('id', user.id);

        if (profileError) {
          console.error('Error updating profile with social auth data:', profileError);
          // Don't fail the auth process for profile update errors
          // The trigger should have already handled the initial setup
        }

        // Ensure user has a role assigned
        const { error: roleError } = await supabase
          .from('user_roles')
          .upsert({
            user_id: user.id,
            role: 'member',
            is_active: true
          }, {
            onConflict: 'user_id,role'
          });

        if (roleError) {
          console.error('Error ensuring user role:', roleError);
          // Don't fail the auth process for role assignment errors
        }

        toast({
          title: "Social Login Successful",
          description: `Welcome back! You've signed in with ${provider}.`,
        });

        return { user, error: null };
      }

      return { error: 'No user found after social authentication' };
    } catch (error) {
      console.error('Error in handleSocialAuthCallback:', error);
      toast({
        title: "Authentication Failed",
        description: "An unexpected error occurred during social authentication.",
        variant: "destructive",
      });
      return { error };
    }
  };

  // User Invitation Methods
  const inviteUser = async (email, role, firstName, lastName, additionalData = {}) => {
    try {
      // Check if user already exists
      const { data: existingUser, error: checkError } = await supabase
        .from('profiles')
        .select('id, email')
        .eq('email', email)
        .single();

      if (existingUser) {
        toast({
          title: "User Already Exists",
          description: "A user with this email address already exists in the system.",
          variant: "destructive",
        });
        return { error: new Error("User already exists") };
      }

      // Generate invitation token
      const invitationToken = crypto.randomUUID();

      // Create invitation record
      const { data: invitation, error: invitationError } = await supabase
        .from('user_invitations')
        .insert({
          email,
          role,
          first_name: firstName,
          last_name: lastName,
          invited_by: user?.id,
          status: 'pending',
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
          additional_data: {
            ...additionalData,
            token: invitationToken
          }
        })
        .select()
        .single();

      if (invitationError) {
        console.error('Error creating invitation:', invitationError);
        toast({
          title: "Invitation Failed",
          description: invitationError.message,
          variant: "destructive",
        });
        return { error: invitationError };
      }

      // Generate invitation URL
      const invitationUrl = `${window.location.origin}/invitation/accept?id=${invitation.id}&token=${invitationToken}`;

      // Send invitation email (this would typically be handled by your email service)
      // For now, we'll show the invitation URL in the success message
      toast({
        title: "Invitation Created",
        description: `Invitation created for ${email}. Invitation URL: ${invitationUrl}`,
      });

      return { data: { ...invitation, invitationUrl }, error: null };
    } catch (error) {
      console.error('Error in inviteUser:', error);
      toast({
        title: "Invitation Failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      return { error };
    }
  };

  const getInvitations = async () => {
    try {
      const { data, error } = await supabase
        .from('user_invitations')
        .select(`
          *,
          invited_by_user:profiles!user_invitations_invited_by_fkey(
            first_name,
            last_name,
            email
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching invitations:', error);
        return { data: [], error };
      }

      return { data, error: null };
    } catch (error) {
      console.error('Error in getInvitations:', error);
      return { data: [], error };
    }
  };

  const cancelInvitation = async (invitationId) => {
    try {
      const { error } = await supabase
        .from('user_invitations')
        .update({ status: 'cancelled' })
        .eq('id', invitationId);

      if (error) {
        console.error('Error cancelling invitation:', error);
        toast({
          title: "Cancellation Failed",
          description: error.message,
          variant: "destructive",
        });
        return { error };
      }

      toast({
        title: "Invitation Cancelled",
        description: "The invitation has been cancelled successfully.",
      });

      return { error: null };
    } catch (error) {
      console.error('Error in cancelInvitation:', error);
      toast({
        title: "Cancellation Failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      return { error };
    }
  };

  const resendInvitation = async (invitationId) => {
    try {
      // Update expiration date
      const { error } = await supabase
        .from('user_invitations')
        .update({
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'pending'
        })
        .eq('id', invitationId);

      if (error) {
        console.error('Error resending invitation:', error);
        toast({
          title: "Resend Failed",
          description: error.message,
          variant: "destructive",
        });
        return { error };
      }

      toast({
        title: "Invitation Resent",
        description: "The invitation has been resent successfully.",
      });

      return { error: null };
    } catch (error) {
      console.error('Error in resendInvitation:', error);
      toast({
        title: "Resend Failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      return { error };
    }
  };

  // Check if email exists in database
  const checkEmailExists = async (email) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, email, is_activated')
        .eq('email', email.toLowerCase())
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
        console.error('Error checking email existence:', error);
        return { exists: false, error: 'Database error' };
      }

      return { 
        exists: !!data, 
        user: data,
        error: null 
      };
    } catch (error) {
      console.error('Error in checkEmailExists:', error);
      return { exists: false, error: 'Unexpected error' };
    }
  };

  const checkPhoneExists = async (phone) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, phone, is_activated')
        .eq('phone', phone)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
        console.error('Error checking phone existence:', error);
        return { exists: false, error: 'Database error' };
      }

      return { 
        exists: !!data, 
        user: data,
        error: null 
      };
    } catch (error) {
      console.error('Error in checkPhoneExists:', error);
      return { exists: false, error: 'Unexpected error' };
    }
  };

  // Magic Link Authentication Methods
  const sendMagicLink = async (email) => {
    console.log('🔍 Validating email:', email);
    const { data: validationData, error: validationError } = await supabase
      .rpc('send_validated_magic_link', {
        email_address: email,
        allow_signup: false
      });
    console.log('📊 Validation result:', validationData);
    console.log('❌ Validation error:', validationError);
    if (validationError) {
      console.error('Validation error:', validationError);
      toast({ title: "Validation Failed", description: "Unable to validate email address", variant: "destructive" });
      return { error: validationError };
    }
    if (!validationData.success) {
      console.log('🚫 Validation failed, not sending email');
      toast({ title: "Magic Link Failed", description: validationData.message, variant: "destructive" });
      return { error: { message: validationData.message } };
    }
    console.log('✅ Validation passed, sending magic link');
    const redirectUrl = `${window.location.origin}/auth/callback`;
    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: redirectUrl, shouldCreateUser: false }
    });
    if (error) {
      toast({ title: "Magic Link Failed", description: error.message, variant: "destructive" });
      return { error };
    }
    toast({ title: "Magic Link Sent", description: "Check your email for a secure login link." });
    return { data, error: null };
  };

  const send2FACode = async (email, method = 'email') => {
    try {
      console.log('AuthContext: Sending 2FA code to:', email, 'method:', method);
      
      // Get user profile to check available methods and get phone number
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('first_name, last_name, phone, email')
        .eq('email', email)
        .single();

      if (profileError) {
        console.error('AuthContext: Error fetching user profile:', profileError);
        toast({
          title: "Profile Error",
          description: "Failed to load user profile.",
          variant: "destructive",
        });
        return { error: profileError };
      }

      // Check if the requested method is available
      if (method === 'sms' && !profileData.phone) {
        toast({
          title: "SMS Not Available",
          description: "No phone number found for this user. Please use email verification.",
          variant: "destructive",
        });
        return { error: new Error('No phone number available') };
      }

      // Generate a 2FA code directly (temporary solution while database functions are being fixed)
      const generateCode = () => {
        return Math.floor(100000 + Math.random() * 900000).toString();
      };
      
      // Check if there's already a valid code for this user
      const existingCode = twoFactorCodes.get(email);
      let codeData;
      
      if (existingCode && Date.now() < existingCode.expiresAt) {
        console.log('AuthContext v2: Using existing code:', existingCode.code);
        codeData = {
          success: true,
          code: existingCode.code,
          message: '2FA code already exists'
        };
      } else {
        const generatedCode = generateCode();
        
        // Store the code temporarily (expires in 10 minutes)
        twoFactorCodes.set(email, {
          code: generatedCode,
          expiresAt: Date.now() + (10 * 60 * 1000), // 10 minutes
          method: method
        });
        
        codeData = {
          success: true,
          code: generatedCode,
          message: '2FA code generated successfully'
        };
      }
      
              console.log('AuthContext v2: Generated 2FA code:', codeData.code);
        console.log('AuthContext v2: Stored code for email:', email, 'data:', twoFactorCodes.get(email));

      const userName = profileData ? 
        `${profileData.first_name} ${profileData.last_name}`.trim() : 
        email.split('@')[0];

      // Send code via the selected method
      console.log('AuthContext v2: Sending code via', method, 'code:', codeData.code);
      
      if (method === 'email') {
        const emailResult = await send2FAVerificationEmail(email, codeData.code, userName);
        if (!emailResult.success) {
          toast({
            title: "2FA Email Failed",
            description: emailResult.error,
            variant: "destructive",
          });
          return { error: new Error(emailResult.error) };
        }
      } else if (method === 'sms') {
        const smsResult = await send2FAVerificationSMS(profileData.phone, codeData.code, userName);
        if (!smsResult.success) {
          toast({
            title: "2FA SMS Failed",
            description: smsResult.error,
            variant: "destructive",
          });
          return { error: new Error(smsResult.error) };
        }
      }

      console.log('AuthContext: 2FA code sent successfully via', method);
      toast({
        title: "2FA Code Sent",
        description: method === 'email' ? "Check your email for the verification code." : "Check your phone for the SMS code.",
      });
      return { success: true };
    } catch (error) {
      console.error('AuthContext: Error sending 2FA code:', error);
      toast({
        title: "2FA Code Failed",
        description: "Failed to send verification code.",
        variant: "destructive",
      });
      return { error };
    }
  };

    const verify2FACode = async (email, code, method = 'email') => {
    try {
      console.log('AuthContext v2: Verifying 2FA code for:', email, 'code:', code, 'method:', method);
      console.log('AuthContext v2: Current stored codes:', Array.from(twoFactorCodes.entries()));
      
      // Check against stored codes
      const storedCodeData = twoFactorCodes.get(email);
      
      if (!storedCodeData) {
        console.error('AuthContext: No 2FA code found for user');
        toast({
          title: "2FA Verification Failed",
          description: "No verification code found. Please request a new code.",
          variant: "destructive",
        });
        return { error: new Error('No verification code found') };
      }
      
      // Check if code has expired
      if (Date.now() > storedCodeData.expiresAt) {
        twoFactorCodes.delete(email); // Clean up expired code
        console.error('AuthContext: 2FA code has expired');
        toast({
          title: "2FA Verification Failed",
          description: "Verification code has expired. Please request a new code.",
          variant: "destructive",
        });
        return { error: new Error('Verification code has expired') };
      }
      
      // Check if code matches
      console.log('AuthContext v2: Comparing codes - entered:', code, 'stored:', storedCodeData.code, 'match:', code === storedCodeData.code);
      
      if (code === storedCodeData.code) {
        // Remove the code after successful verification
        twoFactorCodes.delete(email);
        
        console.log('AuthContext v2: 2FA verification successful');
        toast({
          title: "2FA Verification Successful",
          description: "Welcome to Living Rock Church Management System!",
        });
        return { 
          data: {
            success: true,
            message: '2FA verification successful'
          }
        };
      } else {
        console.error('AuthContext v2: Invalid 2FA code - entered:', code, 'expected:', storedCodeData.code);
        toast({
          title: "2FA Verification Failed",
          description: "Invalid verification code. Please try again.",
          variant: "destructive",
        });
        return { error: new Error('Invalid verification code') };
      }
    } catch (error) {
      console.error('AuthContext: Unexpected error verifying 2FA code:', error);
      toast({
        title: "2FA Verification Failed",
        description: "Failed to verify code.",
        variant: "destructive",
      });
      return { error };
    }
  };

  const enable2FA = async (email, method = 'email') => {
    try {
      console.log('AuthContext: Enabling 2FA for:', email, 'method:', method);
      
      const { data, error } = await supabase.rpc('enable_2fa_for_user', {
        user_email: email,
        method: method
        });
        
        if (error) {
        console.error('AuthContext: Error enabling 2FA:', error);
        toast({
          title: "2FA Enable Failed",
          description: error.message,
          variant: "destructive",
        });
          return { error };
        }
        
      if (!data.success) {
        console.error('AuthContext: 2FA enable failed:', data.message);
        toast({
          title: "2FA Enable Failed",
          description: data.message,
          variant: "destructive",
        });
        return { error: new Error(data.message) };
      }

      console.log('AuthContext: 2FA enabled successfully');
      toast({
        title: "2FA Enabled",
        description: "Two-factor authentication has been enabled successfully.",
      });
      return { data };
    } catch (error) {
      console.error('AuthContext: Unexpected error enabling 2FA:', error);
      toast({
        title: "2FA Enable Failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      return { error };
    }
  };

  const disable2FA = async (email) => {
    try {
      console.log('AuthContext: Disabling 2FA for:', email);
      
      const { data, error } = await supabase.rpc('disable_2fa_for_user', {
        user_email: email
        });
        
        if (error) {
        console.error('AuthContext: Error disabling 2FA:', error);
        toast({
          title: "2FA Disable Failed",
          description: error.message,
          variant: "destructive",
        });
          return { error };
        }
        
      if (!data.success) {
        console.error('AuthContext: 2FA disable failed:', data.message);
        toast({
          title: "2FA Disable Failed",
          description: data.message,
          variant: "destructive",
        });
        return { error: new Error(data.message) };
      }

      console.log('AuthContext: 2FA disabled successfully');
      toast({
        title: "2FA Disabled",
        description: "Two-factor authentication has been disabled successfully.",
      });
      return { data };
    } catch (error) {
      console.error('AuthContext: Unexpected error disabling 2FA:', error);
      toast({
        title: "2FA Disable Failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      return { error };
    }
  };

  const get2FAStatus = async (email) => {
    try {
      console.log('AuthContext: Getting 2FA status for:', email);
      
      const { data, error } = await supabase.rpc('get_2fa_status', {
        user_email: email
        });
        
        if (error) {
        console.error('AuthContext: Error getting 2FA status:', error);
          return { error };
        }
        
      if (!data.success) {
        console.error('AuthContext: Get 2FA status failed:', data.message);
        return { error: new Error(data.message) };
      }

      console.log('AuthContext: 2FA status retrieved successfully');
      return { data };
    } catch (error) {
      console.error('AuthContext: Unexpected error getting 2FA status:', error);
      return { error };
    }
  };

  const get2FASystemStats = async () => {
    try {
      const { data, error } = await supabase.rpc('get_2fa_system_stats');
      
      if (error) {
        console.error('AuthContext: Error getting 2FA system stats:', error);
        return { error };
      }

      return { data };
    } catch (error) {
      console.error('AuthContext: Error getting 2FA system stats:', error);
      return { error };
    }
  };

  const signInWithMagicLink = async (email) => {
    try {
      // For signup, we can skip validation or do a basic check
      const { data: validationData, error: validationError } = await supabase
        .rpc('send_validated_magic_link', {
          email_address: email,
          allow_signup: true
        });

      if (validationError) {
        console.error('Validation error:', validationError);
        // For signup, we can still proceed even if validation fails
      }

      const redirectUrl = `${window.location.origin}/auth/callback`;
      const { data, error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: redirectUrl,
          shouldCreateUser: true, // Allow new user creation
        }
      });

      if (error) {
        toast({
          title: "Magic Link Failed",
          description: error.message,
          variant: "destructive",
        });
        return { error };
      }

      toast({
        title: "Magic Link Sent",
        description: "Check your email for a secure login link.",
      });

      return { data, error: null };
    } catch (error) {
      console.error('Error in signInWithMagicLink:', error);
      toast({
        title: "Magic Link Failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      return { error };
    }
  };

  // Change Email Address Methods
  const changeEmailAddress = async (newEmail) => {
    try {
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please log in to change your email address.",
          variant: "destructive",
        });
        return { error: "User not authenticated" };
      }

      // Check if new email already exists
      const { data: existingUser, error: checkError } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', newEmail)
        .single();

      if (existingUser) {
        toast({
          title: "Email Already Exists",
          description: "This email address is already registered.",
          variant: "destructive",
        });
        return { error: "Email already exists" };
      }

      // Generate confirmation token
      const confirmationToken = crypto.randomUUID();
      const confirmationUrl = `${window.location.origin}/auth/confirm-email-change?token=${confirmationToken}&new_email=${encodeURIComponent(newEmail)}`;

      // Store email change request in database
      const { error: dbError } = await supabase
        .from('email_change_requests')
        .insert({
          user_id: user.id,
          old_email: user.email,
          new_email: newEmail,
          confirmation_token: confirmationToken,
          expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
          status: 'pending'
        });

      if (dbError) {
        console.error('Error storing email change request:', dbError);
        toast({
          title: "Email Change Failed",
          description: "An error occurred while processing your request.",
          variant: "destructive",
        });
        return { error: dbError };
      }

      // Send confirmation email
      const { error: emailError } = await sendChangeEmailConfirmation(
        user.email,
        newEmail,
        confirmationUrl,
        user.user_metadata?.full_name || user.email.split('@')[0]
      );

      if (emailError) {
        console.error('Error sending confirmation email:', emailError);
        toast({
          title: "Email Change Failed",
          description: "Failed to send confirmation email.",
          variant: "destructive",
        });
        return { error: emailError };
      }

      toast({
        title: "Confirmation Email Sent",
        description: "Please check your new email address for confirmation.",
      });

      return { error: null };
    } catch (error) {
      console.error('Error in changeEmailAddress:', error);
      toast({
        title: "Email Change Failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      return { error };
    }
  };

  // Reauthentication Methods
  const requireReauthentication = async (actionType) => {
    try {
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please log in to perform this action.",
          variant: "destructive",
        });
        return { error: "User not authenticated" };
      }

      // Generate reauthentication token
      const reauthToken = crypto.randomUUID();
      const confirmationUrl = `${window.location.origin}/auth/reauthenticate?token=${reauthToken}&action=${encodeURIComponent(actionType)}`;

      // Store reauthentication request in database
      const { error: dbError } = await supabase
        .from('reauthentication_requests')
        .insert({
          user_id: user.id,
          action_type: actionType,
          reauth_token: reauthToken,
          expires_at: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 minutes
          status: 'pending',
          ip_address: 'Unknown', // In production, get from request
          device_info: 'Unknown' // In production, get from request
        });

      if (dbError) {
        console.error('Error storing reauthentication request:', dbError);
        toast({
          title: "Reauthentication Failed",
          description: "An error occurred while processing your request.",
          variant: "destructive",
        });
        return { error: dbError };
      }

      // Send reauthentication email
      const { error: emailError } = await sendReauthenticationEmail(
        user.email,
        confirmationUrl,
        user.user_metadata?.full_name || user.email.split('@')[0],
        actionType,
        'Unknown', // IP address
        'Unknown'  // Device info
      );

      if (emailError) {
        console.error('Error sending reauthentication email:', emailError);
        toast({
          title: "Reauthentication Failed",
          description: "Failed to send verification email.",
          variant: "destructive",
        });
        return { error: emailError };
      }

      toast({
        title: "Verification Email Sent",
        description: "Please check your email to verify your identity.",
      });

      return { error: null };
    } catch (error) {
      console.error('Error in requireReauthentication:', error);
      toast({
        title: "Reauthentication Failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      return { error };
    }
  };

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    changePassword,
    getUserRole,
    getDashboardRoute,
    checkUserActivation,
    signInWithGoogle,
    signInWithFacebook,
    signInWithWhatsApp,
    handleSocialAuthCallback,
    inviteUser,
    getInvitations,
    cancelInvitation,
    resendInvitation,
    sendMagicLink,
    signInWithMagicLink,
    changeEmailAddress,
    requireReauthentication,
    checkEmailExists,
    checkPhoneExists,
    send2FACode,
    verify2FACode,
    enable2FA,
    disable2FA,
    get2FAStatus,
    get2FASystemStats,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
