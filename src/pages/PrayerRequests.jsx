import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { usePrayerRequests } from '@/hooks/usePrayerRequests';
import { Heart } from 'lucide-react';

const PrayerRequests = () => {
  const { prayerRequests, loading, error } = usePrayerRequests();

  return (
    <div className="max-w-2xl mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="text-pink-500" />
            Prayer Requests
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading && <p>Loading prayer requests...</p>}
          {error && <p className="text-red-600">Error: {error}</p>}
          {!loading && !error && (
            <div>
              {prayerRequests && prayerRequests.length > 0 ? (
                <ul className="space-y-4">
                  {prayerRequests.map((request) => (
                    <li key={request.id} className="p-4 bg-gray-50 rounded shadow">
                      <div className="font-semibold">{request.title || 'Prayer Request'}</div>
                      <div className="text-sm text-muted-foreground">{request.description || request.details || 'No details provided.'}</div>
                      <div className="text-xs text-gray-400 mt-2">{request.created_at ? new Date(request.created_at).toLocaleString() : ''}</div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-center text-muted-foreground">No active prayer requests.</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PrayerRequests; 