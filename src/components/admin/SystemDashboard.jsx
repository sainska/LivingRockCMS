import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Activity,
  Database,
  Server,
  Globe,
  HardDrive,
  Cpu,
  MemoryStick,
  Zap,
  CheckCircle,
  AlertTriangle,
  Clock,
  Users,
  DollarSign
} from "lucide-react";
import { useRealTimeData } from '@/hooks/useRealTimeData';

const metricIconMap = {
  'Server Status': Server,
  'Database Connection': Database,
  'Database Status': Database,
  'API Response': Zap,
  'Network Status': Globe,
  'Total Tables': HardDrive,
  'RLS Enabled Tables': Globe,
  'Active Users': Users,
  'Recent Transactions': DollarSign,
};

const SystemDashboard = () => {
  const { data, loading, error } = useRealTimeData();
  const systemHealth = Array.isArray(data?.systemHealth) ? data.systemHealth : [];

  // Map systemHealth to dashboard metrics
  const systemMetrics = systemHealth.map((metric) => ({
    title: metric.metric_name,
    value: metric.metric_value,
    status: metric.status === 'OK' ? 'success' : (metric.status === 'WARNING' ? 'warning' : 'error'),
    icon: metricIconMap[metric.metric_name] || Activity,
    details: '', // Optionally add more details if available
  }));

  // Placeholder for resource usage (extend backend to provide real data)
  const resourceUsage = [
    { name: "CPU Usage", value: 34, unit: "%", color: "bg-blue-500" },
    { name: "Memory Usage", value: 67, unit: "%", color: "bg-green-500" },
    { name: "Disk Usage", value: 45, unit: "%", color: "bg-yellow-500" },
    { name: "Network I/O", value: 23, unit: "%", color: "bg-purple-500" }
  ];

  // Placeholder for system events (extend backend to provide real data)
  const systemEvents = [
    {
      time: "2 minutes ago",
      type: "info",
      message: "System backup completed successfully",
      icon: CheckCircle
    },
    {
      time: "15 minutes ago",
      type: "warning",
      message: "High memory usage detected",
      icon: AlertTriangle
    },
    {
      time: "1 hour ago",
      type: "info",
      message: "Database optimization completed",
      icon: Database
    },
    {
      time: "2 hours ago",
      type: "info",
      message: "Security scan completed - no issues found",
      icon: CheckCircle
    }
  ];

  // Placeholder for services (extend backend to provide real data)
  const services = [
    { name: "Web Server", status: "Running", uptime: "99.9%" },
    { name: "Database", status: "Running", uptime: "99.8%" },
    { name: "Email Service", status: "Running", uptime: "99.7%" },
    { name: "Backup Service", status: "Running", uptime: "99.5%" },
    { name: "Authentication", status: "Running", uptime: "99.9%" },
    { name: "File Storage", status: "Running", uptime: "99.6%" }
  ];

  const getStatusBadge = (status) => {
    const colors = {
      success: "bg-green-100 text-green-800",
      warning: "bg-yellow-100 text-yellow-800",
      error: "bg-red-100 text-red-800"
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getEventIcon = (type) => {
    switch (type) {
      case "warning": return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case "error": return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default: return <CheckCircle className="h-4 w-4 text-green-600" />;
    }
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-8 bg-muted rounded mb-2"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-100 text-red-800 p-4 rounded">Error loading system data: {error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">System Dashboard</h2>
        <div className="flex items-center gap-2">
          <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            All Systems Operational
          </Badge>
        </div>
      </div>

      {/* System Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {systemMetrics.map((metric, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{metric.title}</p>
                  <p className="text-lg font-bold">{metric.value}</p>
                  <p className="text-xs text-muted-foreground">{metric.details}</p>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <metric.icon className="h-6 w-6 text-blue-600" />
                  <Badge className={getStatusBadge(metric.status)}>
                    {metric.status}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Resource Usage */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Resource Usage
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* TODO: Replace with real resource usage data from backend */}
            {resourceUsage.map((resource, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="flex items-center gap-2">
                    {resource.name === "CPU Usage" && <Cpu className="h-4 w-4" />}
                    {resource.name === "Memory Usage" && <MemoryStick className="h-4 w-4" />}
                    {resource.name === "Disk Usage" && <HardDrive className="h-4 w-4" />}
                    {resource.name === "Network I/O" && <Globe className="h-4 w-4" />}
                    {resource.name}
                  </span>
                  <span className="font-medium">{resource.value}{resource.unit}</span>
                </div>
                <Progress value={resource.value} className="h-3" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* System Events */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent System Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {/* TODO: Replace with real system events from backend */}
              {systemEvents.map((event, index) => (
                <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
                  {getEventIcon(event.type)}
                  <div className="flex-1">
                    <p className="text-sm font-medium">{event.message}</p>
                    <p className="text-xs text-muted-foreground">{event.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Services Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="h-5 w-5" />
            System Services
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* TODO: Replace with real service status/uptime from backend */}
            {services.map((service, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">{service.name}</p>
                  <p className="text-sm text-muted-foreground">Uptime: {service.uptime}</p>
                </div>
                <Badge className="bg-green-100 text-green-800">
                  {service.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SystemDashboard;
