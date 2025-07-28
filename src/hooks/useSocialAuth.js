import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useSocialAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [socialUser, setSocialUser] = useState(null);
  const { toast } = useToast();

  // Get social authentication statistics
  const getSocialAuthStats = async () => {
    try {
      const { data, error } = await supabase
        .rpc('get_social_auth_stats');

      if (error) {
        console.error('Error fetching social auth stats:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in getSocialAuthStats:', error);
      return null;
    }
  };

  // Check if user has social authentication
  const hasSocialAuth = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('social_provider, social_id, avatar_url')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error checking social auth:', error);
        return false;
      }

      return data.social_provider !== null;
    } catch (error) {
      console.error('Error in hasSocialAuth:', error);
      return false;
    }
  };

  // Get user's social profile information
  const getSocialProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          social_provider,
          social_id,
          avatar_url,
          email_verified,
          last_social_login,
          first_name,
          last_name,
          email
        `)
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching social profile:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in getSocialProfile:', error);
      return null;
    }
  };

  // Update social profile information
  const updateSocialProfile = async (userId, updates) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();

      if (error) {
        console.error('Error updating social profile:', error);
        toast({
          title: "Profile Update Failed",
          description: error.message,
          variant: "destructive",
        });
        return { error };
      }

      toast({
        title: "Profile Updated",
        description: "Your social profile has been updated successfully.",
      });

      return { data, error: null };
    } catch (error) {
      console.error('Error in updateSocialProfile:', error);
      toast({
        title: "Profile Update Failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      return { error };
    }
  };

  // Disconnect social account
  const disconnectSocialAccount = async (userId) => {
    try {
      setIsLoading(true);

      const { error } = await supabase
        .from('profiles')
        .update({
          social_provider: null,
          social_id: null,
          avatar_url: null,
        })
        .eq('id', userId);

      if (error) {
        console.error('Error disconnecting social account:', error);
        toast({
          title: "Disconnect Failed",
          description: error.message,
          variant: "destructive",
        });
        return { error };
      }

      toast({
        title: "Account Disconnected",
        description: "Your social account has been disconnected successfully.",
      });

      return { error: null };
    } catch (error) {
      console.error('Error in disconnectSocialAccount:', error);
      toast({
        title: "Disconnect Failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      return { error };
    } finally {
      setIsLoading(false);
    }
  };

  // Link additional social account
  const linkSocialAccount = async (provider) => {
    try {
      setIsLoading(true);

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback?action=link&provider=${provider}`,
        },
      });

      if (error) {
        toast({
          title: "Link Failed",
          description: error.message,
          variant: "destructive",
        });
        return { error };
      }

      toast({
        title: "Linking Account",
        description: `Please complete the ${provider} authentication to link your account.`,
      });

      return { data, error: null };
    } catch (error) {
      console.error('Error in linkSocialAccount:', error);
      toast({
        title: "Link Failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      return { error };
    } finally {
      setIsLoading(false);
    }
  };

  // Get available social providers
  const getAvailableProviders = () => {
    return [
      {
        id: 'google',
        name: 'Google',
        icon: 'FcGoogle',
        color: 'bg-white text-gray-700 border-gray-300',
        hoverColor: 'hover:bg-gray-50',
      },
      {
        id: 'facebook',
        name: 'Facebook',
        icon: 'FaFacebook',
        color: 'bg-blue-600 text-white border-blue-600',
        hoverColor: 'hover:bg-blue-700',
      },
      {
        id: 'whatsapp',
        name: 'WhatsApp',
        icon: 'FaWhatsapp',
        color: 'bg-green-600 text-white border-green-600',
        hoverColor: 'hover:bg-green-700',
        disabled: true, // Currently not implemented
      },
    ];
  };

  // Check if social provider is enabled
  const isProviderEnabled = (provider) => {
    // This would typically check against your Supabase configuration
    // For now, we'll return true for Google and Facebook, false for WhatsApp
    const enabledProviders = ['google', 'facebook'];
    return enabledProviders.includes(provider);
  };

  // Get social authentication analytics
  const getAnalytics = async () => {
    try {
      const stats = await getSocialAuthStats();
      if (!stats) return null;

      return {
        totalSocialUsers: stats.reduce((sum, provider) => sum + provider.total_users, 0),
        providers: stats,
        mostPopularProvider: stats.reduce((prev, current) => 
          (prev.total_users > current.total_users) ? prev : current
        ),
      };
    } catch (error) {
      console.error('Error getting analytics:', error);
      return null;
    }
  };

  return {
    isLoading,
    socialUser,
    getSocialAuthStats,
    hasSocialAuth,
    getSocialProfile,
    updateSocialProfile,
    disconnectSocialAccount,
    linkSocialAccount,
    getAvailableProviders,
    isProviderEnabled,
    getAnalytics,
  };
}; 