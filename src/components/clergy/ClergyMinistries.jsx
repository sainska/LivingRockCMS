import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const fetchGroups = async () => {
  const { data, error } = await supabase.from('ministry_groups').select('*').order('name');
  if (error) throw error;
  return data;
};

const ClergyMinistries = () => {
  const { data: groups, isLoading } = useQuery(['clergy_groups'], fetchGroups);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Ministry Oversight</h2>
      <Card>
        <CardHeader><CardTitle>Groups Overview</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Leader</TableHead>
                <TableHead>Members</TableHead>
                <TableHead>Growth</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? <TableRow><TableCell colSpan={4}>Loading...</TableCell></TableRow> :
                groups?.map(g => (
                  <TableRow key={g.id}>
                    <TableCell>{g.name}</TableCell>
                    <TableCell>{g.leader_id}</TableCell>
                    <TableCell>{g.current_members}</TableCell>
                    <TableCell>{g.growth || '-'}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClergyMinistries; 