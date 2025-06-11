
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, Users, UserPlus, UserMinus, Activity } from "lucide-react";

interface MembershipReportProps {
  period: string;
}

const MembershipReport = ({ period }: MembershipReportProps) => {
  const membershipStats = [
    { ageGroup: "Children (0-12)", count: 234, percentage: 18.8, active: 210 },
    { ageGroup: "Youth (13-17)", count: 156, percentage: 12.5, active: 145 },
    { ageGroup: "Young Adults (18-35)", count: 389, percentage: 31.2, active: 356 },
    { ageGroup: "Adults (36-65)", count: 356, percentage: 28.6, active: 334 },
    { ageGroup: "Seniors (65+)", count: 112, percentage: 9.0, active: 98 }
  ];

  const newMembers = [
    { name: "Sarah Johnson", joinDate: "2024-06-01", age: 28, ministry: "Worship Team" },
    { name: "Michael Brown", joinDate: "2024-06-03", age: 34, ministry: "Youth Ministry" },
    { name: "Grace Wanjiku", joinDate: "2024-06-05", age: 22, ministry: "Children's Ministry" },
    { name: "David Kimani", joinDate: "2024-06-07", age: 45, ministry: "Men's Fellowship" },
    { name: "Ruth Mwangi", joinDate: "2024-06-08", age: 38, ministry: "Women's Ministry" }
  ];

  const ministryInvolvement = [
    { ministry: "Worship Team", members: 45, active: 42 },
    { ministry: "Youth Ministry", members: 156, active: 145 },
    { ministry: "Children's Ministry", members: 89, active: 82 },
    { ministry: "Women's Ministry", members: 234, active: 210 },
    { ministry: "Men's Fellowship", members: 178, active: 165 },
    { ministry: "Prayer Team", members: 67, active: 58 }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Membership Report - {period}</h3>
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>

      {/* Membership Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Total Members</p>
                <p className="text-2xl font-bold">1,247</p>
                <p className="text-sm text-green-600">+5.2% growth</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <UserPlus className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">New Members</p>
                <p className="text-2xl font-bold">15</p>
                <p className="text-sm text-blue-600">This month</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Activity className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-sm text-muted-foreground">Active Members</p>
                <p className="text-2xl font-bold">1,143</p>
                <p className="text-sm text-muted-foreground">91.7% rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <UserMinus className="h-8 w-8 text-red-600" />
              <div>
                <p className="text-sm text-muted-foreground">Inactive</p>
                <p className="text-2xl font-bold">104</p>
                <p className="text-sm text-muted-foreground">8.3% rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Age Demographics */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Age Demographics</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Age Group</TableHead>
                <TableHead>Total Count</TableHead>
                <TableHead>Percentage</TableHead>
                <TableHead>Active Members</TableHead>
                <TableHead>Activity Rate</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {membershipStats.map((stat, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{stat.ageGroup}</TableCell>
                  <TableCell>{stat.count}</TableCell>
                  <TableCell>{stat.percentage}%</TableCell>
                  <TableCell>{stat.active}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full" 
                          style={{ width: `${(stat.active / stat.count) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm">{Math.round((stat.active / stat.count) * 100)}%</span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* New Members */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent New Members</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Join Date</TableHead>
                <TableHead>Age</TableHead>
                <TableHead>Ministry Involvement</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {newMembers.map((member, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{member.name}</TableCell>
                  <TableCell>{member.joinDate}</TableCell>
                  <TableCell>{member.age}</TableCell>
                  <TableCell>{member.ministry}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Ministry Involvement */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Ministry Involvement</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ministry</TableHead>
                <TableHead>Total Members</TableHead>
                <TableHead>Active Members</TableHead>
                <TableHead>Participation Rate</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ministryInvolvement.map((ministry, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{ministry.ministry}</TableCell>
                  <TableCell>{ministry.members}</TableCell>
                  <TableCell>{ministry.active}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${(ministry.active / ministry.members) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm">{Math.round((ministry.active / ministry.members) * 100)}%</span>
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

export default MembershipReport;
