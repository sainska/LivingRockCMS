import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useRealTimeData = () => {
  const [data, setData] = useState({
    // Dashboard Stats
    stats: {
      totalMembers: 0,
      totalMinistries: 0,
      totalEvents: 0,
      totalTransactions: 0,
      monthlyIncome: 0,
      monthlyExpenses: 0,
      activePrayerRequests: 0,
      unreadMessages: 0
    },
    
    // Member Data
    members: [],
    memberProfiles: [],
    memberActivity: [],
    
    // Financial Data
    financialAccounts: [],
    financialTransactions: [],
    financialSummary: {},
    
    // Event Data
    events: [],
    upcomingEvents: [],
    attendanceRecords: [],
    
    // Ministry Data
    ministries: [],
    ministryMembers: [],
    
    // Communication Data
    announcements: [],
    messages: [],
    unreadMessages: [],
    
    // Pastoral Care
    pastoralVisits: [],
    counselingSessions: [],
    
    // System Data
    userRoles: [],
    systemHealth: {},
    errorLogs: [],
    auditLogs: []
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      console.log('🔄 Fetching all real-time data...');

      // Fetch system health first
      const { data: healthData, error: healthError } = await supabase
        .rpc('get_system_health');
      
      if (healthError) {
        console.warn('System health fetch warning:', healthError);
      }

      // Fetch member profiles with roles
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select(`
          *,
          user_roles(role),
          members(*),
          ministry_members(
            ministry_id,
            role,
            ministries(name, description)
          )
        `)
        .order('created_at', { ascending: false });

      if (profilesError) {
        console.error('Profiles fetch error:', profilesError);
      }

      // Fetch financial data
      const { data: accountsData, error: accountsError } = await supabase
        .from('financial_accounts')
        .select('*')
        .eq('is_active', true)
        .order('name');

      const { data: transactionsData, error: transactionsError } = await supabase
        .from('financial_transactions')
        .select(`
          *,
          financial_accounts(name, account_type),
          profiles(first_name, last_name)
        `)
        .order('date', { ascending: false })
        .limit(50);

      // Fetch financial summary
      const { data: summaryData, error: summaryError } = await supabase
        .rpc('get_financial_summary');

      // Fetch events and attendance
      const { data: eventsData, error: eventsError } = await supabase
        .from('events')
        .select('*')
        .eq('is_active', true)
        .order('start_date', { ascending: true });

      const { data: attendanceData, error: attendanceError } = await supabase
        .from('attendance_records')
        .select(`
          *,
          events(title, start_date),
          profiles(first_name, last_name)
        `)
        .order('created_at', { ascending: false })
        .limit(100);

      // Fetch ministries
      const { data: ministriesData, error: ministriesError } = await supabase
        .from('ministries')
        .select(`
          *,
          profiles(first_name, last_name),
          ministry_members(
            user_id,
            role,
            profiles(first_name, last_name)
          )
        `)
        .eq('is_active', true)
        .order('name');

      // Fetch announcements
      const { data: announcementsData, error: announcementsError } = await supabase
        .from('announcements')
        .select(`
          *,
          profiles(first_name, last_name)
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(20);

      // Fetch messages
      const { data: messagesData, error: messagesError } = await supabase
        .from('messages')
        .select(`
          *,
          profiles!messages_sender_id_fkey(first_name, last_name),
          profiles!messages_recipient_id_fkey(first_name, last_name)
        `)
        .order('created_at', { ascending: false })
        .limit(50);

      // Fetch pastoral care data
      const { data: visitsData, error: visitsError } = await supabase
        .from('pastoral_visits')
        .select(`
          *,
          profiles!pastoral_visits_visitor_id_fkey(first_name, last_name),
          profiles!pastoral_visits_visited_id_fkey(first_name, last_name)
        `)
        .order('visit_date', { ascending: false })
        .limit(50);

      const { data: counselingData, error: counselingError } = await supabase
        .from('counseling_sessions')
        .select(`
          *,
          profiles!counseling_sessions_counselor_id_fkey(first_name, last_name),
          profiles!counseling_sessions_client_id_fkey(first_name, last_name)
        `)
        .order('session_date', { ascending: false })
        .limit(50);

      // Calculate stats
      const totalMembers = profilesData?.length || 0;
      const totalMinistries = ministriesData?.length || 0;
      const totalEvents = eventsData?.length || 0;
      const totalTransactions = transactionsData?.length || 0;
      
      const monthlyIncome = transactionsData
        ?.filter(t => t.transaction_type === 'income' && 
                     new Date(t.date).getMonth() === new Date().getMonth())
        ?.reduce((sum, t) => sum + Number(t.amount), 0) || 0;
      
      const monthlyExpenses = transactionsData
        ?.filter(t => t.transaction_type === 'expense' && 
                     new Date(t.date).getMonth() === new Date().getMonth())
        ?.reduce((sum, t) => sum + Number(t.amount), 0) || 0;

      const unreadMessages = messagesData?.filter(m => !m.is_read).length || 0;

      const upcomingEvents = eventsData?.filter(e => 
        new Date(e.start_date) > new Date()
      ).slice(0, 5) || [];

      // Update state
      setData({
        stats: {
          totalMembers,
          totalMinistries,
          totalEvents,
          totalTransactions,
          monthlyIncome,
          monthlyExpenses,
          activePrayerRequests: 0, // Will be implemented when prayer_requests table is added
          unreadMessages
        },
        members: profilesData?.filter(p => p.user_roles?.some(r => r.role === 'member')) || [],
        memberProfiles: profilesData || [],
        memberActivity: attendanceData || [],
        financialAccounts: accountsData || [],
        financialTransactions: transactionsData || [],
        financialSummary: summaryData || {},
        events: eventsData || [],
        upcomingEvents,
        attendanceRecords: attendanceData || [],
        ministries: ministriesData || [],
        ministryMembers: ministriesData?.flatMap(m => m.ministry_members) || [],
        announcements: announcementsData || [],
        messages: messagesData || [],
        unreadMessages: messagesData?.filter(m => !m.is_read) || [],
        pastoralVisits: visitsData || [],
        counselingSessions: counselingData || [],
        userRoles: profilesData?.flatMap(p => p.user_roles) || [],
        systemHealth: healthData || {},
        errorLogs: [],
        auditLogs: []
      });

      console.log('✅ All data loaded successfully:', {
        totalMembers,
        totalMinistries,
        totalEvents,
        totalTransactions,
        monthlyIncome,
        monthlyExpenses,
        unreadMessages
      });

    } catch (err) {
      console.error('❌ Error fetching data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();

    // Set up real-time subscriptions
    const channels = [
      'profiles-changes',
      'financial_transactions-changes',
      'events-changes',
      'ministries-changes',
      'announcements-changes',
      'messages-changes',
      'attendance_records-changes'
    ];

    const subscriptions = channels.map(channelName => 
      supabase
        .channel(channelName)
        .on('postgres_changes', 
          { event: '*', schema: 'public', table: channelName.replace('-changes', '') },
          () => {
            console.log(`🔄 ${channelName} changed, refreshing data...`);
            fetchAllData();
          }
        )
        .subscribe()
    );

    return () => {
      subscriptions.forEach(sub => supabase.removeChannel(sub));
    };
  }, []);

  return { data, loading, error, refetch: fetchAllData };
}; 