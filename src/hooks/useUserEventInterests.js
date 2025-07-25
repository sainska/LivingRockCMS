import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export function useUserEventInterests() {
  const { user } = useAuth();
  const [interests, setInterests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    supabase
      .from('user_event_interests')
      .select('interest')
      .eq('user_id', user.id)
      .then(({ data }) => {
        setInterests(data ? data.map(i => i.interest) : []);
        setLoading(false);
      });
  }, [user]);

  const addInterest = async (interest) => {
    if (!user) return;
    await supabase.from('user_event_interests').insert([{ user_id: user.id, interest }]);
    setInterests(prev => [...prev, interest]);
  };

  const removeInterest = async (interest) => {
    if (!user) return;
    await supabase.from('user_event_interests').delete().eq('user_id', user.id).eq('interest', interest);
    setInterests(prev => prev.filter(i => i !== interest));
  };

  return { interests, loading, addInterest, removeInterest };
} 