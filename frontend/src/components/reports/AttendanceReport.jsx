import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, Users, TrendingUp, Calendar } from "lucide-react";

const AttendanceReport = ({ period }) => {
  const attendanceData = [
    { service: "Sunday Morning", date: "2024-06-02", attendance: 945, capacity: 1200, percentage: 79 },
    { service: "Sunday Evening", date: "2024-06-02", attendance: 567, capacity: 800, percentage: 71 },
    { service: "Wednesday Bible Study", date: "2024-06-05", attendance: 234, capacity: 400, percentage: 59 },
    { service: "Youth Service", date: "2024-06-01", attendance: 156, capacity: 200, percentage: 78 },
    { service: "Prayer Meeting", date: "2024-06-04", attendance: 89, capacity: 150, percentage: 59 }
  ];

  const weeklyTrends = [
    { week: "Week 1", attendance: 1890, change: "+5.2%" },
    { week: "Week 2", attendance: 1924, change: "+1.8%" },
    { week: "Week 3", attendance: 1856, change: "-3.5%" },
    { week: "Week 4", attendance: 1978, change: "+6.6%" }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Attendance Report - {period}</h3>
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Average Attendance</p>
                <p className="text-2xl font-bold">890</p>
                <p className="text-sm text-green-600">+8.1% from last period</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Peak Attendance</p>
                <p className="text-2xl font-bold">1,245</p>
                <p className="text-sm text-blue-600">Sunday Morning</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Calendar className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-sm text-muted-foreground">Total Services</p>
                <p className="text-2xl font-bold">16</p>
                <p className="text-sm text-muted-foreground">This month</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Trends */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Weekly Attendance Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Week</TableHead>
                <TableHead>Total Attendance</TableHead>
                <TableHead>Change</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {weeklyTrends.map((week, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{week.week}</TableCell>
                  <TableCell>{week.attendance}</TableCell>
                  <TableCell className={week.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}>
                    {week.change}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Service Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Service Attendance Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Service</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Attendance</TableHead>
                <TableHead>Capacity</TableHead>
                <TableHead>Fill Rate</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {attendanceData.map((service, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{service.service}</TableCell>
                  <TableCell>{service.date}</TableCell>
                  <TableCell>{service.attendance}</TableCell>
                  <TableCell>{service.capacity}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${service.percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm">{service.percentage}%</span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AttendanceReport;
