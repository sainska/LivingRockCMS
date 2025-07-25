import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import GroupList from './GroupList';
import GroupJoinRequests from './GroupJoinRequests';

const MemberGroups = () => {
  const { user } = useAuth();
  const [groups, setGroups] = useState([]);
  const [joinRequests, setJoinRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    Promise.all([
      supabase
        .from('ministry_group_members')
        .select('id, role, joined_at, ministry_groups(name, meeting_time, location, leader_id)')
        .eq('user_id', user.id),
      supabase
        .from('ministry_group_join_requests')
        .select('id, status, requested_at, ministry_groups(name, meeting_time, location, leader_id)')
        .eq('user_id', user.id)
    ])
      .then(([groupsRes, joinReqsRes]) => {
        if (groupsRes.error) setError(groupsRes.error.message);
        else if (joinReqsRes.error) setError(joinReqsRes.error.message);
        setGroups(groupsRes.data || []);
        setJoinRequests(joinReqsRes.data || []);
        setLoading(false);
      })
      .catch((err) => {
        setError('Network error: Failed to fetch. Please check your connection or CORS settings.');
        setLoading(false);
      });
  }, [user]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ministries & Groups</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : (
          <>
            <GroupList groups={groups} />
            <GroupJoinRequests joinRequests={joinRequests} />
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default MemberGroups; 