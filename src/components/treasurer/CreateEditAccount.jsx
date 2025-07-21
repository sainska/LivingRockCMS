import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const CreateEditAccount = ({ account, onSave }) => {
  const [form, setForm] = useState(account || { name: '', description: '', status: 'active' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      let result;
      if (form.id) {
        result = await supabase.from('financial_accounts').update(form).eq('id', form.id);
      } else {
        result = await supabase.from('financial_accounts').insert([form]);
      }
      if (result.error) throw result.error;
      if (onSave) onSave();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader><CardTitle>{form.id ? 'Edit Account' : 'Create Account'}</CardTitle></CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><Label>Name</Label><Input name="name" value={form.name} onChange={handleChange} required /></div>
          <div><Label>Description</Label><Input name="description" value={form.description} onChange={handleChange} /></div>
          <div><Label>Status</Label><Input name="status" value={form.status} onChange={handleChange} /></div>
          {error && <div className="text-red-500">{error}</div>}
          <Button type="submit" className="w-full" disabled={loading}>{loading ? 'Saving...' : 'Save'}</Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreateEditAccount; 