import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';

const SecretaryStatusUpdates = () => {
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    supabase
      .from('status_updates')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) setError(error.message);
        setUpdates(data || []);
        setLoading(false);
      });
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Status Updates</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : updates.length === 0 ? (
          <div>No status updates found.</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {updates.map((u) => (
                <TableRow key={u.id}>
                  <TableCell>{u.title}</TableCell>
                  <TableCell>{u.description}</TableCell>
                  <TableCell>{u.category || '-'}</TableCell>
                  <TableCell>{u.created_at ? new Date(u.created_at).toLocaleString() : ''}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default SecretaryStatusUpdates; 