import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const fetchGrowth = async () => {
  const { data, error } = await supabase.from('profiles').select('id, first_name, last_name, join_date');
  if (error) throw error;
  return data;
};
const fetchAttendance = async () => {
  const { data, error } = await supabase.from('attendance_records').select('id, event_id, user_id, attendance_status, created_at');
  if (error) throw error;
  return data;
};
const fetchPastoralStats = async () => {
  const { data, error } = await supabase.from('pastoral_visits').select('id, pastor_id, member_id, visit_date, status');
  if (error) throw error;
  return data;
};
const fetchEngagement = async () => {
  const { data, error } = await supabase.from('ministry_group_members').select('id, ministry_group_id, user_id, role');
  if (error) throw error;
  return data;
};

const ClergyReports = () => {
  const { data: growth, isLoading: loadingGrowth } = useQuery(['clergy_growth'], fetchGrowth);
  const { data: attendance, isLoading: loadingAttendance } = useQuery(['clergy_attendance'], fetchAttendance);
  const { data: pastoralStats, isLoading: loadingPastoralStats } = useQuery(['clergy_pastoral_stats'], fetchPastoralStats);
  const { data: engagement, isLoading: loadingEngagement } = useQuery(['clergy_engagement'], fetchEngagement);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Reports & Insights</h2>
      <Card>
        <CardHeader><CardTitle>Member Growth</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Join Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loadingGrowth ? <TableRow><TableCell colSpan={2}>Loading...</TableCell></TableRow> :
                growth?.map(g => (
                  <TableRow key={g.id}>
                    <TableCell>{g.first_name} {g.last_name}</TableCell>
                    <TableCell>{g.join_date}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Attendance Trends</CardTitle></CardHeader>
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
      <Card>
        <CardHeader><CardTitle>Pastoral Care Stats</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Pastor</TableHead>
                <TableHead>Member</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loadingPastoralStats ? <TableRow><TableCell colSpan={4}>Loading...</TableCell></TableRow> :
                pastoralStats?.map(p => (
                  <TableRow key={p.id}>
                    <TableCell>{p.pastor_id}</TableCell>
                    <TableCell>{p.member_id}</TableCell>
                    <TableCell>{p.visit_date}</TableCell>
                    <TableCell>{p.status}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Ministry Engagement</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Group</TableHead>
                <TableHead>Member</TableHead>
                <TableHead>Role</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loadingEngagement ? <TableRow><TableCell colSpan={3}>Loading...</TableCell></TableRow> :
                engagement?.map(e => (
                  <TableRow key={e.id}>
                    <TableCell>{e.ministry_group_id}</TableCell>
                    <TableCell>{e.user_id}</TableCell>
                    <TableCell>{e.role}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClergyReports; 