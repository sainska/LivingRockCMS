
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { DatePicker } from "@/components/ui/date-picker";
import { Download, Search, Filter, RefreshCw, AlertTriangle } from "lucide-react";

const SecurityLogs = () => {
  const [filterType, setFilterType] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const securityLogs = [
    {
      id: 1,
      timestamp: "2024-06-09 10:15:32",
      event: "Login Attempt",
      user: "admin@church.com",
      ip: "192.168.1.50",
      result: "Success",
      severity: "low",
      details: "Successful administrator login"
    },
    {
      id: 2,
      timestamp: "2024-06-09 10:12:45",
      event: "Failed Login",
      user: "unknown@example.com",
      ip: "203.0.113.15",
      result: "Failed",
      severity: "medium",
      details: "Invalid credentials provided"
    },
    {
      id: 3,
      timestamp: "2024-06-09 09:58:21",
      event: "Data Access",
      user: "treasurer@church.com",
      ip: "192.168.1.25",
      result: "Success",
      severity: "low",
      details: "Accessed financial reports module"
    },
    {
      id: 4,
      timestamp: "2024-06-09 09:45:17",
      event: "Permission Change",
      user: "admin@church.com",
      ip: "192.168.1.50",
      result: "Success",
      severity: "high",
      details: "Modified user permissions for secretary@church.com"
    },
    {
      id: 5,
      timestamp: "2024-06-09 09:30:08",
      event: "Password Reset",
      user: "member@church.com",
      ip: "192.168.1.75",
      result: "Success",
      severity: "medium",
      details: "User initiated password reset"
    },
    {
      id: 6,
      timestamp: "2024-06-09 09:15:55",
      event: "Brute Force Attempt",
      user: "unknown",
      ip: "198.51.100.42",
      result: "Blocked",
      severity: "high",
      details: "Multiple failed login attempts detected and blocked"
    },
    {
      id: 7,
      timestamp: "2024-06-09 08:45:33",
      event: "Data Export",
      user: "admin@church.com",
      ip: "192.168.1.50",
      result: "Success",
      severity: "medium",
      details: "Exported member database for backup"
    },
    {
      id: 8,
      timestamp: "2024-06-09 08:30:12",
      event: "System Access",
      user: "admin@church.com",
      ip: "192.168.1.50",
      result: "Success",
      severity: "medium",
      details: "Accessed system configuration"
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high": return "bg-red-100 text-red-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getResultColor = (result: string) => {
    switch (result) {
      case "Success": return "bg-green-100 text-green-800";
      case "Failed": return "bg-red-100 text-red-800";
      case "Blocked": return "bg-orange-100 text-orange-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const filteredLogs = securityLogs.filter(log => {
    const matchesType = filterType === "all" || log.severity === filterType;
    const matchesSearch = searchTerm === "" || 
      log.event.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.ip.includes(searchTerm);
    return matchesType && matchesSearch;
  });

  const securitySummary = [
    { label: "Total Events", value: securityLogs.length, color: "text-blue-600" },
    { label: "High Severity", value: securityLogs.filter(log => log.severity === "high").length, color: "text-red-600" },
    { label: "Failed Attempts", value: securityLogs.filter(log => log.result === "Failed").length, color: "text-yellow-600" },
    { label: "Blocked Events", value: securityLogs.filter(log => log.result === "Blocked").length, color: "text-orange-600" }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Security Logs & Audit Trail</h3>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Logs
          </Button>
        </div>
      </div>

      {/* Security Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {securitySummary.map((item, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">{item.label}</p>
                <p className={`text-2xl font-bold ${item.color}`}>{item.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filter & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search logs (event, user, IP)..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severities</SelectItem>
                <SelectItem value="high">High Severity</SelectItem>
                <SelectItem value="medium">Medium Severity</SelectItem>
                <SelectItem value="low">Low Severity</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Security Logs Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Security Event Log</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>Event Type</TableHead>
                <TableHead>User</TableHead>
                <TableHead>IP Address</TableHead>
                <TableHead>Result</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="font-mono text-sm">{log.timestamp}</TableCell>
                  <TableCell className="font-medium">{log.event}</TableCell>
                  <TableCell>{log.user}</TableCell>
                  <TableCell className="font-mono text-sm">{log.ip}</TableCell>
                  <TableCell>
                    <Badge className={getResultColor(log.result)}>
                      {log.result}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getSeverityColor(log.severity)}>
                      {log.severity}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-xs truncate" title={log.details}>
                    {log.details}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Security Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Recent Security Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {securityLogs
              .filter(log => log.severity === "high" || log.result === "Failed" || log.result === "Blocked")
              .slice(0, 5)
              .map((alert, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="h-5 w-5 text-yellow-600" />
                    <div>
                      <p className="font-medium text-sm">{alert.event}</p>
                      <p className="text-xs text-muted-foreground">
                        {alert.user} • {alert.ip} • {alert.timestamp}
                      </p>
                    </div>
                  </div>
                  <Badge className={getSeverityColor(alert.severity)}>
                    {alert.severity}
                  </Badge>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SecurityLogs;
