import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export function useEventComments(eventId) {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!eventId) return;
    setLoading(true);
    supabase
      .from('event_comments')
      .select('*')
      .eq('event_id', eventId)
      .order('created_at', { ascending: true })
      .then(({ data }) => {
        setComments(data || []);
        setLoading(false);
      });
  }, [eventId]);

  const submitComment = async (commentText) => {
    if (!user || !eventId) return;
    await supabase.from('event_comments').insert([
      { event_id: eventId, user_id: user.id, comment: commentText }
    ]);
    setComments(prev => [...prev, { event_id: eventId, user_id: user.id, comment: commentText }]);
  };

  return { comments, loading, submitComment };
} 