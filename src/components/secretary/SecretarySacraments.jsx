import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';

const SecretarySacraments = () => {
  const [sacraments, setSacraments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    supabase
      .from('sacraments')
      .select('id, sacrament_type, date, place, notes, profiles:user_id(first_name, last_name)')
      .then(({ data, error }) => {
        if (error) setError(error.message);
        setSacraments(data || []);
        setLoading(false);
      });
  }, []);

  return (
    <Card>
      <CardHeader><CardTitle>Sacraments</CardTitle></CardHeader>
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
                <TableHead>Member</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Place</TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sacraments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">No sacraments found.</TableCell>
                </TableRow>
              ) : (
                sacraments.map(s => (
                  <TableRow key={s.id}>
                    <TableCell>{s.sacrament_type}</TableCell>
                    <TableCell>{s.profiles?.first_name} {s.profiles?.last_name}</TableCell>
                    <TableCell>{s.date}</TableCell>
                    <TableCell>{s.place}</TableCell>
                    <TableCell>{s.notes}</TableCell>
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

export default SecretarySacraments; 