import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const fetchVisits = async () => {
  const { data, error } = await supabase.from('pastoral_visits').select('*').order('visit_date', { ascending: false });
  if (error) throw error;
  return data;
};
const fetchSessions = async () => {
  const { data, error } = await supabase.from('counseling_sessions').select('*').order('session_date', { ascending: false });
  if (error) throw error;
  return data;
};

const SecretaryPastoralCare = () => {
  const [visits, setVisits] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    async function fetchData() {
      const { data: visitsData } = await supabase
        .from('pastoral_visits')
        .select('*');
      const { data: sessionsData } = await supabase
        .from('counseling_sessions')
        .select('*');
      setVisits(visitsData || []);
      setSessions(sessionsData || []);
      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Pastoral Care Scheduling</h2>
      <Card>
        <CardHeader><CardTitle>Pastoral Visits</CardTitle></CardHeader>
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
              {visits?.map(v => (
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
              {sessions?.map(s => (
                <TableRow key={s.id}>
                  <TableCell>{s.session_date}</TableCell>
                  <TableCell>{s.counselor_id}</TableCell>
                  <TableCell>{s.member_id}</TableCell>
                  <TableCell>{s.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default SecretaryPastoralCare; 