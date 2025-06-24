import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

// Sample data for recent donations
const recentDonations = [
  {
    id: "DON-1234",
    name: "Jane Cooper",
    amount: "$350.00",
    type: "Tithe",
    date: "2025-05-20",
    status: "completed"
  },
  {
    id: "DON-1235",
    name: "Michael Johnson",
    amount: "$75.00",
    type: "Offering",
    date: "2025-05-19",
    status: "completed"
  },
  {
    id: "DON-1236",
    name: "Sarah Williams",
    amount: "$500.00",
    type: "Campaign",
    date: "2025-05-19",
    status: "completed"
  },
  {
    id: "DON-1237",
    name: "Robert Brown",
    amount: "$250.00",
    type: "Tithe",
    date: "2025-05-18",
    status: "pending"
  },
  {
    id: "DON-1238",
    name: "Elizabeth Davis",
    amount: "$1,000.00",
    type: "Building Fund",
    date: "2025-05-17",
    status: "completed"
  }
];

const getStatusBadge = (status) => {
  switch (status) {
    case "completed":
      return <Badge variant="default" className="bg-green-500">Completed</Badge>;
    case "pending":
      return <Badge variant="outline" className="text-amber-600 border-amber-600">Pending</Badge>;
    case "failed":
      return <Badge variant="destructive">Failed</Badge>;
    default:
      return null;
  }
};

const RecentDonations = () => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Recent Donations</CardTitle>
          <CardDescription>Recent contributions received</CardDescription>
        </div>
        <Button variant="outline" size="sm">
          View All
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentDonations.map((donation) => (
              <TableRow key={donation.id}>
                <TableCell className="font-medium">{donation.id}</TableCell>
                <TableCell>{donation.name}</TableCell>
                <TableCell>{donation.amount}</TableCell>
                <TableCell>{donation.type}</TableCell>
                <TableCell>{donation.date}</TableCell>
                <TableCell>{getStatusBadge(donation.status)}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default RecentDonations;
