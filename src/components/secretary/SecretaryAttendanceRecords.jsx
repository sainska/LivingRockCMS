import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';

const SecretaryAttendanceRecords = () => {
  const [records, setRecords] = useState([]);
  const [events, setEvents] = useState({});
  const [profiles, setProfiles] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchAll() {
      setLoading(true);
      try {
        // Fetch attendance records
        const { data: attendance, error: attendanceError } = await supabase
          .from('attendance_records')
          .select('*')
          .order('attendance_date', { ascending: false });
        if (attendanceError) throw attendanceError;

        // Get unique event_ids and member_ids
        const eventIds = [...new Set(attendance.map(r => r.event_id))];
        const memberIds = [...new Set(attendance.map(r => r.member_id))];

        // Fetch events
        let eventsMap = {};
        if (eventIds.length > 0) {
          const { data: eventsData } = await supabase
            .from('events')
            .select('id, title')
            .in('id', eventIds);
          eventsMap = Object.fromEntries((eventsData || []).map(e => [e.id, e.title]));
        }

        // Fetch profiles
        let profilesMap = {};
        if (memberIds.length > 0) {
          const { data: profilesData } = await supabase
            .from('profiles')
            .select('id, first_name, last_name')
            .in('id', memberIds);
          profilesMap = Object.fromEntries((profilesData || []).map(p => [p.id, p]));
        }

        setRecords(attendance);
        setEvents(eventsMap);
        setProfiles(profilesMap);
        setError(null);
      } catch (err) {
        setError(err.message || String(err));
      } finally {
        setLoading(false);
      }
    }
    fetchAll();
  }, []);

  return (
    <Card>
      <CardHeader><CardTitle>Attendance Records</CardTitle></CardHeader>
      <CardContent>
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div className="text-red-500">Error: {error}</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Event</TableHead>
                <TableHead>Member</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {records.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">No attendance records found.</TableCell>
                </TableRow>
              ) : (
                records.map(record => (
                  <TableRow key={record.id}>
                    <TableCell>{events[record.event_id] || record.event_id}</TableCell>
                    <TableCell>{profiles[record.member_id] ? `${profiles[record.member_id].first_name} ${profiles[record.member_id].last_name}` : record.member_id}</TableCell>
                    <TableCell>{record.status || record.attendance_status}</TableCell>
                    <TableCell>{record.attendance_date || record.created_at?.split('T')[0]}</TableCell>
                    <TableCell>{record.notes || ''}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default SecretaryAttendanceRecords; 