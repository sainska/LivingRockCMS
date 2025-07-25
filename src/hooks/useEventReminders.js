import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export function useEventReminders(eventId) {
  const { user } = useAuth();
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !eventId) return;
    setLoading(true);
    supabase
      .from('event_reminders')
      .select('*')
      .eq('user_id', user.id)
      .eq('event_id', eventId)
      .then(({ data }) => {
        setReminders(data || []);
        setLoading(false);
      });
  }, [user, eventId]);

  const addReminder = async (reminder_time, method = 'email') => {
    if (!user || !eventId) return;
    await supabase.from('event_reminders').insert([
      { user_id: user.id, event_id: eventId, reminder_time, method }
    ]);
    setReminders(prev => [...prev, { user_id: user.id, event_id: eventId, reminder_time, method }]);
  };

  const removeReminder = async (reminderId) => {
    await supabase.from('event_reminders').delete().eq('id', reminderId);
    setReminders(prev => prev.filter(r => r.id !== reminderId));
  };

  return { reminders, loading, addReminder, removeReminder };
} 