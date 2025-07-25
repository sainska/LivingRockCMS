import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
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

const ClergyCommunication = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { data: announcements, isLoading: loadingAnnouncements, error: announcementsError } = useQuery(['clergy_announcements'], fetchAnnouncements);
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
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => navigate('/dashboard/clergy')}>Back to Dashboard</Button>
          <h2 className="text-2xl font-bold">Announcements</h2>
        </div>
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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Content</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loadingAnnouncements ? <TableRow><TableCell colSpan={4}>Loading...</TableCell></TableRow> :
                announcementsError ? <TableRow><TableCell colSpan={4} className="text-red-500">{announcementsError.message || announcementsError}</TableCell></TableRow> :
                announcements?.length === 0 ? <TableRow><TableCell colSpan={4}>No announcements found.</TableCell></TableRow> :
                announcements?.map(a => (
                  <TableRow key={a.id}>
                    <TableCell>{a.title}</TableCell>
                    <TableCell>{a.content}</TableCell>
                    <TableCell>{a.priority}</TableCell>
                    <TableCell>{a.created_at ? new Date(a.created_at).toLocaleString() : ''}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClergyCommunication; 