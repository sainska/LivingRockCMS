
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export const usePrayerRequests = () => {
  const { user } = useAuth();
  const [prayerRequests, setPrayerRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) return;

    const fetchPrayerRequests = async () => {
      try {
        console.log('Fetching prayer requests...');
        const { data, error } = await supabase
          .from('prayer_requests')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching prayer requests:', error);
          setError(error.message);
        } else {
          setPrayerRequests(data || []);
        }
      } catch (err) {
        console.error('Error in fetchPrayerRequests:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPrayerRequests();
  }, [user]);

  const addPrayerRequest = async (requestData) => {
    try {
      const { data, error } = await supabase
        .from('prayer_requests')
        .insert([{
          ...requestData,
          requester_id: user.id
        }])
        .select()
        .single();

      if (error) throw error;

      setPrayerRequests(prev => [data, ...prev]);
      return { data, error: null };
    } catch (error) {
      console.error('Error adding prayer request:', error);
      return { data: null, error };
    }
  };

  return {
    prayerRequests,
    loading,
    error,
    addPrayerRequest
  };
};
