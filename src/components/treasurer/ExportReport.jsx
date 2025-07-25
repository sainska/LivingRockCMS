import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const ExportReport = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleExport = async () => {
    setLoading(true);
    setSuccess(false);
    setError(null);
    try {
      // Fetch all financial transactions
      const { data: transactions, error: txError } = await supabase
        .from('financial_transactions')
        .select('*');
      if (txError) throw txError;
      if (!transactions || transactions.length === 0) throw new Error('No transactions to export.');

      // Fetch all accounts for mapping
      const { data: accounts, error: accError } = await supabase
        .from('financial_accounts')
        .select('id, account_name, account_type');
      if (accError) throw accError;
      const accountMap = Object.fromEntries((accounts || []).map(a => [a.id, a]));

      // Build export rows with all relevant columns
      const headers = [
        'id', 'amount', 'transaction_type', 'description', 'category', 'reference_number', 'transaction_date',
        'recorded_by', 'approved_by', 'approval_status', 'notes', 'created_at', 'account_id', 'account_name', 'account_type'
      ];
      const csvRows = [headers.join(',')];
      for (const row of transactions) {
        const account = accountMap[row.account_id] || {};
        csvRows.push([
          row.id,
          row.amount,
          row.transaction_type,
          JSON.stringify(row.description ?? ''),
          JSON.stringify(row.category ?? ''),
          JSON.stringify(row.reference_number ?? ''),
          row.transaction_date,
          row.recorded_by,
          row.approved_by,
          row.approval_status,
          JSON.stringify(row.notes ?? ''),
          row.created_at,
          row.account_id,
          JSON.stringify(account.account_name ?? ''),
          JSON.stringify(account.account_type ?? '')
        ].join(','));
      }
      const csvContent = csvRows.join('\n');
      // Download
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'financial_transactions_export.csv';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setSuccess(true);
    } catch (err) {
      setError(err.message || String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader><CardTitle>Export Financial Transactions</CardTitle></CardHeader>
      <CardContent>
        <Button onClick={handleExport} disabled={loading}>
          {loading ? 'Exporting...' : 'Export as CSV'}
        </Button>
        {success && <div className="text-green-600 mt-2">Export successful!</div>}
        {error && <div className="text-red-500 mt-2">Error: {error}</div>}
      </CardContent>
    </Card>
  );
};

export default ExportReport; 