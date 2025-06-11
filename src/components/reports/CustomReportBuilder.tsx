
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Plus, Settings, Play, Download } from "lucide-react";

const CustomReportBuilder = () => {
  const [reportType, setReportType] = useState("");
  const [dateRange, setDateRange] = useState("");
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [filters, setFilters] = useState<any[]>([]);

  const reportTypes = [
    { value: "attendance", label: "Attendance Report" },
    { value: "membership", label: "Membership Report" },
    { value: "events", label: "Events Report" },
    { value: "engagement", label: "Member Engagement Report" },
    { value: "system", label: "System Activity Report" },
    { value: "mixed", label: "Mixed Report" }
  ];

  const availableFields = {
    attendance: ["Service Name", "Date", "Total Attendance", "Capacity", "Fill Rate"],
    membership: ["Member Name", "Age Group", "Join Date", "Ministry Involvement", "Status"],
    events: ["Event Name", "Date", "Type", "Attendance", "Location", "Status"],
    engagement: ["Member Name", "Activity", "Participation Level", "Frequency", "Duration"],
    system: ["Module", "Activity Type", "User Count", "Success Rate", "Performance"],
    mixed: ["All Available Fields"]
  };

  const addFilter = () => {
    setFilters([...filters, { field: "", operator: "", value: "" }]);
  };

  const updateFilter = (index: number, key: string, value: string) => {
    const newFilters = [...filters];
    newFilters[index][key] = value;
    setFilters(newFilters);
  };

  const removeFilter = (index: number) => {
    setFilters(filters.filter((_, i) => i !== index));
  };

  const handleFieldToggle = (field: string) => {
    setSelectedFields(prev => 
      prev.includes(field) 
        ? prev.filter(f => f !== field)
        : [...prev, field]
    );
  };

  const generateReport = () => {
    console.log("Generating custom report with:", {
      reportType,
      dateRange,
      selectedFields,
      filters
    });
    // In a real app, this would generate and display the report
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Custom Report Builder</h3>
        <div className="flex gap-2">
          <Button variant="outline" onClick={generateReport}>
            <Play className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Report Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Report Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Report Type */}
            <div className="space-y-2">
              <Label>Report Type</Label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select report type" />
                </SelectTrigger>
                <SelectContent>
                  {reportTypes.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Date Range */}
            <div className="space-y-2">
              <Label>Date Range</Label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select date range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="quarter">This Quarter</SelectItem>
                  <SelectItem value="year">This Year</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Fields Selection */}
            {reportType && (
              <div className="space-y-2">
                <Label>Select Fields to Include</Label>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {availableFields[reportType as keyof typeof availableFields]?.map(field => (
                    <div key={field} className="flex items-center space-x-2">
                      <Checkbox
                        id={field}
                        checked={selectedFields.includes(field)}
                        onCheckedChange={() => handleFieldToggle(field)}
                      />
                      <Label htmlFor={field} className="text-sm">{field}</Label>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Filters & Conditions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <Label>Add Filters</Label>
              <Button variant="outline" size="sm" onClick={addFilter}>
                <Plus className="h-4 w-4 mr-1" />
                Add Filter
              </Button>
            </div>

            {filters.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No filters added. Click "Add Filter" to create custom conditions.
              </p>
            ) : (
              <div className="space-y-3">
                {filters.map((filter, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <Select 
                      value={filter.field} 
                      onValueChange={(value) => updateFilter(index, 'field', value)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Field" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="date">Date</SelectItem>
                        <SelectItem value="count">Count</SelectItem>
                        <SelectItem value="attendance">Attendance</SelectItem>
                        <SelectItem value="status">Status</SelectItem>
                        <SelectItem value="engagement">Engagement</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select 
                      value={filter.operator} 
                      onValueChange={(value) => updateFilter(index, 'operator', value)}
                    >
                      <SelectTrigger className="w-24">
                        <SelectValue placeholder="Op" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="equals">=</SelectItem>
                        <SelectItem value="greater">&gt;</SelectItem>
                        <SelectItem value="less">&lt;</SelectItem>
                        <SelectItem value="contains">Contains</SelectItem>
                      </SelectContent>
                    </Select>

                    <Input
                      placeholder="Value"
                      value={filter.value}
                      onChange={(e) => updateFilter(index, 'value', e.target.value)}
                      className="flex-1"
                    />

                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => removeFilter(index)}
                    >
                      ×
                    </Button>
                  </div>
                ))}
              </div>
            )}

            <Separator />

            <div className="space-y-2">
              <Label>Report Name (Optional)</Label>
              <Input placeholder="Enter custom report name" />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="save-template" />
              <Label htmlFor="save-template" className="text-sm">
                Save as template for future use
              </Label>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Preview */}
      {reportType && selectedFields.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Report Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground space-y-2">
              <p><strong>Report Type:</strong> {reportTypes.find(t => t.value === reportType)?.label}</p>
              <p><strong>Date Range:</strong> {dateRange || "Not selected"}</p>
              <p><strong>Selected Fields:</strong> {selectedFields.join(", ")}</p>
              {filters.length > 0 && (
                <p><strong>Filters:</strong> {filters.length} filter(s) applied</p>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CustomReportBuilder;
