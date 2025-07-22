import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { useAttendance } from '@/hooks/useAttendance';

const SecretaryAttendanceRecords = () => {
  const { attendanceRecords, loading, error } = useAttendance();

  return (
    <Card>
      <CardHeader><CardTitle>Attendance Records</CardTitle></CardHeader>
      <CardContent>
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div className="text-red-500">Error: {error}</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Event</TableHead>
                <TableHead>Member</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {attendanceRecords.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">No attendance records found.</TableCell>
                </TableRow>
              ) : (
                attendanceRecords.map(record => (
                  <TableRow key={record.id}>
                    <TableCell>{record.events?.title || record.event_id}</TableCell>
                    <TableCell>{record.profiles?.first_name || ''} {record.profiles?.last_name || ''}</TableCell>
                    <TableCell>{record.status || record.attendance_status}</TableCell>
                    <TableCell>{record.attendance_date || record.created_at?.split('T')[0]}</TableCell>
                    <TableCell>{record.notes || ''}</TableCell>
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

export default SecretaryAttendanceRecords; 