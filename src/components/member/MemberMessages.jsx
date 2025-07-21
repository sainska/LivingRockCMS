import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const MemberMessages = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    supabase
      .from('messages')
      .select('*')
      .eq('recipient_id', user.id)
      .order('sent_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) setError(error.message);
        setMessages(data || []);
        setLoading(false);
      });
  }, [user]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Messages</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : messages.length === 0 ? (
          <div>No messages found.</div>
        ) : (
          <ul className="space-y-4">
            {messages.map((msg) => (
              <li key={msg.id} className="border rounded p-3 bg-gray-50">
                <div className="font-semibold">{msg.subject}</div>
                <div className="text-sm text-gray-600 mb-1">{msg.sent_at ? new Date(msg.sent_at).toLocaleString() : ''}</div>
                <div>{msg.body}</div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
};

export default MemberMessages; 