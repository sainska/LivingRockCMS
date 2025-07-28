import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useNavigate } from 'react-router-dom';

const fetchAnnouncements = async () => {
  const { data, error } = await supabase.from('announcements').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data;
};

const ClergyAnnouncements = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { data: announcements, isLoading, error } = useQuery(['clergy_announcements'], fetchAnnouncements);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ title: '', content: '', priority: 'normal' });

  const addAnnouncementMutation = useMutation(async (newAnnouncement) => {
    const { data, error } = await supabase.from('announcements').insert([newAnnouncement]);
    if (error) throw error;
    return data;
  }, {
    onSuccess: () => { setShowAdd(false); queryClient.invalidateQueries(['clergy_announcements']); }
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Button variant="outline" onClick={() => navigate('/dashboard/clergy')}>Back to Dashboard</Button>
        <h2 className="text-2xl font-bold">Announcements</h2>
        <Dialog open={showAdd} onOpenChange={setShowAdd}>
          <DialogTrigger asChild>
            <Button>Send Announcement</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>New Announcement</DialogTitle></DialogHeader>
            <form onSubmit={e => { e.preventDefault(); addAnnouncementMutation.mutate(form); }} className="space-y-4">
              <div><Label>Title</Label><Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required /></div>
              <div><Label>Content</Label><Textarea value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} required /></div>
              <div><Label>Priority</Label><Input value={form.priority} onChange={e => setForm(f => ({ ...f, priority: e.target.value }))} /></div>
              <Button type="submit" className="w-full">Save</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <Card>
        <CardHeader><CardTitle>Announcements</CardTitle></CardHeader>
        <CardContent>
          {isLoading ? <div>Loading...</div> :
            error ? <div className="text-red-500">{error.message || error}</div> :
            announcements?.length === 0 ? <div>No announcements found.</div> :
            announcements.map(a => (
              <div key={a.id} className="mb-3 p-2 rounded bg-blue-100">
                <div className="font-semibold text-blue-800">{a.title}</div>
                <div className="text-xs text-gray-500">{a.created_at ? new Date(a.created_at).toLocaleString() : ''}</div>
                <div className="text-sm">{a.content}</div>
              </div>
            ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default ClergyAnnouncements; 