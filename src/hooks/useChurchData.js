
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export const useChurchData = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalMembers: 0,
    totalEvents: 0,
    totalDonations: 0,
    totalSermons: 0,
    recentDonations: [],
    upcomingEvents: [],
    recentMembers: [],
    monthlyDonations: 0,
    weeklyAttendance: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) return;

    const fetchChurchData = async () => {
      try {
        console.log('Fetching church data...');
        
        // Fetch total members
        const { data: membersData, error: membersError } = await supabase
          .from('members')
          .select('id, created_at, profiles:user_id(first_name, last_name)')
          .eq('status', 'active');

        if (membersError) {
          console.error('Error fetching members:', membersError);
        }

        // Fetch total events
        const { data: eventsData, error: eventsError } = await supabase
          .from('events')
          .select('id, title, start_date, location')
          .gte('start_date', new Date().toISOString())
          .order('start_date', { ascending: true })
          .limit(5);

        if (eventsError) {
          console.error('Error fetching events:', eventsError);
        }

        // Fetch donations
        const { data: donationsData, error: donationsError } = await supabase
          .from('donations')
          .select('id, amount, donation_date, purpose')
          .order('created_at', { ascending: false })
          .limit(10);

        if (donationsError) {
          console.error('Error fetching donations:', donationsError);
        }

        // Fetch monthly donations
        const currentMonth = new Date().toISOString().slice(0, 7);
        const { data: monthlyData, error: monthlyError } = await supabase
          .from('donations')
          .select('amount')
          .gte('donation_date', `${currentMonth}-01`)
          .lt('donation_date', `${currentMonth}-31`);

        if (monthlyError) {
          console.error('Error fetching monthly donations:', monthlyError);
        }

        // Fetch sermons
        const { data: sermonsData, error: sermonsError } = await supabase
          .from('sermons')
          .select('count');

        if (sermonsError) {
          console.error('Error fetching sermons count:', sermonsError);
        }

        // Calculate stats
        const totalMembers = membersData?.length || 0;
        const totalEvents = eventsData?.length || 0;
        const totalDonations = donationsData?.reduce((sum, d) => sum + (parseFloat(d.amount) || 0), 0) || 0;
        const monthlyDonations = monthlyData?.reduce((sum, d) => sum + (parseFloat(d.amount) || 0), 0) || 0;

        setStats({
          totalMembers,
          totalEvents,
          totalDonations,
          totalSermons: sermonsData?.[0]?.count || 0,
          recentDonations: donationsData || [],
          upcomingEvents: eventsData || [],
          recentMembers: membersData?.slice(0, 5) || [],
          monthlyDonations,
          weeklyAttendance: Math.floor(totalMembers * 0.75) // Estimate based on members
        });

      } catch (err) {
        console.error('Error fetching church data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchChurchData();

    // Set up real-time subscriptions
    const membersSubscription = supabase
      .channel('members-stats')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'members' }, fetchChurchData)
      .subscribe();

    const donationsSubscription = supabase
      .channel('donations-stats')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'donations' }, fetchChurchData)
      .subscribe();

    const eventsSubscription = supabase
      .channel('events-stats')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'events' }, fetchChurchData)
      .subscribe();

    return () => {
      membersSubscription.unsubscribe();
      donationsSubscription.unsubscribe();
      eventsSubscription.unsubscribe();
    };
  }, [user]);

  return { stats, loading, error };
};
