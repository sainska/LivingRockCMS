
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useAttendance = () => {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const fetchAttendanceRecords = async (eventId = null) => {
    try {
      setLoading(true);
      let query = supabase
        .from('attendance_records')
        .select(`
          *,
          events (
            title,
            start_date,
            location
          ),
          profiles:member_id (
            first_name,
            last_name,
            email
          ),
          recorded_by_profile:recorded_by (
            first_name,
            last_name
          )
        `)
        .order('attendance_date', { ascending: false });

      if (eventId) {
        query = query.eq('event_id', eventId);
      }

      const { data, error } = await query;

      if (error) throw error;
      setAttendanceRecords(data || []);
    } catch (err) {
      console.error('Error fetching attendance records:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const recordAttendance = async (eventId, memberId, status = 'present', notes = '') => {
    try {
      const { data, error } = await supabase
        .from('attendance_records')
        .insert({
          event_id: eventId,
          member_id: memberId,
          status,
          notes,
          recorded_by: user.id
        })
        .select()
        .single();

      if (error) throw error;
      
      setAttendanceRecords(prev => [data, ...prev]);
      return { data, error: null };
    } catch (err) {
      console.error('Error recording attendance:', err);
      return { data: null, error: err.message };
    }
  };

  const updateAttendance = async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from('attendance_records')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      setAttendanceRecords(prev => prev.map(a => a.id === id ? { ...a, ...data } : a));
      return { data, error: null };
    } catch (err) {
      console.error('Error updating attendance:', err);
      return { data: null, error: err.message };
    }
  };

  const getAttendanceStats = async (eventId) => {
    try {
      const { data, error } = await supabase
        .from('attendance_records')
        .select('status')
        .eq('event_id', eventId);

      if (error) throw error;

      const stats = {
        present: data.filter(a => a.status === 'present').length,
        absent: data.filter(a => a.status === 'absent').length,
        late: data.filter(a => a.status === 'late').length,
        total: data.length
      };

      return { data: stats, error: null };
    } catch (err) {
      console.error('Error getting attendance stats:', err);
      return { data: null, error: err.message };
    }
  };

  useEffect(() => {
    if (user) {
      fetchAttendanceRecords();
    }
  }, [user]);

  return {
    attendanceRecords,
    loading,
    error,
    recordAttendance,
    updateAttendance,
    getAttendanceStats,
    refetch: fetchAttendanceRecords
  };
};
