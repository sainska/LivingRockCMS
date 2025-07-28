import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useAuditLogs(userId, isAdmin = false) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    let query = supabase.from('audit_logs').select('*').order('created_at', { ascending: false });
    if (!isAdmin && userId) {
      query = query.eq('user_id', userId);
    }
    query.then(({ data, error }) => {
      if (error) setError(error.message);
      else setLogs(data || []);
      setLoading(false);
    });
  }, [userId, isAdmin]);

  return { logs, loading, error };
} 