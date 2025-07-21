import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import ReportDownload from "./ReportDownload";

const EventsReport = ({ period }) => {
  const events = [
    { title: "Sunday Service", date: "2025-07-06", location: "Main Sanctuary", attendees: 320 },
    { title: "Bible Study", date: "2025-07-03", location: "Fellowship Hall", attendees: 85 },
    { title: "Youth Meeting", date: "2025-07-02", location: "Youth Hall", attendees: 60 }
  ];

  // Prepare data for ReportDownload
  const reportData = {
    summary: {
      "Total Events": events.length,
      "Total Attendees": events.reduce((a, b) => a + b.attendees, 0)
    },
    table: {
      title: "Events Records",
      columns: ["Title", "Date", "Location", "Attendees"],
      rows: events.map(e => [e.title, e.date, e.location, e.attendees])
    }
  };

  return (
    <div className="space-y-6">
      <ReportDownload data={reportData} title="Events Report" period={period} />
      <Card>
        <CardHeader>
          <CardTitle>Events Records</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Attendees</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {events.map((e, index) => (
                <TableRow key={index}>
                  <TableCell>{e.title}</TableCell>
                  <TableCell>{e.date}</TableCell>
                  <TableCell>{e.location}</TableCell>
                  <TableCell>{e.attendees}</TableCell>
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
