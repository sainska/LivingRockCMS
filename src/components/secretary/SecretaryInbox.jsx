import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const SecretaryInbox = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    async function fetchData() {
      // Replace 'secretary_id' with the actual secretary user id if available
      const { data } = await supabase.from('messages').select('*').eq('recipient_id', 'secretary_id');
      setMessages(data || []);
      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <Card>
      <CardHeader><CardTitle>Inbox</CardTitle></CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>From</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {messages.map(m => (
              <TableRow key={m.id}>
                <TableCell>{m.sender_id}</TableCell>
                <TableCell>{m.subject}</TableCell>
                <TableCell>{m.created_at}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default SecretaryInbox; 