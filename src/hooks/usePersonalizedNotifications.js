import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function usePersonalizedNotifications(userId) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    supabase
      .from('system_notifications')
      .select('*')
      .eq('recipient_id', userId)
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) setError(error.message);
        else setNotifications(data || []);
        setLoading(false);
      });
  }, [userId]);

  return { notifications, loading, error };
} 