import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useMinistryGroups = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMinistryGroups();
  }, []);

  const fetchMinistryGroups = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('ministry_groups')
        .select(`
          *,
          leader:leader_id (
            first_name,
            last_name
          ),
          co_leader:co_leader_id (
            first_name,
            last_name
          )
        `)
        .eq('is_active', true)
        .order('name');

      if (fetchError) {
        console.error('Error fetching ministry groups:', fetchError);
        setError(fetchError.message);
        return;
      }

      setGroups(data);
    } catch (err) {
      console.error('Error in fetchMinistryGroups:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addMinistryGroup = async (groupData) => {
    try {
      const { error: insertError } = await supabase
        .from('ministry_groups')
        .insert(groupData);

      if (insertError) {
        console.error('Error adding ministry group:', insertError);
        throw insertError;
      }

      await fetchMinistryGroups();
    } catch (err) {
      console.error('Error adding ministry group:', err);
      throw err;
    }
  };

  const updateMinistryGroup = async (id, updates) => {
    try {
      const { error: updateError } = await supabase
        .from('ministry_groups')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (updateError) {
        console.error('Error updating ministry group:', updateError);
        throw updateError;
      }

      await fetchMinistryGroups();
    } catch (err) {
      console.error('Error updating ministry group:', err);
      throw err;
    }
  };

  const deleteMinistryGroup = async (id) => {
    try {
      const { error: deleteError } = await supabase
        .from('ministry_groups')
        .update({ is_active: false })
        .eq('id', id);

      if (deleteError) {
        console.error('Error deleting ministry group:', deleteError);
        throw deleteError;
      }

      await fetchMinistryGroups();
    } catch (err) {
      console.error('Error deleting ministry group:', err);
      throw err;
    }
  };

  return {
    groups,
    loading,
    error,
    refreshGroups: fetchMinistryGroups,
    addMinistryGroup,
    updateMinistryGroup,
    deleteMinistryGroup
  };
}; 