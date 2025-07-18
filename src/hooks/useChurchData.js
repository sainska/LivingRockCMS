
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useChurchData = () => {
  const [stats, setStats] = useState({
    total_members: 0,
    new_members_this_month: 0,
    upcoming_events: 0,
    total_donations: 0,
    monthly_donations: 0,
    active_ministries: 0,
    pending_communications: 0,
    prayer_requests: 0,
    totalMembers: 0,
    totalEvents: 0,
    monthlyDonations: 0,
    weeklyAttendance: 0,
    recentDonations: [],
    upcomingEvents: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setLoading(true);
        console.log('Fetching dashboard statistics...');

        // Fetch dashboard stats using the database function
        const { data: dashboardData, error: dashboardError } = await supabase
          .rpc('get_dashboard_stats');

        if (dashboardError) {
          console.error('Dashboard stats error:', dashboardError);
        }

        // Fetch recent donations with profile data
        const { data: donationsData, error: donationsError } = await supabase
          .from('donations')
          .select(`
            id,
            amount,
            donation_date,
            donation_type,
            purpose,
            is_anonymous,
            profiles!donations_donor_id_fkey (
              first_name,
              last_name
            )
          `)
          .order('donation_date', { ascending: false })
          .limit(10);

        if (donationsError) {
          console.error('Donations fetch error:', donationsError);
        }

        // Fetch upcoming events
        const { data: eventsData, error: eventsError } = await supabase
          .from('events')
          .select('*')
          .gte('start_date', new Date().toISOString())
          .order('start_date', { ascending: true })
          .limit(10);

        if (eventsError) {
          console.error('Events fetch error:', eventsError);
        }

        // Fetch members count from profiles table
        const { count: membersCount, error: membersError } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });

        if (membersError) {
          console.error('Members count error:', membersError);
        }

        const statsData = dashboardData?.[0] || {};
        
        setStats({
          ...statsData,
          totalMembers: membersCount || 0,
          totalEvents: eventsData?.length || 0,
          monthlyDonations: statsData.monthly_donations || 0,
          weeklyAttendance: 350, // This would come from attendance records
          recentDonations: donationsData || [],
          upcomingEvents: eventsData || []
        });

        console.log('Dashboard stats loaded:', {
          ...statsData,
          totalMembers: membersCount,
          recentDonations: donationsData?.length,
          upcomingEvents: eventsData?.length
        });

      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();

    // Set up real-time subscriptions for data changes
    const donationsSubscription = supabase
      .channel('donations-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'donations' },
        () => {
          console.log('Donations changed, refreshing stats...');
          fetchDashboardStats();
        }
      )
      .subscribe();

    const eventsSubscription = supabase
      .channel('events-changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'events' },
        () => {
          console.log('Events changed, refreshing stats...');
          fetchDashboardStats();
        }
      )
      .subscribe();

    const profilesSubscription = supabase
      .channel('profiles-changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'profiles' },
        () => {
          console.log('Profiles changed, refreshing stats...');
          fetchDashboardStats();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(donationsSubscription);
      supabase.removeChannel(eventsSubscription);
      supabase.removeChannel(profilesSubscription);
    };
  }, []);

  return { stats, loading, error };
};
