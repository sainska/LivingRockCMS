import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useUserInvitations = () => {
  const [invitations, setInvitations] = useState([]);
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingStats, setIsLoadingStats] = useState(false);
  const { toast } = useToast();

  // Load all invitations
  const loadInvitations = async () => {
    setIsLoading(true);
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
        toast({
          title: "Error Loading Invitations",
          description: error.message,
          variant: "destructive",
        });
        return { data: [], error };
      }

      setInvitations(data || []);
      return { data: data || [], error: null };
    } catch (error) {
      console.error('Error in loadInvitations:', error);
      return { data: [], error };
    } finally {
      setIsLoading(false);
    }
  };

  // Load invitation statistics
  const loadInvitationStats = async () => {
    setIsLoadingStats(true);
    try {
      const { data, error } = await supabase
        .rpc('get_invitation_stats');

      if (error) {
        console.error('Error fetching invitation stats:', error);
        return { data: null, error };
      }

      setStats(data[0] || null);
      return { data: data[0] || null, error: null };
    } catch (error) {
      console.error('Error in loadInvitationStats:', error);
      return { data: null, error };
    } finally {
      setIsLoadingStats(false);
    }
  };

  // Get invitation analytics
  const getInvitationAnalytics = async (days = 30) => {
    try {
      const { data, error } = await supabase
        .from('invitation_analytics')
        .select('*')
        .gte('invitation_date', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString())
        .order('invitation_date', { ascending: false });

      if (error) {
        console.error('Error fetching invitation analytics:', error);
        return { data: [], error };
      }

      return { data: data || [], error: null };
    } catch (error) {
      console.error('Error in getInvitationAnalytics:', error);
      return { data: [], error };
    }
  };

  // Create new invitation
  const createInvitation = async (invitationData) => {
    try {
      const { data, error } = await supabase
        .from('user_invitations')
        .insert({
          email: invitationData.email,
          first_name: invitationData.firstName,
          last_name: invitationData.lastName,
          role: invitationData.role,
          invited_by: invitationData.invitedBy,
          status: 'pending',
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
          additional_data: invitationData.additionalData || {}
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating invitation:', error);
        toast({
          title: "Invitation Failed",
          description: error.message,
          variant: "destructive",
        });
        return { data: null, error };
      }

      // Reload invitations and stats
      await loadInvitations();
      await loadInvitationStats();

      toast({
        title: "Invitation Sent",
        description: `Invitation sent to ${invitationData.email}`,
      });

      return { data, error: null };
    } catch (error) {
      console.error('Error in createInvitation:', error);
      toast({
        title: "Invitation Failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      return { data: null, error };
    }
  };

  // Cancel invitation
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

      // Reload invitations and stats
      await loadInvitations();
      await loadInvitationStats();

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

  // Resend invitation
  const resendInvitation = async (invitationId) => {
    try {
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

      // Reload invitations
      await loadInvitations();

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

  // Expire old invitations
  const expireOldInvitations = async () => {
    try {
      const { error } = await supabase
        .rpc('expire_old_invitations');

      if (error) {
        console.error('Error expiring invitations:', error);
        return { error };
      }

      // Reload invitations and stats
      await loadInvitations();
      await loadInvitationStats();

      return { error: null };
    } catch (error) {
      console.error('Error in expireOldInvitations:', error);
      return { error };
    }
  };

  // Get invitation by ID
  const getInvitationById = async (invitationId) => {
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
        .eq('id', invitationId)
        .single();

      if (error) {
        console.error('Error fetching invitation:', error);
        return { data: null, error };
      }

      return { data, error: null };
    } catch (error) {
      console.error('Error in getInvitationById:', error);
      return { data: null, error };
    }
  };

  // Get invitations by status
  const getInvitationsByStatus = (status) => {
    return invitations.filter(invitation => invitation.status === status);
  };

  // Get pending invitations
  const getPendingInvitations = () => {
    return getInvitationsByStatus('pending');
  };

  // Get accepted invitations
  const getAcceptedInvitations = () => {
    return getInvitationsByStatus('accepted');
  };

  // Get cancelled invitations
  const getCancelledInvitations = () => {
    return getInvitationsByStatus('cancelled');
  };

  // Get expired invitations
  const getExpiredInvitations = () => {
    return getInvitationsByStatus('expired');
  };

  // Check if invitation is expired
  const isInvitationExpired = (invitation) => {
    return new Date(invitation.expires_at) < new Date();
  };

  // Format invitation date
  const formatInvitationDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get role label
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

  // Get status badge variant
  const getStatusBadgeVariant = (status, expiresAt) => {
    const isExpired = new Date(expiresAt) < new Date();
    
    if (status === 'accepted') return 'default';
    if (status === 'cancelled') return 'destructive';
    if (status === 'expired' || isExpired) return 'secondary';
    return 'outline';
  };

  // Load initial data
  useEffect(() => {
    loadInvitations();
    loadInvitationStats();
  }, []);

  return {
    // State
    invitations,
    stats,
    isLoading,
    isLoadingStats,

    // Actions
    loadInvitations,
    loadInvitationStats,
    createInvitation,
    cancelInvitation,
    resendInvitation,
    expireOldInvitations,
    getInvitationById,
    getInvitationAnalytics,

    // Filtered data
    getInvitationsByStatus,
    getPendingInvitations,
    getAcceptedInvitations,
    getCancelledInvitations,
    getExpiredInvitations,

    // Utilities
    isInvitationExpired,
    formatInvitationDate,
    getRoleLabel,
    getStatusBadgeVariant,
  };
}; 