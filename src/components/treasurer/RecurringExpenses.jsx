import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const RecurringExpenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    supabase.from('recurring_expenses').select('*').order('next_due_date', { ascending: false }).then(({ data }) => {
      setExpenses(data || []);
      setLoading(false);
    });
  }, []);

  return (
    <Card>
      <CardHeader><CardTitle>Recurring Expenses</CardTitle></CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Frequency</TableHead>
              <TableHead>Next Due</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {expenses.map(e => (
              <TableRow key={e.id}>
                <TableCell>{e.name}</TableCell>
                <TableCell>{e.amount}</TableCell>
                <TableCell>{e.frequency}</TableCell>
                <TableCell>{e.next_due_date}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default RecurringExpenses; 