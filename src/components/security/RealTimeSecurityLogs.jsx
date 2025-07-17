
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Download, Search, Filter, RefreshCw, AlertTriangle, Activity } from "lucide-react";
import { useRealTimeSecurityLogs } from '@/hooks/useRealTimeSecurityLogs';
import { usePDFExport } from '@/hooks/usePDFExport';
import { toast } from 'sonner';

const RealTimeSecurityLogs = () => {
  const { securityLogs, securityStats, loading, refetch } = useRealTimeSecurityLogs();
  const { exportSecurityReport, isExporting } = usePDFExport();
  const [filterType, setFilterType] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const handleExportPDF = async () => {
    try {
      await exportSecurityReport(securityLogs);
      toast.success('Security report exported successfully!');
    } catch (error) {
      toast.error('Failed to export security report');
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "high": return "bg-red-100 text-red-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getResultColor = (result) => {
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
      (log.user && log.user.toLowerCase().includes(searchTerm.toLowerCase())) ||
      log.ip.includes(searchTerm);
    return matchesType && matchesSearch;
  });

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Activity className="h-6 w-6 text-blue-600" />
          <h3 className="text-lg font-semibold">Real-Time Security Logs</h3>
          <Badge variant="outline" className="bg-green-50 text-green-700">
            Live
          </Badge>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={refetch}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportPDF} disabled={isExporting}>
            <Download className="h-4 w-4 mr-2" />
            {isExporting ? 'Exporting...' : 'Export PDF'}
          </Button>
        </div>
      </div>

      {/* Real-time Security Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Total Events</p>
              <p className="text-2xl font-bold text-blue-600">{securityStats.totalEvents}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">High Severity</p>
              <p className="text-2xl font-bold text-red-600">{securityStats.highSeverity}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Failed Attempts</p>
              <p className="text-2xl font-bold text-yellow-600">{securityStats.failedAttempts}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Blocked Events</p>
              <p className="text-2xl font-bold text-orange-600">{securityStats.blockedEvents}</p>
            </div>
          </CardContent>
        </Card>
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

      {/* Real-time Security Logs Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Live Security Event Log
          </CardTitle>
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
              {filteredLogs.slice(0, 50).map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="font-mono text-sm">
                    {new Date(log.timestamp).toLocaleString()}
                  </TableCell>
                  <TableCell className="font-medium">{log.event}</TableCell>
                  <TableCell>{log.user || 'System'}</TableCell>
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
          
          {filteredLogs.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No security events found matching your criteria
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RealTimeSecurityLogs;
