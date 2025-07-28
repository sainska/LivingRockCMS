import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useMemberDirectory() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    supabase
      .from('profiles')
      .select('id, first_name, last_name, email, phone, photo_url, privacy_settings')
      .then(({ data, error }) => {
        if (error) setError(error.message);
        else setMembers(data || []);
        setLoading(false);
      });
  }, []);

  return { members, loading, error };
} 