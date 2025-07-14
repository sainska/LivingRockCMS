import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { useEffect, useState } from 'react';

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
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch('/api/donations/recent')
      .then(res => res.json())
      .then(json => {
        setDonations(json.data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

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
        {loading ? (
          <div className="text-center py-10">Loading...</div>
        ) : donations.length === 0 ? (
          <div className="text-center py-10">No data available</div>
        ) : (
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
              {donations.map((donation) => (
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
        )}
      </CardContent>
    </Card>
  );
};

export default RecentDonations;
