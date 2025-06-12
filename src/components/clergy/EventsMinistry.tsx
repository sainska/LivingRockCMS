
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calendar, 
  Plus, 
  Users, 
  MapPin, 
  Clock,
  Edit,
  Trash2,
  CheckCircle,
  AlertCircle,
  Star
} from "lucide-react";

const EventsMinistry = () => {
  const events = [
    {
      id: 1,
      name: "Youth Conference 2024",
      date: "2024-06-15",
      endDate: "2024-06-16",
      time: "09:00",
      location: "Main Sanctuary",
      type: "Conference",
      status: "Confirmed",
      attendees: 45,
      maxCapacity: 60,
      organizer: "Youth Ministry Team",
      description: "Annual youth conference with workshops and activities",
      budget: 50000,
      spent: 35000
    },
    {
      id: 2,
      name: "Women's Retreat",
      date: "2024-06-22",
      endDate: "2024-06-22",
      time: "08:00",
      location: "Kiambu Conference Center",
      type: "Retreat",
      status: "Planning",
      attendees: 32,
      maxCapacity: 40,
      organizer: "Women's Ministry",
      description: "Day retreat focusing on spiritual renewal",
      budget: 80000,
      spent: 20000
    },
    {
      id: 3,
      name: "Elder's Meeting",
      date: "2024-06-18",
      endDate: "2024-06-18",
      time: "19:00",
      location: "Church Board Room",
      type: "Meeting",
      status: "Confirmed",
      attendees: 12,
      maxCapacity: 15,
      organizer: "Church Leadership",
      description: "Monthly elders meeting for church governance",
      budget: 5000,
      spent: 2000
    },
    {
      id: 4,
      name: "Baptism Ceremony",
      date: "2024-06-25",
      endDate: "2024-06-25",
      time: "10:30",
      location: "Main Sanctuary",
      type: "Ceremony",
      status: "Confirmed",
      attendees: 8,
      maxCapacity: 200,
      organizer: "Pastor John",
      description: "Special baptism service for new believers",
      budget: 15000,
      spent: 8000
    },
    {
      id: 5,
      name: "Community Outreach",
      date: "2024-07-06",
      endDate: "2024-07-06",
      time: "14:00",
      location: "Kiambu Community Center",
      type: "Outreach",
      status: "Planning",
      attendees: 25,
      maxCapacity: 50,
      organizer: "Missions Team",
      description: "Community service and evangelism event",
      budget: 30000,
      spent: 10000
    }
  ];

  const upcomingEvents = events.filter(event => new Date(event.date) >= new Date()).slice(0, 3);
  
  const eventStats = {
    totalEvents: events.length,
    thisMonth: events.filter(e => {
      const eventDate = new Date(e.date);
      const now = new Date();
      return eventDate.getMonth() === now.getMonth() && eventDate.getFullYear() === now.getFullYear();
    }).length,
    confirmed: events.filter(e => e.status === "Confirmed").length,
    planning: events.filter(e => e.status === "Planning").length
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Confirmed": return "bg-green-100 text-green-800";
      case "Planning": return "bg-yellow-100 text-yellow-800";
      case "Cancelled": return "bg-red-100 text-red-800";
      case "Completed": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Conference": return "bg-purple-100 text-purple-800";
      case "Retreat": return "bg-blue-100 text-blue-800";
      case "Meeting": return "bg-gray-100 text-gray-800";
      case "Ceremony": return "bg-green-100 text-green-800";
      case "Outreach": return "bg-orange-100 text-orange-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getCapacityStatus = (attendees: number, maxCapacity: number) => {
    const percentage = (attendees / maxCapacity) * 100;
    if (percentage >= 90) return "text-red-600";
    if (percentage >= 70) return "text-yellow-600";
    return "text-green-600";
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Events & Ministry</h3>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Event
        </Button>
      </div>

      {/* Event Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-full">
                <Calendar className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Events</p>
                <p className="text-xl font-bold">{eventStats.totalEvents}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-full">
                <Star className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">This Month</p>
                <p className="text-xl font-bold">{eventStats.thisMonth}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-full">
                <CheckCircle className="h-4 w-4 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Confirmed</p>
                <p className="text-xl font-bold">{eventStats.confirmed}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-full">
                <AlertCircle className="h-4 w-4 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Planning</p>
                <p className="text-xl font-bold">{eventStats.planning}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="upcoming" className="space-y-4">
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
          <TabsTrigger value="all">All Events</TabsTrigger>
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Next 3 Events
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingEvents.map((event) => (
                    <div key={event.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-medium">{event.name}</h4>
                          <p className="text-sm text-muted-foreground">{event.organizer}</p>
                        </div>
                        <Badge className={getStatusColor(event.status)}>
                          {event.status}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-3 w-3" />
                          {event.date} at {event.time}
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-3 w-3" />
                          {event.location}
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-3 w-3" />
                          <span className={getCapacityStatus(event.attendees, event.maxCapacity)}>
                            {event.attendees}/{event.maxCapacity} registered
                          </span>
                        </div>
                      </div>

                      <div className="flex gap-2 mt-3">
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Event Types Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {["Conference", "Retreat", "Meeting", "Ceremony", "Outreach"].map((type) => {
                    const typeEvents = events.filter(e => e.type === type);
                    const totalAttendees = typeEvents.reduce((sum, e) => sum + e.attendees, 0);
                    
                    return (
                      <div key={type} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <Badge className={getTypeColor(type)}>
                            {type}
                          </Badge>
                          <span className="text-sm">{typeEvents.length} events</span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {totalAttendees} total attendees
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>All Events</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Event</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Attendance</TableHead>
                    <TableHead>Budget</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {events.map((event) => (
                    <TableRow key={event.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{event.name}</p>
                          <p className="text-sm text-muted-foreground">{event.organizer}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <p>{event.date}</p>
                          <p className="text-muted-foreground">{event.time}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <MapPin className="h-3 w-3" />
                          {event.location}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getTypeColor(event.type)}>
                          {event.type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(event.status)}>
                          {event.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <span className={getCapacityStatus(event.attendees, event.maxCapacity)}>
                            {event.attendees}/{event.maxCapacity}
                          </span>
                          <p className="text-xs text-muted-foreground">
                            {Math.round((event.attendees / event.maxCapacity) * 100)}% full
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <p>KSh {event.spent.toLocaleString()}</p>
                          <p className="text-xs text-muted-foreground">
                            of KSh {event.budget.toLocaleString()}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button variant="outline" size="sm">
                            View
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

        <TabsContent value="calendar">
          <Card>
            <CardHeader>
              <CardTitle>Event Calendar</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="text-center py-12 text-muted-foreground">
                  <Calendar className="h-12 w-12 mx-auto mb-4" />
                  <p>Calendar view integration would be implemented here</p>
                  <p className="text-sm">This would show a full calendar interface with event scheduling</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <Button variant="outline" className="w-full justify-start">
                          <Plus className="h-4 w-4 mr-2" />
                          Schedule New Event
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          <Calendar className="h-4 w-4 mr-2" />
                          View Month Calendar
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          <Users className="h-4 w-4 mr-2" />
                          Manage Registrations
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Event Reminders</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <p className="text-sm font-medium">Youth Conference</p>
                          <p className="text-xs text-muted-foreground">Setup needed tomorrow</p>
                        </div>
                        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                          <p className="text-sm font-medium">Women's Retreat</p>
                          <p className="text-xs text-muted-foreground">Catering confirmation needed</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EventsMinistry;
