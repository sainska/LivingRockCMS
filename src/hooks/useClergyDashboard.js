import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useClergyDashboard = (userId) => {
  const [clergyData, setClergyData] = useState({
    profile: null,
    ministries: [],
    pastoralVisits: [],
    counselingSessions: [],
    memberRequests: [],
    attendanceStats: {},
    memberActivity: [],
    upcomingEvents: [],
    announcements: [],
    prayerRequests: []
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchClergyData = async () => {
    if (!userId) return;

    try {
      setLoading(true);
      console.log('🔄 Fetching clergy dashboard data for:', userId);

      // Fetch clergy profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      // Fetch ministries led by this clergy
      const { data: ministriesData, error: ministriesError } = await supabase
        .from('ministries')
        .select(`
          *,
          ministry_members(
            user_id,
            role,
            profiles(first_name, last_name, email, phone)
          )
        `)
        .eq('leader_id', userId)
        .eq('is_active', true);

      // Fetch pastoral visits conducted by this clergy
      const { data: visitsData, error: visitsError } = await supabase
        .from('pastoral_visits')
        .select(`
          *,
          profiles!pastoral_visits_visited_id_fkey(
            first_name,
            last_name,
            email,
            phone,
            address
          )
        `)
        .eq('visitor_id', userId)
        .order('visit_date', { ascending: false })
        .limit(50);

      // Fetch counseling sessions conducted by this clergy
      const { data: counselingData, error: counselingError } = await supabase
        .from('counseling_sessions')
        .select(`
          *,
          profiles!counseling_sessions_client_id_fkey(
            first_name,
            last_name,
            email,
            phone
          )
        `)
        .eq('counselor_id', userId)
        .order('session_date', { ascending: false })
        .limit(50);

      // Fetch all members for pastoral care overview
      const { data: membersData, error: membersError } = await supabase
        .from('profiles')
        .select(`
          id,
          first_name,
          last_name,
          email,
          phone,
          date_of_birth,
          gender,
          address,
          city,
          user_roles(role),
          members(status, join_date),
          ministry_members(
            ministry_id,
            role,
            ministries(name)
          ),
          attendance_records(
            attendance_status,
            events(title, start_date)
          )
        `)
        .contains('user_roles', [{ role: 'member' }])
        .order('first_name');

      // Fetch recent attendance records for all events
      const { data: attendanceData, error: attendanceError } = await supabase
        .from('attendance_records')
        .select(`
          attendance_status,
          created_at,
          events(
            id,
            title,
            start_date,
            event_type
          ),
          profiles(
            first_name,
            last_name
          )
        `)
        .order('created_at', { ascending: false })
        .limit(100);

      // Fetch upcoming events
      const { data: eventsData, error: eventsError } = await supabase
        .from('events')
        .select('*')
        .eq('is_active', true)
        .gte('start_date', new Date().toISOString())
        .order('start_date', { ascending: true })
        .limit(10);

      // Fetch announcements
      const { data: announcementsData, error: announcementsError } = await supabase
        .from('announcements')
        .select(`
          *,
          profiles(first_name, last_name)
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(10);

      // Calculate attendance statistics
      const totalEvents = attendanceData?.length || 0;
      const presentCount = attendanceData?.filter(a => a.attendance_status === 'present').length || 0;
      const absentCount = attendanceData?.filter(a => a.attendance_status === 'absent').length || 0;
      const lateCount = attendanceData?.filter(a => a.attendance_status === 'late').length || 0;
      const attendanceRate = totalEvents > 0 ? (presentCount / totalEvents * 100).toFixed(1) : 0;

      // Calculate pastoral care statistics
      const totalVisits = visitsData?.length || 0;
      const visitsThisMonth = visitsData?.filter(v => {
        const visitDate = new Date(v.visit_date);
        const now = new Date();
        return visitDate.getMonth() === now.getMonth() && 
               visitDate.getFullYear() === now.getFullYear();
      }).length || 0;

      const totalCounselingSessions = counselingData?.length || 0;
      const sessionsThisMonth = counselingData?.filter(c => {
        const sessionDate = new Date(c.session_date);
        const now = new Date();
        return sessionDate.getMonth() === now.getMonth() && 
               sessionDate.getFullYear() === now.getFullYear();
      }).length || 0;

      // Get members needing follow-up
      const membersNeedingFollowUp = visitsData
        ?.filter(v => v.follow_up_required)
        ?.map(v => ({
          ...v.profiles,
          lastVisitDate: v.visit_date,
          visitPurpose: v.purpose
        })) || [];

      // Get upcoming counseling sessions
      const upcomingCounseling = counselingData
        ?.filter(c => new Date(c.session_date) > new Date())
        ?.sort((a, b) => new Date(a.session_date) - new Date(b.session_date))
        ?.slice(0, 5) || [];

      setClergyData({
        profile: profileData,
        ministries: ministriesData || [],
        pastoralVisits: {
          all: visitsData || [],
          thisMonth: visitsThisMonth,
          total: totalVisits,
          needingFollowUp: membersNeedingFollowUp
        },
        counselingSessions: {
          all: counselingData || [],
          thisMonth: sessionsThisMonth,
          total: totalCounselingSessions,
          upcoming: upcomingCounseling
        },
        memberRequests: membersNeedingFollowUp,
        attendanceStats: {
          totalEvents,
          presentCount,
          absentCount,
          lateCount,
          attendanceRate: parseFloat(attendanceRate)
        },
        memberActivity: membersData || [],
        upcomingEvents: eventsData || [],
        announcements: announcementsData || [],
        prayerRequests: [] // Will be implemented when prayer_requests table is added
      });

      console.log('✅ Clergy dashboard data loaded:', {
        profile: !!profileData,
        ministries: ministriesData?.length,
        visits: visitsData?.length,
        counseling: counselingData?.length,
        members: membersData?.length,
        attendanceRate: parseFloat(attendanceRate)
      });

    } catch (err) {
      console.error('❌ Error fetching clergy data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClergyData();

    // Set up real-time subscriptions for clergy-specific data
    const subscriptions = [
      supabase
        .channel('clergy-ministries-changes')
        .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'ministries', filter: `leader_id=eq.${userId}` },
          () => {
            console.log('🔄 Clergy ministries changed, refreshing...');
            fetchClergyData();
          }
        )
        .subscribe(),
      
      supabase
        .channel('clergy-visits-changes')
        .on('postgres_changes',
          { event: '*', schema: 'public', table: 'pastoral_visits', filter: `visitor_id=eq.${userId}` },
          () => {
            console.log('🔄 Clergy visits changed, refreshing...');
            fetchClergyData();
          }
        )
        .subscribe(),
      
      supabase
        .channel('clergy-counseling-changes')
        .on('postgres_changes',
          { event: '*', schema: 'public', table: 'counseling_sessions', filter: `counselor_id=eq.${userId}` },
          () => {
            console.log('🔄 Clergy counseling changed, refreshing...');
            fetchClergyData();
          }
        )
        .subscribe(),
      
      supabase
        .channel('attendance-changes')
        .on('postgres_changes',
          { event: '*', schema: 'public', table: 'attendance_records' },
          () => {
            console.log('🔄 Attendance changed, refreshing...');
            fetchClergyData();
          }
        )
        .subscribe()
    ];

    return () => {
      subscriptions.forEach(sub => supabase.removeChannel(sub));
    };
  }, [userId]);

  return { clergyData, loading, error, refetch: fetchClergyData };
}; 