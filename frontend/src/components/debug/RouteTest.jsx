import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const RouteTest = () => {
  const routes = [
    // Admin Routes
    { path: '/admin/dashboard', name: 'Admin Dashboard', role: 'system_admin' },
    { path: '/admin/church-info', name: 'Admin Church Info', role: 'system_admin' },
    { path: '/admin/system-settings', name: 'System Settings', role: 'system_admin' },
    { path: '/admin/user-management', name: 'User Management', role: 'system_admin' },
    { path: '/admin/backup', name: 'Backup & Data', role: 'system_admin' },
    { path: '/admin/system-events', name: 'System Events', role: 'system_admin' },
    { path: '/admin/content', name: 'Content Management', role: 'system_admin' },
    { path: '/admin/communications', name: 'System Communications', role: 'system_admin' },
    { path: '/admin/reports', name: 'System Reports', role: 'system_admin' },
    { path: '/admin/security', name: 'Security & Access', role: 'system_admin' },
    
    // Role-specific Dashboards
    { path: '/clergy/dashboard', name: 'Clergy Dashboard', role: 'clergy' },
    { path: '/treasurer/dashboard', name: 'Treasurer Dashboard', role: 'treasurer' },
    { path: '/secretary/dashboard', name: 'Secretary Dashboard', role: 'secretary' },
    
    // Common Routes
    { path: '/church-info', name: 'Church Info', role: 'all' },
    { path: '/profile', name: 'User Profile', role: 'all' },
    { path: '/notifications', name: 'Notifications', role: 'all' },
    
    // Main Module Routes
    { path: '/members', name: 'Members', role: 'clergy+' },
    { path: '/events', name: 'Events', role: 'all' },
    { path: '/finances', name: 'Finances', role: 'treasurer+' },
    { path: '/communication', name: 'Communication', role: 'clergy+' },
    { path: '/reports', name: 'Reports', role: 'all' },
    { path: '/settings', name: 'Settings', role: 'system_admin' },
    { path: '/security', name: 'Security', role: 'system_admin' },
    
    // Security Routes
    { path: '/security-overview', name: 'Security Overview', role: 'system_admin' },
    { path: '/access-control', name: 'Access Control', role: 'system_admin' },
    { path: '/data-protection', name: 'Data Protection', role: 'system_admin' },
    { path: '/security-logs', name: 'Security Logs', role: 'system_admin' },
    { path: '/checkin-security', name: 'Check-in Security', role: 'system_admin' },
    
    // Additional System Routes
    { path: '/system-overview', name: 'System Overview', role: 'system_admin' },
    { path: '/users', name: 'Users', role: 'system_admin' },
    { path: '/backup', name: 'Backup', role: 'system_admin' },
    { path: '/integrations', name: 'Integrations', role: 'system_admin' },
  ];

  const testRoute = (path) => {
    console.log('Testing route:', path);
    window.location.href = path;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Route Testing</h1>
        <p className="text-muted-foreground">Click on any route to test if it works correctly</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {routes.map((route, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">{route.name}</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">Path: {route.path}</p>
                <p className="text-xs text-muted-foreground">Role: {route.role}</p>
                <Button 
                  size="sm" 
                  onClick={() => testRoute(route.path)}
                  className="w-full"
                >
                  Test Route
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center mt-8">
        <Link to="/test" className="text-blue-600 hover:underline">
          ← Back to Debug Page
        </Link>
      </div>
    </div>
  );
};

export default RouteTest; 