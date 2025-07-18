
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Users, 
  Search,
  Filter,
  UserPlus,
  Mail,
  Phone,
  Calendar
} from 'lucide-react';
import { useMinistries } from '@/hooks/useMinistries';

const MinistryMembers = () => {
  const { ministries, loading, error } = useMinistries();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMinistry, setSelectedMinistry] = useState("all");

  // Flatten all ministry members
  const allMembers = ministries.flatMap(ministry => 
    ministry.ministry_members?.filter(member => member.is_active).map(member => ({
      ...member,
      ministryName: ministry.name,
      ministryId: ministry.id
    })) || []
  );

  const filteredMembers = allMembers.filter(member => {
    const matchesSearch = searchTerm === "" || 
      member.profiles?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.profiles?.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.profiles?.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesMinistry = selectedMinistry === "all" || member.ministryId === selectedMinistry;
    
    return matchesSearch && matchesMinistry;
  });

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="h-64 bg-muted rounded"></div>
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
              Error loading ministry members: {error}
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
          <h1 className="text-3xl font-bold">Ministry Members</h1>
          <p className="text-muted-foreground">Manage members across all ministries</p>
        </div>
        <Button>
          <UserPlus className="h-4 w-4 mr-2" />
          Add Member to Ministry
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Ministry Members ({filteredMembers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search members..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={selectedMinistry} onValueChange={setSelectedMinistry}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by ministry" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Ministries</SelectItem>
                {ministries.map((ministry) => (
                  <SelectItem key={ministry.id} value={ministry.id}>
                    {ministry.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Member</TableHead>
                  <TableHead>Ministry</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMembers.length > 0 ? (
                  filteredMembers.map((member) => (
                    <TableRow key={`${member.ministry_id}-${member.member_id}`}>
                      <TableCell>
                        <div>
                          <p className="font-medium">
                            {member.profiles ? 
                              `${member.profiles.first_name} ${member.profiles.last_name}` : 
                              'Unknown Member'
                            }
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {member.ministryName}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {member.role || 'Member'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1 text-sm">
                          {member.profiles?.email && (
                            <div className="flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {member.profiles.email}
                            </div>
                          )}
                          {member.profiles?.phone && (
                            <div className="flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {member.profiles.phone}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <Calendar className="h-3 w-3" />
                          {member.joined_date ? 
                            new Date(member.joined_date).toLocaleDateString() : 
                            'N/A'
                          }
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button size="sm" variant="outline">
                            Edit
                          </Button>
                          <Button size="sm" variant="outline">
                            Remove
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      {searchTerm || selectedMinistry !== "all" ? 
                        "No members found matching your criteria." :
                        "No ministry members found."
                      }
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MinistryMembers;
