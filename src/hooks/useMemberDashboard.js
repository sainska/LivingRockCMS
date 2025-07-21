import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useMemberDashboard = (userId) => {
  const [memberData, setMemberData] = useState({
    profile: null,
    memberInfo: null,
    roles: [],
    ministries: [],
    attendance: [],
    giving: [],
    messages: [],
    announcements: [],
    upcomingEvents: []
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMemberData = async () => {
    if (!userId) return;

    try {
      setLoading(true);
      console.log('🔄 Fetching member dashboard data for:', userId);

      // Fetch member profile and activity using the database function
      const { data: activityData, error: activityError } = await supabase
        .rpc('get_member_activity', { user_uuid: userId });

      if (activityError) {
        console.warn('Member activity fetch warning:', activityError);
      }

      // Fetch member's ministries
      const { data: ministriesData, error: ministriesError } = await supabase
        .from('ministry_members')
        .select(`
          role,
          join_date,
          ministries(
            id,
            name,
            description,
            meeting_time,
            location,
            is_active
          )
        `)
        .eq('user_id', userId);

      // Fetch member's attendance records
      const { data: attendanceData, error: attendanceError } = await supabase
        .from('attendance_records')
        .select(`
          attendance_status,
          notes,
          created_at,
          events(
            id,
            title,
            start_date,
            location,
            event_type
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(20);

      // Fetch member's financial transactions
      const { data: givingData, error: givingError } = await supabase
        .from('financial_transactions')
        .select(`
          amount,
          transaction_type,
          date,
          description,
          payment_method,
          financial_accounts(name, account_type)
        `)
        .eq('user_id', userId)
        .order('date', { ascending: false })
        .limit(20);

      // Fetch messages for the member
      const { data: messagesData, error: messagesError } = await supabase
        .from('messages')
        .select(`
          id,
          subject,
          content,
          is_read,
          created_at,
          profiles!messages_sender_id_fkey(first_name, last_name)
        `)
        .eq('recipient_id', userId)
        .order('created_at', { ascending: false })
        .limit(10);

      // Fetch recent announcements
      const { data: announcementsData, error: announcementsError } = await supabase
        .from('announcements')
        .select(`
          id,
          title,
          content,
          created_at,
          profiles(first_name, last_name)
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(5);

      // Fetch upcoming events
      const { data: eventsData, error: eventsError } = await supabase
        .from('events')
        .select('*')
        .eq('is_active', true)
        .gte('start_date', new Date().toISOString())
        .order('start_date', { ascending: true })
        .limit(5);

      // Calculate attendance statistics
      const totalEvents = attendanceData?.length || 0;
      const presentCount = attendanceData?.filter(a => a.attendance_status === 'present').length || 0;
      const attendanceRate = totalEvents > 0 ? (presentCount / totalEvents * 100).toFixed(1) : 0;

      // Calculate giving statistics
      const totalGiven = givingData
        ?.filter(g => g.transaction_type === 'income')
        ?.reduce((sum, g) => sum + Number(g.amount), 0) || 0;

      const monthlyGiven = givingData
        ?.filter(g => g.transaction_type === 'income' && 
                     new Date(g.date).getMonth() === new Date().getMonth())
        ?.reduce((sum, g) => sum + Number(g.amount), 0) || 0;

      setMemberData({
        profile: activityData?.profile || null,
        memberInfo: activityData?.member_info || null,
        roles: activityData?.roles || [],
        ministries: ministriesData || [],
        attendance: {
          records: attendanceData || [],
          stats: {
            totalEvents,
            presentCount,
            attendanceRate: parseFloat(attendanceRate)
          }
        },
        giving: {
          transactions: givingData || [],
          stats: {
            totalGiven,
            monthlyGiven
          }
        },
        messages: messagesData || [],
        announcements: announcementsData || [],
        upcomingEvents: eventsData || []
      });

      console.log('✅ Member dashboard data loaded:', {
        profile: !!activityData?.profile,
        ministries: ministriesData?.length,
        attendance: attendanceData?.length,
        giving: givingData?.length,
        messages: messagesData?.length
      });

    } catch (err) {
      console.error('❌ Error fetching member data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMemberData();

    // Set up real-time subscriptions for member-specific data
    const subscriptions = [
      supabase
        .channel('member-ministries-changes')
        .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'ministry_members', filter: `user_id=eq.${userId}` },
          () => {
            console.log('🔄 Member ministries changed, refreshing...');
            fetchMemberData();
          }
        )
        .subscribe(),
      
      supabase
        .channel('member-attendance-changes')
        .on('postgres_changes',
          { event: '*', schema: 'public', table: 'attendance_records', filter: `user_id=eq.${userId}` },
          () => {
            console.log('🔄 Member attendance changed, refreshing...');
            fetchMemberData();
          }
        )
        .subscribe(),
      
      supabase
        .channel('member-transactions-changes')
        .on('postgres_changes',
          { event: '*', schema: 'public', table: 'financial_transactions', filter: `user_id=eq.${userId}` },
          () => {
            console.log('🔄 Member transactions changed, refreshing...');
            fetchMemberData();
          }
        )
        .subscribe(),
      
      supabase
        .channel('member-messages-changes')
        .on('postgres_changes',
          { event: '*', schema: 'public', table: 'messages', filter: `recipient_id=eq.${userId}` },
          () => {
            console.log('🔄 Member messages changed, refreshing...');
            fetchMemberData();
          }
        )
        .subscribe()
    ];

    return () => {
      subscriptions.forEach(sub => supabase.removeChannel(sub));
    };
  }, [userId]);

  return { memberData, loading, error, refetch: fetchMemberData };
}; 