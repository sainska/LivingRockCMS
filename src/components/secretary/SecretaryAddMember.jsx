import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const SecretaryAddMember = () => {
  const [form, setForm] = useState({ first_name: '', last_name: '', email: '', phone: '', address: '', gender: '', date_of_birth: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await supabase.from('members').insert([form]);
    setForm({ first_name: '', last_name: '', email: '', phone: '', address: '', gender: '', date_of_birth: '' });
    setSuccess(true);
    setLoading(false);
    setTimeout(() => setSuccess(false), 2000);
  };

  return (
    <Card>
      <CardHeader><CardTitle>Add New Member</CardTitle></CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><Label>First Name</Label><Input value={form.first_name} onChange={e => setForm(f => ({ ...f, first_name: e.target.value }))} required /></div>
            <div><Label>Last Name</Label><Input value={form.last_name} onChange={e => setForm(f => ({ ...f, last_name: e.target.value }))} required /></div>
            <div><Label>Email</Label><Input value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} type="email" required /></div>
            <div><Label>Phone</Label><Input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} /></div>
            <div><Label>Gender</Label><Input value={form.gender} onChange={e => setForm(f => ({ ...f, gender: e.target.value }))} /></div>
            <div><Label>Date of Birth</Label><Input value={form.date_of_birth} onChange={e => setForm(f => ({ ...f, date_of_birth: e.target.value }))} type="date" /></div>
          </div>
          <div><Label>Address</Label><Input value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} /></div>
          <Button type="submit" className="w-full" disabled={loading}>{loading ? 'Saving...' : 'Save'}</Button>
          {success && <div className="text-green-600 mt-2">Member added successfully!</div>}
        </form>
      </CardContent>
    </Card>
  );
};

export default SecretaryAddMember; 