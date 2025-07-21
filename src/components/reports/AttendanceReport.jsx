import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import ReportDownload from "./ReportDownload";

const AttendanceReport = ({ period }) => {
  const attendanceSummary = [
    { event: "Sunday Service", attendees: 320, absentees: 20, date: "2025-07-06" },
    { event: "Bible Study", attendees: 85, absentees: 5, date: "2025-07-03" },
    { event: "Youth Meeting", attendees: 60, absentees: 10, date: "2025-07-02" }
  ];

  // Prepare data for ReportDownload
  const reportData = {
    summary: {
      "Total Events": attendanceSummary.length,
      "Total Attendees": attendanceSummary.reduce((a, b) => a + b.attendees, 0),
      "Total Absentees": attendanceSummary.reduce((a, b) => a + b.absentees, 0)
    },
    table: {
      title: "Attendance Records",
      columns: ["Event", "Date", "Attendees", "Absentees"],
      rows: attendanceSummary.map(item => [item.event, item.date, item.attendees, item.absentees])
    }
  };

  return (
    <div className="space-y-6">
      <ReportDownload data={reportData} title="Attendance Report" period={period} />
      <Card>
        <CardHeader>
          <CardTitle>Attendance Records</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Event</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Attendees</TableHead>
                <TableHead>Absentees</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {attendanceSummary.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.event}</TableCell>
                  <TableCell>{item.date}</TableCell>
                  <TableCell>{item.attendees}</TableCell>
                  <TableCell>{item.absentees}</TableCell>
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
