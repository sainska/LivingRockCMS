import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const MemberProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()
      .then(({ data, error }) => {
        if (error) setError(error.message);
        setProfile(data);
        setForm(data || {});
        setLoading(false);
      });
  }, [user]);

  const handleChange = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);
    const { error } = await supabase
      .from('profiles')
      .update(form)
      .eq('id', user.id);
    setSaving(false);
    if (error) setError(error.message);
    else setSuccess(true);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Profile</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : (
          <form onSubmit={handleSave} className="space-y-4 max-w-lg">
            <Input name="first_name" value={form.first_name || ''} onChange={handleChange} placeholder="First Name" required />
            <Input name="last_name" value={form.last_name || ''} onChange={handleChange} placeholder="Last Name" required />
            <Input name="email" value={form.email || ''} onChange={handleChange} placeholder="Email" type="email" required />
            <Input name="phone" value={form.phone || ''} onChange={handleChange} placeholder="Phone" />
            <Input name="address" value={form.address || ''} onChange={handleChange} placeholder="Address" />
            <Input name="membership_number" value={form.membership_number || ''} onChange={handleChange} placeholder="Membership Number" />
            <Input name="gender" value={form.gender || ''} onChange={handleChange} placeholder="Gender" />
            <Input name="date_of_birth" value={form.date_of_birth || ''} onChange={handleChange} placeholder="Date of Birth" type="date" />
            <Button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</Button>
            {success && <div className="text-green-600">Profile updated!</div>}
          </form>
        )}
      </CardContent>
    </Card>
  );
};

export default MemberProfile; 