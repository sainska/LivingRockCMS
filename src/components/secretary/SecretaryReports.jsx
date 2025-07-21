import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const fetchMembershipReport = async () => {
  const { data, error } = await supabase.from('profiles').select('id, first_name, last_name, membership_status, join_date');
  if (error) throw error;
  return data;
};
const fetchEventReport = async () => {
  const { data, error } = await supabase.from('events').select('id, title, event_type, start_date, attendance_count');
  if (error) throw error;
  return data;
};
const fetchGroupReport = async () => {
  const { data, error } = await supabase.from('ministry_groups').select('id, name, leader_id, current_members');
  if (error) throw error;
  return data;
};
const fetchFinanceReport = async () => {
  const { data, error } = await supabase.from('financial_transactions').select('id, amount, transaction_type, date, user_id').order('date', { ascending: false }).limit(20);
  if (error) throw error;
  return data;
};

const SecretaryReports = () => {
  const { data: members, isLoading: loadingMembers } = useQuery(['membership_report'], fetchMembershipReport);
  const { data: events, isLoading: loadingEvents } = useQuery(['event_report'], fetchEventReport);
  const { data: groups, isLoading: loadingGroups } = useQuery(['group_report'], fetchGroupReport);
  const { data: finances, isLoading: loadingFinances } = useQuery(['finance_report'], fetchFinanceReport);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Reports & Analytics</h2>
      <Card>
        <CardHeader><CardTitle>Membership Report</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Join Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loadingMembers ? <TableRow><TableCell colSpan={3}>Loading...</TableCell></TableRow> :
                members?.map(m => (
                  <TableRow key={m.id}>
                    <TableCell>{m.first_name} {m.last_name}</TableCell>
                    <TableCell>{m.membership_status}</TableCell>
                    <TableCell>{m.join_date}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Event Attendance Report</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Attendance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loadingEvents ? <TableRow><TableCell colSpan={4}>Loading...</TableCell></TableRow> :
                events?.map(e => (
                  <TableRow key={e.id}>
                    <TableCell>{e.title}</TableCell>
                    <TableCell>{e.event_type}</TableCell>
                    <TableCell>{e.start_date}</TableCell>
                    <TableCell>{e.attendance_count}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Group Activity Report</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Leader</TableHead>
                <TableHead>Members</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loadingGroups ? <TableRow><TableCell colSpan={3}>Loading...</TableCell></TableRow> :
                groups?.map(g => (
                  <TableRow key={g.id}>
                    <TableCell>{g.name}</TableCell>
                    <TableCell>{g.leader_id}</TableCell>
                    <TableCell>{g.current_members}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Financial Overview (Read Only)</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Member</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loadingFinances ? <TableRow><TableCell colSpan={4}>Loading...</TableCell></TableRow> :
                finances?.map(f => (
                  <TableRow key={f.id}>
                    <TableCell>{f.date}</TableCell>
                    <TableCell>{f.transaction_type}</TableCell>
                    <TableCell>{f.amount}</TableCell>
                    <TableCell>{f.user_id}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default SecretaryReports; 