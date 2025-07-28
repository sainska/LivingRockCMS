import React from 'react';
import { useEventTickets } from '@/hooks/useEventTickets';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import QRCode from 'react-qr-code';
import { useAuth } from '@/contexts/AuthContext';

const EventTicket = () => {
  const { user } = useAuth();
  const { tickets, loading, error, generateTicketCode } = useEventTickets(user?.id);

  if (!user) return <div>Login required</div>;
  if (loading) return <div>Loading tickets...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">My Event Tickets</h2>
      {tickets.length === 0 && <div>No event registrations found.</div>}
      {tickets.map(ticket => (
        <Card key={ticket.id} className="mb-4">
          <CardHeader>
            <CardTitle>{ticket.events?.title} ({ticket.events?.date})</CardTitle>
          </CardHeader>
          <CardContent>
            {ticket.ticket_code ? (
              <div className="flex flex-col items-center">
                <QRCode value={ticket.ticket_code} size={128} />
                <div className="mt-2 font-mono">{ticket.ticket_code}</div>
                <Button onClick={() => window.print()}>Download/Print Ticket</Button>
              </div>
            ) : (
              <Button onClick={() => generateTicketCode(ticket.id)}>
                Generate Ticket
              </Button>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default EventTicket; 