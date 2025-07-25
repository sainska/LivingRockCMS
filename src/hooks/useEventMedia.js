import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useEventMedia(eventId) {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!eventId) return;
    setLoading(true);
    supabase
      .from('event_media')
      .select('*')
      .eq('event_id', eventId)
      .then(({ data }) => {
        setMedia(data || []);
        setLoading(false);
      });
  }, [eventId]);

  return { media, loading };
} 