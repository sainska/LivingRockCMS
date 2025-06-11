
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, Bell } from "lucide-react";

const EventsServicesModule = () => {
  const upcomingEvents = [
    {
      id: 1,
      title: "Sunday Service",
      date: "2025-01-07",
      time: "09:00 AM",
      location: "Main Sanctuary",
      type: "Service",
      rsvpRequired: false
    },
    {
      id: 2,
      title: "Youth Conference",
      date: "2025-01-12",
      time: "02:00 PM",
      location: "Fellowship Hall",
      type: "Conference",
      rsvpRequired: true
    },
    {
      id: 3,
      title: "Bible Study",
      date: "2025-01-15",
      time: "07:00 PM",
      location: "Room 201",
      type: "Study",
      rsvpRequired: false
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-xiracom-blue">Events & Services</h2>
        <Button variant="outline">
          <Bell className="h-4 w-4 mr-2" />
          Set Reminders
        </Button>
      </div>

      <div className="grid gap-4">
        {upcomingEvents.map((event) => (
          <Card key={event.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-lg">{event.title}</h3>
                    <Badge 
                      variant="outline" 
                      className={`${
                        event.type === 'Service' ? 'border-xiracom-blue text-xiracom-blue' :
                        event.type === 'Conference' ? 'border-xiracom-orange text-xiracom-orange' :
                        'border-purple-500 text-purple-500'
                      }`}
                    >
                      {event.type}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {event.date}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {event.time}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {event.location}
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  {event.rsvpRequired && (
                    <Button size="sm" className="bg-xiracom-orange hover:bg-xiracom-lightorange">
                      RSVP
                    </Button>
                  )}
                  <Button size="sm" variant="outline">
                    Details
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-20 flex-col">
              <Calendar className="h-6 w-6 mb-2" />
              View Calendar
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Clock className="h-6 w-6 mb-2" />
              Event History
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Bell className="h-6 w-6 mb-2" />
              Notification Settings
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EventsServicesModule;
