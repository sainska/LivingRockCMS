import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useMissionTrips() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    supabase
      .from('mission_trips')
      .select('*')
      .order('start_date', { ascending: false })
      .then(({ data, error }) => {
        if (error) setError(error.message);
        else setTrips(data || []);
        setLoading(false);
      });
  }, []);

  const registerParticipant = async (tripId, userId, role) => {
    const { error } = await supabase.from('mission_trip_participants').insert({
      mission_trip_id: tripId,
      user_id: userId,
      role
    });
    if (error) setError(error.message);
    else await refresh();
  };

  const refresh = async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from('mission_trips')
      .select('*')
      .order('start_date', { ascending: false });
    if (error) setError(error.message);
    else setTrips(data || []);
    setLoading(false);
  };

  return { trips, loading, error, registerParticipant, refresh };
} 