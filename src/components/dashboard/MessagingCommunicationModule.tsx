
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Send, Bell, Users, User } from "lucide-react";

const MessagingCommunicationModule = () => {
  const messages = [
    {
      id: 1,
      from: "Pastor John Doe",
      subject: "Welcome to Youth Ministry",
      preview: "Thank you for joining our youth ministry...",
      date: "2025-01-05",
      type: "personal",
      unread: true
    },
    {
      id: 2,
      from: "Church Admin",
      subject: "Service Schedule Update",
      preview: "Please note the updated service times...",
      date: "2025-01-03",
      type: "broadcast",
      unread: true
    },
    {
      id: 3,
      from: "Sister Grace (Choir Leader)",
      subject: "Choir Practice Reminder",
      preview: "Don't forget about tonight's practice...",
      date: "2025-01-02",
      type: "group",
      unread: false
    }
  ];

  const conversations = [
    {
      id: 1,
      name: "Pastor John Doe",
      role: "Senior Pastor",
      lastMessage: "Thank you for your dedication to the ministry",
      timestamp: "2 hours ago",
      unread: 0
    },
    {
      id: 2,
      name: "Youth Ministry Group",
      role: "Group Chat",
      lastMessage: "Sarah: Looking forward to the retreat!",
      timestamp: "1 day ago",
      unread: 3
    },
    {
      id: 3,
      name: "Sister Grace",
      role: "Choir Leader",
      lastMessage: "Practice is at 7 PM tonight",
      timestamp: "2 days ago",
      unread: 0
    }
  ];

  const getMessageTypeColor = (type: string) => {
    switch (type) {
      case 'personal': return 'border-blue-500 text-blue-500';
      case 'broadcast': return 'border-red-500 text-red-500';
      case 'group': return 'border-green-500 text-green-500';
      default: return 'border-gray-500 text-gray-500';
    }
  };

  const getMessageTypeText = (type: string) => {
    switch (type) {
      case 'personal': return 'Personal';
      case 'broadcast': return 'Broadcast';
      case 'group': return 'Group';
      default: return 'Message';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-xiracom-blue">Messaging & Communication</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </Button>
          <Button className="bg-xiracom-blue hover:bg-xiracom-darkblue" size="sm">
            <Send className="h-4 w-4 mr-2" />
            New Message
          </Button>
        </div>
      </div>

      {/* Message Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-700 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Unread</p>
                <p className="text-2xl font-bold">2</p>
              </div>
              <Bell className="h-6 w-6 opacity-80" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-500 to-green-700 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Total Messages</p>
                <p className="text-2xl font-bold">15</p>
              </div>
              <MessageCircle className="h-6 w-6 opacity-80" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-500 to-purple-700 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Active Chats</p>
                <p className="text-2xl font-bold">3</p>
              </div>
              <Users className="h-6 w-6 opacity-80" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-orange-500 to-orange-700 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Broadcasts</p>
                <p className="text-2xl font-bold">8</p>
              </div>
              <Send className="h-6 w-6 opacity-80" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Messages */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Recent Messages
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer ${message.unread ? 'bg-blue-50' : ''}`}>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className={`font-semibold ${message.unread ? 'text-xiracom-blue' : ''}`}>
                          {message.from}
                        </h4>
                        <Badge variant="outline" className={getMessageTypeColor(message.type)}>
                          {getMessageTypeText(message.type)}
                        </Badge>
                        {message.unread && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full" />
                        )}
                      </div>
                      <p className={`font-medium ${message.unread ? 'text-gray-900' : 'text-gray-600'}`}>
                        {message.subject}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {message.preview}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {message.date}
                      </p>
                    </div>
                    <Button size="sm" variant="outline">
                      Read
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              View All Messages
            </Button>
          </CardContent>
        </Card>

        {/* Active Conversations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Active Conversations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {conversations.map((conversation) => (
                <div key={conversation.id} className="flex items-center gap-4 p-3 border rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                  <div className="w-12 h-12 bg-xiracom-blue rounded-full flex items-center justify-center text-white font-bold">
                    {conversation.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold">{conversation.name}</h4>
                      {conversation.unread > 0 && (
                        <Badge className="bg-red-500">{conversation.unread}</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{conversation.role}</p>
                    <p className="text-sm">{conversation.lastMessage}</p>
                    <p className="text-xs text-muted-foreground">{conversation.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-20 flex-col">
              <User className="h-6 w-6 mb-2" />
              Message Pastor
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Users className="h-6 w-6 mb-2" />
              Group Messages
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Bell className="h-6 w-6 mb-2" />
              Notification Settings
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Broadcast Messages (Leaders Only) */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Send className="h-5 w-5" />
            Send Broadcast Message
            <Badge variant="outline">Leaders Only</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <Send className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">
              Send messages to all members or specific groups
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              This feature is available for church leaders and ministry heads
            </p>
            <Button className="bg-xiracom-orange hover:bg-xiracom-lightorange" disabled>
              Contact Admin for Access
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MessagingCommunicationModule;
