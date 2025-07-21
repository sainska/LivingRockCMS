import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';

const MemberGiving = () => {
  const { user } = useAuth();
  const [giving, setGiving] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    supabase
      .from('donations')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false })
      .then(({ data, error }) => {
        if (error) setError(error.message);
        setGiving(data || []);
        setLoading(false);
      });
  }, [user]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Giving</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : giving.length === 0 ? (
          <div>No giving records found.</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {giving.map((g) => (
                <TableRow key={g.id}>
                  <TableCell>{g.date ? new Date(g.date).toLocaleDateString() : 'N/A'}</TableCell>
                  <TableCell>{g.type}</TableCell>
                  <TableCell>{g.amount}</TableCell>
                  <TableCell>{g.method}</TableCell>
                  <TableCell>{g.notes || '-'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default MemberGiving; 