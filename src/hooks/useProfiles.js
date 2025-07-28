
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useProfiles = () => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const fetchProfiles = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          user_roles:user_roles!user_roles_user_id_fkey (
            role,
            is_active
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProfiles(data || []);
    } catch (err) {
      console.error('Error fetching profiles:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      setProfiles(prev => prev.map(profile => 
        profile.id === id ? { ...profile, ...data } : profile
      ));
      
      return { data, error: null };
    } catch (err) {
      console.error('Error updating profile:', err);
      return { data: null, error: err.message };
    }
  };

  const assignRole = async (userId, role) => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .upsert({
          user_id: userId,
          role: role,
          assigned_by: user?.id,
          is_active: true
        }, {
          onConflict: 'user_id,role'
        });

      if (error) throw error;
      
      // Refresh profiles to get updated roles
      await fetchProfiles();
      
      return { data, error: null };
    } catch (err) {
      console.error('Error assigning role:', err);
      return { data: null, error: err.message };
    }
  };

  useEffect(() => {
    if (user) {
      fetchProfiles();
    }
  }, [user]);

  return {
    profiles,
    loading,
    error,
    updateProfile,
    assignRole,
    refetch: fetchProfiles
  };
};
