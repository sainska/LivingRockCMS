
import { useState } from 'react';
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

// Sample event data for demonstration
const sampleEvents = [
  {
    id: "evt-001",
    title: "Sunday Service",
    date: new Date(),
    startTime: "09:00 AM",
    endTime: "11:30 AM",
    location: "Main Sanctuary",
    description: "Weekly Sunday worship service with praise and sermon.",
    isRecurring: true,
    requiresRegistration: false,
    organizer: "Pastor John",
    attendees: 120,
    status: "upcoming"
  },
  {
    id: "evt-002",
    title: "Bible Study Group",
    date: addDays(new Date(), 2),
    startTime: "06:30 PM",
    endTime: "08:00 PM",
    location: "Fellowship Hall",
    description: "Weekly Bible study focusing on the book of Romans.",
    isRecurring: true,
    requiresRegistration: false,
    organizer: "Deacon Sarah",
    attendees: 25,
    status: "upcoming"
  },
  {
    id: "evt-003",
    title: "Youth Camp",
    date: addDays(new Date(), 14),
    startTime: "08:00 AM",
    endTime: "05:00 PM",
    location: "Camp Wilderness",
    description: "Annual youth camp with activities, worship, and fellowship.",
    isRecurring: false,
    requiresRegistration: true,
    organizer: "Youth Pastor Mike",
    attendees: 45,
    status: "upcoming"
  },
  {
    id: "evt-004",
    title: "Easter Service",
    date: new Date("2025-04-20"),
    startTime: "10:00 AM",
    endTime: "12:00 PM",
    location: "Main Sanctuary",
    description: "Special Easter celebration service.",
    isRecurring: false,
    requiresRegistration: false,
    organizer: "Pastor John",
    attendees: 300,
    status: "upcoming"
  },
  {
    id: "evt-005",
    title: "Women's Conference",
    date: addDays(new Date(), -7),
    startTime: "09:00 AM",
    endTime: "04:00 PM",
    location: "Community Center",
    description: "Annual women's conference with guest speakers and workshops.",
    isRecurring: false,
    requiresRegistration: true,
    organizer: "Sister Mary",
    attendees: 85,
    status: "completed"
  }
];

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

const Events = () => {
  const [events, setEvents] = useState(sampleEvents);
  const [activeTab, setActiveTab] = useState("upcoming");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);

  const form = useForm({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      title: "",
      date: format(new Date(), 'yyyy-MM-dd'),
      startTime: "09:00",
      endTime: "10:00",
      location: "",
      description: "",
      isRecurring: false,
      requiresRegistration: false,
      organizer: "",
    },
  });

  const filteredEvents = events.filter(event => {
    const matchesStatus = activeTab === "all" || (
      activeTab === "upcoming" && !isBefore(new Date(event.date), new Date()) ||
      activeTab === "completed" && isBefore(new Date(event.date), new Date()) && event.status === "completed"
    );
    
    const matchesSearch = searchTerm === "" || 
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.organizer.toLowerCase().includes(searchTerm.toLowerCase());
      
    return matchesStatus && matchesSearch;
  });

  const handleAddEvent = (data) => {
    const newEvent = {
      id: `evt-${(events.length + 1).toString().padStart(3, '0')}`,
      title: data.title,
      date: new Date(data.date),
      startTime: formatTime(data.startTime),
      endTime: formatTime(data.endTime),
      location: data.location,
      description: data.description || "",
      isRecurring: data.isRecurring,
      requiresRegistration: data.requiresRegistration,
      organizer: data.organizer,
      attendees: 0,
      status: "upcoming"
    };
    
    setEvents([...events, newEvent]);
    setIsAddEventOpen(false);
    form.reset();
  };

  const formatTime = (time24h) => {
    const [hours, minutes] = time24h.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

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
          <Dialog open={isAddEventOpen} onOpenChange={setIsAddEventOpen}>
            <DialogTrigger asChild>
              <Button className="bg-xiracom-blue hover:bg-xiracom-darkblue">
                <Plus className="mr-2 h-4 w-4" /> Add Event
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
              <DialogHeader>
                <DialogTitle>Create New Event</DialogTitle>
                <DialogDescription>
                  Fill in the details for the new church event.
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleAddEvent)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Event Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter event title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-2 gap-2">
                      <FormField
                        control={form.control}
                        name="startTime"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Start Time</FormLabel>
                            <FormControl>
                              <Input type="time" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="endTime"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>End Time</FormLabel>
                            <FormControl>
                              <Input type="time" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter event location" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter event description" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="organizer"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Organizer</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter organizer name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="flex flex-col md:flex-row gap-4 pt-2">
                    <FormField
                      control={form.control}
                      name="isRecurring"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center gap-2 space-y-0">
                          <FormControl>
                            <Checkbox 
                              checked={field.value} 
                              onCheckedChange={field.onChange} 
                            />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer">
                            Recurring Event
                          </FormLabel>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="requiresRegistration"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center gap-2 space-y-0">
                          <FormControl>
                            <Checkbox 
                              checked={field.value} 
                              onCheckedChange={field.onChange} 
                            />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer">
                            Requires Registration
                          </FormLabel>
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <DialogFooter className="pt-4">
                    <Button type="button" variant="outline" onClick={() => setIsAddEventOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-xiracom-blue hover:bg-xiracom-darkblue">
                      Create Event
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
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
        </TabsContent>
        
        <TabsContent value="completed" className="mt-0">
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
        </TabsContent>
        
        <TabsContent value="all" className="mt-0">
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
        </TabsContent>
      </Tabs>
      
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
