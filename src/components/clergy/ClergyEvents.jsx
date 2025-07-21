import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const fetchEvents = async () => {
  const { data, error } = await supabase.from('events').select('*').order('start_date', { ascending: false });
  if (error) throw error;
  return data;
};
const fetchAttendance = async () => {
  const { data, error } = await supabase.from('attendance_records').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data;
};

const ClergyEvents = () => {
  const { data: events, isLoading: loadingEvents } = useQuery(['clergy_events'], fetchEvents);
  const { data: attendance, isLoading: loadingAttendance } = useQuery(['clergy_attendance'], fetchAttendance);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Events & Services</h2>
      <Card>
        <CardHeader><CardTitle>Event Calendar</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Location</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loadingEvents ? <TableRow><TableCell colSpan={4}>Loading...</TableCell></TableRow> :
                events?.map(e => (
                  <TableRow key={e.id}>
                    <TableCell>{e.title}</TableCell>
                    <TableCell>{e.start_date}</TableCell>
                    <TableCell>{e.event_type}</TableCell>
                    <TableCell>{e.location}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Attendance Records</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Event</TableHead>
                <TableHead>Member</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loadingAttendance ? <TableRow><TableCell colSpan={4}>Loading...</TableCell></TableRow> :
                attendance?.map(a => (
                  <TableRow key={a.id}>
                    <TableCell>{a.event_id}</TableCell>
                    <TableCell>{a.user_id}</TableCell>
                    <TableCell>{a.attendance_status}</TableCell>
                    <TableCell>{a.created_at}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClergyEvents; 