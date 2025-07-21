import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const SecretaryBulkSend = () => {
  const [form, setForm] = useState({ recipients: '', subject: '', content: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const recipientIds = form.recipients.split(',').map(r => r.trim()).filter(Boolean);
    const messages = recipientIds.map(recipient_id => ({
      recipient_id,
      subject: form.subject,
      content: form.content,
      sender_id: 'secretary_id', // Replace with actual secretary id
    }));
    await supabase.from('messages').insert(messages);
    setForm({ recipients: '', subject: '', content: '' });
    setSuccess(true);
    setLoading(false);
    setTimeout(() => setSuccess(false), 2000);
  };

  return (
    <Card>
      <CardHeader><CardTitle>Bulk Send Message</CardTitle></CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><Label>Recipient IDs (comma separated)</Label><Input value={form.recipients} onChange={e => setForm(f => ({ ...f, recipients: e.target.value }))} required /></div>
          <div><Label>Subject</Label><Input value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} required /></div>
          <div><Label>Content</Label><Input value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} required /></div>
          <Button type="submit" className="w-full" disabled={loading}>{loading ? 'Sending...' : 'Send'}</Button>
          {success && <div className="text-green-600 mt-2">Messages sent successfully!</div>}
        </form>
      </CardContent>
    </Card>
  );
};

export default SecretaryBulkSend; 