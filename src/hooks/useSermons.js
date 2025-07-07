
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export const useSermons = () => {
  const { user } = useAuth();
  const [sermons, setSermons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) return;

    const fetchSermons = async () => {
      try {
        console.log('Fetching sermons...');
        const { data, error } = await supabase
          .from('sermons')
          .select('*')
          .order('date_preached', { ascending: false });

        if (error) {
          console.error('Error fetching sermons:', error);
          setError(error.message);
        } else {
          setSermons(data || []);
        }
      } catch (err) {
        console.error('Error in fetchSermons:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSermons();
  }, [user]);

  const addSermon = async (sermonData) => {
    try {
      const { data, error } = await supabase
        .from('sermons')
        .insert([{
          ...sermonData,
          preacher_id: user.id
        }])
        .select()
        .single();

      if (error) throw error;

      setSermons(prev => [data, ...prev]);
      return { data, error: null };
    } catch (error) {
      console.error('Error adding sermon:', error);
      return { data: null, error };
    }
  };

  return {
    sermons,
    loading,
    error,
    addSermon
  };
};
