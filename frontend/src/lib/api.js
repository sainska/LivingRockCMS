import { supabase } from '@/integrations/supabase/client';

// =====================================================
// SYSTEM STATISTICS AND METRICS
// =====================================================

export const systemAPI = {
  // Get system statistics
  async getSystemStats() {
    const { data, error } = await supabase
      .from('system_stats')
      .select('*')
      .order('last_updated', { ascending: false })
      .limit(10);
    
    if (error) throw error;
    return data;
  },

  // Update system statistics
  async updateSystemStats(stats) {
    const { data, error } = await supabase
      .from('system_stats')
      .upsert(stats)
      .select();
    
    if (error) throw error;
    return data;
  },

  // Get system health metrics
  async getSystemHealth() {
    const { data, error } = await supabase
      .from('system_health')
      .select('*')
      .order('recorded_at', { ascending: false })
      .limit(20);
    
    if (error) throw error;
    return data;
  },

  // Record system event
  async recordSystemEvent(event) {
    const { data, error } = await supabase
      .from('system_events')
      .insert(event)
      .select();
    
    if (error) throw error;
    return data;
  },

  // Get recent system events
  async getRecentEvents(limit = 10) {
    const { data, error } = await supabase
      .from('system_events')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return data;
  }
};

// =====================================================
// CHURCH INFORMATION
// =====================================================

export const churchAPI = {
  // Get church information
  async getChurchInfo() {
    const { data, error } = await supabase
      .from('church_info')
      .select('*')
      .single();
    
    if (error) throw error;
    return data;
  },

  // Update church information
  async updateChurchInfo(info) {
    const { data, error } = await supabase
      .from('church_info')
      .upsert(info)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};

// =====================================================
// MEMBERS MANAGEMENT
// =====================================================

export const membersAPI = {
  // Get all members
  async getMembers() {
    const { data, error } = await supabase
      .from('members')
      .select(`
        *,
        profiles:profile_id (
          id,
          first_name,
          last_name,
          email,
          phone
        )
      `)
      .eq('is_active', true)
      .order('date_joined', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  // Get member by ID
  async getMember(id) {
    const { data, error } = await supabase
      .from('members')
      .select(`
        *,
        profiles:profile_id (
          id,
          first_name,
          last_name,
          email,
          phone
        )
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  // Create new member
  async createMember(memberData) {
    const { data, error } = await supabase
      .from('members')
      .insert(memberData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Update member
  async updateMember(id, updates) {
    const { data, error } = await supabase
      .from('members')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Get ministry teams
  async getMinistryTeams() {
    const { data, error } = await supabase
      .from('ministry_teams')
      .select(`
        *,
        leader:leader_id (
          id,
          first_name,
          last_name
        )
      `)
      .eq('is_active', true)
      .order('name');
    
    if (error) throw error;
    return data;
  },

  // Get team members
  async getTeamMembers(teamId) {
    const { data, error } = await supabase
      .from('team_members')
      .select(`
        *,
        member:member_id (
          id,
          profiles:profile_id (
            first_name,
            last_name,
            email
          )
        )
      `)
      .eq('team_id', teamId)
      .eq('is_active', true);
    
    if (error) throw error;
    return data;
  }
};

// =====================================================
// EVENTS AND SERVICES
// =====================================================

export const eventsAPI = {
  // Get all events
  async getEvents() {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('date', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  // Get upcoming events
  async getUpcomingEvents(limit = 10) {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .gte('date', new Date().toISOString().split('T')[0])
      .order('date', { ascending: true })
      .limit(limit);
    
    if (error) throw error;
    return data;
  },

  // Create event
  async createEvent(eventData) {
    const { data, error } = await supabase
      .from('events')
      .insert(eventData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Update event
  async updateEvent(id, updates) {
    const { data, error } = await supabase
      .from('events')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Get event attendance
  async getEventAttendance(eventId) {
    const { data, error } = await supabase
      .from('event_attendance')
      .select(`
        *,
        member:member_id (
          id,
          profiles:profile_id (
            first_name,
            last_name
          )
        )
      `)
      .eq('event_id', eventId);
    
    if (error) throw error;
    return data;
  },

  // Record attendance
  async recordAttendance(attendanceData) {
    const { data, error } = await supabase
      .from('event_attendance')
      .insert(attendanceData)
      .select();
    
    if (error) throw error;
    return data;
  }
};

// =====================================================
// FINANCIAL MANAGEMENT
// =====================================================

export const financesAPI = {
  // Get financial categories
  async getFinancialCategories() {
    const { data, error } = await supabase
      .from('financial_categories')
      .select('*')
      .eq('is_active', true)
      .order('name');
    
    if (error) throw error;
    return data;
  },

  // Get financial transactions
  async getTransactions(filters = {}) {
    let query = supabase
      .from('financial_transactions')
      .select(`
        *,
        category:category_id (
          name,
          type
        ),
        member:member_id (
          id,
          profiles:profile_id (
            first_name,
            last_name
          )
        )
      `)
      .order('transaction_date', { ascending: false });

    if (filters.startDate) {
      query = query.gte('transaction_date', filters.startDate);
    }
    if (filters.endDate) {
      query = query.lte('transaction_date', filters.endDate);
    }
    if (filters.type) {
      query = query.eq('type', filters.type);
    }
    if (filters.categoryId) {
      query = query.eq('category_id', filters.categoryId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  // Create transaction
  async createTransaction(transactionData) {
    const { data, error } = await supabase
      .from('financial_transactions')
      .insert(transactionData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Get financial summary
  async getFinancialSummary(startDate, endDate) {
    const { data, error } = await supabase
      .from('financial_transactions')
      .select('type, amount')
      .gte('transaction_date', startDate)
      .lte('transaction_date', endDate);
    
    if (error) throw error;
    
    const summary = {
      totalIncome: 0,
      totalExpenses: 0,
      netAmount: 0
    };
    
    data.forEach(transaction => {
      if (transaction.type === 'income') {
        summary.totalIncome += parseFloat(transaction.amount);
      } else {
        summary.totalExpenses += parseFloat(transaction.amount);
      }
    });
    
    summary.netAmount = summary.totalIncome - summary.totalExpenses;
    return summary;
  },

  // Get budgets
  async getBudgets(year, month) {
    const { data, error } = await supabase
      .from('budgets')
      .select(`
        *,
        category:category_id (
          name,
          type
        )
      `)
      .eq('year', year)
      .eq('month', month);
    
    if (error) throw error;
    return data;
  }
};

// =====================================================
// COMMUNICATION
// =====================================================

export const communicationAPI = {
  // Get announcements
  async getAnnouncements() {
    const { data, error } = await supabase
      .from('announcements')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  // Create announcement
  async createAnnouncement(announcementData) {
    const { data, error } = await supabase
      .from('announcements')
      .insert(announcementData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Get messages
  async getMessages(userId) {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .or(`sender_id.eq.${userId},recipient_id.eq.${userId}`)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  // Send message
  async sendMessage(messageData) {
    const { data, error } = await supabase
      .from('messages')
      .insert(messageData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};

// =====================================================
// REPORTS AND ANALYTICS
// =====================================================

export const reportsAPI = {
  // Get report templates
  async getReportTemplates() {
    const { data, error } = await supabase
      .from('report_templates')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data;
  },

  // Generate report
  async generateReport(templateId, parameters) {
    const { data, error } = await supabase
      .from('generated_reports')
      .insert({
        template_id: templateId,
        parameters: parameters,
        report_name: `Report_${new Date().toISOString()}`
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Get generated reports
  async getGeneratedReports() {
    const { data, error } = await supabase
      .from('generated_reports')
      .select(`
        *,
        template:template_id (
          name,
          report_type
        )
      `)
      .order('generated_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }
};

// =====================================================
// SECURITY AND ACCESS CONTROL
// =====================================================

export const securityAPI = {
  // Get security logs
  async getSecurityLogs(limit = 50) {
    const { data, error } = await supabase
      .from('security_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return data;
  },

  // Record security event
  async recordSecurityEvent(eventData) {
    const { data, error } = await supabase
      .from('security_logs')
      .insert(eventData)
      .select();
    
    if (error) throw error;
    return data;
  },

  // Get access attempts
  async getAccessAttempts(limit = 100) {
    const { data, error } = await supabase
      .from('access_attempts')
      .select('*')
      .order('attempt_time', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return data;
  }
};

// =====================================================
// NOTIFICATIONS
// =====================================================

export const notificationsAPI = {
  // Get user notifications
  async getUserNotifications(userId) {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  // Get unread notifications
  async getUnreadNotifications(userId) {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .eq('is_read', false)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  // Mark notification as read
  async markNotificationAsRead(notificationId) {
    const { data, error } = await supabase
      .from('notifications')
      .update({ is_read: true, read_at: new Date().toISOString() })
      .eq('id', notificationId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Create notification
  async createNotification(notificationData) {
    const { data, error } = await supabase
      .from('notifications')
      .insert(notificationData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};

// =====================================================
// SYSTEM SETTINGS AND BACKUP
// =====================================================

export const settingsAPI = {
  // Get system settings
  async getSystemSettings() {
    const { data, error } = await supabase
      .from('system_settings')
      .select('*');
    
    if (error) throw error;
    return data;
  },

  // Update system setting
  async updateSystemSetting(key, value) {
    const { data, error } = await supabase
      .from('system_settings')
      .upsert({
        setting_key: key,
        setting_value: value
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Get backup logs
  async getBackupLogs() {
    const { data, error } = await supabase
      .from('backup_logs')
      .select('*')
      .order('started_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  // Create backup log
  async createBackupLog(backupData) {
    const { data, error } = await supabase
      .from('backup_logs')
      .insert(backupData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};

// =====================================================
// INTEGRATIONS
// =====================================================

export const integrationsAPI = {
  // Get integrations
  async getIntegrations() {
    const { data, error } = await supabase
      .from('integrations')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data;
  },

  // Update integration
  async updateIntegration(id, updates) {
    const { data, error } = await supabase
      .from('integrations')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};

// =====================================================
// USER ACTIVITY
// =====================================================

export const activityAPI = {
  // Record user activity
  async recordActivity(activityData) {
    const { data, error } = await supabase
      .from('user_activity')
      .insert(activityData)
      .select();
    
    if (error) throw error;
    return data;
  },

  // Get user activity
  async getUserActivity(userId, limit = 50) {
    const { data, error } = await supabase
      .from('user_activity')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return data;
  }
};

// =====================================================
// UTILITY FUNCTIONS
// =====================================================

export const apiUtils = {
  // Handle API errors
  handleError(error) {
    console.error('API Error:', error);
    throw new Error(error.message || 'An error occurred');
  },

  // Format date for database
  formatDate(date) {
    return new Date(date).toISOString().split('T')[0];
  },

  // Get current user ID
  getCurrentUserId() {
    const user = supabase.auth.getUser();
    return user?.id;
  }
};

// Export all APIs
export default {
  system: systemAPI,
  church: churchAPI,
  members: membersAPI,
  events: eventsAPI,
  finances: financesAPI,
  communication: communicationAPI,
  reports: reportsAPI,
  security: securityAPI,
  notifications: notificationsAPI,
  settings: settingsAPI,
  integrations: integrationsAPI,
  activity: activityAPI,
  utils: apiUtils
}; 