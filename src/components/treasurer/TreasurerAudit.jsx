import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const fetchLogs = async () => {
  const { data, error } = await supabase.from('transaction_logs').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data;
};
const fetchUserAccess = async () => {
  const { data, error } = await supabase.from('user_roles').select('*');
  if (error) throw error;
  return data;
};
const fetchBackups = async () => {
  const { data, error } = await supabase.from('backups').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data;
};

const TreasurerAudit = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    async function fetchData() {
      const { data, error } = await supabase
        .from('audit_logs')
        .select('*');
      setLogs(data || []);
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
      <h2 className="text-2xl font-bold">Audit & Security</h2>
      <Card>
        <CardHeader><CardTitle>Transaction Logs</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Action</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? <TableRow><TableCell colSpan={3}>Loading...</TableCell></TableRow> :
                logs?.map(l => (
                  <TableRow key={l.id}>
                    <TableCell>{l.action}</TableCell>
                    <TableCell>{l.user_id}</TableCell>
                    <TableCell>{l.created_at}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>User Access</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? <TableRow><TableCell colSpan={2}>Loading...</TableCell></TableRow> :
                userAccess?.map(u => (
                  <TableRow key={u.id}>
                    <TableCell>{u.user_id}</TableCell>
                    <TableCell>{u.role}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Backups</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? <TableRow><TableCell colSpan={2}>Loading...</TableCell></TableRow> :
                backups?.map(b => (
                  <TableRow key={b.id}>
                    <TableCell>{b.created_at}</TableCell>
                    <TableCell>{b.status}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default TreasurerAudit; 