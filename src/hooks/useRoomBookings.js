import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useRoomBookings(roomId) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!roomId) return;
    setLoading(true);
    setError(null);
    supabase
      .from('room_bookings')
      .select('*')
      .eq('room_id', roomId)
      .order('start_time', { ascending: true })
      .then(({ data, error }) => {
        if (error) setError(error.message);
        else setBookings(data || []);
        setLoading(false);
      });
  }, [roomId]);

  const bookRoom = async (bookingData) => {
    const { error } = await supabase.from('room_bookings').insert(bookingData);
    if (error) setError(error.message);
    else await refresh();
  };

  const cancelBooking = async (bookingId) => {
    const { error } = await supabase.from('room_bookings').update({ status: 'cancelled' }).eq('id', bookingId);
    if (error) setError(error.message);
    else await refresh();
  };

  const refresh = async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from('room_bookings')
      .select('*')
      .eq('room_id', roomId)
      .order('start_time', { ascending: true });
    if (error) setError(error.message);
    else setBookings(data || []);
    setLoading(false);
  };

  return { bookings, loading, error, bookRoom, cancelBooking, refresh };
} 