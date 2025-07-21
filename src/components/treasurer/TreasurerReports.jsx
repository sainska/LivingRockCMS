import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const fetchIncome = async () => {
  const { data, error } = await supabase.from('financial_transactions').select('id, amount, transaction_type, date').eq('transaction_type', 'income').order('date', { ascending: false });
  if (error) throw error;
  return data;
};
const fetchExpenses = async () => {
  const { data, error } = await supabase.from('financial_transactions').select('id, amount, transaction_type, date').eq('transaction_type', 'expense').order('date', { ascending: false });
  if (error) throw error;
  return data;
};
const fetchBalances = async () => {
  const { data, error } = await supabase.from('financial_accounts').select('id, name, balance');
  if (error) throw error;
  return data;
};
const fetchBudgets = async () => {
  const { data, error } = await supabase.from('budgets').select('*');
  if (error) throw error;
  return data;
};

const TreasurerReports = () => {
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    async function fetchData() {
      // Example: fetch from a view or aggregate
      const { data, error } = await supabase
        .from('financial_reports_view')
        .select('*');
      setReportData(data || []);
      setLoading(false);
    }
    fetchData();
  }, []);

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
      <h2 className="text-2xl font-bold">Reports & Analytics</h2>
      <Card>
        <CardHeader><CardTitle>Income Report</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? <TableRow><TableCell colSpan={2}>Loading...</TableCell></TableRow> :
                reportData?.map(i => (
                  <TableRow key={i.id}>
                    <TableCell>{i.date}</TableCell>
                    <TableCell>{i.amount}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Expense Report</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? <TableRow><TableCell colSpan={2}>Loading...</TableCell></TableRow> :
                reportData?.map(e => (
                  <TableRow key={e.id}>
                    <TableCell>{e.date}</TableCell>
                    <TableCell>{e.amount}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Account Balances</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Account</TableHead>
                <TableHead>Balance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? <TableRow><TableCell colSpan={2}>Loading...</TableCell></TableRow> :
                reportData?.map(b => (
                  <TableRow key={b.id}>
                    <TableCell>{b.name}</TableCell>
                    <TableCell>{b.balance}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Budget Tracking</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead>Planned</TableHead>
                <TableHead>Actual</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? <TableRow><TableCell colSpan={3}>Loading...</TableCell></TableRow> :
                reportData?.map(b => (
                  <TableRow key={b.id}>
                    <TableCell>{b.category}</TableCell>
                    <TableCell>{b.planned_amount}</TableCell>
                    <TableCell>{b.actual_amount}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default TreasurerReports; 