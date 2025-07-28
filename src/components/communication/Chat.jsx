import React, { useState } from 'react';
import { useChat } from '@/hooks/useChat';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Chat = ({ userId, recipientId, groupId }) => {
  const { messages, loading, error, sendMessage } = useChat({ userId, recipientId, groupId });
  const [newMsg, setNewMsg] = useState('');
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    if (!newMsg.trim()) return;
    setSending(true);
    await sendMessage(newMsg);
    setNewMsg('');
    setSending(false);
  };

  return (
    <Card className="max-w-lg mx-auto">
      <CardHeader>
        <CardTitle>Chat</CardTitle>
      </CardHeader>
      <CardContent>
        {loading && <div>Loading...</div>}
        {error && <div className="text-red-600">{error}</div>}
        <div className="h-64 overflow-y-auto mb-4 bg-gray-50 p-2 rounded">
          {messages.map(msg => (
            <div key={msg.id} className={`mb-2 ${msg.sender_id === userId ? 'text-right' : 'text-left'}`}>
              <span className="inline-block px-2 py-1 rounded bg-blue-100 text-blue-900">
                {msg.message}
              </span>
              <div className="text-xs text-gray-400">{new Date(msg.sent_at).toLocaleString()}</div>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            value={newMsg}
            onChange={e => setNewMsg(e.target.value)}
            placeholder="Type a message..."
            onKeyDown={e => { if (e.key === 'Enter') handleSend(); }}
            disabled={sending}
          />
          <Button onClick={handleSend} disabled={sending || !newMsg.trim()}>
            Send
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default Chat; 