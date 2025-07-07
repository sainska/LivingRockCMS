
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
  }, [user]);

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

  return {
    members,
    loading,
    error,
    updateMember
  };
};
