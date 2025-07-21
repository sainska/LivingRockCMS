import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const MemberBadges = () => {
  const { user } = useAuth();
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    supabase
      .from('badges')
      .select('*')
      .eq('user_id', user.id)
      .order('awarded_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) setError(error.message);
        setBadges(data || []);
        setLoading(false);
      });
  }, [user]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Badges</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : badges.length === 0 ? (
          <div>No badges found.</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {badges.map((badge) => (
              <div key={badge.id} className="flex flex-col items-center p-2 border rounded shadow-sm bg-gray-50">
                <div className="text-3xl mb-2">🏅</div>
                <div className="font-semibold">{badge.title}</div>
                <div className="text-xs text-gray-500">{badge.awarded_at ? new Date(badge.awarded_at).toLocaleDateString() : ''}</div>
                <div className="text-xs text-gray-400">{badge.description}</div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MemberBadges; 