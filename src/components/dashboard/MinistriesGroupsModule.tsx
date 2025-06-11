
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Calendar, MessageCircle, UserPlus } from "lucide-react";

const MinistriesGroupsModule = () => {
  const joinedMinistries = [
    {
      id: 1,
      name: "Youth Ministry",
      role: "Member",
      nextMeeting: "2025-01-08",
      leader: "Pastor Mike",
      members: 45
    },
    {
      id: 2,
      name: "Choir",
      role: "Member",
      nextMeeting: "2025-01-06",
      leader: "Sister Grace",
      members: 32
    }
  ];

  const availableMinistries = [
    {
      id: 3,
      name: "Men's Fellowship",
      description: "Fellowship and spiritual growth for men",
      leader: "Brother Paul",
      members: 28
    },
    {
      id: 4,
      name: "Ushering Team",
      description: "Welcome and guide church members",
      leader: "Sister Mary",
      members: 18
    },
    {
      id: 5,
      name: "Sunday School",
      description: "Teaching and nurturing children",
      leader: "Teacher Sarah",
      members: 15
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-xiracom-blue">Ministries & Groups</h2>
        <Button variant="outline">
          <UserPlus className="h-4 w-4 mr-2" />
          Browse All
        </Button>
      </div>

      {/* Joined Ministries */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            My Ministries
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {joinedMinistries.map((ministry) => (
              <div key={ministry.id} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold">{ministry.name}</h4>
                      <Badge variant="outline">{ministry.role}</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        Next meeting: {ministry.nextMeeting}
                      </div>
                      <p>Leader: {ministry.leader}</p>
                      <p>Members: {ministry.members}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <MessageCircle className="h-4 w-4 mr-1" />
                      Chat
                    </Button>
                    <Button size="sm" variant="outline">
                      Schedule
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Available Ministries */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Available Ministries
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {availableMinistries.map((ministry) => (
              <div key={ministry.id} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <h4 className="font-semibold">{ministry.name}</h4>
                    <p className="text-sm text-muted-foreground">{ministry.description}</p>
                    <div className="text-sm text-muted-foreground">
                      <p>Leader: {ministry.leader}</p>
                      <p>Members: {ministry.members}</p>
                    </div>
                  </div>
                  <Button size="sm" className="bg-xiracom-blue hover:bg-xiracom-darkblue">
                    Join Ministry
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Group Activities */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Group Activities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded">
              <div>
                <p className="font-semibold">Youth Ministry Retreat</p>
                <p className="text-sm text-muted-foreground">January 15-17, 2025</p>
              </div>
              <Button size="sm" variant="outline">Details</Button>
            </div>
            <div className="flex items-center justify-between p-3 border rounded">
              <div>
                <p className="font-semibold">Choir Practice</p>
                <p className="text-sm text-muted-foreground">Every Tuesday 7:00 PM</p>
              </div>
              <Button size="sm" variant="outline">Details</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MinistriesGroupsModule;
