import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useChurchInfo = () => {
  const [churchInfo, setChurchInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchChurchInfo();
  }, []);

  const fetchChurchInfo = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('church_info')
        .select('*')
        .single();

      if (fetchError) {
        console.error('Error fetching church info:', fetchError);
        setError(fetchError.message);
        return;
      }

      setChurchInfo(data);
    } catch (err) {
      console.error('Error in fetchChurchInfo:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateChurchInfo = async (updates) => {
    try {
      const { error: updateError } = await supabase
        .from('church_info')
        .upsert({
          ...updates,
          updated_at: new Date().toISOString()
        });

      if (updateError) {
        console.error('Error updating church info:', updateError);
        throw updateError;
      }

      // Refresh church info after update
      await fetchChurchInfo();
    } catch (err) {
      console.error('Error updating church info:', err);
      throw err;
    }
  };

  return {
    churchInfo,
    loading,
    error,
    refreshChurchInfo: fetchChurchInfo,
    updateChurchInfo
  };
}; 