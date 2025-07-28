import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useChildCheckIn(childId) {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!childId) return;
    setLoading(true);
    setError(null);
    supabase
      .from('child_checkin_sessions')
      .select('*')
      .eq('child_id', childId)
      .order('checkin_time', { ascending: false })
      .then(({ data, error }) => {
        if (error) setError(error.message);
        else setSessions(data || []);
        setLoading(false);
      });
  }, [childId]);

  const checkIn = async (parentId, guardianName) => {
    const { error } = await supabase.from('child_checkin_sessions').insert({
      child_id: childId,
      parent_id: parentId,
      guardian_name: guardianName,
      status: 'checked_in'
    });
    if (error) setError(error.message);
    else await refresh();
  };

  const checkOut = async (sessionId) => {
    const { error } = await supabase.from('child_checkin_sessions').update({
      checkout_time: new Date().toISOString(),
      status: 'checked_out'
    }).eq('id', sessionId);
    if (error) setError(error.message);
    else await refresh();
  };

  const refresh = async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from('child_checkin_sessions')
      .select('*')
      .eq('child_id', childId)
      .order('checkin_time', { ascending: false });
    if (error) setError(error.message);
    else setSessions(data || []);
    setLoading(false);
  };

  return { sessions, loading, error, checkIn, checkOut, refresh };
} 