import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';

const EditReverse = () => {
  const [transactions, setTransactions] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');

  useEffect(() => {
    setLoading(true);
    supabase.from('financial_transactions').select('*').order('date', { ascending: false }).then(({ data }) => {
      setTransactions(data || []);
      setLoading(false);
    });
  }, []);

  const handleEdit = async (id, newStatus) => {
    await supabase.from('financial_transactions').update({ status: newStatus }).eq('id', id);
    setTransactions(txs => txs.map(t => t.id === id ? { ...t, status: newStatus } : t));
    setSelected(null);
  };

  return (
    <Card>
      <CardHeader><CardTitle>Edit/Reverse Transaction</CardTitle></CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map(t => (
              <TableRow key={t.id}>
                <TableCell>{t.date}</TableCell>
                <TableCell>{t.transaction_type}</TableCell>
                <TableCell>{t.amount}</TableCell>
                <TableCell>{t.status}</TableCell>
                <TableCell>
                  <Button onClick={() => setSelected(t.id)}>Edit/Reverse</Button>
                  {selected === t.id && (
                    <div className="mt-2">
                      <Button onClick={() => handleEdit(t.id, 'reversed')}>Reverse</Button>
                      <Button onClick={() => setSelected(null)} variant="secondary">Cancel</Button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default EditReverse; 