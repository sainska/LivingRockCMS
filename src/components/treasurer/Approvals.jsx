import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';

const Approvals = () => {
  const [approvals, setApprovals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    supabase.from('expense_approvals').select('*').eq('status', 'pending').order('requested_at', { ascending: false }).then(({ data }) => {
      setApprovals(data || []);
      setLoading(false);
    });
  }, []);

  const handleApprove = async (id) => {
    await supabase.from('expense_approvals').update({ status: 'approved' }).eq('id', id);
    setApprovals(list => list.map(a => a.id === id ? { ...a, status: 'approved' } : a));
  };

  return (
    <Card>
      <CardHeader><CardTitle>Pending Approvals</CardTitle></CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Expense</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Requested By</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {approvals.map(a => (
              <TableRow key={a.id}>
                <TableCell>{a.expense_name}</TableCell>
                <TableCell>{a.amount}</TableCell>
                <TableCell>{a.requested_by}</TableCell>
                <TableCell>{a.status}</TableCell>
                <TableCell>
                  <Button onClick={() => handleApprove(a.id)}>Approve</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default Approvals; 