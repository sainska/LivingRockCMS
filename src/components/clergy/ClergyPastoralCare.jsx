import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const fetchVisits = async () => {
  const { data, error } = await supabase.from('pastoral_visits').select('*').order('visit_date', { ascending: false });
  if (error) throw error;
  return data;
};
const fetchCounseling = async () => {
  const { data, error } = await supabase.from('counseling_sessions').select('*').order('session_date', { ascending: false });
  if (error) throw error;
  return data;
};

const ClergyPastoralCare = () => {
  const { data: visits, isLoading: loadingVisits } = useQuery(['clergy_visits'], fetchVisits);
  const { data: counseling, isLoading: loadingCounseling } = useQuery(['clergy_counseling'], fetchCounseling);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Pastoral Care</h2>
      <Card>
        <CardHeader><CardTitle>Visit Planner & Care History</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Pastor</TableHead>
                <TableHead>Member</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loadingVisits ? <TableRow><TableCell colSpan={4}>Loading...</TableCell></TableRow> :
                visits?.map(v => (
                  <TableRow key={v.id}>
                    <TableCell>{v.visit_date}</TableCell>
                    <TableCell>{v.pastor_id}</TableCell>
                    <TableCell>{v.member_id}</TableCell>
                    <TableCell>{v.status}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Counseling Sessions</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Counselor</TableHead>
                <TableHead>Member</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loadingCounseling ? <TableRow><TableCell colSpan={4}>Loading...</TableCell></TableRow> :
                counseling?.map(c => (
                  <TableRow key={c.id}>
                    <TableCell>{c.session_date}</TableCell>
                    <TableCell>{c.counselor_id}</TableCell>
                    <TableCell>{c.member_id}</TableCell>
                    <TableCell>{c.status}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClergyPastoralCare; 