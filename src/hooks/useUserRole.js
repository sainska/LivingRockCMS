import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export const useUserRole = () => {
  const { user } = useAuth();
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserRole = async () => {
      console.log('useUserRole: Fetching role for user:', user?.id);
      
      if (!user) {
        console.log('useUserRole: No user, setting role to null');
        setRole(null);
        setLoading(false);
        return;
      }

      try {
        console.log('useUserRole: Querying user_roles table...');
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .eq('is_active', true)
          .order('role')
          .limit(1);

        console.log('useUserRole: Query result:', { data, error });

        if (error) {
          console.error('Error fetching user role:', error);
          setRole('member'); // Default to member role
        } else if (data && data.length > 0) {
          console.log('useUserRole: Setting role to:', data[0].role);
          setRole(data[0].role);
        } else {
          console.log('useUserRole: No role found, defaulting to member');
          setRole('member'); // Default to member role if no role found
        }
      } catch (error) {
        console.error('Error fetching user role:', error);
        setRole('member'); // Default to member role
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
  }, [user]);

  return { role, loading };
};
