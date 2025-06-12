
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Heart, 
  Plus, 
  Calendar, 
  Phone, 
  MapPin, 
  Clock,
  AlertTriangle,
  CheckCircle,
  User,
  MessageSquare
} from "lucide-react";

const PastoralCare = () => {
  const [newRequest, setNewRequest] = useState({
    memberName: "",
    requestType: "",
    priority: "",
    description: "",
    scheduledDate: ""
  });

  const careRequests = [
    {
      id: 1,
      memberName: "Mary Wanjiku",
      type: "Hospital Visit",
      priority: "Urgent",
      status: "Scheduled",
      description: "Surgery recovery at Kenyatta Hospital",
      requestDate: "2024-06-10",
      scheduledDate: "2024-06-11",
      location: "Kenyatta Hospital, Ward 2B",
      notes: "Requested prayer and communion",
      contact: "+254 712 345 678"
    },
    {
      id: 2,
      memberName: "John Mwangi",
      type: "Grief Counseling",
      priority: "High",
      status: "In Progress",
      description: "Lost spouse last month, needs support",
      requestDate: "2024-06-08",
      scheduledDate: "2024-06-12",
      location: "Church Office",
      notes: "Weekly sessions arranged",
      contact: "+254 721 456 789"
    },
    {
      id: 3,
      memberName: "Grace Njeri",
      type: "Prayer Request",
      priority: "Medium",
      status: "Pending",
      description: "Job interview preparation and prayers",
      requestDate: "2024-06-09",
      scheduledDate: "",
      location: "",
      notes: "Seeking spiritual guidance",
      contact: "+254 733 567 890"
    },
    {
      id: 4,
      memberName: "Peter Kamau",
      type: "Marriage Counseling",
      priority: "High",
      status: "Scheduled",
      description: "Relationship challenges, both spouses attending",
      requestDate: "2024-06-07",
      scheduledDate: "2024-06-13",
      location: "Church Counseling Room",
      notes: "Both partners committed to process",
      contact: "+254 744 678 901"
    },
    {
      id: 5,
      memberName: "Sarah Muthoni",
      type: "Home Visit",
      priority: "Low",
      status: "Completed",
      description: "New baby blessing and family prayers",
      requestDate: "2024-06-05",
      scheduledDate: "2024-06-09",
      location: "Family Home, Kikuyu",
      notes: "Beautiful family time, baby dedication scheduled",
      contact: "+254 755 789 012"
    }
  ];

  const upcomingVisits = [
    {
      date: "2024-06-11",
      time: "14:00",
      member: "Mary Wanjiku",
      type: "Hospital Visit",
      location: "Kenyatta Hospital"
    },
    {
      date: "2024-06-12",
      time: "10:00",
      member: "John Mwangi",
      type: "Grief Counseling",
      location: "Church Office"
    },
    {
      date: "2024-06-13",
      time: "16:00",
      member: "Peter Kamau",
      type: "Marriage Counseling",
      location: "Counseling Room"
    }
  ];

  const careStats = {
    totalRequests: careRequests.length,
    urgent: careRequests.filter(r => r.priority === "Urgent").length,
    scheduled: careRequests.filter(r => r.status === "Scheduled").length,
    completed: careRequests.filter(r => r.status === "Completed").length
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Urgent": return "bg-red-100 text-red-800";
      case "High": return "bg-orange-100 text-orange-800";
      case "Medium": return "bg-yellow-100 text-yellow-800";
      case "Low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Urgent": return "bg-red-100 text-red-800";
      case "Scheduled": return "bg-blue-100 text-blue-800";
      case "In Progress": return "bg-yellow-100 text-yellow-800";
      case "Completed": return "bg-green-100 text-green-800";
      case "Pending": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const handleSubmitRequest = () => {
    // Handle new request submission
    console.log("New request:", newRequest);
    // Reset form
    setNewRequest({
      memberName: "",
      requestType: "",
      priority: "",
      description: "",
      scheduledDate: ""
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Pastoral Care Management</h3>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Care Request
        </Button>
      </div>

      {/* Care Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-full">
                <Heart className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Requests</p>
                <p className="text-xl font-bold">{careStats.totalRequests}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-full">
                <AlertTriangle className="h-4 w-4 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Urgent</p>
                <p className="text-xl font-bold">{careStats.urgent}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-full">
                <Calendar className="h-4 w-4 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Scheduled</p>
                <p className="text-xl font-bold">{careStats.scheduled}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-full">
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-xl font-bold">{careStats.completed}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="requests" className="space-y-4">
        <TabsList>
          <TabsTrigger value="requests">Care Requests</TabsTrigger>
          <TabsTrigger value="schedule">Upcoming Visits</TabsTrigger>
          <TabsTrigger value="new">New Request</TabsTrigger>
        </TabsList>

        <TabsContent value="requests">
          <Card>
            <CardHeader>
              <CardTitle>Active Care Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Member</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Scheduled</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {careRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{request.memberName}</p>
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {request.contact}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>{request.type}</TableCell>
                      <TableCell>
                        <Badge className={getPriorityColor(request.priority)}>
                          {request.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(request.status)}>
                          {request.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {request.scheduledDate ? (
                          <div className="flex items-center gap-1 text-sm">
                            <Calendar className="h-3 w-3" />
                            {request.scheduledDate}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">Not scheduled</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {request.location ? (
                          <div className="flex items-center gap-1 text-sm">
                            <MapPin className="h-3 w-3" />
                            {request.location}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">TBD</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                          <Button variant="outline" size="sm">
                            Schedule
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedule">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Upcoming Pastoral Visits
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingVisits.map((visit, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 border rounded-lg">
                    <div className="text-center min-w-[80px]">
                      <p className="text-sm font-medium text-blue-600">{visit.date}</p>
                      <p className="text-xs text-muted-foreground">{visit.time}</p>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{visit.member}</p>
                      <p className="text-sm text-muted-foreground">{visit.type}</p>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      {visit.location}
                    </div>
                    <Button variant="outline" size="sm">
                      Details
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="new">
          <Card>
            <CardHeader>
              <CardTitle>New Pastoral Care Request</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Member Name</label>
                  <Input
                    value={newRequest.memberName}
                    onChange={(e) => setNewRequest(prev => ({...prev, memberName: e.target.value}))}
                    placeholder="Enter member name"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Request Type</label>
                  <Select
                    value={newRequest.requestType}
                    onValueChange={(value) => setNewRequest(prev => ({...prev, requestType: value}))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hospital-visit">Hospital Visit</SelectItem>
                      <SelectItem value="home-visit">Home Visit</SelectItem>
                      <SelectItem value="counseling">Counseling</SelectItem>
                      <SelectItem value="prayer-request">Prayer Request</SelectItem>
                      <SelectItem value="grief-support">Grief Support</SelectItem>
                      <SelectItem value="marriage-counseling">Marriage Counseling</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Priority</label>
                  <Select
                    value={newRequest.priority}
                    onValueChange={(value) => setNewRequest(prev => ({...prev, priority: value}))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="urgent">Urgent</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Scheduled Date</label>
                  <Input
                    type="date"
                    value={newRequest.scheduledDate}
                    onChange={(e) => setNewRequest(prev => ({...prev, scheduledDate: e.target.value}))}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  value={newRequest.description}
                  onChange={(e) => setNewRequest(prev => ({...prev, description: e.target.value}))}
                  placeholder="Describe the care needed..."
                  rows={4}
                />
              </div>
              <Button onClick={handleSubmitRequest} className="w-full">
                Submit Care Request
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PastoralCare;
