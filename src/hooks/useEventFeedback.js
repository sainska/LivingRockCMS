import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export function useEventFeedback(eventId) {
  const { user } = useAuth();
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!eventId) return;
    setLoading(true);
    supabase
      .from('event_feedback')
      .select('*')
      .eq('event_id', eventId)
      .then(({ data }) => {
        setFeedback(data || []);
        setLoading(false);
      });
  }, [eventId]);

  const submitFeedback = async (rating, feedbackText) => {
    if (!user || !eventId) return;
    await supabase.from('event_feedback').insert([
      { event_id: eventId, user_id: user.id, rating, feedback: feedbackText }
    ]);
    setFeedback(prev => [...prev, { event_id: eventId, user_id: user.id, rating, feedback: feedbackText }]);
  };

  return { feedback, loading, submitFeedback };
} 