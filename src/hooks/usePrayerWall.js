import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function usePrayerWall() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    supabase
      .from('prayer_requests')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) setError(error.message);
        else setRequests(data || []);
        setLoading(false);
      });
  }, []);

  const postRequest = async (content, anonymous = false) => {
    const { error } = await supabase.from('prayer_requests').insert({ content, anonymous });
    if (error) setError(error.message);
    else await refresh();
  };

  const refresh = async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from('prayer_requests')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) setError(error.message);
    else setRequests(data || []);
    setLoading(false);
  };

  return { requests, loading, error, postRequest, refresh };
} 