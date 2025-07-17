
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useMinistries = () => {
  const [ministries, setMinistries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const fetchMinistries = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('ministries')
        .select(`
          *,
          leader:leader_id (
            first_name,
            last_name,
            email
          ),
          co_leader:co_leader_id (
            first_name,
            last_name,
            email
          ),
          ministry_members (
            id,
            role,
            joined_date,
            is_active,
            profiles:member_id (
              id,
              first_name,
              last_name,
              email
            )
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMinistries(data || []);
    } catch (err) {
      console.error('Error fetching ministries:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createMinistry = async (ministryData) => {
    try {
      const { data, error } = await supabase
        .from('ministries')
        .insert(ministryData)
        .select()
        .single();

      if (error) throw error;
      
      setMinistries(prev => [data, ...prev]);
      return { data, error: null };
    } catch (err) {
      console.error('Error creating ministry:', err);
      return { data: null, error: err.message };
    }
  };

  const updateMinistry = async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from('ministries')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      setMinistries(prev => prev.map(m => m.id === id ? { ...m, ...data } : m));
      return { data, error: null };
    } catch (err) {
      console.error('Error updating ministry:', err);
      return { data: null, error: err.message };
    }
  };

  const addMemberToMinistry = async (ministryId, memberId, role = 'member') => {
    try {
      const { data, error } = await supabase
        .from('ministry_members')
        .insert({
          ministry_id: ministryId,
          member_id: memberId,
          role
        })
        .select()
        .single();

      if (error) throw error;
      
      // Refresh ministries to get updated member list
      await fetchMinistries();
      return { data, error: null };
    } catch (err) {
      console.error('Error adding member to ministry:', err);
      return { data: null, error: err.message };
    }
  };

  const removeMemberFromMinistry = async (ministryId, memberId) => {
    try {
      const { error } = await supabase
        .from('ministry_members')
        .delete()
        .eq('ministry_id', ministryId)
        .eq('member_id', memberId);

      if (error) throw error;
      
      // Refresh ministries to get updated member list
      await fetchMinistries();
      return { error: null };
    } catch (err) {
      console.error('Error removing member from ministry:', err);
      return { error: err.message };
    }
  };

  useEffect(() => {
    if (user) {
      fetchMinistries();
    }
  }, [user]);

  return {
    ministries,
    loading,
    error,
    createMinistry,
    updateMinistry,
    addMemberToMinistry,
    removeMemberFromMinistry,
    refetch: fetchMinistries
  };
};
