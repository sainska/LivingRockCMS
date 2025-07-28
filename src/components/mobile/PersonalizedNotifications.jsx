import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { usePersonalizedNotifications } from '@/hooks/usePersonalizedNotifications';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const PersonalizedNotifications = () => {
  const { user } = useAuth();
  const { notifications, loading, error } = usePersonalizedNotifications(user?.id);

  if (!user) return <div>Login required</div>;
  if (loading) return <div>Loading notifications...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <Card className="max-w-lg mx-auto">
      <CardHeader>
        <CardTitle>My Notifications</CardTitle>
      </CardHeader>
      <CardContent>
        <ul>
          {notifications.map(n => (
            <li key={n.id} className="mb-2 border-b pb-2">
              <div className="font-semibold">{n.title}</div>
              <div>{n.message}</div>
              <div className="text-xs text-gray-400">{new Date(n.created_at).toLocaleString()}</div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default PersonalizedNotifications; 