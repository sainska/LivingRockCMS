
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useMinistries = () => {
  const [ministries, setMinistries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMinistries = async () => {
      try {
        const { data, error } = await supabase
          .from('ministries')
          .select(`
            *,
            leader:profiles!ministries_leader_id_fkey (
              first_name,
              last_name
            ),
            co_leader:profiles!ministries_co_leader_id_fkey (
              first_name,
              last_name
            )
          `)
          .eq('is_active', true)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setMinistries(data || []);
      } catch (err) {
        console.error('Error fetching ministries:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMinistries();

    // Real-time subscription
    const subscription = supabase
      .channel('ministries-realtime')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'ministries' },
        () => fetchMinistries()
      )
      .subscribe();

    return () => supabase.removeChannel(subscription);
  }, []);

  return { ministries, loading, error };
};
