import React from 'react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';

const GroupList = ({ groups }) => (
  <div className="mb-6">
    <h3 className="font-semibold mb-2 text-lg">My Groups</h3>
    {groups.length === 0 ? (
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
  </div>
);

export default GroupList; 