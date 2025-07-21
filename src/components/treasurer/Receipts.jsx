import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const Receipts = () => {
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    supabase.from('financial_transactions').select('*').not('receipt_url', 'is', null).order('date', { ascending: false }).then(({ data }) => {
      setReceipts(data || []);
      setLoading(false);
    });
  }, []);

  return (
    <Card>
      <CardHeader><CardTitle>Receipts</CardTitle></CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Receipt</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {receipts.map(r => (
              <TableRow key={r.id}>
                <TableCell>{r.date}</TableCell>
                <TableCell>{r.amount}</TableCell>
                <TableCell>{r.receipt_url ? <a href={r.receipt_url} target="_blank" rel="noopener noreferrer">View</a> : 'None'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default Receipts; 