import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';

const MemberGroups = () => {
  const { user } = useAuth();
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    supabase
      .from('ministry_group_members')
      .select('id, role, joined_at, ministry_groups(name, meeting_time, location, leader_id)')
      .eq('user_id', user.id)
      .order('joined_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) setError(error.message);
        setGroups(data || []);
        setLoading(false);
      });
  }, [user]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Groups</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : groups.length === 0 ? (
          <div>No groups found.</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Group Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Meeting Time</TableHead>
                <TableHead>Location</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {groups.map((g) => (
                <TableRow key={g.id}>
                  <TableCell>{g.ministry_groups?.name || 'N/A'}</TableCell>
                  <TableCell>{g.role}</TableCell>
                  <TableCell>{g.ministry_groups?.meeting_time || '-'}</TableCell>
                  <TableCell>{g.ministry_groups?.location || '-'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default MemberGroups; 