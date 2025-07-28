import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useEventTickets(userId) {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    supabase
      .from('event_registrations')
      .select('*, events(title, date)')
      .eq('user_id', userId)
      .then(({ data, error }) => {
        if (error) setError(error.message);
        else setTickets(data || []);
        setLoading(false);
      });
  }, [userId]);

  const generateTicketCode = async (registrationId) => {
    const code = Math.random().toString(36).substring(2, 10).toUpperCase();
    const { error } = await supabase
      .from('event_registrations')
      .update({ ticket_code: code })
      .eq('id', registrationId);
    if (error) setError(error.message);
    else setTickets(tickets => tickets.map(t => t.id === registrationId ? { ...t, ticket_code: code } : t));
    return code;
  };

  return { tickets, loading, error, generateTicketCode };
} 