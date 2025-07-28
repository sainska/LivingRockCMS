import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const fetchAlerts = async () => {
  const { data, error } = await supabase.from('system_notifications').select('*').eq('notification_type', 'urgent').order('created_at', { ascending: false });
  if (error) throw error;
  return data;
};

const SecretaryAlerts = () => {
  const navigate = useNavigate();
  const { data: alerts, isLoading, error } = useQuery(['secretary_alerts'], fetchAlerts);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Button variant="outline" onClick={() => navigate('/dashboard/secretary')}>Back to Dashboard</Button>
        <h2 className="text-2xl font-bold">Urgent Alerts</h2>
      </div>
      <Card>
        <CardHeader><CardTitle>Urgent Alerts</CardTitle></CardHeader>
        <CardContent>
          {isLoading ? <div>Loading...</div> :
            error ? <div className="text-red-500">{error.message || error}</div> :
            alerts?.length === 0 ? <div>No urgent alerts found.</div> :
            alerts.map(alert => (
              <div key={alert.id} className="mb-3 p-2 rounded bg-gradient-to-r from-red-100 to-red-200">
                <div className="font-semibold text-red-700">{alert.title || 'Urgent Alert'}</div>
                <div className="text-xs text-gray-500">{alert.created_at ? new Date(alert.created_at).toLocaleString() : ''}</div>
                <div className="text-sm">{alert.message}</div>
              </div>
            ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default SecretaryAlerts; 