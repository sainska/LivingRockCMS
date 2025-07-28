import React, { useState } from 'react';
import { usePrayerWall } from '@/hooks/usePrayerWall';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const PrayerWall = () => {
  const { requests, loading, error, postRequest } = usePrayerWall();
  const [content, setContent] = useState('');
  const [anonymous, setAnonymous] = useState(false);

  const handlePost = () => {
    if (!content.trim()) return;
    postRequest(content, anonymous);
    setContent('');
    setAnonymous(false);
  };

  return (
    <Card className="max-w-lg mx-auto">
      <CardHeader>
        <CardTitle>Prayer Wall</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <textarea
            className="border p-2 w-full mb-2"
            placeholder="Share a prayer request..."
            value={content}
            onChange={e => setContent(e.target.value)}
          />
          <label className="flex items-center gap-2 mb-2">
            <input type="checkbox" checked={anonymous} onChange={e => setAnonymous(e.target.checked)} />
            Post as anonymous
          </label>
          <Button onClick={handlePost}>Post Request</Button>
        </div>
        <div className="space-y-2">
          {loading && <div>Loading requests...</div>}
          {error && <div className="text-red-600">{error}</div>}
          {requests.map(req => (
            <div key={req.id} className="border-b pb-2 mb-2">
              <div className="font-semibold">{req.anonymous ? 'Anonymous' : req.user_name || 'Member'}</div>
              <div>{req.content}</div>
              <div className="text-xs text-gray-400">{new Date(req.created_at).toLocaleString()}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PrayerWall; 