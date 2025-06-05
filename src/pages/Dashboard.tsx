
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  User, 
  Calendar, 
  Heart, 
  Users, 
  DollarSign, 
  Bell, 
  HandHeart, 
  BookOpen, 
  MessageCircle, 
  Settings,
  FileText
} from "lucide-react";
import MemberProfileModule from "@/components/dashboard/MemberProfileModule";
import EventsServicesModule from "@/components/dashboard/EventsServicesModule";
import SpiritualJourneyModule from "@/components/dashboard/SpiritualJourneyModule";
import MinistriesGroupsModule from "@/components/dashboard/MinistriesGroupsModule";
import GivingDonationsModule from "@/components/dashboard/GivingDonationsModule";
import AnnouncementsNewsModule from "@/components/dashboard/AnnouncementsNewsModule";
import VolunteerServiceModule from "@/components/dashboard/VolunteerServiceModule";
import ResourcesMediaModule from "@/components/dashboard/ResourcesMediaModule";
import MessagingCommunicationModule from "@/components/dashboard/MessagingCommunicationModule";
import SettingsPreferencesModule from "@/components/dashboard/SettingsPreferencesModule";
import FeedbackTestimoniesModule from "@/components/dashboard/FeedbackTestimoniesModule";

const Dashboard = () => {
  const modules = [
    {
      id: "member-profile",
      title: "Member Profile",
      icon: User,
      description: "Manage your personal information and membership status",
      component: MemberProfileModule,
      color: "bg-gradient-to-br from-xiracom-blue to-xiracom-darkblue"
    },
    {
      id: "events-services",
      title: "Events & Services",
      icon: Calendar,
      description: "View upcoming services and events",
      component: EventsServicesModule,
      color: "bg-gradient-to-br from-xiracom-orange to-xiracom-lightorange"
    },
    {
      id: "spiritual-journey",
      title: "Spiritual Journey",
      icon: Heart,
      description: "Track your spiritual milestones and growth",
      component: SpiritualJourneyModule,
      color: "bg-gradient-to-br from-purple-500 to-purple-700"
    },
    {
      id: "ministries-groups",
      title: "Ministries & Groups",
      icon: Users,
      description: "Connect with ministries and fellowship groups",
      component: MinistriesGroupsModule,
      color: "bg-gradient-to-br from-green-500 to-green-700"
    },
    {
      id: "giving-donations",
      title: "Giving & Donations",
      icon: DollarSign,
      description: "Manage your tithes, offerings, and donations",
      component: GivingDonationsModule,
      color: "bg-gradient-to-br from-emerald-500 to-emerald-700"
    },
    {
      id: "announcements-news",
      title: "Announcements & News",
      icon: Bell,
      description: "Stay updated with church news and announcements",
      component: AnnouncementsNewsModule,
      color: "bg-gradient-to-br from-blue-500 to-blue-700"
    },
    {
      id: "volunteer-service",
      title: "Volunteer & Service",
      icon: HandHeart,
      description: "Find and sign up for volunteer opportunities",
      component: VolunteerServiceModule,
      color: "bg-gradient-to-br from-red-500 to-red-700"
    },
    {
      id: "resources-media",
      title: "Resources & Media",
      icon: BookOpen,
      description: "Access sermons, study materials, and media",
      component: ResourcesMediaModule,
      color: "bg-gradient-to-br from-indigo-500 to-indigo-700"
    },
    {
      id: "messaging-communication",
      title: "Messaging & Communication",
      icon: MessageCircle,
      description: "Chat with leaders and receive messages",
      component: MessagingCommunicationModule,
      color: "bg-gradient-to-br from-teal-500 to-teal-700"
    },
    {
      id: "settings-preferences",
      title: "Settings & Preferences",
      icon: Settings,
      description: "Customize your account and preferences",
      component: SettingsPreferencesModule,
      color: "bg-gradient-to-br from-gray-500 to-gray-700"
    },
    {
      id: "feedback-testimonies",
      title: "Feedback & Testimonies",
      icon: FileText,
      description: "Share feedback and testimonies",
      component: FeedbackTestimoniesModule,
      color: "bg-gradient-to-br from-yellow-500 to-yellow-700"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-xiracom-blue mb-2">
          Welcome to Your Church Dashboard
        </h1>
        <p className="text-lg text-muted-foreground">
          Manage your spiritual journey and stay connected with Living Rock Church
        </p>
      </div>

      {/* Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((module) => {
          const IconComponent = module.icon;
          return (
            <Card key={module.id} className="hover:shadow-lg transition-shadow cursor-pointer group">
              <CardHeader className="pb-3">
                <div className={`w-12 h-12 rounded-lg ${module.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                  <IconComponent className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-lg text-xiracom-blue">{module.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  {module.description}
                </p>
                <Button 
                  variant="outline" 
                  className="w-full border-xiracom-blue text-xiracom-blue hover:bg-xiracom-blue hover:text-white"
                >
                  Access Module
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
        <Card className="gradient-blue text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Active Memberships</p>
                <p className="text-2xl font-bold">1</p>
              </div>
              <User className="h-8 w-8 opacity-80" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="gradient-orange text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Upcoming Events</p>
                <p className="text-2xl font-bold">3</p>
              </div>
              <Calendar className="h-8 w-8 opacity-80" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-500 to-green-700 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Ministries Joined</p>
                <p className="text-2xl font-bold">2</p>
              </div>
              <Users className="h-8 w-8 opacity-80" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-500 to-purple-700 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Unread Messages</p>
                <p className="text-2xl font-bold">5</p>
              </div>
              <MessageCircle className="h-8 w-8 opacity-80" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
