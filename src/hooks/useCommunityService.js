import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useCommunityService() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    supabase
      .from('community_service_projects')
      .select('*')
      .order('start_date', { ascending: false })
      .then(({ data, error }) => {
        if (error) setError(error.message);
        else setProjects(data || []);
        setLoading(false);
      });
  }, []);

  const registerParticipation = async (projectId, userId, role, hours) => {
    const { error } = await supabase.from('service_participation').insert({
      project_id: projectId,
      user_id: userId,
      role,
      hours
    });
    if (error) setError(error.message);
    else await refresh();
  };

  const refresh = async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from('community_service_projects')
      .select('*')
      .order('start_date', { ascending: false });
    if (error) setError(error.message);
    else setProjects(data || []);
    setLoading(false);
  };

  return { projects, loading, error, registerParticipation, refresh };
} 