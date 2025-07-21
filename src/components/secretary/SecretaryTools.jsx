import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';

const fetchTemplates = async () => {
  const { data, error } = await supabase.from('document_templates').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data;
};
const fetchSettings = async () => {
  const { data, error } = await supabase.from('system_settings').select('*').order('setting_key');
  if (error) throw error;
  return data;
};

const SecretaryTools = () => {
  const queryClient = useQueryClient();
  const { data: templates, isLoading: loadingTemplates } = useQuery(['document_templates'], fetchTemplates);
  const { data: settings, isLoading: loadingSettings } = useQuery(['system_settings'], fetchSettings);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: '', content: '' });

  const addTemplateMutation = useMutation(async (newTemplate) => {
    const { data, error } = await supabase.from('document_templates').insert([newTemplate]);
    if (error) throw error;
    return data;
  }, {
    onSuccess: () => { setShowAdd(false); queryClient.invalidateQueries(['document_templates']); }
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">System Tools</h2>
        <Dialog open={showAdd} onOpenChange={setShowAdd}>
          <DialogTrigger asChild>
            <Button>Add Template</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add Document Template</DialogTitle></DialogHeader>
            <form onSubmit={e => { e.preventDefault(); addTemplateMutation.mutate(form); }} className="space-y-4">
              <div><Label>Name</Label><Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required /></div>
              <div><Label>Content</Label><Input value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} required /></div>
              <Button type="submit" className="w-full">Save</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <Card>
        <CardHeader><CardTitle>Document Templates</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Content</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loadingTemplates ? <TableRow><TableCell colSpan={3}>Loading...</TableCell></TableRow> :
                templates?.map(t => (
                  <TableRow key={t.id}>
                    <TableCell>{t.name}</TableCell>
                    <TableCell>{t.content}</TableCell>
                    <TableCell>{t.created_at}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Notification & Security Settings</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Key</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Description</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loadingSettings ? <TableRow><TableCell colSpan={3}>Loading...</TableCell></TableRow> :
                settings?.map(s => (
                  <TableRow key={s.id}>
                    <TableCell>{s.setting_key}</TableCell>
                    <TableCell>{s.setting_value}</TableCell>
                    <TableCell>{s.description}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default SecretaryTools; 