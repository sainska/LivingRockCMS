import React from 'react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';

const GroupJoinRequests = ({ joinRequests }) => (
  <div>
    <h3 className="font-semibold mb-2 text-lg">Join Requests</h3>
    {joinRequests.length === 0 ? (
      <div>No join requests found.</div>
    ) : (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Group Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Requested At</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {joinRequests.map((r) => (
            <TableRow key={r.id}>
              <TableCell>{r.ministry_groups?.name || 'N/A'}</TableCell>
              <TableCell>{r.status}</TableCell>
              <TableCell>{r.requested_at ? new Date(r.requested_at).toLocaleString() : '-'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    )}
  </div>
);

export default GroupJoinRequests; 