
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export const useDonations = () => {
  const { user } = useAuth();
  const [donations, setDonations] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) return;

    const fetchDonations = async () => {
      try {
        console.log('Fetching donations...');
        const { data: donationsData, error: donationsError } = await supabase
          .from('donations')
          .select('*')
          .order('created_at', { ascending: false });

        if (donationsError) {
          console.error('Error fetching donations:', donationsError);
          setError(donationsError.message);
        } else {
          setDonations(donationsData || []);
        }

        const { data: campaignsData, error: campaignsError } = await supabase
          .from('donation_campaigns')
          .select('*')
          .eq('is_active', true)
          .order('created_at', { ascending: false });

        if (campaignsError) {
          console.error('Error fetching campaigns:', campaignsError);
        } else {
          setCampaigns(campaignsData || []);
        }
      } catch (err) {
        console.error('Error in fetchDonations:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDonations();
  }, [user]);

  const addDonation = async (donationData) => {
    try {
      const { data, error } = await supabase
        .from('donations')
        .insert([{
          ...donationData,
          recorded_by: user.id
        }])
        .select()
        .single();

      if (error) throw error;

      setDonations(prev => [data, ...prev]);
      return { data, error: null };
    } catch (error) {
      console.error('Error adding donation:', error);
      return { data: null, error };
    }
  };

  return {
    donations,
    campaigns,
    loading,
    error,
    addDonation
  };
};
