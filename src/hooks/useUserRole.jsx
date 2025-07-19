
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export const useUserRole = () => {
  const { user } = useAuth();
  const [role, setRole] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      console.log('useUserRole: Fetching user data for:', user?.id);
      
      if (!user) {
        console.log('useUserRole: No user, setting role to null');
        setRole(null);
        setProfile(null);
        setLoading(false);
        return;
      }

      try {
        // First, get user profile
        console.log('useUserRole: Fetching profile...');
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profileError) {
          console.error('Error fetching profile:', profileError);
        } else {
          console.log('useUserRole: Profile data:', profileData);
          setProfile(profileData);
        }

        // Then get user role using the database function
        console.log('useUserRole: Fetching user role...');
        const { data: roleData, error: roleError } = await supabase
          .rpc('get_user_role', { user_uuid: user.id });

        console.log('useUserRole: Role RPC result:', { roleData, roleError });

        if (roleError) {
          console.error('Error fetching user role:', roleError);
          setRole('member'); // Default to member role
        } else {
          console.log('useUserRole: Setting role to:', roleData);
          setRole(roleData || 'member');
        }
      } catch (error) {
        console.error('Error in fetchUserData:', error);
        setRole('member'); // Default to member role
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  return { role, profile, loading };
};
