import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const fetchTransactions = async () => {
  const { data, error } = await supabase.from('financial_transactions').select('*').order('date', { ascending: false });
  if (error) throw error;
  return data;
};

const TreasurerTransactions = () => {
  const queryClient = useQueryClient();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ amount: '', transaction_type: '', date: '', account_id: '', notes: '' });

  useEffect(() => {
    setLoading(true);
    async function fetchData() {
      const { data, error } = await supabase
        .from('financial_transactions')
        .select('*');
      setTransactions(data || []);
      setLoading(false);
    }
    fetchData();
  }, []);

  const mutation = useMutation(async (mutationData) => {
    const { data, error } = await supabase.from('financial_transactions').insert([mutationData]);
    if (error) throw error;
    return data;
  });

  useEffect(() => {
    if (mutation.isSuccess) {
      setShowAdd(false);
      queryClient.invalidateQueries(['transactions']);
    }
  }, [mutation.isSuccess, queryClient]);

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
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Transactions</h2>
        <Dialog open={showAdd} onOpenChange={setShowAdd}>
          <DialogTrigger asChild>
            <Button>Record Transaction</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Record Transaction</DialogTitle></DialogHeader>
            <form onSubmit={e => { e.preventDefault(); mutation.mutate(form); }} className="space-y-4">
              <div><Label>Amount</Label><Input value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} required type="number" /></div>
              <div><Label>Type</Label><Input value={form.transaction_type} onChange={e => setForm(f => ({ ...f, transaction_type: e.target.value }))} required /></div>
              <div><Label>Date</Label><Input value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} type="date" required /></div>
              <div><Label>Account ID</Label><Input value={form.account_id} onChange={e => setForm(f => ({ ...f, account_id: e.target.value }))} required /></div>
              <div><Label>Notes</Label><Input value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} /></div>
              <Button type="submit" className="w-full">Save</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <Card>
        <CardHeader><CardTitle>All Transactions</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Account</TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions?.map(t => (
                  <TableRow key={t.id}>
                    <TableCell>{t.date}</TableCell>
                    <TableCell>{t.transaction_type}</TableCell>
                    <TableCell>{t.amount}</TableCell>
                    <TableCell>{t.account_id}</TableCell>
                    <TableCell>{t.notes}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default TreasurerTransactions; 