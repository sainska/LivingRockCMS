
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart3, 
  TrendingUp,
  Users,
  Calendar,
  Download,
  FileText,
  PieChart,
  Activity
} from 'lucide-react';
import { useMinistries } from '@/hooks/useMinistries';

const MinistryReports = () => {
  const { ministries, loading, error } = useMinistries();
  const [selectedPeriod, setSelectedPeriod] = useState("monthly");

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-red-600">
              Error loading ministry reports: {error}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const totalMembers = ministries.reduce((sum, ministry) => 
    sum + (ministry.ministry_members?.filter(m => m.is_active).length || 0), 0
  );

  const activeMinistries = ministries.filter(m => m.is_active).length;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Ministry Reports</h1>
          <p className="text-muted-foreground">Analyze ministry performance and engagement</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button>
            <FileText className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Ministries</CardTitle>
            <Activity className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeMinistries}</div>
            <p className="text-xs text-muted-foreground">
              {ministries.length - activeMinistries} inactive
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Members</CardTitle>
            <Users className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalMembers}</div>
            <p className="text-xs text-muted-foreground">Across all ministries</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Size</CardTitle>
            <BarChart3 className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {activeMinistries > 0 ? Math.round(totalMembers / activeMinistries) : 0}
            </div>
            <p className="text-xs text-muted-foreground">Members per ministry</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Growth Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+12%</div>
            <p className="text-xs text-muted-foreground">This quarter</p>
          </CardContent>
        </Card>
      </div>

      {/* Ministry Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChart className="h-5 w-5" />
            Ministry Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {ministries.filter(m => m.is_active).map((ministry) => {
              const memberCount = ministry.ministry_members?.filter(m => m.is_active).length || 0;
              const targetMembers = 50; // Example target
              const progressPercentage = (memberCount / targetMembers) * 100;

              return (
                <div key={ministry.id} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium">{ministry.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {memberCount} of {targetMembers} target members
                      </p>
                    </div>
                    <Badge variant={progressPercentage >= 80 ? "default" : progressPercentage >= 50 ? "secondary" : "outline"}>
                      {Math.round(progressPercentage)}%
                    </Badge>
                  </div>
                  <Progress value={progressPercentage} className="h-2" />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Quick Reports */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div>
                  <p className="font-medium">New member joined Youth Ministry</p>
                  <p className="text-sm text-muted-foreground">2 days ago</p>
                </div>
                <Badge>New</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div>
                  <p className="font-medium">Worship Team meeting scheduled</p>
                  <p className="text-sm text-muted-foreground">1 week ago</p>
                </div>
                <Badge variant="outline">Event</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div>
                  <p className="font-medium">Children Ministry reached target</p>
                  <p className="text-sm text-muted-foreground">2 weeks ago</p>
                </div>
                <Badge variant="secondary">Achievement</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Growth Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center p-8 bg-muted rounded-lg">
                <BarChart3 className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">
                  Detailed analytics and charts will be available here
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MinistryReports;
