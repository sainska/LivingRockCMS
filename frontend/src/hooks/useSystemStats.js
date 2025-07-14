import { useState, useEffect } from 'react';
import { systemAPI } from '@/lib/api';

export const useSystemStats = () => {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await systemAPI.getSystemStats();
        
        // Transform database data to match component expectations
        const transformedStats = data.map(stat => ({
          title: stat.stat_type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          value: stat.value,
          change: stat.change_description || stat.change_value || '',
          icon: getIconForStatType(stat.stat_type),
          color: getColorForStatType(stat.stat_type),
        }));
        
        setStats(transformedStats);
      } catch (err) {
        console.error('Error fetching system stats:', err);
        setError(err.message);
        
        // Fallback to default stats if database is not available
        setStats(getDefaultStats());
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const getIconForStatType = (statType) => {
    const icons = {
      total_users: 'Users',
      active_sessions: 'Activity',
      system_health: 'CheckCircle',
      storage_used: 'HardDrive',
    };
    return icons[statType] || 'Activity';
  };

  const getColorForStatType = (statType) => {
    const colors = {
      total_users: '#0071BC',
      active_sessions: '#F7941D',
      system_health: '#28a745',
      storage_used: '#6f42c1',
    };
    return colors[statType] || '#0071BC';
  };

  const getDefaultStats = () => [
    {
      title: "Total Users",
      value: "247",
      change: "+12 this month",
      icon: "Users",
      color: "#0071BC",
    },
    {
      title: "Active Sessions",
      value: "43",
      change: "Real-time",
      icon: "Activity",
      color: "#F7941D",
    },
    {
      title: "System Health",
      value: "99.8%",
      change: "Uptime",
      icon: "CheckCircle",
      color: "#28a745",
    },
    {
      title: "Storage Used",
      value: "15.2 GB",
      change: "of 100 GB",
      icon: "HardDrive",
      color: "#6f42c1",
    },
  ];

  return { stats, loading, error };
}; 