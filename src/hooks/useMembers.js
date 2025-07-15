
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export const useMembers = () => {
  const { user } = useAuth();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) return;

    const fetchMembers = async () => {
      try {
        console.log('Fetching members...');
        const { data, error } = await supabase
          .from('members')
          .select(`
            *,
            profiles:user_id (
              first_name,
              last_name,
              email,
              phone,
              profile_image_url
            )
          `)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching members:', error);
          setError(error.message);
        } else {
          setMembers(data || []);
        }
      } catch (err) {
        console.error('Error in fetchMembers:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();

    // Set up real-time subscription
    const subscription = supabase
      .channel('members-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'members'
        },
        () => {
          fetchMembers();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user]);

  const addMember = async (memberData) => {
    try {
      const { data, error } = await supabase
        .from('members')
        .insert([{
          ...memberData,
          user_id: memberData.user_id || user.id,
          membership_number: `MEM${Date.now()}`,
          join_date: new Date().toISOString().split('T')[0]
        }])
        .select()
        .single();

      if (error) throw error;

      setMembers(prev => [data, ...prev]);
      return { data, error: null };
    } catch (error) {
      console.error('Error adding member:', error);
      return { data: null, error };
    }
  };

  const updateMember = async (memberId, updates) => {
    try {
      const { data, error } = await supabase
        .from('members')
        .update(updates)
        .eq('id', memberId)
        .select()
        .single();

      if (error) throw error;

      setMembers(prev => prev.map(member => 
        member.id === memberId ? { ...member, ...data } : member
      ));
      
      return { data, error: null };
    } catch (error) {
      console.error('Error updating member:', error);
      return { data: null, error };
    }
  };

  const deleteMember = async (memberId) => {
    try {
      const { error } = await supabase
        .from('members')
        .delete()
        .eq('id', memberId);

      if (error) throw error;

      setMembers(prev => prev.filter(member => member.id !== memberId));
      return { error: null };
    } catch (error) {
      console.error('Error deleting member:', error);
      return { error };
    }
  };

  return {
    members,
    loading,
    error,
    addMember,
    updateMember,
    deleteMember
  };
};
