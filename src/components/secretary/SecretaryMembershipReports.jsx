import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const SecretaryMembershipReports = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    async function fetchData() {
      const { data } = await supabase.from('members').select('*, profiles:user_id(first_name, last_name)');
      setMembers(data || []);
      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <Card>
      <CardHeader><CardTitle>Membership Reports</CardTitle></CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Joined</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map(m => (
              <TableRow key={m.id}>
                <TableCell>{(m.profiles?.first_name || '-') + ' ' + (m.profiles?.last_name || '-')}</TableCell>
                <TableCell>{m.membership_status || m.status || 'Active'}</TableCell>
                <TableCell>{m.created_at}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default SecretaryMembershipReports; 