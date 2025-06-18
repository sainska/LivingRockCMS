
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export type UserRole = "system_admin" | "treasurer" | "secretary" | "clergy" | "member";

export const useUserRole = () => {
  const { user } = useAuth();
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (!user) {
        setRole(null);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .eq('is_active', true)
          .order('role')
          .limit(1);

        if (error) {
          console.error('Error fetching user role:', error);
          setRole('member'); // Default to member role
        } else if (data && data.length > 0) {
          setRole(data[0].role as UserRole);
        } else {
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
