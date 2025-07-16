
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

let isDataFetching = false;
let cachedData = null;
let cacheExpiry = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const useChurchData = () => {
  const [stats, setStats] = useState({
    totalMembers: 0,
    totalEvents: 0,
    monthlyDonations: 0,
    weeklyAttendance: 0,
    upcomingEvents: [],
    recentDonations: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      // Check cache first
      const now = Date.now();
      if (cachedData && now < cacheExpiry) {
        console.log('useChurchData: Using cached data');
        setStats(cachedData);
        setLoading(false);
        return;
      }

      // Prevent multiple simultaneous fetches
      if (isDataFetching) {
        console.log('useChurchData: Data fetch already in progress, waiting...');
        return;
      }

      isDataFetching = true;
      console.log('Fetching church data...');

      try {
        // Fetch basic stats with error handling
        const statsPromises = [
          supabase.from('members').select('id', { count: 'exact', head: true }).then(r => r.count || 0),
          supabase.from('events').select('id', { count: 'exact', head: true }).gte('start_date', new Date().toISOString()).then(r => r.count || 0),
          supabase.from('donations').select('amount').gte('donation_date', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()).then(r => {
            return r.data?.reduce((sum, donation) => sum + (parseFloat(donation.amount) || 0), 0) || 0;
          }),
          supabase.from('attendance_records').select('id', { count: 'exact', head: true }).gte('attendance_date', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()).then(r => r.count || 0)
        ];

        const [totalMembers, totalEvents, monthlyDonations, weeklyAttendance] = await Promise.allSettled(statsPromises);

        // Fetch recent data with error handling
        const [eventsResponse, donationsResponse] = await Promise.allSettled([
          supabase.from('events').select('*').gte('start_date', new Date().toISOString()).order('start_date', { ascending: true }).limit(5),
          supabase.from('donations').select('*').order('created_at', { ascending: false }).limit(5)
        ]);

        const newStats = {
          totalMembers: totalMembers.status === 'fulfilled' ? totalMembers.value : 0,
          totalEvents: totalEvents.status === 'fulfilled' ? totalEvents.value : 0,
          monthlyDonations: monthlyDonations.status === 'fulfilled' ? monthlyDonations.value : 0,
          weeklyAttendance: weeklyAttendance.status === 'fulfilled' ? weeklyAttendance.value : 0,
          upcomingEvents: eventsResponse.status === 'fulfilled' && eventsResponse.value.data ? eventsResponse.value.data : [],
          recentDonations: donationsResponse.status === 'fulfilled' && donationsResponse.value.data ? donationsResponse.value.data : []
        };

        // Cache the data
        cachedData = newStats;
        cacheExpiry = now + CACHE_DURATION;

        setStats(newStats);
        setError(null);
      } catch (err) {
        console.error('Error fetching church data:', err);
        setError(err.message);
        
        // Use empty data on error
        const emptyStats = {
          totalMembers: 0,
          totalEvents: 0,
          monthlyDonations: 0,
          weeklyAttendance: 0,
          upcomingEvents: [],
          recentDonations: []
        };
        setStats(emptyStats);
      } finally {
        setLoading(false);
        isDataFetching = false;
      }
    };

    fetchData();
  }, []);

  return { stats, loading, error };
};
