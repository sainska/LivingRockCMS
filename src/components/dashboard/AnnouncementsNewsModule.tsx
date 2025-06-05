
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, Calendar, BookOpen, Filter } from "lucide-react";

const AnnouncementsNewsModule = () => {
  const announcements = [
    {
      id: 1,
      title: "New Year Service Schedule",
      content: "Join us for special New Year services and events...",
      type: "urgent",
      date: "2025-01-05",
      author: "Church Admin"
    },
    {
      id: 2,
      title: "Youth Conference Registration Open",
      content: "Register now for the annual youth conference...",
      type: "events",
      date: "2025-01-03",
      author: "Youth Ministry"
    },
    {
      id: 3,
      title: "Building Fund Update",
      content: "We've reached 75% of our building fund goal...",
      type: "general",
      date: "2025-01-01",
      author: "Finance Committee"
    },
    {
      id: 4,
      title: "Weekly Bulletin Available",
      content: "Download this week's digital bulletin...",
      type: "bulletin",
      date: "2024-12-29",
      author: "Church Secretary"
    }
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'urgent': return 'bg-red-500';
      case 'events': return 'bg-xiracom-orange';
      case 'bulletin': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'urgent': return 'Urgent';
      case 'events': return 'Events';
      case 'bulletin': return 'Bulletin';
      default: return 'General';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-xiracom-blue">Announcements & News</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Bell className="h-4 w-4 mr-2" />
            Alert Settings
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-red-500 to-red-700 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Urgent</p>
                <p className="text-2xl font-bold">1</p>
              </div>
              <Bell className="h-6 w-6 opacity-80" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-xiracom-orange to-xiracom-lightorange text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Events</p>
                <p className="text-2xl font-bold">1</p>
              </div>
              <Calendar className="h-6 w-6 opacity-80" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-blue-500 to-blue-700 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Bulletins</p>
                <p className="text-2xl font-bold">1</p>
              </div>
              <BookOpen className="h-6 w-6 opacity-80" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-gray-500 to-gray-700 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">General</p>
                <p className="text-2xl font-bold">1</p>
              </div>
              <Bell className="h-6 w-6 opacity-80" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        {announcements.map((announcement) => (
          <Card key={announcement.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className={`w-1 h-16 rounded ${getTypeColor(announcement.type)}`} />
                <div className="flex-1 space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-lg">{announcement.title}</h3>
                        <Badge className={getTypeColor(announcement.type)}>
                          {getTypeText(announcement.type)}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        By {announcement.author} • {announcement.date}
                      </p>
                    </div>
                    <Button size="sm" variant="outline">
                      Read More
                    </Button>
                  </div>
                  <p className="text-muted-foreground">{announcement.content}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Digital Bulletin */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Digital Bulletin & Newsletter
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">This Week's Bulletin</h4>
              <p className="text-sm text-muted-foreground mb-3">
                January 5, 2025 - Week 1
              </p>
              <Button size="sm" className="bg-xiracom-blue hover:bg-xiracom-darkblue">
                Download PDF
              </Button>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">Monthly Newsletter</h4>
              <p className="text-sm text-muted-foreground mb-3">
                January 2025 Edition
              </p>
              <Button size="sm" variant="outline">
                View Online
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notification Preferences */}
      <Card>
        <CardHeader>
          <CardTitle>Notification Preferences</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold">Email Notifications</p>
                <p className="text-sm text-muted-foreground">Receive announcements via email</p>
              </div>
              <Button variant="outline" size="sm">Configure</Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold">SMS Alerts</p>
                <p className="text-sm text-muted-foreground">Get urgent announcements via SMS</p>
              </div>
              <Button variant="outline" size="sm">Configure</Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold">Push Notifications</p>
                <p className="text-sm text-muted-foreground">Browser notifications for important updates</p>
              </div>
              <Button variant="outline" size="sm">Configure</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnnouncementsNewsModule;
