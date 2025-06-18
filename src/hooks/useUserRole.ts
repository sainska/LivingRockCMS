import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type UserRole = Database['public']['Enums']['user_role'];

interface UseUserRoleReturn {
  userRole: UserRole | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useUserRole = (): UseUserRoleReturn => {
  const { user } = useAuth();
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserRole = async () => {
    if (!user) {
      setUserRole(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .single();

      if (error) {
        throw error;
      }

      setUserRole(data?.role || null);
    } catch (err: any) {
      console.error('Error fetching user role:', err);
      setError(err.message || 'Failed to fetch user role');
      setUserRole(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserRole();
  }, [user]);

  return {
    userRole,
    loading,
    error,
    refetch: fetchUserRole,
  };
}; 