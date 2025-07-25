import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';

const BalancesReport = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    supabase
      .from('financial_accounts')
      .select('id, account_name, account_type, current_balance')
      .order('account_name', { ascending: true })
      .then(({ data, error }) => {
        if (error) setError(error.message);
        setAccounts(data || []);
        setLoading(false);
      });
  }, []);

  return (
    <Card>
      <CardHeader><CardTitle>Account Balances</CardTitle></CardHeader>
      <CardContent>
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div className="text-red-500">Error: {error}</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Account Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Current Balance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {accounts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center">No accounts found.</TableCell>
                </TableRow>
              ) : (
                accounts.map(acc => (
                  <TableRow key={acc.id}>
                    <TableCell>{acc.account_name}</TableCell>
                    <TableCell>{acc.account_type}</TableCell>
                    <TableCell>{acc.current_balance != null ? Number(acc.current_balance).toLocaleString(undefined, { style: 'currency', currency: 'USD' }) : '-'}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default BalancesReport; 