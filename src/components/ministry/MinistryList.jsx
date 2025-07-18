
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Users, 
  Plus, 
  Search,
  MapPin,
  Clock,
  UserPlus,
  Edit,
  Trash,
  Calendar
} from 'lucide-react';
import { useMinistries } from '@/hooks/useMinistries';
import { useToast } from '@/components/ui/use-toast';

const MinistryList = () => {
  const { ministries, loading, error } = useMinistries();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const filteredMinistries = ministries.filter(ministry =>
    ministry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ministry.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 bg-muted rounded"></div>
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
              Error loading ministries: {error}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Ministry Management</h1>
          <p className="text-muted-foreground">Manage church ministries and their activities</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Ministry
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Ministry</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Ministry Name</Label>
                <Input id="name" placeholder="Enter ministry name" />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" placeholder="Describe the ministry" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="meeting_day">Meeting Day</Label>
                  <Input id="meeting_day" placeholder="e.g., Sunday" />
                </div>
                <div>
                  <Label htmlFor="meeting_time">Meeting Time</Label>
                  <Input id="meeting_time" placeholder="e.g., 14:00" />
                </div>
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input id="location" placeholder="Meeting location" />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => {
                  toast({
                    title: "Ministry Added",
                    description: "New ministry has been created successfully."
                  });
                  setIsAddDialogOpen(false);
                }}>
                  Create Ministry
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center space-x-4 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search ministries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMinistries.map((ministry) => {
          const activeMembers = ministry.ministry_members?.filter(m => m.is_active) || [];
          const memberCount = activeMembers.length;
          const leaderName = ministry.leader ? 
            `${ministry.leader.first_name} ${ministry.leader.last_name}` : 
            'No leader assigned';

          return (
            <Card key={ministry.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{ministry.name}</CardTitle>
                  <Badge variant="outline">
                    {memberCount} {memberCount === 1 ? 'member' : 'members'}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {ministry.description || 'No description available'}
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm">
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

                {activeMembers.length > 0 && (
                  <div>
                    <h4 className="font-medium text-sm mb-2">Recent Members:</h4>
                    <div className="flex flex-wrap gap-1">
                      {activeMembers.slice(0, 3).map((member) => (
                        <Badge key={member.id} variant="secondary" className="text-xs">
                          {member.profiles ? 
                            `${member.profiles.first_name} ${member.profiles.last_name}` : 
                            'Unknown'
                          }
                        </Badge>
                      ))}
                      {activeMembers.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{activeMembers.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    <UserPlus className="h-3 w-3 mr-1" />
                    Add Member
                  </Button>
                  <Button size="sm" variant="outline">
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Calendar className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredMinistries.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Users className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">No Ministries Found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm ? 
                "No ministries match your search criteria." : 
                "Start by creating your first ministry to engage your congregation."
              }
            </p>
            {!searchTerm && (
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Ministry
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MinistryList;
