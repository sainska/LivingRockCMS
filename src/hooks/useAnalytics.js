import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useAnalytics(userId) {
  const [engagement, setEngagement] = useState(null);
  const [giving, setGiving] = useState(null);
  const [predictive, setPredictive] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    Promise.all([
      supabase.from('engagement_analytics').select('*').eq('user_id', userId).single(),
      supabase.from('giving_analytics').select('*').eq('user_id', userId).single(),
      supabase.from('predictive_analytics').select('*').order('forecast_date', { ascending: false })
    ]).then(([eng, giv, pred]) => {
      setEngagement(eng.data);
      setGiving(giv.data);
      setPredictive(pred.data || []);
      setLoading(false);
    }).catch(e => {
      setError(e.message);
      setLoading(false);
    });
  }, [userId]);

  return { engagement, giving, predictive, loading, error };
} 