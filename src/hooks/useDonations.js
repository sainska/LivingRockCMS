
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useDonations = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const { data, error } = await supabase
          .from('donations')
          .select(`
            *,
            profiles!donations_donor_id_fkey (
              first_name,
              last_name
            ),
            donation_campaigns (
              name
            )
          `)
          .order('donation_date', { ascending: false });

        if (error) throw error;
        setDonations(data || []);
      } catch (err) {
        console.error('Error fetching donations:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDonations();

    // Real-time subscription
    const subscription = supabase
      .channel('donations-realtime')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'donations' },
        () => fetchDonations()
      )
      .subscribe();

    return () => supabase.removeChannel(subscription);
  }, []);

  return { donations, loading, error };
};
