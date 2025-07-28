import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useGDPRRequests(userId) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    supabase
      .from('gdpr_requests')
      .select('*')
      .eq('user_id', userId)
      .order('requested_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) setError(error.message);
        else setRequests(data || []);
        setLoading(false);
      });
  }, [userId]);

  const submitRequest = async (type) => {
    const { error } = await supabase.from('gdpr_requests').insert({ user_id: userId, request_type: type });
    if (error) setError(error.message);
    else await refresh();
  };

  const refresh = async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from('gdpr_requests')
      .select('*')
      .eq('user_id', userId)
      .order('requested_at', { ascending: false });
    if (error) setError(error.message);
    else setRequests(data || []);
    setLoading(false);
  };

  return { requests, loading, error, submitRequest, refresh };
} 