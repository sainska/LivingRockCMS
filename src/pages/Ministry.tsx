
import { useState } from 'react';
import { Search, Filter, Plus, Tag, Clock, User, FileText, Download, BookOpen, Heart } from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Sample sermon data for demonstration
const sermons = [
  {
    id: 1,
    title: "Finding Peace in Troubled Times",
    speaker: "Pastor John Smith",
    date: "May 19, 2025",
    duration: "45 mins",
    scripture: "John 14:27",
    tags: ["Peace", "Faith", "Trust"],
    featured: true,
    audioUrl: "#",
    videoUrl: "#",
    notes: "Sample sermon notes about finding peace...",
    downloads: 124
  },
  {
    id: 2,
    title: "The Power of Prayer",
    speaker: "Pastor John Smith",
    date: "May 12, 2025",
    duration: "38 mins",
    scripture: "James 5:16",
    tags: ["Prayer", "Spiritual Growth"],
    featured: false,
    audioUrl: "#",
    videoUrl: "#",
    notes: "Sample sermon notes about prayer...",
    downloads: 98
  },
  {
    id: 3,
    title: "Living with Purpose",
    speaker: "Rev. Sarah Johnson",
    date: "May 5, 2025",
    duration: "42 mins",
    scripture: "Ephesians 2:10",
    tags: ["Purpose", "Calling", "Life"],
    featured: true,
    audioUrl: "#",
    videoUrl: "#",
    notes: "Sample sermon notes about living with purpose...",
    downloads: 156
  },
  {
    id: 4,
    title: "The Good Shepherd",
    speaker: "Pastor Michael Williams",
    date: "April 28, 2025",
    duration: "40 mins",
    scripture: "Psalm 23",
    tags: ["Guidance", "Protection", "Comfort"],
    featured: false,
    audioUrl: "#",
    videoUrl: "#",
    notes: "Sample sermon notes about the Good Shepherd...",
    downloads: 112
  }
];

// Sample Bible study data
const bibleStudies = [
  {
    id: 1,
    title: "Book of Romans Study",
    leader: "Deacon David",
    day: "Wednesday",
    time: "7:00 PM",
    location: "Fellowship Hall",
    currentLesson: "Romans 8: Life in the Spirit",
    members: 15,
    description: "Weekly study through Paul's letter to the Romans"
  },
  {
    id: 2,
    title: "Women's Bible Study",
    leader: "Sister Mary",
    day: "Tuesday",
    time: "10:00 AM",
    location: "Room 102",
    currentLesson: "Esther: For Such a Time as This",
    members: 22,
    description: "Bible study for women exploring biblical heroines"
  },
  {
    id: 3,
    title: "Youth Bible Discovery",
    leader: "Youth Pastor Mike",
    day: "Friday",
    time: "6:30 PM",
    location: "Youth Room",
    currentLesson: "Foundations of Faith",
    members: 18,
    description: "Interactive Bible study for teenagers"
  }
];

// Sample pastoral care data
const careRequests = [
  {
    id: 1,
    type: "Prayer",
    member: "Alice Johnson",
    request: "Healing from surgery",
    date: "May 21, 2025",
    status: "Active",
    assignedTo: "Prayer Team",
    notes: "Follow up next week",
    confidential: true
  },
  {
    id: 2,
    type: "Visitation",
    member: "George Smith",
    request: "Hospital visitation",
    date: "May 20, 2025",
    status: "Completed",
    assignedTo: "Pastor John",
    notes: "Visited on Wednesday",
    confidential: false
  },
  {
    id: 3,
    type: "Counseling",
    member: "Robert & Susan Davis",
    request: "Marriage counseling",
    date: "May 18, 2025",
    status: "Scheduled",
    assignedTo: "Pastor Sarah",
    notes: "First session scheduled for May 25",
    confidential: true
  }
];

const SermonCard = ({ sermon }) => {
  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex justify-between">
          <CardTitle className="text-lg text-xiracom-blue">{sermon.title}</CardTitle>
          {sermon.featured && (
            <Badge className="bg-xiracom-orange">Featured</Badge>
          )}
        </div>
        <CardDescription>
          {sermon.speaker} • {sermon.date}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex items-center mb-2 text-sm">
          <Clock className="h-4 w-4 mr-1 text-gray-500" />
          <span>{sermon.duration}</span>
          <span className="mx-2">•</span>
          <BookOpen className="h-4 w-4 mr-1 text-gray-500" />
          <span>{sermon.scripture}</span>
        </div>
        <div className="flex flex-wrap gap-1 mb-3">
          {sermon.tags.map((tag, i) => (
            <Badge key={i} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="pt-0 justify-between">
        <div className="text-xs text-gray-500">
          {sermon.downloads} downloads
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <FileText className="h-3.5 w-3.5 mr-1" /> Notes
          </Button>
          <Button size="sm" className="bg-xiracom-blue hover:bg-xiracom-darkblue">
            Listen
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

const StudyGroupCard = ({ study }) => {
  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg text-xiracom-blue">{study.title}</CardTitle>
        <CardDescription>
          Led by {study.leader}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex items-center mb-2 text-sm">
          <Clock className="h-4 w-4 mr-1 text-gray-500" />
          <span>{study.day}s at {study.time}</span>
          <span className="mx-2">•</span>
          <User className="h-4 w-4 mr-1 text-gray-500" />
          <span>{study.members} members</span>
        </div>
        <p className="text-sm mb-2">{study.description}</p>
        <div className="bg-muted rounded p-2 text-sm">
          <p className="font-medium">Current Lesson:</p>
          <p>{study.currentLesson}</p>
        </div>
      </CardContent>
      <CardFooter className="pt-0 justify-between">
        <span className="text-xs text-gray-500">
          Location: {study.location}
        </span>
        <Button size="sm" className="bg-xiracom-blue hover:bg-xiracom-darkblue">
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
};

const CareRequestRow = ({ request }) => {
  return (
    <tr className="border-b hover:bg-gray-50">
      <td className="px-4 py-3">
        <div className="flex items-center">
          {request.confidential && (
            <span className="bg-red-100 text-red-800 text-xs font-medium mr-2 px-2 py-0.5 rounded">
              Confidential
            </span>
          )}
          {request.type}
        </div>
      </td>
      <td className="px-4 py-3">{request.member}</td>
      <td className="px-4 py-3 max-w-[200px] truncate" title={request.request}>
        {request.request}
      </td>
      <td className="px-4 py-3">{request.date}</td>
      <td className="px-4 py-3">
        <span className={`px-2 py-1 rounded-full text-xs font-medium 
          ${request.status === 'Active' ? 'bg-green-100 text-green-800' : 
            request.status === 'Completed' ? 'bg-gray-100 text-gray-800' : 
            'bg-yellow-100 text-yellow-800'}`}>
          {request.status}
        </span>
      </td>
      <td className="px-4 py-3">{request.assignedTo}</td>
      <td className="px-4 py-3 text-right">
        <Button variant="ghost" size="sm">View</Button>
        <Button variant="ghost" size="sm" className="text-blue-600">Update</Button>
      </td>
    </tr>
  );
};

const Ministry = () => {
  const [activeTab, setActiveTab] = useState("sermons");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredSermons = sermons.filter(sermon => 
    sermon.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sermon.speaker.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sermon.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Ministry Support</h1>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search..."
            className="pl-8 w-[200px] md:w-[300px]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <Tabs defaultValue="sermons" className="w-full" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="sermons">Sermon Archive</TabsTrigger>
          <TabsTrigger value="studies">Bible Studies</TabsTrigger>
          <TabsTrigger value="pastoral">Pastoral Care</TabsTrigger>
        </TabsList>
        
        <TabsContent value="sermons">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Sermon Archive</h2>
            <div className="flex gap-2">
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" /> Filter
              </Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-xiracom-blue hover:bg-xiracom-darkblue">
                    <Plus className="mr-2 h-4 w-4" /> Add Sermon
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Sermon</DialogTitle>
                    <DialogDescription>
                      Upload a new sermon to the archive.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-4">
                    <p>Sermon upload form would go here.</p>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSermons.map(sermon => (
              <SermonCard key={sermon.id} sermon={sermon} />
            ))}
          </div>
          
          {filteredSermons.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 mx-auto text-gray-300" />
              <h3 className="mt-4 text-lg font-medium text-gray-500">No sermons found</h3>
              <p className="mt-1 text-gray-400">Try adjusting your search or filters</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="studies">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Bible Study Groups</h2>
            <Button className="bg-xiracom-blue hover:bg-xiracom-darkblue">
              <Plus className="mr-2 h-4 w-4" /> Create Group
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {bibleStudies.map(study => (
              <StudyGroupCard key={study.id} study={study} />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="pastoral">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Pastoral Care Tracking</h2>
            <Button className="bg-xiracom-blue hover:bg-xiracom-darkblue">
              <Plus className="mr-2 h-4 w-4" /> New Request
            </Button>
          </div>
          
          <div className="border rounded-lg overflow-hidden">
            <table className="min-w-full divide-y">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Member</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Request</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned To</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y">
                {careRequests.map(request => (
                  <CareRequestRow key={request.id} request={request} />
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Ministry;
