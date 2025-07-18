
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Users, 
  Heart, 
  Calendar, 
  TrendingUp,
  UserPlus,
  Activity,
  Target,
  MapPin,
  Clock
} from 'lucide-react';
import { useMinistries } from '@/hooks/useMinistries';
import { usePDFExport } from '@/hooks/usePDFExport';
import { toast } from 'sonner';

const MinistryDashboard = () => {
  const { ministries, loading, error } = useMinistries();
  const { exportMembershipReport, isExporting } = usePDFExport();

  const handleExportPDF = async () => {
    try {
      const membersData = ministries.flatMap(ministry => 
        ministry.ministry_members?.filter(member => member.is_active).map(member => ({
          first_name: member.profiles?.first_name || '',
          last_name: member.profiles?.last_name || '',
          email: member.profiles?.email || '',
          phone: member.profiles?.phone || '',
          created_at: member.joined_date,
          ministry: ministry.name,
          role: member.role || 'member'
        })) || []
      );
      
      await exportMembershipReport(membersData);
      toast.success('Ministry report exported successfully!');
    } catch (error) {
      toast.error('Failed to export ministry report');
    }
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
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
              Error loading ministry data: {error}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const activeMinistries = ministries.filter(m => m.is_active);
  const totalMembers = ministries.reduce((sum, ministry) => 
    sum + (ministry.ministry_members?.filter(m => m.is_active).length || 0), 0
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Ministry Dashboard</h1>
          <p className="text-muted-foreground">Manage church ministries and member engagement</p>
        </div>
        <Button onClick={handleExportPDF} disabled={isExporting}>
          <Activity className="h-4 w-4 mr-2" />
          {isExporting ? 'Exporting...' : 'Export Report'}
        </Button>
      </div>

      {/* Ministry Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Ministries</CardTitle>
            <Heart className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeMinistries.length}</div>
            <p className="text-xs text-muted-foreground">
              {ministries.length - activeMinistries.length} inactive
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Members</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalMembers}</div>
            <p className="text-xs text-muted-foreground">Across all ministries</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Size</CardTitle>
            <Target className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {activeMinistries.length > 0 ? Math.round(totalMembers / activeMinistries.length) : 0}
            </div>
            <p className="text-xs text-muted-foreground">Members per ministry</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Growth Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+12%</div>
            <p className="text-xs text-muted-foreground">This quarter</p>
          </CardContent>
        </Card>
      </div>

      {/* Ministry List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5" />
            Active Ministries
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activeMinistries.map((ministry) => {
              const activeMembers = ministry.ministry_members?.filter(m => m.is_active) || [];
              const memberCount = activeMembers.length;
              const leaderName = ministry.leader ? 
                `${ministry.leader.first_name} ${ministry.leader.last_name}` : 
                'No leader assigned';
              
              return (
                <div key={ministry.id} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-lg">{ministry.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {ministry.description || 'No description available'}
                      </p>
                    </div>
                    <Badge variant="outline">
                      {memberCount} members
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-4">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Leader:</span> {leaderName}
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Meeting:</span> 
                      {ministry.meeting_day && ministry.meeting_time ? 
                        ` ${ministry.meeting_day} at ${ministry.meeting_time}` : 
                        ' Not scheduled'
                      }
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Location:</span> 
                      {ministry.meeting_location || 'Not specified'}
                    </div>
                  </div>

                  {/* Ministry Members List */}
                  {activeMembers.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-medium text-sm mb-2">Members:</h4>
                      <div className="flex flex-wrap gap-2">
                        {activeMembers.slice(0, 5).map((member) => (
                          <Badge key={member.id} variant="secondary" className="text-xs">
                            {member.profiles ? 
                              `${member.profiles.first_name} ${member.profiles.last_name}` : 
                              'Unknown Member'
                            }
                            {member.role && member.role !== 'member' && (
                              <span className="ml-1 text-muted-foreground">({member.role})</span>
                            )}
                          </Badge>
                        ))}
                        {activeMembers.length > 5 && (
                          <Badge variant="outline" className="text-xs">
                            +{activeMembers.length - 5} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {/* Member Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Membership Growth</span>
                      <span>{memberCount}/50 target</span>
                    </div>
                    <Progress value={(memberCount / 50) * 100} className="h-2" />
                  </div>
                  
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <UserPlus className="h-4 w-4 mr-1" />
                      Add Member
                    </Button>
                    <Button size="sm" variant="outline">
                      <Calendar className="h-4 w-4 mr-1" />
                      Schedule Meeting
                    </Button>
                  </div>
                </div>
              );
            })}
            
            {activeMinistries.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Heart className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">No Active Ministries</h3>
                <p>Start by creating your first ministry to engage your congregation.</p>
                <Button className="mt-4" variant="outline">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Create Ministry
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MinistryDashboard;
