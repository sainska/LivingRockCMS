
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useMembers = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMembers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          households (
            name,
            address
          ),
          user_roles!user_roles_user_id_fkey (
            role
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      console.log('Fetched members:', data);
      setMembers(data || []);
    } catch (err) {
      console.error('Error fetching members:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addMember = async (memberData) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .insert([memberData])
        .select()
        .single();

      if (error) throw error;
      
      setMembers(prev => [data, ...prev]);
      return { data, error: null };
    } catch (err) {
      console.error('Error adding member:', err);
      return { data: null, error: err };
    }
  };

  const updateMember = async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      setMembers(prev => prev.map(member => 
        member.id === id ? { ...member, ...data } : member
      ));
      
      return { data, error: null };
    } catch (err) {
      console.error('Error updating member:', err);
      return { data: null, error: err };
    }
  };

  const deleteMember = async (id) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setMembers(prev => prev.filter(member => member.id !== id));
      return { error: null };
    } catch (err) {
      console.error('Error deleting member:', err);
      return { error: err };
    }
  };

  useEffect(() => {
    fetchMembers();

    // Real-time subscription
    const subscription = supabase
      .channel('members-realtime')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'profiles' },
        () => fetchMembers()
      )
      .subscribe();

    return () => supabase.removeChannel(subscription);
  }, []);

  return { members, loading, error, addMember, updateMember, deleteMember };
};
