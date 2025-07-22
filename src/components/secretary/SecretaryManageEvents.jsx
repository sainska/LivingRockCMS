import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';

const SecretaryManageEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    supabase
      .from('events')
      .select('id, title, event_type, start_date, end_date, location, status')
      .then(({ data, error }) => {
        if (error) setError(error.message);
        setEvents(data || []);
        setLoading(false);
      });
  }, []);

  return (
    <Card>
      <CardHeader><CardTitle>Manage Events</CardTitle></CardHeader>
      <CardContent>
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div className="text-red-500">Error: {error}</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {events.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">No events found.</TableCell>
                </TableRow>
              ) : (
                events.map(e => (
                  <TableRow key={e.id}>
                    <TableCell>{e.title}</TableCell>
                    <TableCell>{e.event_type}</TableCell>
                    <TableCell>{e.start_date}</TableCell>
                    <TableCell>{e.end_date}</TableCell>
                    <TableCell>{e.location}</TableCell>
                    <TableCell>{e.status}</TableCell>
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

export default SecretaryManageEvents; 