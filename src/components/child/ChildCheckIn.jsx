import React, { useState } from 'react';
import { useChildCheckIn } from '@/hooks/useChildCheckIn';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const ChildCheckIn = ({ childId, parentId }) => {
  const { sessions, loading, error, checkIn, checkOut } = useChildCheckIn(childId);
  const [guardianName, setGuardianName] = useState('');

  if (loading) return <div>Loading check-in sessions...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <Card className="max-w-lg mx-auto">
      <CardHeader>
        <CardTitle>Child Check-In/Out</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <input
            className="border p-2 w-full mb-2"
            placeholder="Guardian Name"
            value={guardianName}
            onChange={e => setGuardianName(e.target.value)}
          />
          <Button onClick={() => checkIn(parentId, guardianName)}>
            Check In
          </Button>
        </div>
        <h3 className="font-semibold mb-2">Session History</h3>
        <ul>
          {sessions.map(session => (
            <li key={session.id} className="mb-2 border-b pb-2">
              <div>Checked in: {new Date(session.checkin_time).toLocaleString()}</div>
              <div>Status: {session.status}</div>
              {session.status === 'checked_in' && (
                <Button size="sm" onClick={() => checkOut(session.id)}>
                  Check Out
                </Button>
              )}
              {session.checkout_time && <div>Checked out: {new Date(session.checkout_time).toLocaleString()}</div>}
              <div>Guardian: {session.guardian_name}</div>
              {session.notes && <div>Notes: {session.notes}</div>}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default ChildCheckIn; 