
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, Download, Users, DollarSign, Calendar, TrendingUp, FileText, BarChart3, Trash2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import AttendanceReport from "@/components/reports/AttendanceReport";
import FinancialReport from "@/components/reports/FinancialReport";
import MembershipReport from "@/components/reports/MembershipReport";
import EventsReport from "@/components/reports/EventsReport";
import CustomReportBuilder from "@/components/reports/CustomReportBuilder";
import { useToast } from '@/hooks/use-toast';
import jsPDF from 'jspdf';

const Reports = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const [activeTab, setActiveTab] = useState("overview");
  const { toast } = useToast();

  const reportSummary = [
    {
      title: "Total Members",
      value: "1,247",
      change: "+5.2%",
      icon: Users,
      color: "text-blue-600"
    },
    {
      title: "Monthly Giving",
      value: "KSh 850,000",
      change: "+12.3%",
      icon: DollarSign,
      color: "text-green-600"
    },
    {
      title: "Average Attendance",
      value: "890",
      change: "+8.1%",
      icon: Calendar,
      color: "text-purple-600"
    },
    {
      title: "Growth Rate",
      value: "15.2%",
      change: "+2.1%",
      icon: TrendingUp,
      color: "text-orange-600"
    }
  ];

  const generateOverviewReportPDF = () => {
    try {
      const doc = new jsPDF();
      const currentDate = new Date().toLocaleDateString();
      
      // Header
      doc.setFontSize(20);
      doc.text('Living Rock Church', 20, 20);
      doc.setFontSize(16);
      doc.text('Church Overview Report', 20, 30);
      doc.setFontSize(12);
      doc.text(`Period: ${selectedPeriod} | Generated on: ${currentDate}`, 20, 40);
      
      // Summary Statistics
      doc.setFontSize(14);
      doc.text('Summary Statistics', 20, 60);
      doc.setFontSize(12);
      
      let yPos = 75;
      reportSummary.forEach((item) => {
        doc.text(`${item.title}: ${item.value} (${item.change})`, 20, yPos);
        yPos += 10;
      });
      
      // Monthly Trends
      yPos += 20;
      doc.setFontSize(14);
      doc.text('Monthly Trends', 20, yPos);
      yPos += 15;
      doc.setFontSize(12);
      
      const trends = [
        'Attendance Growth: +8.1%',
        'Giving Growth: +12.3%',
        'New Members: +15',
        'Events Hosted: 8'
      ];
      
      trends.forEach((trend) => {
        doc.text(trend, 20, yPos);
        yPos += 10;
      });
      
      // Key Metrics
      yPos += 20;
      doc.setFontSize(14);
      doc.text('Key Metrics', 20, yPos);
      yPos += 15;
      doc.setFontSize(12);
      
      const metrics = [
        'Active Members: 1,247',
        'Regular Attendees: 890',
        'Volunteer Rate: 35%',
        'Giving Families: 456'
      ];
      
      metrics.forEach((metric) => {
        doc.text(metric, 20, yPos);
        yPos += 10;
      });
      
      // Footer
      doc.setFontSize(8);
      doc.text('Living Rock Church Management System © 2025 | Powered by Xiracom', 20, 280);
      
      doc.save(`Church_Overview_Report_${selectedPeriod}_${currentDate.replace(/\//g, '-')}.pdf`);
      
      toast({
        title: "Report Generated",
        description: "Overview report has been downloaded successfully.",
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: "Error",
        description: "Failed to generate report.",
        variant: "destructive",
      });
    }
  };

  const handleExportReport = (reportType) => {
    console.log(`Exporting ${reportType} report for period: ${selectedPeriod}`);
    
    try {
      const doc = new jsPDF();
      const currentDate = new Date().toLocaleDateString();
      
      // Header
      doc.setFontSize(20);
      doc.text('Living Rock Church', 20, 20);
      doc.setFontSize(16);
      doc.text(`${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report`, 20, 30);
      doc.setFontSize(12);
      doc.text(`Period: ${selectedPeriod} | Generated on: ${currentDate}`, 20, 40);
      
      // Content based on report type
      doc.setFontSize(12);
      let content = '';
      
      switch (reportType) {
        case 'summary':
          content = 'Complete summary of all church activities and statistics.';
          break;
        case 'attendance':
          content = 'Detailed attendance records and trends.';
          break;
        case 'financial':
          content = 'Financial reports including donations and expenses.';
          break;
        case 'membership':
          content = 'Membership statistics and growth analysis.';
          break;
        case 'events':
          content = 'Event reports and attendance statistics.';
          break;
        default:
          content = 'General church report.';
      }
      
      doc.text(content, 20, 60);
      
      // Add sample data
      doc.text('Report Data:', 20, 80);
      doc.text('• Total records processed: 1,247', 20, 95);
      doc.text('• Analysis period: ' + selectedPeriod, 20, 105);
      doc.text('• Growth rate: +15.2%', 20, 115);
      doc.text('• Active participation: 890 members', 20, 125);
      
      // Footer
      doc.setFontSize(8);
      doc.text('Living Rock Church Management System © 2025 | Powered by Xiracom', 20, 280);
      
      doc.save(`${reportType}_Report_${selectedPeriod}_${currentDate.replace(/\//g, '-')}.pdf`);
      
      toast({
        title: "Export Complete",
        description: `${reportType} report has been downloaded successfully.`,
      });
    } catch (error) {
      console.error('Error exporting report:', error);
      toast({
        title: "Error",
        description: "Failed to export report.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteReport = (reportId) => {
    toast({
      title: "Delete Report",
      description: `Report ${reportId} would be deleted (feature in development)`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Reports & Analytics</h1>
        <div className="flex gap-3">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
              <SelectItem value="custom">Custom Range</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={() => handleExportReport("summary")}>
            <Download className="h-4 w-4 mr-2" />
            Export All
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {reportSummary.map((item, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{item.title}</p>
                  <p className="text-2xl font-bold">{item.value}</p>
                  <p className={`text-sm ${item.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                    {item.change} from last period
                  </p>
                </div>
                <item.icon className={`h-8 w-8 ${item.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detailed Reports */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Detailed Reports
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="attendance">Attendance</TabsTrigger>
              <TabsTrigger value="financial">Financial</TabsTrigger>
              <TabsTrigger value="membership">Membership</TabsTrigger>
              <TabsTrigger value="events">Events</TabsTrigger>
              <TabsTrigger value="custom">Custom</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Church Overview Report</h3>
                  <div className="flex gap-2">
                    <Button onClick={generateOverviewReportPDF}>
                      <FileText className="h-4 w-4 mr-2" />
                      Generate Report
                    </Button>
                    <Button variant="outline" onClick={() => handleExportReport("overview")}>
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Monthly Trends</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Attendance Growth</span>
                          <span className="text-green-600">+8.1%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Giving Growth</span>
                          <span className="text-green-600">+12.3%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>New Members</span>
                          <span className="text-blue-600">+15</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Events Hosted</span>
                          <span className="text-purple-600">8</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Key Metrics</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Active Members</span>
                          <span className="font-medium">1,247</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Regular Attendees</span>
                          <span className="font-medium">890</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Volunteer Rate</span>
                          <span className="font-medium">35%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Giving Families</span>
                          <span className="font-medium">456</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="attendance">
              <AttendanceReport period={selectedPeriod} />
            </TabsContent>

            <TabsContent value="financial">
              <FinancialReport period={selectedPeriod} />
            </TabsContent>

            <TabsContent value="membership">
              <MembershipReport period={selectedPeriod} />
            </TabsContent>

            <TabsContent value="events">
              <EventsReport period={selectedPeriod} />
            </TabsContent>

            <TabsContent value="custom">
              <CustomReportBuilder />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;
