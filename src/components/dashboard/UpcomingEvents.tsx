
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, Users } from "lucide-react";

// Sample data for upcoming events
const events = [
  {
    id: 1,
    title: "Sunday Service",
    date: "2025-05-25",
    time: "9:00 AM - 11:00 AM",
    location: "Main Hall",
    attendees: 120
  },
  {
    id: 2,
    title: "Youth Meeting",
    date: "2025-05-24",
    time: "6:00 PM - 8:00 PM",
    location: "Youth Center",
    attendees: 45
  },
  {
    id: 3,
    title: "Prayer Meeting",
    date: "2025-05-26",
    time: "7:00 PM - 8:00 PM",
    location: "Chapel",
    attendees: 35
  }
];

const UpcomingEvents = () => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Upcoming Events</CardTitle>
          <CardDescription>Next scheduled church events</CardDescription>
        </div>
        <Button variant="outline" size="sm">View Calendar</Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {events.map((event) => (
          <div key={event.id} className="flex flex-col p-4 border rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold">{event.title}</h3>
              <Button variant="ghost" size="sm">Details</Button>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>{event.date}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>{event.time}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{event.location}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>{event.attendees} expected</span>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default UpcomingEvents;
