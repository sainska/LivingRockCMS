import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import ReportDownload from "./ReportDownload";

const MembershipReport = ({ period }) => {
  const members = [
    { name: "John Doe", status: "Active", joined: "2023-01-15" },
    { name: "Jane Smith", status: "Inactive", joined: "2022-11-10" },
    { name: "Samuel Kim", status: "Active", joined: "2024-03-22" }
  ];

  // Prepare data for ReportDownload
  const reportData = {
    summary: {
      "Total Members": members.length,
      "Active Members": members.filter(m => m.status === "Active").length,
      "Inactive Members": members.filter(m => m.status === "Inactive").length
    },
    table: {
      title: "Membership Records",
      columns: ["Name", "Status", "Joined"],
      rows: members.map(m => [m.name, m.status, m.joined])
    }
  };

  return (
    <div className="space-y-6">
      <ReportDownload data={reportData} title="Membership Report" period={period} />
      <Card>
        <CardHeader>
          <CardTitle>Membership Records</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Joined</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.map((m, index) => (
                <TableRow key={index}>
                  <TableCell>{m.name}</TableCell>
                  <TableCell>{m.status}</TableCell>
                  <TableCell>{m.joined}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default MembershipReport;
