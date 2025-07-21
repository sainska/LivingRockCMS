import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useSecretaryDashboard = () => {
  const [secretaryData, setSecretaryData] = useState({
    // Member Management
    allMembers: [],
    memberStats: {
      total: 0,
      active: 0,
      inactive: 0,
      newThisMonth: 0
    },
    
    // Communications
    messages: [],
    announcements: [],
    unreadMessages: [],
    
    // Events and Attendance
    events: [],
    upcomingEvents: [],
    attendanceRecords: [],
    
    // Reports
    membershipReports: [],
    attendanceReports: [],
    financialReports: [],
    
    // Administrative
    ministries: [],
    groups: [],
    sacraments: [],
    pastoralCare: []
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSecretaryData = async () => {
    try {
      setLoading(true);
      console.log('🔄 Fetching secretary dashboard data...');

      // Fetch all members with profiles and roles
      const { data: membersData, error: membersError } = await supabase
        .from('profiles')
        .select(`
          *,
          user_roles(role),
          members(status, join_date, membership_type),
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
        .order('first_name');

      if (membersError) {
        console.error('Members fetch error:', membersError);
      }

      // Fetch messages and communications
      const { data: messagesData, error: messagesError } = await supabase
        .from('messages')
        .select(`
          *,
          profiles!messages_sender_id_fkey(first_name, last_name),
          profiles!messages_recipient_id_fkey(first_name, last_name)
        `)
        .order('created_at', { ascending: false })
        .limit(50);

      const { data: announcementsData, error: announcementsError } = await supabase
        .from('announcements')
        .select(`
          *,
          profiles(first_name, last_name)
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(20);

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
          events(title, start_date, event_type),
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

      // Calculate member statistics
      const totalMembers = membersData?.length || 0;
      const activeMembers = membersData?.filter(m => 
        m.members?.status === 'active' || m.user_roles?.some(r => r.role === 'member')
      ).length || 0;
      const inactiveMembers = totalMembers - activeMembers;
      
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      const newThisMonth = membersData?.filter(m => {
        const joinDate = new Date(m.created_at);
        return joinDate.getMonth() === currentMonth && 
               joinDate.getFullYear() === currentYear;
      }).length || 0;

      // Get unread messages
      const unreadMessages = messagesData?.filter(m => !m.is_read) || [];

      // Get upcoming events
      const upcomingEvents = eventsData?.filter(e => 
        new Date(e.start_date) > new Date()
      ).slice(0, 5) || [];

      setSecretaryData({
        allMembers: membersData || [],
        memberStats: {
          total: totalMembers,
          active: activeMembers,
          inactive: inactiveMembers,
          newThisMonth
        },
        messages: messagesData || [],
        announcements: announcementsData || [],
        unreadMessages,
        events: eventsData || [],
        upcomingEvents,
        attendanceRecords: attendanceData || [],
        membershipReports: [],
        attendanceReports: [],
        financialReports: [],
        ministries: ministriesData || [],
        groups: [],
        sacraments: [],
        pastoralCare: []
      });

      console.log('✅ Secretary dashboard data loaded:', {
        totalMembers,
        activeMembers,
        messages: messagesData?.length,
        events: eventsData?.length,
        ministries: ministriesData?.length
      });

    } catch (err) {
      console.error('❌ Error fetching secretary data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Function to add a new member
  const addMember = async (memberData) => {
    try {
      // First create a profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .insert([{
          first_name: memberData.first_name,
          last_name: memberData.last_name,
          email: memberData.email,
          phone: memberData.phone,
          address: memberData.address,
          city: memberData.city,
          gender: memberData.gender,
          date_of_birth: memberData.date_of_birth
        }])
        .select()
        .single();

      if (profileError) throw profileError;

      // Add member role
      await supabase
        .from('user_roles')
        .insert([{
          user_id: profileData.id,
          role: 'member'
        }]);

      // Create member record
      await supabase
        .from('members')
        .insert([{
          user_id: profileData.id,
          status: 'active',
          join_date: new Date().toISOString(),
          membership_type: memberData.membership_type || 'regular'
        }]);

      // Refresh data
      await fetchSecretaryData();

      return { success: true, profile: profileData };
    } catch (err) {
      console.error('Error adding member:', err);
      return { success: false, error: err.message };
    }
  };

  // Function to update member status
  const updateMemberStatus = async (userId, status) => {
    try {
      const { error } = await supabase
        .from('members')
        .update({ status })
        .eq('user_id', userId);

      if (error) throw error;

      // Refresh data
      await fetchSecretaryData();

      return { success: true };
    } catch (err) {
      console.error('Error updating member status:', err);
      return { success: false, error: err.message };
    }
  };

  // Function to send bulk message
  const sendBulkMessage = async (recipients, subject, content) => {
    try {
      const messages = recipients.map(recipientId => ({
        sender_id: null, // System message
        recipient_id: recipientId,
        subject,
        content,
        message_type: 'announcement'
      }));

      const { error } = await supabase
        .from('messages')
        .insert(messages);

      if (error) throw error;

      return { success: true };
    } catch (err) {
      console.error('Error sending bulk message:', err);
      return { success: false, error: err.message };
    }
  };

  useEffect(() => {
    fetchSecretaryData();

    // Set up real-time subscriptions
    const subscriptions = [
      supabase
        .channel('secretary-profiles-changes')
        .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'profiles' },
          () => {
            console.log('🔄 Profiles changed, refreshing secretary data...');
            fetchSecretaryData();
          }
        )
        .subscribe(),
      
      supabase
        .channel('secretary-messages-changes')
        .on('postgres_changes',
          { event: '*', schema: 'public', table: 'messages' },
          () => {
            console.log('🔄 Messages changed, refreshing secretary data...');
            fetchSecretaryData();
          }
        )
        .subscribe(),
      
      supabase
        .channel('secretary-events-changes')
        .on('postgres_changes',
          { event: '*', schema: 'public', table: 'events' },
          () => {
            console.log('🔄 Events changed, refreshing secretary data...');
            fetchSecretaryData();
          }
        )
        .subscribe(),
      
      supabase
        .channel('secretary-attendance-changes')
        .on('postgres_changes',
          { event: '*', schema: 'public', table: 'attendance_records' },
          () => {
            console.log('🔄 Attendance changed, refreshing secretary data...');
            fetchSecretaryData();
          }
        )
        .subscribe()
    ];

    return () => {
      subscriptions.forEach(sub => supabase.removeChannel(sub));
    };
  }, []);

  return { 
    secretaryData, 
    loading, 
    error, 
    refetch: fetchSecretaryData,
    addMember,
    updateMemberStatus,
    sendBulkMessage
  };
}; 