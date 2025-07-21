import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';

const AttachReceipts = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    setLoading(true);
    supabase.from('financial_transactions').select('*').order('date', { ascending: false }).then(({ data }) => {
      setTransactions(data || []);
      setLoading(false);
    });
  }, []);

  const handleUpload = async (id, file) => {
    setUploading(true);
    const { data, error } = await supabase.storage.from('receipts').upload(`receipts/${id}/${file.name}`, file);
    if (!error) {
      const url = data?.Key || data?.path || '';
      await supabase.from('financial_transactions').update({ receipt_url: url }).eq('id', id);
      setTransactions(txs => txs.map(t => t.id === id ? { ...t, receipt_url: url } : t));
    }
    setUploading(false);
  };

  return (
    <Card>
      <CardHeader><CardTitle>Attach Receipts</CardTitle></CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Receipt</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map(t => (
              <TableRow key={t.id}>
                <TableCell>{t.date}</TableCell>
                <TableCell>{t.transaction_type}</TableCell>
                <TableCell>{t.amount}</TableCell>
                <TableCell>{t.receipt_url ? <a href={t.receipt_url} target="_blank" rel="noopener noreferrer">View</a> : 'None'}</TableCell>
                <TableCell>
                  <input type="file" onChange={e => handleUpload(t.id, e.target.files[0])} disabled={uploading} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default AttachReceipts; 