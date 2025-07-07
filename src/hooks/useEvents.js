
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export const useEvents = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) return;

    const fetchEvents = async () => {
      try {
        console.log('Fetching events...');
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .order('start_date', { ascending: true });

        if (error) {
          console.error('Error fetching events:', error);
          setError(error.message);
        } else {
          setEvents(data || []);
        }
      } catch (err) {
        console.error('Error in fetchEvents:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [user]);

  const addEvent = async (eventData) => {
    try {
      const { data, error } = await supabase
        .from('events')
        .insert([{
          ...eventData,
          created_by: user.id
        }])
        .select()
        .single();

      if (error) throw error;

      setEvents(prev => [...prev, data]);
      return { data, error: null };
    } catch (error) {
      console.error('Error adding event:', error);
      return { data: null, error };
    }
  };

  return {
    events,
    loading,
    error,
    addEvent
  };
};
