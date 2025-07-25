
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export const useCommunications = () => {
  const { user } = useAuth();
  const [communications, setCommunications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) return;

    const fetchCommunications = async () => {
      try {
        console.log('Fetching communications...');
        const { data, error } = await supabase
          .from('communications')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching communications:', error);
          setError(error.message);
        } else {
          setCommunications(data || []);
        }
      } catch (err) {
        console.error('Error in fetchCommunications:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCommunications();
  }, [user]);

  const sendCommunication = async (communicationData) => {
    try {
      const { data, error } = await supabase
        .from('communications')
        .insert([{
          ...communicationData,
          sent_by: user.id,
          status: 'published'
        }])
        .select()
        .single();

      if (error) throw error;

      setCommunications(prev => [data, ...prev]);
      return { data, error: null };
    } catch (error) {
      console.error('Error sending communication:', error);
      return { data: null, error };
    }
  };

  return {
    communications,
    loading,
    error,
    sendCommunication
  };
};
