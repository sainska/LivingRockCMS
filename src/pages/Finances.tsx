
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Plus, Filter, Database, FileText, Users, Calendar } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";

// Sample data for system records
const systemRecords = [
  { id: "SYS-1234", category: "User Activity", description: "New member registration", count: "15", date: "2025-05-15", status: "Active" },
  { id: "SYS-1235", category: "Events", description: "Weekly Service", count: "890", date: "2025-05-10", status: "Completed" },
  { id: "SYS-1236", category: "Ministry", description: "Youth Group Meeting", count: "45", date: "2025-05-08", status: "Active" },
  { id: "SYS-1237", category: "Communication", description: "Newsletter Sent", count: "1200", date: "2025-05-05", status: "Completed" },
  { id: "SYS-1238", category: "Events", description: "Community Outreach", count: "150", date: "2025-05-03", status: "Planned" },
];

// Sample data for member engagement
const memberEngagement = [
  { id: "ENG-1234", activity: "Weekly Services", member: "John Smith", participation: "Regular", level: "High", endDate: "Ongoing" },
  { id: "ENG-1235", activity: "Bible Study", member: "Jane Cooper", participation: "Weekly", level: "High", endDate: "Ongoing" },
  { id: "ENG-1236", activity: "Youth Ministry", member: "Robert Johnson", participation: "Monthly", level: "Medium", endDate: "2025-08-15" },
  { id: "ENG-1237", activity: "Volunteer Work", member: "Sarah Williams", participation: "Occasional", level: "Low", endDate: "Ongoing" },
  { id: "ENG-1238", activity: "Choir Practice", member: "Michael Brown", participation: "Weekly", level: "High", endDate: "Ongoing" },
];

// Sample data for system metrics
const systemMetrics = [
  { id: 1, name: "User Management", total: "1,247", active: "890", inactive: "357", growth: 12 },
  { id: 2, name: "Event Management", total: "45", completed: "38", upcoming: "7", growth: 15 },
  { id: 3, name: "Ministry Programs", total: "12", active: "10", planning: "2", growth: 8 },
  { id: 4, name: "Communication", total: "156", sent: "145", scheduled: "11", growth: 22 },
  { id: 5, name: "Member Engagement", total: "780", high: "450", medium: "230", growth: 18 },
];

const getEngagementBadge = (level: string) => {
  switch (level) {
    case "High":
      return <Badge className="bg-green-500">High</Badge>;
    case "Medium":
      return <Badge className="bg-xiracom-blue">Medium</Badge>;
    case "Low":
      return <Badge variant="outline" className="text-gray-500">Low</Badge>;
    default:
      return null;
  }
};

const Finances = () => {
  const [year, setYear] = useState("2025");
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">System Data Management</h1>
        <div className="flex gap-2">
          <Select defaultValue={year} onValueChange={setYear}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Select Year" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Year</SelectLabel>
                <SelectItem value="2023">2023</SelectItem>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2025">2025</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <Button className="bg-xiracom-blue hover:bg-xiracom-darkblue">
            <Plus className="mr-2 h-4 w-4" /> New Record
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="records">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="records">System Records</TabsTrigger>
          <TabsTrigger value="engagement">Member Engagement</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="metrics">System Metrics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="records" className="pt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  System Activity Records
                </CardTitle>
                <CardDescription>Track and manage system activities and events</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline">
                  <Filter className="mr-2 h-4 w-4" /> Filter
                </Button>
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" /> Export
                </Button>
                <Button className="bg-xiracom-blue hover:bg-xiracom-darkblue">
                  <Plus className="mr-2 h-4 w-4" /> Add Record
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Count</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {systemRecords.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell className="font-medium">{record.id}</TableCell>
                        <TableCell>{record.category}</TableCell>
                        <TableCell>{record.description}</TableCell>
                        <TableCell>{record.count}</TableCell>
                        <TableCell>{record.date}</TableCell>
                        <TableCell>
                          <Badge variant={record.status === "Completed" ? "default" : "outline"}>
                            {record.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-1">
                            <Button variant="outline" size="sm">View</Button>
                            <Button variant="outline" size="sm">Edit</Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="engagement" className="pt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Member Engagement Tracking
                </CardTitle>
                <CardDescription>Monitor member participation and engagement levels</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline">
                  <Filter className="mr-2 h-4 w-4" /> Filter by Activity
                </Button>
                <Button className="bg-xiracom-blue hover:bg-xiracom-darkblue">
                  <Plus className="mr-2 h-4 w-4" /> New Engagement
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Activity</TableHead>
                      <TableHead>Member</TableHead>
                      <TableHead>Participation</TableHead>
                      <TableHead>Engagement Level</TableHead>
                      <TableHead>End Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {memberEngagement.map((engagement) => (
                      <TableRow key={engagement.id}>
                        <TableCell className="font-medium">{engagement.id}</TableCell>
                        <TableCell>{engagement.activity}</TableCell>
                        <TableCell>{engagement.member}</TableCell>
                        <TableCell>{engagement.participation}</TableCell>
                        <TableCell>{getEngagementBadge(engagement.level)}</TableCell>
                        <TableCell>{engagement.endDate}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="analytics" className="pt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  System Analytics
                </CardTitle>
                <CardDescription>Analyze system performance and user engagement</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" /> Export Analytics
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <Users className="h-8 w-8 text-blue-600" />
                      <div>
                        <p className="text-sm text-muted-foreground">Total Users</p>
                        <p className="text-2xl font-bold">1,247</p>
                        <p className="text-sm text-green-600">+5.2% this month</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-8 w-8 text-green-600" />
                      <div>
                        <p className="text-sm text-muted-foreground">Active Events</p>
                        <p className="text-2xl font-bold">45</p>
                        <p className="text-sm text-green-600">+8.3% this month</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <Database className="h-8 w-8 text-purple-600" />
                      <div>
                        <p className="text-sm text-muted-foreground">Data Records</p>
                        <p className="text-2xl font-bold">12,456</p>
                        <p className="text-sm text-green-600">+15.7% this month</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="metrics" className="pt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>System Performance Metrics</CardTitle>
                <CardDescription>Monitor system performance across different modules</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" /> Export
                </Button>
                <Button className="bg-xiracom-blue hover:bg-xiracom-darkblue">
                  <Plus className="mr-2 h-4 w-4" /> Update Metrics
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Module</TableHead>
                      <TableHead>Total Records</TableHead>
                      <TableHead>Active</TableHead>
                      <TableHead>Inactive/Other</TableHead>
                      <TableHead>Growth %</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {systemMetrics.map((metric) => (
                      <TableRow key={metric.id}>
                        <TableCell className="font-medium">{metric.name}</TableCell>
                        <TableCell>{metric.total}</TableCell>
                        <TableCell>{metric.active}</TableCell>
                        <TableCell>{metric.inactive}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-xiracom-blue h-2 rounded-full"
                                style={{ width: `${metric.growth}%` }}
                              ></div>
                            </div>
                            <span className="text-sm text-green-600">+{metric.growth}%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">Details</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Finances;
