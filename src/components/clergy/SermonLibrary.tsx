
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BookOpen, 
  Plus, 
  Search, 
  Calendar, 
  Clock,
  Edit,
  Trash2,
  FileText,
  Download,
  Upload
} from "lucide-react";

const SermonLibrary = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [seriesFilter, setSeriesFilter] = useState("all");

  const sermons = [
    {
      id: 1,
      title: "Faith in Action",
      series: "Living Faith",
      scripture: "James 2:14-26",
      date: "2024-06-11",
      status: "Published",
      duration: "35 min",
      outline: "Introduction, Faith without works, Examples of active faith, Application",
      notes: "Emphasis on practical Christianity, interactive examples",
      attendance: 145,
      feedback: "Excellent response, many commitments"
    },
    {
      id: 2,
      title: "God's Unfailing Love",
      series: "Living Faith",
      scripture: "1 John 4:7-21",
      date: "2024-06-18",
      status: "In Progress",
      duration: "30 min",
      outline: "Love defined, God's love for us, Our love for others",
      notes: "Focus on practical love in community",
      attendance: null,
      feedback: null
    },
    {
      id: 3,
      title: "Walking in Truth",
      series: "Living Faith",
      scripture: "3 John 1:1-4",
      date: "2024-06-25",
      status: "Draft",
      duration: "25 min",
      outline: "Truth in scripture, Truth in relationships, Living truthfully",
      notes: "Address current cultural challenges",
      attendance: null,
      feedback: null
    },
    {
      id: 4,
      title: "The Good Shepherd",
      series: "Jesus the Way",
      scripture: "John 10:1-18",
      date: "2024-05-28",
      status: "Published",
      duration: "40 min",
      outline: "Shepherd imagery, Jesus as shepherd, Our response",
      notes: "Very well received, powerful imagery",
      attendance: 132,
      feedback: "Deep spiritual impact, requests for follow-up"
    },
    {
      id: 5,
      title: "Peace in the Storm",
      series: "Jesus the Way",
      scripture: "Mark 4:35-41",
      date: "2024-05-21",
      status: "Published",
      duration: "32 min",
      outline: "The storm, Jesus' response, Lessons in faith",
      notes: "Timely message during difficult season",
      attendance: 158,
      feedback: "Brought comfort to many facing trials"
    }
  ];

  const sermonSeries = [
    {
      name: "Living Faith",
      sermons: 3,
      current: true,
      startDate: "2024-06-11",
      description: "Exploring practical Christian living"
    },
    {
      name: "Jesus the Way",
      sermons: 8,
      current: false,
      startDate: "2024-04-07",
      description: "Journey through the life and teachings of Jesus"
    },
    {
      name: "Psalms of Hope",
      sermons: 6,
      current: false,
      startDate: "2024-01-14",
      description: "Finding hope and encouragement in the Psalms"
    }
  ];

  const filteredSermons = sermons.filter(sermon => {
    const matchesSearch = sermon.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sermon.scripture.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sermon.series.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || sermon.status.toLowerCase().replace(" ", "-") === statusFilter;
    const matchesSeries = seriesFilter === "all" || sermon.series === seriesFilter;
    
    return matchesSearch && matchesStatus && matchesSeries;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Published": return "bg-green-100 text-green-800";
      case "In Progress": return "bg-blue-100 text-blue-800";
      case "Draft": return "bg-yellow-100 text-yellow-800";
      case "Planning": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Sermon Library</h3>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Sermon
        </Button>
      </div>

      <Tabs defaultValue="sermons" className="space-y-4">
        <TabsList>
          <TabsTrigger value="sermons">All Sermons</TabsTrigger>
          <TabsTrigger value="series">Sermon Series</TabsTrigger>
          <TabsTrigger value="planning">Sermon Planning</TabsTrigger>
        </TabsList>

        <TabsContent value="sermons">
          {/* Search and Filters */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search sermons by title, scripture, or series..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="planning">Planning</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={seriesFilter} onValueChange={setSeriesFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Series" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Series</SelectItem>
                    <SelectItem value="Living Faith">Living Faith</SelectItem>
                    <SelectItem value="Jesus the Way">Jesus the Way</SelectItem>
                    <SelectItem value="Psalms of Hope">Psalms of Hope</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Sermons Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Sermons ({filteredSermons.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Series</TableHead>
                    <TableHead>Scripture</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Attendance</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSermons.map((sermon) => (
                    <TableRow key={sermon.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{sermon.title}</p>
                          <p className="text-sm text-muted-foreground">{sermon.outline}</p>
                        </div>
                      </TableCell>
                      <TableCell>{sermon.series}</TableCell>
                      <TableCell>{sermon.scripture}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <Calendar className="h-3 w-3" />
                          {sermon.date}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(sermon.status)}>
                          {sermon.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <Clock className="h-3 w-3" />
                          {sermon.duration}
                        </div>
                      </TableCell>
                      <TableCell>
                        {sermon.attendance ? sermon.attendance : "-"}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <FileText className="h-3 w-3" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="series">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sermonSeries.map((series, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {series.name}
                    {series.current && (
                      <Badge className="bg-blue-100 text-blue-800">Current</Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{series.description}</p>
                  <div className="flex justify-between text-sm">
                    <span>Started: {series.startDate}</span>
                    <span>{series.sermons} sermons</span>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      View Sermons
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="planning">
          <Card>
            <CardHeader>
              <CardTitle>Sermon Planning Calendar</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Upcoming Sermons</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {sermons.filter(s => s.status !== "Published").map((sermon) => (
                          <div key={sermon.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div>
                              <p className="font-medium">{sermon.title}</p>
                              <p className="text-sm text-muted-foreground">{sermon.date}</p>
                            </div>
                            <Badge className={getStatusColor(sermon.status)}>
                              {sermon.status}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Special Events</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="p-3 border rounded-lg">
                          <p className="font-medium">Youth Sunday</p>
                          <p className="text-sm text-muted-foreground">July 2, 2024</p>
                          <p className="text-xs text-muted-foreground">Youth-led service</p>
                        </div>
                        <div className="p-3 border rounded-lg">
                          <p className="font-medium">Missions Sunday</p>
                          <p className="text-sm text-muted-foreground">July 16, 2024</p>
                          <p className="text-xs text-muted-foreground">Guest missionary speaker</p>
                        </div>
                        <div className="p-3 border rounded-lg">
                          <p className="font-medium">Baptism Service</p>
                          <p className="text-sm text-muted-foreground">July 30, 2024</p>
                          <p className="text-xs text-muted-foreground">Special baptism ceremony</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <Button variant="outline" className="h-20 flex-col gap-2">
                        <Plus className="h-6 w-6" />
                        New Sermon
                      </Button>
                      <Button variant="outline" className="h-20 flex-col gap-2">
                        <BookOpen className="h-6 w-6" />
                        New Series
                      </Button>
                      <Button variant="outline" className="h-20 flex-col gap-2">
                        <Upload className="h-6 w-6" />
                        Import Sermon
                      </Button>
                      <Button variant="outline" className="h-20 flex-col gap-2">
                        <Calendar className="h-6 w-6" />
                        Plan Schedule
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SermonLibrary;
