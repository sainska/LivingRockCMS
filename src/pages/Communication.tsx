
import { useState } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  Mail, 
  MessageSquare, 
  Send, 
  Calendar, 
  Users,
  UserPlus,
  Clock,
  X,
  Tag,
  CheckCircle,
  AlertCircle,
  ChevronDown
} from 'lucide-react';
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
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Sample campaign data
const campaigns = [
  {
    id: 1,
    title: "Sunday Service Reminder",
    type: "email",
    sentAt: "May 20, 2025 • 4:30 PM",
    status: "sent",
    recipients: 248,
    opens: 186,
    clicks: 75,
    unsubscribes: 2
  },
  {
    id: 2,
    title: "Youth Camp Registration",
    type: "email",
    sentAt: "May 18, 2025 • 10:15 AM",
    status: "sent",
    recipients: 120,
    opens: 98,
    clicks: 62,
    unsubscribes: 0
  },
  {
    id: 3,
    title: "Church Cleanup Day",
    type: "sms",
    sentAt: "May 15, 2025 • 3:45 PM",
    status: "sent",
    recipients: 175,
    delivered: 170,
    responses: 45
  },
  {
    id: 4,
    title: "Worship Team Practice",
    type: "email",
    sentAt: null,
    status: "draft",
    recipients: 15,
    opens: 0,
    clicks: 0,
    unsubscribes: 0
  },
  {
    id: 5,
    title: "Monthly Newsletter",
    type: "email",
    sentAt: null,
    status: "scheduled",
    scheduledFor: "June 1, 2025 • 8:00 AM",
    recipients: 320,
    opens: 0,
    clicks: 0,
    unsubscribes: 0
  }
];

// Sample groups for messaging
const messageGroups = [
  {
    id: 1,
    name: "All Members",
    description: "All active church members",
    members: 320,
    icon: Users
  },
  {
    id: 2,
    name: "Worship Team",
    description: "Musicians and singers",
    members: 15,
    icon: MessageSquare
  },
  {
    id: 3,
    name: "Youth Group",
    description: "Teen ministry group",
    members: 45,
    icon: MessageSquare
  },
  {
    id: 4,
    name: "Prayer Team",
    description: "Prayer ministry volunteers",
    members: 12,
    icon: MessageSquare
  },
  {
    id: 5,
    name: "Church Staff",
    description: "All staff members",
    members: 8,
    icon: MessageSquare
  }
];

// Sample newsletters
const newsletters = [
  {
    id: 1,
    title: "May Monthly Newsletter",
    sentAt: "May 1, 2025",
    status: "sent",
    recipients: 315,
    opens: 242,
    clicks: 128
  },
  {
    id: 2,
    title: "Easter Special Edition",
    sentAt: "April 15, 2025",
    status: "sent",
    recipients: 310,
    opens: 265,
    clicks: 145
  },
  {
    id: 3,
    title: "June Monthly Newsletter",
    sentAt: null,
    status: "draft",
    recipients: 0,
    opens: 0,
    clicks: 0
  }
];

const CampaignCard = ({ campaign }) => {
  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex justify-between">
          <CardTitle className="text-lg text-xiracom-blue">{campaign.title}</CardTitle>
          {campaign.type === "email" ? (
            <Badge className="bg-xiracom-blue">Email</Badge>
          ) : (
            <Badge className="bg-xiracom-orange">SMS</Badge>
          )}
        </div>
        <CardDescription>
          {campaign.status === "sent" ? (
            <span>Sent: {campaign.sentAt}</span>
          ) : campaign.status === "scheduled" ? (
            <span>Scheduled: {campaign.scheduledFor}</span>
          ) : (
            <span>Draft</span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex items-center mb-3">
          <Users className="h-4 w-4 mr-1 text-gray-500" />
          <span>{campaign.recipients} recipients</span>
        </div>
        
        {campaign.status === "sent" && (
          <div className="space-y-2">
            {campaign.type === "email" ? (
              <>
                <div className="flex justify-between text-sm">
                  <span>Opens:</span>
                  <div className="flex items-center">
                    <span className="font-medium">{campaign.opens}</span>
                    <span className="text-gray-500 ml-1">({Math.round(campaign.opens / campaign.recipients * 100)}%)</span>
                  </div>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Clicks:</span>
                  <div className="flex items-center">
                    <span className="font-medium">{campaign.clicks}</span>
                    <span className="text-gray-500 ml-1">({Math.round(campaign.clicks / campaign.recipients * 100)}%)</span>
                  </div>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Unsubscribes:</span>
                  <div className="flex items-center">
                    <span className="font-medium">{campaign.unsubscribes}</span>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="flex justify-between text-sm">
                  <span>Delivered:</span>
                  <div className="flex items-center">
                    <span className="font-medium">{campaign.delivered}</span>
                    <span className="text-gray-500 ml-1">({Math.round(campaign.delivered / campaign.recipients * 100)}%)</span>
                  </div>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Responses:</span>
                  <div className="flex items-center">
                    <span className="font-medium">{campaign.responses}</span>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-2">
        {campaign.status === "draft" || campaign.status === "scheduled" ? (
          <div className="flex gap-2 w-full">
            <Button variant="outline" className="flex-1">Edit</Button>
            {campaign.status === "draft" ? (
              <Button className="flex-1 bg-xiracom-blue hover:bg-xiracom-darkblue">Send</Button>
            ) : (
              <Button className="flex-1 bg-xiracom-orange hover:bg-xiracom-lightorange">Reschedule</Button>
            )}
          </div>
        ) : (
          <div className="flex gap-2 w-full">
            <Button variant="outline" className="flex-1">View Report</Button>
            <Button className="flex-1 bg-xiracom-blue hover:bg-xiracom-darkblue">Duplicate</Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

const GroupCard = ({ group }) => {
  const Icon = group.icon;
  
  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex justify-between">
          <CardTitle className="text-lg text-xiracom-blue">{group.name}</CardTitle>
          <Badge variant="outline">{group.members} members</Badge>
        </div>
        <CardDescription>
          {group.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex justify-center">
          <Icon className="h-16 w-16 text-gray-300" />
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <div className="flex gap-2 w-full">
          <Button variant="outline" className="flex-1">
            <UserPlus className="mr-2 h-4 w-4" /> Manage
          </Button>
          <Button className="flex-1 bg-xiracom-blue hover:bg-xiracom-darkblue">
            <Send className="mr-2 h-4 w-4" /> Message
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

const NewsletterRow = ({ newsletter }) => {
  return (
    <tr className="border-b hover:bg-gray-50">
      <td className="px-4 py-4">
        <div className="font-medium text-xiracom-blue">{newsletter.title}</div>
      </td>
      <td className="px-4 py-4">
        {newsletter.status === "sent" ? (
          <div className="flex items-center">
            <CheckCircle className="h-4 w-4 mr-1 text-green-600" />
            <span>Sent on {newsletter.sentAt}</span>
          </div>
        ) : (
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1 text-amber-600" />
            <span>Draft</span>
          </div>
        )}
      </td>
      <td className="px-4 py-4 text-center">{newsletter.recipients}</td>
      <td className="px-4 py-4 text-center">{newsletter.opens}</td>
      <td className="px-4 py-4 text-center">{newsletter.clicks}</td>
      <td className="px-4 py-4 text-right">
        {newsletter.status === "sent" ? (
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm">View</Button>
            <Button variant="outline" size="sm">Duplicate</Button>
          </div>
        ) : (
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm">Edit</Button>
            <Button size="sm" className="bg-xiracom-blue hover:bg-xiracom-darkblue">Send</Button>
          </div>
        )}
      </td>
    </tr>
  );
};

const Communication = () => {
  const [activeTab, setActiveTab] = useState("campaigns");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCampaigns = campaigns.filter(campaign => 
    campaign.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const filteredGroups = messageGroups.filter(group => 
    group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredNewsletters = newsletters.filter(newsletter => 
    newsletter.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Communication Tools</h1>
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
      
      <Tabs defaultValue="campaigns" className="w-full" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="campaigns">Mass Communication</TabsTrigger>
          <TabsTrigger value="groups">Group Messaging</TabsTrigger>
          <TabsTrigger value="newsletters">Newsletters</TabsTrigger>
        </TabsList>
        
        <TabsContent value="campaigns" className="mt-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-semibold">Communication Campaigns</h2>
              <p className="text-sm text-gray-500 mt-1">
                Send emails and SMS to your congregation
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" /> Filter
              </Button>
              <Button className="bg-xiracom-blue hover:bg-xiracom-darkblue">
                <Plus className="mr-2 h-4 w-4" /> New Campaign
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCampaigns.map(campaign => (
              <CampaignCard key={campaign.id} campaign={campaign} />
            ))}
          </div>
          
          {filteredCampaigns.length === 0 && (
            <div className="text-center py-12">
              <Mail className="h-12 w-12 mx-auto text-gray-300" />
              <h3 className="mt-4 text-lg font-medium text-gray-500">No campaigns found</h3>
              <p className="mt-1 text-gray-400">Try adjusting your search or filters</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="groups" className="mt-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-semibold">Message Groups</h2>
              <p className="text-sm text-gray-500 mt-1">
                Send targeted messages to specific groups
              </p>
            </div>
            <Button className="bg-xiracom-blue hover:bg-xiracom-darkblue">
              <Plus className="mr-2 h-4 w-4" /> Create Group
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredGroups.map(group => (
              <GroupCard key={group.id} group={group} />
            ))}
          </div>
          
          {filteredGroups.length === 0 && (
            <div className="text-center py-12">
              <Users className="h-12 w-12 mx-auto text-gray-300" />
              <h3 className="mt-4 text-lg font-medium text-gray-500">No groups found</h3>
              <p className="mt-1 text-gray-400">Try adjusting your search</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="newsletters" className="mt-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-semibold">Newsletter Management</h2>
              <p className="text-sm text-gray-500 mt-1">
                Create and send newsletters to your congregation
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" /> Filter
              </Button>
              <Button className="bg-xiracom-blue hover:bg-xiracom-darkblue">
                <Plus className="mr-2 h-4 w-4" /> Create Newsletter
              </Button>
            </div>
          </div>
          
          <div className="border rounded-lg overflow-hidden">
            <table className="min-w-full divide-y">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Newsletter</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Recipients</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Opens</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Clicks</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y">
                {filteredNewsletters.map(newsletter => (
                  <NewsletterRow key={newsletter.id} newsletter={newsletter} />
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredNewsletters.length === 0 && (
            <div className="text-center py-12">
              <Mail className="h-12 w-12 mx-auto text-gray-300" />
              <h3 className="mt-4 text-lg font-medium text-gray-500">No newsletters found</h3>
              <p className="mt-1 text-gray-400">Try adjusting your search</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Communication;
