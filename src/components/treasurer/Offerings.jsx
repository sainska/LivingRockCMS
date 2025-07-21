import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const Offerings = () => {
  const [offerings, setOfferings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    supabase.from('financial_transactions').select('*').eq('transaction_type', 'offering').order('date', { ascending: false }).then(({ data }) => {
      setOfferings(data || []);
      setLoading(false);
    });
  }, []);

  return (
    <Card>
      <CardHeader><CardTitle>Offerings</CardTitle></CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Donor</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {offerings.map(o => (
              <TableRow key={o.id}>
                <TableCell>{o.date}</TableCell>
                <TableCell>{o.amount}</TableCell>
                <TableCell>{o.user_id}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default Offerings; 