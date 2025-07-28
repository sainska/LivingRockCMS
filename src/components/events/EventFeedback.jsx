import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const EventFeedback = ({ eventId }) => {
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [comments, setComments] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    setError(null);
    if (!rating) {
      setError('Please select a rating.');
      return;
    }
    const { error } = await supabase.from('event_feedback').insert({
      event_id: eventId,
      user_id: user.id,
      rating,
      comments
    });
    if (error) setError(error.message);
    else setSubmitted(true);
  };

  if (!user) return <div>Login required</div>;
  if (submitted) return <div>Thank you for your feedback!</div>;

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Event Feedback</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-2">How would you rate this event?</div>
        <div className="flex gap-2 mb-4">
          {[1,2,3,4,5].map(star => (
            <Button key={star} variant={rating === star ? 'default' : 'outline'} onClick={() => setRating(star)}>
              {star}★
            </Button>
          ))}
        </div>
        <textarea
          className="border p-2 w-full mb-2"
          placeholder="Additional comments (optional)"
          value={comments}
          onChange={e => setComments(e.target.value)}
        />
        <Button onClick={handleSubmit}>Submit Feedback</Button>
        {error && <div className="text-red-600 mt-2">{error}</div>}
      </CardContent>
    </Card>
  );
};

export default EventFeedback; 