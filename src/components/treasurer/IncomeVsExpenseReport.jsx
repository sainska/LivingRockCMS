import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';

const IncomeVsExpenseReport = () => {
  const [totals, setTotals] = useState({ income: 0, expense: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    supabase
      .from('financial_transactions')
      .select('amount, transaction_type')
      .then(({ data, error }) => {
        if (error) setError(error.message);
        let income = 0;
        let expense = 0;
        (data || []).forEach(tx => {
          if (tx.transaction_type === 'income') income += Number(tx.amount);
          if (tx.transaction_type === 'expense') expense += Number(tx.amount);
        });
        setTotals({ income, expense });
        setLoading(false);
      });
  }, []);

  return (
    <Card>
      <CardHeader><CardTitle>Income vs Expense Report</CardTitle></CardHeader>
      <CardContent>
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div className="text-red-500">Error: {error}</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Income</TableCell>
                <TableCell>{totals.income.toLocaleString(undefined, { style: 'currency', currency: 'KES' })}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Expense</TableCell>
                <TableCell>{totals.expense.toLocaleString(undefined, { style: 'currency', currency: 'KES' })}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell><b>Net</b></TableCell>
                <TableCell><b>{(totals.income - totals.expense).toLocaleString(undefined, { style: 'currency', currency: 'KES' })}</b></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default IncomeVsExpenseReport; 