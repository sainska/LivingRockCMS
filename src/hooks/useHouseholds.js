
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useHouseholds = () => {
  const [households, setHouseholds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const fetchHouseholds = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('households')
        .select(`
          *,
          profiles:head_of_household_id (
            first_name,
            last_name,
            email
          ),
          household_members (
            id,
            relationship,
            is_head,
            profiles:member_id (
              id,
              first_name,
              last_name,
              email,
              phone
            )
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setHouseholds(data || []);
    } catch (err) {
      console.error('Error fetching households:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createHousehold = async (householdData) => {
    try {
      const { data, error } = await supabase
        .from('households')
        .insert(householdData)
        .select()
        .single();

      if (error) throw error;
      
      setHouseholds(prev => [data, ...prev]);
      return { data, error: null };
    } catch (err) {
      console.error('Error creating household:', err);
      return { data: null, error: err.message };
    }
  };

  const updateHousehold = async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from('households')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      setHouseholds(prev => prev.map(h => h.id === id ? { ...h, ...data } : h));
      return { data, error: null };
    } catch (err) {
      console.error('Error updating household:', err);
      return { data: null, error: err.message };
    }
  };

  const addMemberToHousehold = async (householdId, memberId, relationship = 'member', isHead = false) => {
    try {
      const { data, error } = await supabase
        .from('household_members')
        .insert({
          household_id: householdId,
          member_id: memberId,
          relationship,
          is_head: isHead
        })
        .select()
        .single();

      if (error) throw error;
      
      // Refresh households to get updated member list
      await fetchHouseholds();
      return { data, error: null };
    } catch (err) {
      console.error('Error adding member to household:', err);
      return { data: null, error: err.message };
    }
  };

  useEffect(() => {
    if (user) {
      fetchHouseholds();
    }
  }, [user]);

  return {
    households,
    loading,
    error,
    createHousehold,
    updateHousehold,
    addMemberToHousehold,
    refetch: fetchHouseholds
  };
};
