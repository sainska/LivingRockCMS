
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useRealTimeSecurityLogs = () => {
  const [securityLogs, setSecurityLogs] = useState([]);
  const [securityStats, setSecurityStats] = useState({
    totalEvents: 0,
    highSeverity: 0,
    failedAttempts: 0,
    blockedEvents: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const fetchSecurityLogs = async () => {
    try {
      setLoading(true);
      
      // Fetch audit logs for security events
      const { data: auditLogs } = await supabase
        .from('audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      // Fetch access logs
      const { data: accessLogs } = await supabase
        .from('access_logs')
        .select('*')
        .order('time', { ascending: false })
        .limit(50);

      // Transform and combine logs
      const transformedAuditLogs = auditLogs?.map(log => ({
        id: log.id,
        timestamp: log.created_at,
        event: log.action,
        user: log.user_id,
        ip: log.ip_address || 'Unknown',
        result: 'Success',
        severity: log.action.includes('DELETE') ? 'high' : 
                 log.action.includes('UPDATE') ? 'medium' : 'low',
        details: `${log.action} on ${log.table_name}`,
        type: 'audit'
      })) || [];

      const transformedAccessLogs = accessLogs?.map(log => ({
        id: log.id,
        timestamp: log.time,
        event: log.action || 'Access',
        user: log.user_name || 'Unknown',
        ip: 'System',
        result: log.status || 'Success',
        severity: log.status === 'Failed' ? 'high' : 'low',
        details: log.action || 'System access',
        type: 'access'
      })) || [];

      const allLogs = [...transformedAuditLogs, ...transformedAccessLogs]
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

      setSecurityLogs(allLogs);

      // Calculate statistics
      const stats = {
        totalEvents: allLogs.length,
        highSeverity: allLogs.filter(log => log.severity === 'high').length,
        failedAttempts: allLogs.filter(log => log.result === 'Failed').length,
        blockedEvents: allLogs.filter(log => log.result === 'Blocked').length
      };

      setSecurityStats(stats);

    } catch (err) {
      console.error('Error fetching security logs:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchSecurityLogs();
      
      // Set up real-time subscription
      const securitySubscription = supabase
        .channel('security-logs')
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'audit_logs'
        }, () => {
          fetchSecurityLogs();
        })
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'access_logs'
        }, () => {
          fetchSecurityLogs();
        })
        .subscribe();

      return () => {
        supabase.removeChannel(securitySubscription);
      };
    }
  }, [user]);

  return {
    securityLogs,
    securityStats,
    loading,
    error,
    refetch: fetchSecurityLogs
  };
};
