import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';

const BudgetTrackingReport = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    supabase
      .from('budget_categories')
      .select('id, name, allocated_amount, spent_amount')
      .order('name', { ascending: true })
      .then(({ data, error }) => {
        if (error) setError(error.message);
        setCategories(data || []);
        setLoading(false);
      });
  }, []);

  return (
    <Card>
      <CardHeader><CardTitle>Budget Tracking</CardTitle></CardHeader>
      <CardContent>
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div className="text-red-500">Error: {error}</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead>Allocated</TableHead>
                <TableHead>Spent</TableHead>
                <TableHead>Remaining</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">No budget categories found.</TableCell>
                </TableRow>
              ) : (
                categories.map(cat => (
                  <TableRow key={cat.id}>
                    <TableCell>{cat.name}</TableCell>
                    <TableCell>{cat.allocated_amount != null ? Number(cat.allocated_amount).toLocaleString(undefined, { style: 'currency', currency: 'KES' }) : '-'}</TableCell>
                    <TableCell>{cat.spent_amount != null ? Number(cat.spent_amount).toLocaleString(undefined, { style: 'currency', currency: 'KES' }) : '-'}</TableCell>
                    <TableCell>{cat.allocated_amount != null && cat.spent_amount != null ? (Number(cat.allocated_amount) - Number(cat.spent_amount)).toLocaleString(undefined, { style: 'currency', currency: 'KES' }) : '-'}</TableCell>
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

export default BudgetTrackingReport; 