import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useVolunteers() {
  const [opportunities, setOpportunities] = useState([]);
  const [signups, setSignups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    async function fetchData() {
      try {
        const { data: opps, error: oppsError } = await supabase
          .from('volunteer_opportunities')
          .select('*')
          .order('created_at', { ascending: false });
        if (oppsError) throw oppsError;
        setOpportunities(opps || []);

        const { data: signupsData, error: signupsError } = await supabase
          .from('volunteer_signups')
          .select('*');
        if (signupsError) throw signupsError;
        setSignups(signupsData || []);
      } catch (err) {
        setError(err.message || 'Error fetching volunteer data');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return { opportunities, signups, loading, error };
} 