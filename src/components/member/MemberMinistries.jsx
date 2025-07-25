import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';

const MemberMinistries = () => {
  const { user } = useAuth();
  const [ministries, setMinistries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    supabase
      .from('ministry_members')
      .select('id, role, ministries(name, description, meeting_day, meeting_time, meeting_location)')
      .eq('member_id', user.id)
      .then(({ data, error }) => {
        if (error) setError(error.message);
        setMinistries(data || []);
        setLoading(false);
      })
      .catch((err) => {
        setError('Network error: Failed to fetch. Please check your connection or CORS settings.');
        setLoading(false);
      });
  }, [user]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Ministries</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : ministries.length === 0 ? (
          <div>No ministries found.</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Meeting Day</TableHead>
                <TableHead>Meeting Time</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Role</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ministries.map((m) => (
                <TableRow key={m.id}>
                  <TableCell>{m.ministries?.name || 'N/A'}</TableCell>
                  <TableCell>{m.ministries?.description || '-'}</TableCell>
                  <TableCell>{m.ministries?.meeting_day || '-'}</TableCell>
                  <TableCell>{m.ministries?.meeting_time || '-'}</TableCell>
                  <TableCell>{m.ministries?.meeting_location || '-'}</TableCell>
                  <TableCell>{m.role || '-'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default MemberMinistries; 