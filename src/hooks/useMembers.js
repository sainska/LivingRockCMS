
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useMembers = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select(`
            *,
            households (
              name,
              address
            ),
            user_roles (
              role
            )
          `)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setMembers(data || []);
      } catch (err) {
        console.error('Error fetching members:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();

    // Real-time subscription
    const subscription = supabase
      .channel('members-realtime')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'profiles' },
        () => fetchMembers()
      )
      .subscribe();

    return () => supabase.removeChannel(subscription);
  }, []);

  return { members, loading, error };
};
