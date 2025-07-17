
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data, error } = await supabase
          .from('events')
          .select(`
            *,
            profiles!events_created_by_fkey (
              first_name,
              last_name
            )
          `)
          .order('start_date', { ascending: true });

        if (error) throw error;
        setEvents(data || []);
      } catch (err) {
        console.error('Error fetching events:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();

    // Real-time subscription
    const subscription = supabase
      .channel('events-realtime')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'events' },
        () => fetchEvents()
      )
      .subscribe();

    return () => supabase.removeChannel(subscription);
  }, []);

  return { events, loading, error };
};
