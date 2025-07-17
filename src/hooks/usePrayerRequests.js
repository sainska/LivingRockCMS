
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const usePrayerRequests = () => {
  const [prayerRequests, setPrayerRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPrayerRequests = async () => {
      try {
        const { data, error } = await supabase
          .from('prayer_requests')
          .select(`
            *,
            profiles!prayer_requests_requester_id_fkey (
              first_name,
              last_name
            )
          `)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setPrayerRequests(data || []);
      } catch (err) {
        console.error('Error fetching prayer requests:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPrayerRequests();

    // Real-time subscription
    const subscription = supabase
      .channel('prayer-requests-realtime')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'prayer_requests' },
        () => fetchPrayerRequests()
      )
      .subscribe();

    return () => supabase.removeChannel(subscription);
  }, []);

  return { prayerRequests, loading, error };
};
