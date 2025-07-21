import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

const SecretarySettings = () => {
  const [email, setEmail] = useState('');
  const [notifications, setNotifications] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Save settings logic here
    alert('Settings saved!');
  };

  return (
    <Card>
      <CardHeader><CardTitle>Secretary Settings</CardTitle></CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
          <div>
            <Label>Email</Label>
            <Input value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter your email" />
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" checked={notifications} onChange={e => setNotifications(e.target.checked)} id="notifications" />
            <Label htmlFor="notifications">Enable notifications</Label>
          </div>
          <Button type="submit">Save Settings</Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default SecretarySettings; 