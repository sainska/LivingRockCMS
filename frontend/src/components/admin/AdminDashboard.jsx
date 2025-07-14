import React, { useState, useEffect } from "react";
import { useUserRole } from "@/hooks/useUserRole";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Users,
  Activity,
  CheckCircle,
  HardDrive,
  Settings,
  ClipboardList,
  Database,
  Shield,
  Info,
  BarChart3,
  Bell,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const AdminDashboard = () => {
  const { role } = useUserRole();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [systemStats, setSystemStats] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [systemResources, setSystemResources] = useState(null);
  const [resourcesLoading, setResourcesLoading] = useState(true);
  const [resourcesError, setResourcesError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        // Fetch system statistics from system_stats table
        const { data: statsData, error: statsError } = await supabase
          .from("system_stats")
          .select("stat_type, value, change_description, change_value")
          .order("stat_type");
        if (statsError) throw statsError;
        const transformedStats = (statsData || []).map(stat => ({
          title: stat.stat_type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          value: stat.value,
          change: stat.change_description || stat.change_value || '',
          icon: getIconForStatType(stat.stat_type),
          color: getColorForStatType(stat.stat_type),
        }));
        setSystemStats(transformedStats);

        // Fetch recent system events from system_events table
        const { data: eventsData, error: eventsError } = await supabase
          .from("system_events")
          .select("action, user_name, created_at, event_type")
          .order("created_at", { ascending: false })
          .limit(5);
        if (eventsError) throw eventsError;
        const transformedActivities = (eventsData || []).map(event => ({
          action: event.action,
          user: event.user_name || 'System',
          time: formatTimeAgo(event.created_at),
          type: getActivityType(event.event_type),
        }));
        setRecentActivity(transformedActivities);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError(err.message || String(err));
        setSystemStats([]);
        setRecentActivity([]);
        toast({
          title: "Dashboard Data Error",
          description: "Could not load real-time data.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    if (role === "system_admin") fetchDashboardData();
  }, [toast, role]);

  useEffect(() => {
    const fetchSystemResources = async () => {
      setResourcesLoading(true);
      setResourcesError(null);
      try {
        const { data, error } = await supabase.rpc('get_system_resources');
        if (error) throw error;
        setSystemResources(data && data.length > 0 ? data[0] : null);
      } catch (err) {
        setResourcesError(err.message || String(err));
      } finally {
        setResourcesLoading(false);
      }
    };
    if (role === "system_admin") fetchSystemResources();
  }, [role]);

  if (role !== "system_admin") {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <h2 className="text-2xl font-bold text-[#F7941D]">Access Denied</h2>
        <p className="text-[#0071BC]">You do not have permission to view this page.</p>
        <p className="text-sm text-gray-500 mt-2">Required role: system_admin, Your role: {role}</p>
      </div>
    );
  }

  const getIconForStatType = (statType) => {
    const icons = {
      total_users: Users,
      active_sessions: Activity,
      system_health: CheckCircle,
      storage_used: HardDrive,
    };
    return icons[statType] || Activity;
  };

  const getColorForStatType = (statType) => {
    const colors = {
      total_users: "#0071BC",
      active_sessions: "#F7941D",
      system_health: "#28a745",
      storage_used: "#6f42c1",
    };
    return colors[statType] || "#0071BC";
  };

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

  const quickActions = [
    { label: "User Management", icon: Users, to: "/admin/user-management" },
    { label: "Church Info", icon: Info, to: "/admin/church-info" },
    { label: "System Settings", icon: Settings, to: "/admin/system-settings" },
    { label: "Backup & Data", icon: Database, to: "/admin/backup" },
    { label: "Security & Access", icon: Shield, to: "/admin/security" },
    { label: "System Reports", icon: BarChart3, to: "/admin/reports" },
    { label: "System Events", icon: ClipboardList, to: "/admin/system-events" },
    { label: "Communications", icon: Bell, to: "/admin/communications" },
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0071BC] mb-4"></div>
        <h2 className="text-xl font-bold text-[#0071BC]">Loading Dashboard...</h2>
        <p className="text-gray-500">Fetching real-time data</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <h2 className="text-2xl font-bold text-[#F7941D]">Dashboard Error</h2>
        <p className="text-[#0071BC]">Something went wrong loading the dashboard.</p>
        <p className="text-sm text-gray-500 mt-2">{error}</p>
        <Button 
          onClick={() => window.location.reload()} 
          className="mt-4"
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#0071BC]">System Administration</h1>
          <p className="text-[#F7941D]">Living Rock Church Management System</p>
        </div>
        <Badge variant="outline" className="flex items-center gap-1 border-[#0071BC] text-[#0071BC]">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          System Online
        </Badge>
      </div>

      {/* System Resource Stats (Live) */}
      <div>
        <h2 className="text-xl font-bold text-[#0071BC] mb-4">System Resources (Live)</h2>
        {resourcesLoading ? (
          <div>Loading system resources...</div>
        ) : resourcesError ? (
          <div className="text-red-600">{resourcesError}</div>
        ) : systemResources ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardContent className="p-6">
                <div className="text-sm font-medium text-gray-500 mb-1">Total Users</div>
                <div className="text-2xl font-bold text-[#0071BC]">{systemResources.total_users}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-sm font-medium text-gray-500 mb-1">Database Size</div>
                <div className="text-2xl font-bold text-[#0071BC]">{systemResources.db_size}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-sm font-medium text-gray-500 mb-1">Active Connections</div>
                <div className="text-2xl font-bold text-[#0071BC]">{systemResources.active_connections}</div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div>No system resource data available.</div>
        )}
      </div>

      {/* System Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {systemStats.map((stat, index) => (
          <Card key={index} className="border-[#0071BC]/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                  <p className="text-2xl font-bold" style={{ color: stat.color }}>{stat.value}</p>
                  <p className="text-xs text-gray-400">{stat.change}</p>
                </div>
                <stat.icon className="h-8 w-8" style={{ color: stat.color }} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickActions.map((action, idx) => (
          <Button
            key={idx}
            className="flex items-center gap-2 h-16 bg-[#0071BC] hover:bg-[#F7941D] text-white text-lg font-semibold justify-center"
            onClick={() => {
              console.log('AdminDashboard: Navigating to:', action.to);
              window.location.href = action.to;
            }}
          >
            <action.icon className="h-5 w-5" />
            {action.label}
          </Button>
        ))}
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-xl font-bold text-[#0071BC] mb-4">Recent Activity</h2>
        <div className="space-y-3">
          {recentActivity.map((activity, idx) => (
            <div key={idx} className="flex items-center gap-3 p-3 rounded-lg border border-[#0071BC]/10">
              <span className="font-medium text-[#F7941D]">{activity.action}</span>
              <span className="text-gray-500">by {activity.user} • {activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
