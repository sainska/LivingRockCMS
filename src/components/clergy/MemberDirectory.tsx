
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Users, 
  Search, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar,
  Heart,
  UserPlus,
  Filter
} from "lucide-react";

const MemberDirectory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [groupFilter, setGroupFilter] = useState("all");

  const members = [
    {
      id: 1,
      name: "Mary Wanjiku Kamau",
      email: "mary.kamau@email.com",
      phone: "+254 712 345 678",
      address: "Kiambu, Kenya",
      status: "Active",
      group: "Women's Ministry",
      joinDate: "2022-03-15",
      lastVisit: "2024-06-09",
      birthDate: "1985-07-20",
      occupation: "Teacher",
      family: "Married, 2 children",
      notes: "Active in choir, volunteers regularly"
    },
    {
      id: 2,
      name: "John Mwangi Njoroge",
      email: "john.njoroge@email.com",
      phone: "+254 721 456 789",
      address: "Nairobi, Kenya",
      status: "Active",
      group: "Men's Fellowship",
      joinDate: "2021-11-20",
      lastVisit: "2024-06-09",
      birthDate: "1978-12-10",
      occupation: "Engineer",
      family: "Married, 3 children",
      notes: "Elder, leads Bible study"
    },
    {
      id: 3,
      name: "Grace Njeri Waweru",
      email: "grace.waweru@email.com",
      phone: "+254 733 567 890",
      address: "Thika, Kenya",
      status: "New Member",
      group: "Youth Ministry",
      joinDate: "2024-05-01",
      lastVisit: "2024-06-08",
      birthDate: "2000-04-15",
      occupation: "Student",
      family: "Single",
      notes: "Recently baptized, active in youth"
    },
    {
      id: 4,
      name: "Peter Kamau Gitau",
      email: "peter.gitau@email.com",
      phone: "+254 744 678 901",
      address: "Ruiru, Kenya",
      status: "Inactive",
      group: "General",
      joinDate: "2020-08-10",
      lastVisit: "2024-04-20",
      birthDate: "1965-09-25",
      occupation: "Business Owner",
      family: "Married, 4 children",
      notes: "Needs pastoral visit, health issues"
    },
    {
      id: 5,
      name: "Sarah Muthoni Kang'ethe",
      email: "sarah.kangethe@email.com",
      phone: "+254 755 789 012",
      address: "Kikuyu, Kenya",
      status: "Active",
      group: "Choir",
      joinDate: "2023-01-12",
      lastVisit: "2024-06-09",
      birthDate: "1990-11-30",
      occupation: "Nurse",
      family: "Married, 1 child",
      notes: "Music ministry leader, counselor"
    }
  ];

  const filteredMembers = members.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.phone.includes(searchTerm);
    
    const matchesStatus = statusFilter === "all" || member.status.toLowerCase() === statusFilter;
    const matchesGroup = groupFilter === "all" || member.group === groupFilter;
    
    return matchesSearch && matchesStatus && matchesGroup;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "bg-green-100 text-green-800";
      case "New Member": return "bg-blue-100 text-blue-800";
      case "Inactive": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Member Directory</h3>
        <Button>
          <UserPlus className="h-4 w-4 mr-2" />
          Add New Member
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search members by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="new member">New Member</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            <Select value={groupFilter} onValueChange={setGroupFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Group" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Groups</SelectItem>
                <SelectItem value="Women's Ministry">Women's Ministry</SelectItem>
                <SelectItem value="Men's Fellowship">Men's Fellowship</SelectItem>
                <SelectItem value="Youth Ministry">Youth Ministry</SelectItem>
                <SelectItem value="Choir">Choir</SelectItem>
                <SelectItem value="General">General</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Members Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Members ({filteredMembers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Group</TableHead>
                <TableHead>Age</TableHead>
                <TableHead>Family</TableHead>
                <TableHead>Last Visit</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMembers.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{member.name}</p>
                      <p className="text-sm text-muted-foreground">{member.occupation}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-sm">
                        <Phone className="h-3 w-3" />
                        {member.phone}
                      </div>
                      <div className="flex items-center gap-1 text-sm">
                        <Mail className="h-3 w-3" />
                        {member.email}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        {member.address}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(member.status)}>
                      {member.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{member.group}</TableCell>
                  <TableCell>{calculateAge(member.birthDate)} years</TableCell>
                  <TableCell>{member.family}</TableCell>
                  <TableCell>{member.lastVisit}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                      <Button variant="outline" size="sm">
                        <Heart className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Member Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{members.filter(m => m.status === "Active").length}</p>
              <p className="text-sm text-muted-foreground">Active Members</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{members.filter(m => m.status === "New Member").length}</p>
              <p className="text-sm text-muted-foreground">New Members</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">{members.filter(m => m.status === "Inactive").length}</p>
              <p className="text-sm text-muted-foreground">Need Follow-up</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">{members.length}</p>
              <p className="text-sm text-muted-foreground">Total Members</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MemberDirectory;
