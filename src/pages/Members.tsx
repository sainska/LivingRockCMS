
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, UserPlus, Download, Filter, Edit, Trash } from "lucide-react";

// Sample member data
const membersData = [
  { id: 1, name: "John Doe", email: "john@example.com", phone: "123-456-7890", status: "active", joinDate: "2020-01-15", household: "Doe Family" },
  { id: 2, name: "Jane Smith", email: "jane@example.com", phone: "123-456-7891", status: "active", joinDate: "2021-03-20", household: "Smith Family" },
  { id: 3, name: "Robert Johnson", email: "robert@example.com", phone: "123-456-7892", status: "inactive", joinDate: "2019-05-10", household: "Johnson Family" },
  { id: 4, name: "Sarah Williams", email: "sarah@example.com", phone: "123-456-7893", status: "active", joinDate: "2022-07-05", household: "Williams Family" },
  { id: 5, name: "Michael Brown", email: "michael@example.com", phone: "123-456-7894", status: "visitor", joinDate: "2025-04-18", household: "N/A" },
  { id: 6, name: "Elizabeth Taylor", email: "elizabeth@example.com", phone: "123-456-7895", status: "active", joinDate: "2018-09-30", household: "Taylor Family" },
  { id: 7, name: "William Davis", email: "william@example.com", phone: "123-456-7896", status: "inactive", joinDate: "2017-11-12", household: "Davis Family" },
  { id: 8, name: "Jennifer Wilson", email: "jennifer@example.com", phone: "123-456-7897", status: "active", joinDate: "2023-02-08", household: "Wilson Family" },
];

const Members = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [members, setMembers] = useState(membersData);

  const filteredMembers = members.filter(member => 
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.phone.includes(searchTerm)
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">Active</Badge>;
      case "inactive":
        return <Badge variant="outline" className="text-gray-500">Inactive</Badge>;
      case "visitor":
        return <Badge variant="secondary" className="bg-xiracom-blue">Visitor</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Member Management</h1>
        <Button className="bg-xiracom-blue hover:bg-xiracom-darkblue">
          <UserPlus className="mr-2 h-4 w-4" /> Add Member
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Members Directory</CardTitle>
          <CardDescription>
            View, add, edit, or delete your church members
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search by name, email, phone..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" /> Filter
              </Button>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" /> Export
              </Button>
            </div>
          </div>
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="hidden md:table-cell">Phone</TableHead>
                  <TableHead className="hidden md:table-cell">Household</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden md:table-cell">Join Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMembers.length > 0 ? (
                  filteredMembers.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell className="font-medium">{member.name}</TableCell>
                      <TableCell>{member.email}</TableCell>
                      <TableCell className="hidden md:table-cell">{member.phone}</TableCell>
                      <TableCell className="hidden md:table-cell">{member.household}</TableCell>
                      <TableCell>{getStatusBadge(member.status)}</TableCell>
                      <TableCell className="hidden md:table-cell">{member.joinDate}</TableCell>
                      <TableCell>
                        <div className="flex space-x-1">
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-4 text-muted-foreground">
                      No members found. Try a different search term.
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

export default Members;
