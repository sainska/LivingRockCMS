import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, Calendar, Users, MapPin, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const EventsReport = ({ period }) => {
  const eventSummary = [
    { title: "Total Events", value: 24, change: "+20%", icon: Calendar },
    { title: "Total Attendance", value: 3456, change: "+15%", icon: Users },
    { title: "Average per Event", value: 144, change: "+8%", icon: Users },
    { title: "Event Types", value: 8, change: "+2", icon: MapPin }
  ];

  const events = [
    {
      name: "Sunday Morning Service",
      date: "2024-06-02",
      type: "Weekly Service",
      attendance: 945,
      capacity: 1200,
      status: "Completed",
      location: "Main Sanctuary"
    },
    {
      name: "Youth Conference",
      date: "2024-06-01",
      type: "Special Event",
      attendance: 234,
      capacity: 300,
      status: "Completed",
      location: "Youth Hall"
    },
    {
      name: "Women's Fellowship",
      date: "2024-06-03",
      type: "Fellowship",
      attendance: 156,
      capacity: 200,
      status: "Completed",
      location: "Fellowship Hall"
    },
    {
      name: "Bible Study",
      date: "2024-06-05",
      type: "Study Group",
      attendance: 89,
      capacity: 150,
      status: "Completed",
      location: "Conference Room"
    },
    {
      name: "Children's Program",
      date: "2024-06-02",
      type: "Children's Event",
      attendance: 67,
      capacity: 100,
      status: "Completed",
      location: "Children's Wing"
    }
  ];

  const eventTypes = [
    { type: "Weekly Services", count: 16, totalAttendance: 2340 },
    { type: "Fellowship Events", count: 4, totalAttendance: 456 },
    { type: "Study Groups", count: 2, totalAttendance: 178 },
    { type: "Special Events", count: 1, totalAttendance: 234 },
    { type: "Children's Events", count: 1, totalAttendance: 67 }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed": return "bg-green-100 text-green-800";
      case "Upcoming": return "bg-blue-100 text-blue-800";
      case "Cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Events Report - {period}</h3>
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>

      {/* Event Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {eventSummary.map((item, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <item.icon className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-sm text-muted-foreground">{item.title}</p>
                  <p className="text-2xl font-bold">{item.value}</p>
                  <p className="text-sm text-green-600">{item.change} from last period</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Event Details */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Event Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Event Name</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Attendance</TableHead>
                <TableHead>Capacity</TableHead>
                <TableHead>Fill Rate</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {events.map((event, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{event.name}</TableCell>
                  <TableCell>{event.date}</TableCell>
                  <TableCell>{event.type}</TableCell>
                  <TableCell>{event.attendance}</TableCell>
                  <TableCell>{event.capacity}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${(event.attendance / event.capacity) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm">{Math.round((event.attendance / event.capacity) * 100)}%</span>
                    </div>
                  </TableCell>
                  <TableCell>{event.location}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(event.status)}>
                      {event.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Event Types Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Event Types Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Event Type</TableHead>
                <TableHead>Number of Events</TableHead>
                <TableHead>Total Attendance</TableHead>
                <TableHead>Average Attendance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {eventTypes.map((type, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{type.type}</TableCell>
                  <TableCell>{type.count}</TableCell>
                  <TableCell>{type.totalAttendance}</TableCell>
                  <TableCell>{Math.round(type.totalAttendance / type.count)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default EventsReport;
