
import { useState } from 'react';
import { useEvents } from '@/hooks/useEvents';
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Calendar, Clock, MapPin, Filter, Plus, Download, Search, X } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Drawer, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { format, addDays, isBefore } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useEffect } from 'react';
import { useUserEventInterests } from '@/hooks/useUserEventInterests';
import { useEventReminders } from '@/hooks/useEventReminders';
import { saveAs } from 'file-saver';
import { createEvent } from 'ics';
import { useEventFeedback } from '@/hooks/useEventFeedback';
import { useEventComments } from '@/hooks/useEventComments';
import { useEventMedia } from '@/hooks/useEventMedia';

// Form schema for event creation
const eventFormSchema = z.object({
  title: z.string().min(3, {
    message: "Event name must be at least 3 characters.",
  }),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Please select a valid date.",
  }),
  startTime: z.string(),
  endTime: z.string(),
  location: z.string().min(3, {
    message: "Location must be at least 3 characters.",
  }),
  description: z.string().optional(),
  isRecurring: z.boolean().default(false),
  requiresRegistration: z.boolean().default(false),
  organizer: z.string().min(3, {
    message: "Organizer name must be at least 3 characters.",
  }),
});

const EventCard = ({ event, onViewDetails }) => {
  const isPast = isBefore(new Date(event.date), new Date()) && event.status === "completed";

  return (
    <Card className={`mb-4 hover:shadow-md transition-shadow ${isPast ? 'opacity-70' : ''}`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl text-xiracom-blue">{event.title}</CardTitle>
            <CardDescription className="flex items-center mt-1">
              <Calendar className="h-4 w-4 mr-1" />
              {format(new Date(event.date), 'MMMM d, yyyy')} 
              <span className="mx-2">•</span>
              <Clock className="h-4 w-4 mr-1" />
              {event.startTime} - {event.endTime}
            </CardDescription>
          </div>
          {isPast ? (
            <Badge variant="outline" className="bg-gray-200">Completed</Badge>
          ) : (
            event.requiresRegistration ? (
              <Badge className="bg-xiracom-orange">Registration Required</Badge>
            ) : (
              <Badge className="bg-xiracom-blue">Open Event</Badge>
            )
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-start mb-3">
          <MapPin className="h-4 w-4 mr-1 mt-0.5 text-gray-500" />
          <span>{event.location}</span>
        </div>
        <p className="text-sm text-gray-600 line-clamp-2">{event.description}</p>
      </CardContent>
      <CardFooter className="flex justify-between pt-0">
        <div className="text-sm text-gray-500">
          Organized by: <span className="font-medium">{event.organizer}</span>
        </div>
        <HoverCard>
          <HoverCardTrigger asChild>
            <Button variant="ghost" size="sm" onClick={() => onViewDetails(event)}>
              View Details
            </Button>
          </HoverCardTrigger>
          <HoverCardContent className="w-80">
            <div className="space-y-1">
              <h4 className="text-sm font-semibold">{event.title}</h4>
              <p className="text-sm">
                {event.description}
              </p>
              <div className="pt-2">
                <span className="text-xs text-muted-foreground">
                  {event.attendees} registered attendees
                </span>
              </div>
            </div>
          </HoverCardContent>
        </HoverCard>
      </CardFooter>
    </Card>
  );
};

function EventRegistrationButton({ eventId }) {
  const { user } = useAuth();
  const [registered, setRegistered] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    let isMounted = true;
    supabase
      .from('event_registrations')
      .select('*')
      .eq('event_id', eventId)
      .eq('user_id', user.id)
      .then(({ data }) => {
        if (isMounted) setRegistered(data && data.length > 0);
      });
    return () => { isMounted = false; };
  }, [user, eventId]);

  const handleRegister = async () => {
    setLoading(true);
    if (registered) {
      await supabase
        .from('event_registrations')
        .delete()
        .eq('event_id', eventId)
        .eq('user_id', user.id);
      setRegistered(false);
    } else {
      await supabase
        .from('event_registrations')
        .insert([{ event_id: eventId, user_id: user.id }]);
      setRegistered(true);
    }
    setLoading(false);
  };

  if (!user) return null;

  return (
    <button
      className={`btn ${registered ? 'btn-secondary' : 'btn-primary'} mt-2`}
      onClick={handleRegister}
      disabled={loading}
    >
      {registered ? 'Unregister' : 'Register'}
    </button>
  );
}

const Events = () => {
  const { events, loading, error } = useEvents();
  const [activeTab, setActiveTab] = useState("upcoming");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const { interests: userInterests } = useUserEventInterests();
  const [filterType, setFilterType] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [filterLocation, setFilterLocation] = useState('');
  const [filterOrganizer, setFilterOrganizer] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [attendeeCount, setAttendeeCount] = useState(0);
  const [attendees, setAttendees] = useState([]);
  const { user } = useAuth();
  const [attendanceHistory, setAttendanceHistory] = useState([]);

  useEffect(() => {
    if (!selectedEvent?.id) return;
    supabase
      .from('event_registrations')
      .select('user_id')
      .eq('event_id', selectedEvent.id)
      .then(({ data }) => {
        setAttendeeCount(data ? data.length : 0);
        setAttendees(data ? data.map(r => r.user_id) : []);
      });
  }, [selectedEvent?.id]);

  useEffect(() => {
    if (!user) return;
    supabase
      .from('event_registrations')
      .select('event_id, events(title, date)')
      .eq('user_id', user.id)
      .then(({ data }) => {
        setAttendanceHistory(data || []);
  });
  }, [user]);

  const filteredEvents = events
    .filter(e => !filterType || e.event_type === filterType)
    .filter(e => !filterDate || e.date === filterDate)
    .filter(e => !filterLocation || e.location === filterLocation)
    .filter(e => !filterOrganizer || e.organizer === filterOrganizer)
    .sort((a, b) => sortBy === 'date' ? new Date(a.date) - new Date(b.date) : a.title.localeCompare(b.title));

  const recommendedEvents = events.filter(event =>
    userInterests.some(interest =>
      event.title?.toLowerCase().includes(interest.toLowerCase()) ||
      event.event_type?.toLowerCase() === interest.toLowerCase()
    )
  );

  const handleViewDetails = (event) => {
    setSelectedEvent(event);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Events & Scheduling</h1>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search events..."
              className="pl-8 w-[200px] md:w-[300px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                className="absolute right-2.5 top-2.5"
                onClick={() => setSearchTerm("")}
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            )}
          </div>
          {/* Add Event button and dialog removed for member portal. */}
        </div>
      </div>
      
      <Tabs defaultValue="upcoming" className="w-full" onValueChange={setActiveTab}>
        <div className="flex items-center justify-between mb-4">
          <TabsList>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="all">All Events</TabsTrigger>
          </TabsList>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" /> Filter
            </Button>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" /> Export
            </Button>
          </div>
        </div>
        
        <TabsContent value="upcoming" className="mt-0">
          {loading ? (
            <div className="text-center py-10">Loading events...</div>
          ) : error ? (
            <div className="text-center text-red-500 py-10">Error loading events: {error}</div>
          ) : (
            <>
              {userInterests.length > 0 && recommendedEvents.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-xl font-bold mb-2">Recommended for You</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {recommendedEvents.map(event => (
                      <EventCard key={event.id} event={event} onViewDetails={handleViewDetails} />
                    ))}
                  </div>
                </div>
              )}
              <div className="flex flex-wrap gap-2 mb-4">
                <select value={filterType} onChange={e => setFilterType(e.target.value)}>
                  <option value="">All Types</option>
                  {/* Map event types dynamically if available */}
                  <option value="worship">Worship</option>
                  <option value="study">Study</option>
                  <option value="youth">Youth</option>
                  <option value="conference">Conference</option>
                </select>
                <input type="date" value={filterDate} onChange={e => setFilterDate(e.target.value)} />
                <input type="text" placeholder="Location" value={filterLocation} onChange={e => setFilterLocation(e.target.value)} />
                <input type="text" placeholder="Organizer" value={filterOrganizer} onChange={e => setFilterOrganizer(e.target.value)} />
                <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
                  <option value="date">Sort by Date</option>
                  <option value="title">Sort by Title</option>
                </select>
              </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredEvents.length > 0 ? (
              filteredEvents.map((event) => (
                <EventCard key={event.id} event={event} onViewDetails={handleViewDetails} />
              ))
            ) : (
              <div className="col-span-2 text-center py-10">
                <h3 className="text-lg font-medium text-gray-500">No upcoming events found</h3>
                <p className="text-sm text-gray-400 mt-1">Try adjusting your search or filters</p>
              </div>
            )}
          </div>
            </>
          )}
        </TabsContent>
        
        <TabsContent value="completed" className="mt-0">
          {loading ? (
            <div className="text-center py-10">Loading events...</div>
          ) : error ? (
            <div className="text-center text-red-500 py-10">Error loading events: {error}</div>
          ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredEvents.length > 0 ? (
              filteredEvents.map((event) => (
                <EventCard key={event.id} event={event} onViewDetails={handleViewDetails} />
              ))
            ) : (
              <div className="col-span-2 text-center py-10">
                <h3 className="text-lg font-medium text-gray-500">No completed events found</h3>
                <p className="text-sm text-gray-400 mt-1">Try adjusting your search or filters</p>
              </div>
            )}
          </div>
          )}
        </TabsContent>
        
        <TabsContent value="all" className="mt-0">
          {loading ? (
            <div className="text-center py-10">Loading events...</div>
          ) : error ? (
            <div className="text-center text-red-500 py-10">Error loading events: {error}</div>
          ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredEvents.length > 0 ? (
              filteredEvents.map((event) => (
                <EventCard key={event.id} event={event} onViewDetails={handleViewDetails} />
              ))
            ) : (
              <div className="col-span-2 text-center py-10">
                <h3 className="text-lg font-medium text-gray-500">No events found</h3>
                <p className="text-sm text-gray-400 mt-1">Try adjusting your search or filters</p>
              </div>
            )}
          </div>
          )}
        </TabsContent>
      </Tabs>
      
      {attendanceHistory.length > 0 && (
        <div className="my-8">
          <h2 className="text-xl font-bold mb-2">My Attendance History</h2>
          <ul className="text-xs">
            {attendanceHistory.map(a => (
              <li key={a.event_id}>{a.events?.title} ({a.events?.date && new Date(a.events.date).toLocaleDateString()})</li>
            ))}
          </ul>
        </div>
      )}
      
      {/* Event Details Drawer */}
      <Drawer open={!!selectedEvent} onOpenChange={(open) => !open && setSelectedEvent(null)}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle className="text-2xl text-xiracom-blue">{selectedEvent?.title}</DrawerTitle>
            <DrawerDescription>
              <div className="flex items-center gap-2 mt-1">
                <Calendar className="h-4 w-4" />
                {selectedEvent && format(new Date(selectedEvent.date), 'EEEE, MMMM d, yyyy')}
                <span className="mx-1">•</span>
                <Clock className="h-4 w-4" />
                {selectedEvent?.startTime} - {selectedEvent?.endTime}
              </div>
            </DrawerDescription>
          </DrawerHeader>
          {selectedEvent && (
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Location</h4>
                  <p className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1 text-xiracom-blue" />
                    {selectedEvent.location}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Organizer</h4>
                  <p>{selectedEvent.organizer}</p>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Description</h4>
                <p className="text-sm">{selectedEvent.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Event Type</h4>
                  <p>{selectedEvent.isRecurring ? 'Recurring Event' : 'One-time Event'}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Registration</h4>
                  <p>{selectedEvent.requiresRegistration ? 'Required' : 'Not Required'}</p>
                </div>
              </div>
              
              {selectedEvent.requiresRegistration && (
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Attendees</h4>
                  <p className="text-2xl font-bold">{selectedEvent.attendees}</p>
                </div>
              )}
              
              {selectedEvent?.capacity && (
                <div className="mt-4">
                  <span className="font-semibold">Capacity:</span> {selectedEvent.capacity}
                  <span className="ml-4 font-semibold">Registered:</span> {attendeeCount}
                  <span className="ml-4 font-semibold">Spots Left:</span> {selectedEvent.capacity - attendeeCount}
                </div>
              )}
              {attendees.length > 0 && (
                <div className="mt-2">
                  <span className="font-semibold">Attendees:</span>
                  <ul className="text-xs mt-1">
                    {attendees.map(uid => (
                      <li key={uid}>{uid}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              <div className="flex justify-between pt-4">
                <div className="space-x-2">
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" /> Export Details
                  </Button>
                  {!isBefore(new Date(selectedEvent.date), new Date()) && (
                    <Button variant="outline" size="sm" className="text-xiracom-blue">
                      Manage Event
                    </Button>
                  )}
                </div>
                {!isBefore(new Date(selectedEvent.date), new Date()) && (
                  <Button className="bg-xiracom-blue hover:bg-xiracom-darkblue">
                    {selectedEvent.requiresRegistration ? 'Register Now' : 'Add to Calendar'}
                  </Button>
                )}
              </div>
              <EventRegistrationButton eventId={selectedEvent.id} />
              <div className="mt-4">
                <label>Set Reminder:</label>
                <button onClick={() => addReminder(new Date(new Date(selectedEvent.date).getTime() - 24*60*60*1000).toISOString())} className="btn btn-sm ml-2">1 Day Before</button>
                <button onClick={() => addReminder(new Date(new Date(selectedEvent.date).getTime() - 60*60*1000).toISOString())} className="btn btn-sm ml-2">1 Hour Before</button>
                {reminders && reminders.length > 0 && (
                  <ul className="mt-2">
                    {reminders.map(r => (
                      <li key={r.id} className="flex items-center gap-2 text-xs">
                        {new Date(r.reminder_time).toLocaleString()} <button onClick={() => removeReminder(r.id)} className="text-red-500">Remove</button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="mt-4 flex gap-2">
                <a href={getGoogleCalendarUrl(selectedEvent)} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm">Add to Google Calendar</a>
                <button onClick={() => exportEventToICS(selectedEvent)} className="btn btn-outline btn-sm">Export .ics</button>
              </div>
              <div className="mt-4 flex gap-2">
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(selectedEvent?.title + ' - ' + window.location.href)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline btn-sm"
                  aria-label="Share on WhatsApp"
                >
                  WhatsApp
                </a>
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline btn-sm"
                  aria-label="Share on Facebook"
                >
                  Facebook
                </a>
                <a
                  href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(selectedEvent?.title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline btn-sm"
                  aria-label="Share on Twitter"
                >
                  Twitter
                </a>
                <button
                  className="btn btn-outline btn-sm"
                  aria-label="Copy event link"
                  onClick={() => navigator.clipboard.writeText(window.location.href)}
                  type="button"
                >
                  Copy Link
                </button>
              </div>
            </div>
          )}
          <DrawerFooter className="pt-2">
            <Button variant="outline" onClick={() => setSelectedEvent(null)}>
              Close
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default Events;
