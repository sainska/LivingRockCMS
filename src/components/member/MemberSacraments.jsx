import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';

const MemberSacraments = () => {
  const { user } = useAuth();
  const [sacraments, setSacraments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    supabase
      .from('sacraments')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false })
      .then(({ data, error }) => {
        if (error) setError(error.message);
        setSacraments(data || []);
        setLoading(false);
      });
  }, [user]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Sacraments</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : sacraments.length === 0 ? (
          <div>No sacraments found.</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Place</TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sacraments.map((s) => (
                <TableRow key={s.id}>
                  <TableCell>{s.sacrament_type}</TableCell>
                  <TableCell>{s.date ? new Date(s.date).toLocaleDateString() : 'N/A'}</TableCell>
                  <TableCell>{s.place}</TableCell>
                  <TableCell>{s.notes || '-'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default MemberSacraments; 