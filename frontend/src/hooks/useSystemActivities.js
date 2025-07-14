import { useState, useEffect } from 'react';
import { systemAPI } from '@/lib/api';

export const useSystemActivities = (limit = 10) => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true);
        const data = await systemAPI.getRecentEvents(limit);
        
        // Transform database data to match component expectations
        const transformedActivities = data.map(event => ({
          action: event.action,
          user: event.user_name || 'System',
          time: formatTimeAgo(event.created_at),
          type: getActivityType(event.event_type),
        }));
        
        setActivities(transformedActivities);
      } catch (err) {
        console.error('Error fetching system activities:', err);
        setError(err.message);
        
        // Fallback to default activities if database is not available
        setActivities(getDefaultActivities());
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [limit]);

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const eventTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - eventTime) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return '1 day ago';
    return `${diffInDays} days ago`;
  };

  const getActivityType = (eventType) => {
    const typeMap = {
      user_added: 'user',
      user_updated: 'user',
      role_changed: 'user',
      backup_completed: 'system',
      security_scan: 'security',
      church_info_updated: 'info',
      system_maintenance: 'system',
    };
    return typeMap[eventType] || 'system';
  };

  const getDefaultActivities = () => [
    {
      action: "User added",
      user: "Admin",
      time: "2 minutes ago",
      type: "user",
    },
    {
      action: "System backup completed",
      user: "System",
      time: "1 hour ago",
      type: "system",
    },
    {
      action: "Security scan completed",
      user: "System",
      time: "3 hours ago",
      type: "security",
    },
    {
      action: "Church info updated",
      user: "Admin",
      time: "5 hours ago",
      type: "info",
    },
    {
      action: "User role changed",
      user: "Admin",
      time: "1 day ago",
      type: "user",
    },
  ];

  return { activities, loading, error };
}; 