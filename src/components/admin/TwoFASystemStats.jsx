import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { RefreshCw, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

const TwoFASystemStats = () => {
  const { get2FASystemStats } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await get2FASystemStats();
      
      if (error) {
        setError(error.message);
      } else {
        setStats(data);
      }
    } catch (err) {
      setError('Failed to fetch 2FA system statistics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'operational':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'depleted':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'operational':
        return 'bg-green-100 text-green-800';
      case 'depleted':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-red-600">
            <AlertTriangle className="h-8 w-8 mx-auto mb-2" />
            <p>Error loading 2FA system statistics</p>
            <p className="text-sm text-gray-500">{error}</p>
            <Button onClick={fetchStats} className="mt-2">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <RefreshCw className="h-5 w-5" />
          2FA System Statistics
        </CardTitle>
        <CardDescription>
          Monitor the status of your two-factor authentication system
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-8">
            <RefreshCw className="h-8 w-8 mx-auto animate-spin text-blue-500" />
            <p className="mt-2 text-gray-600">Loading statistics...</p>
          </div>
        ) : stats ? (
          <div className="space-y-6">
            {/* System Status */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                {getStatusIcon(stats.system_status)}
                <span className="font-medium">System Status</span>
              </div>
              <Badge className={getStatusColor(stats.system_status)}>
                {stats.system_status}
              </Badge>
            </div>

            {/* Code Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {stats.total_codes?.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Total Codes</div>
              </div>
              
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {stats.available_codes?.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Available</div>
              </div>
              
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">
                  {stats.assigned_codes?.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Assigned</div>
              </div>
              
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">
                  {stats.used_codes?.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Used</div>
              </div>
            </div>

            {/* Usage Percentage */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">Usage Percentage</span>
                <span className="text-lg font-bold">{stats.usage_percentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(stats.usage_percentage, 100)}%` }}
                ></div>
              </div>
            </div>

            {/* Warning for Low Codes */}
            {stats.available_codes < 1000 && (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  <span className="font-medium text-yellow-800">
                    Low Code Warning
                  </span>
                </div>
                <p className="text-sm text-yellow-700 mt-1">
                  Only {stats.available_codes} codes remaining. Consider generating more codes soon.
                </p>
              </div>
            )}

            {/* Refresh Button */}
            <div className="text-center">
              <Button onClick={fetchStats} disabled={loading}>
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh Statistics
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No statistics available
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TwoFASystemStats; 