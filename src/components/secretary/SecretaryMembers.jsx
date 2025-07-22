import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const SecretaryMembers = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ first_name: '', last_name: '', email: '', phone: '', address: '', gender: '', date_of_birth: '' });

  useEffect(() => {
    setLoading(true);
    async function fetchData() {
      const { data, error } = await supabase
        .from('members')
        .select('*, profiles:user_id(first_name, last_name, email, phone)');
      setMembers(data || []);
      setLoading(false);
    }
    fetchData();
  }, []);

  const handleAddMember = async (e) => {
    e.preventDefault();
    await supabase.from('members').insert([form]);
    setShowAdd(false);
    setForm({ first_name: '', last_name: '', email: '', phone: '', address: '', gender: '', date_of_birth: '' });
    setLoading(true);
    const { data } = await supabase.from('members').select('*');
    setMembers(data || []);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Member Directory</h2>
        <Dialog open={showAdd} onOpenChange={setShowAdd}>
          <DialogTrigger asChild>
            <Button>Add New Member</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add Member</DialogTitle></DialogHeader>
            <form onSubmit={handleAddMember} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><Label>First Name</Label><Input value={form.first_name} onChange={e => setForm(f => ({ ...f, first_name: e.target.value }))} required /></div>
                <div><Label>Last Name</Label><Input value={form.last_name} onChange={e => setForm(f => ({ ...f, last_name: e.target.value }))} required /></div>
                <div><Label>Email</Label><Input value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} type="email" required /></div>
                <div><Label>Phone</Label><Input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} /></div>
                <div><Label>Gender</Label><Input value={form.gender} onChange={e => setForm(f => ({ ...f, gender: e.target.value }))} /></div>
                <div><Label>Date of Birth</Label><Input value={form.date_of_birth} onChange={e => setForm(f => ({ ...f, date_of_birth: e.target.value }))} type="date" /></div>
              </div>
              <div><Label>Address</Label><Input value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} /></div>
              <Button type="submit" className="w-full">Save</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <Card>
        <CardHeader><CardTitle>All Members</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {members?.map(member => (
                  <TableRow key={member.id}>
                    <TableCell>{(member.profiles?.first_name || '-') + ' ' + (member.profiles?.last_name || '-')}</TableCell>
                    <TableCell>{member.profiles?.email || '-'}</TableCell>
                    <TableCell>{member.profiles?.phone || '-'}</TableCell>
                    <TableCell>{member.status || member.membership_status || 'Active'}</TableCell>
                    <TableCell><Button size="sm" variant="outline">Edit</Button></TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default SecretaryMembers; 