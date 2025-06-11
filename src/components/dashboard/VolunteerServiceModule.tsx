
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { HandHeart, Calendar, Clock, Users, CheckCircle } from "lucide-react";

const VolunteerServiceModule = () => {
  const myDuties = [
    {
      id: 1,
      role: "Usher",
      date: "2025-01-12",
      time: "08:30 AM",
      service: "Sunday Service",
      status: "confirmed"
    },
    {
      id: 2,
      role: "Audio/Visual",
      date: "2025-01-19",
      time: "09:00 AM",
      service: "Youth Service",
      status: "pending"
    }
  ];

  const availableOpportunities = [
    {
      id: 1,
      title: "Church Cleaning",
      description: "Help maintain our church facility",
      date: "2025-01-15",
      time: "09:00 AM - 12:00 PM",
      volunteers: 8,
      needed: 12,
      category: "Maintenance"
    },
    {
      id: 2,
      title: "Food Drive Coordinator",
      description: "Organize community food drive event",
      date: "2025-01-20",
      time: "10:00 AM - 4:00 PM",
      volunteers: 3,
      needed: 6,
      category: "Community"
    },
    {
      id: 3,
      title: "Children's Ministry Helper",
      description: "Assist with Sunday school activities",
      date: "2025-01-26",
      time: "09:00 AM - 11:00 AM",
      volunteers: 2,
      needed: 4,
      category: "Ministry"
    }
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Maintenance': return 'border-blue-500 text-blue-500';
      case 'Community': return 'border-green-500 text-green-500';
      case 'Ministry': return 'border-purple-500 text-purple-500';
      default: return 'border-gray-500 text-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-xiracom-blue">Volunteer & Service</h2>
        <Button variant="outline">
          <HandHeart className="h-4 w-4 mr-2" />
          My Schedule
        </Button>
      </div>

      {/* Service Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-xiracom-blue to-xiracom-darkblue text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Active Duties</p>
                <p className="text-2xl font-bold">2</p>
              </div>
              <HandHeart className="h-8 w-8 opacity-80" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-500 to-green-700 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Hours This Month</p>
                <p className="text-2xl font-bold">12</p>
              </div>
              <Clock className="h-8 w-8 opacity-80" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-orange-500 to-orange-700 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Available Roles</p>
                <p className="text-2xl font-bold">3</p>
              </div>
              <Users className="h-8 w-8 opacity-80" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* My Upcoming Duties */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            My Upcoming Duties
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {myDuties.map((duty) => (
              <div key={duty.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-2 h-12 bg-xiracom-blue rounded" />
                  <div>
                    <h4 className="font-semibold">{duty.role}</h4>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {duty.date} at {duty.time}
                      </div>
                      <p>Service: {duty.service}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={duty.status === 'confirmed' ? 'default' : 'secondary'}>
                    {duty.status}
                  </Badge>
                  <Button size="sm" variant="outline">
                    Details
                  </Button>
                </div>
              </div>
            ))}
            
            {myDuties.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <HandHeart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No upcoming duties scheduled</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Available Opportunities */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HandHeart className="h-5 w-5" />
            Available Volunteer Opportunities
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {availableOpportunities.map((opportunity) => (
              <div key={opportunity.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold">{opportunity.title}</h4>
                      <Badge variant="outline" className={getCategoryColor(opportunity.category)}>
                        {opportunity.category}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{opportunity.description}</p>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {opportunity.date}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        {opportunity.time}
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        {opportunity.volunteers}/{opportunity.needed} volunteers
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-xiracom-orange h-2 rounded-full" 
                        style={{ width: `${(opportunity.volunteers / opportunity.needed) * 100}%` }}
                      />
                    </div>
                  </div>
                  <Button className="ml-4 bg-xiracom-blue hover:bg-xiracom-darkblue">
                    Sign Up
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Service History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Service History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <div>
                  <p className="font-semibold">Sunday Service Usher</p>
                  <p className="text-sm text-muted-foreground">December 29, 2024</p>
                </div>
              </div>
              <span className="text-sm text-muted-foreground">3 hours</span>
            </div>
            <div className="flex items-center justify-between p-3 border rounded">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <div>
                  <p className="font-semibold">Christmas Event Helper</p>
                  <p className="text-sm text-muted-foreground">December 25, 2024</p>
                </div>
              </div>
              <span className="text-sm text-muted-foreground">5 hours</span>
            </div>
            <div className="flex items-center justify-between p-3 border rounded">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <div>
                  <p className="font-semibold">Youth Ministry Assistant</p>
                  <p className="text-sm text-muted-foreground">December 22, 2024</p>
                </div>
              </div>
              <span className="text-sm text-muted-foreground">4 hours</span>
            </div>
          </div>
          <Button variant="outline" className="w-full mt-4">
            View Full History
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default VolunteerServiceModule;
