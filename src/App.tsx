
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./components/layout/Layout";
import Welcome from "./pages/Welcome";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import MemberProfile from "./pages/MemberProfile";
import EventsServices from "./pages/EventsServices";
import SpiritualJourney from "./pages/SpiritualJourney";
import MinistriesGroups from "./pages/MinistriesGroups";
import GivingDonations from "./pages/GivingDonations";
import AnnouncementsNews from "./pages/AnnouncementsNews";
import VolunteerService from "./pages/VolunteerService";
import ResourcesMedia from "./pages/ResourcesMedia";
import MessagingCommunication from "./pages/MessagingCommunication";
import SettingsPreferences from "./pages/SettingsPreferences";
import FeedbackTestimonies from "./pages/FeedbackTestimonies";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected Routes with Layout */}
          <Route path="/" element={<Layout><Dashboard /></Layout>} />
          <Route path="/member-profile" element={<Layout><MemberProfile /></Layout>} />
          <Route path="/events-services" element={<Layout><EventsServices /></Layout>} />
          <Route path="/spiritual-journey" element={<Layout><SpiritualJourney /></Layout>} />
          <Route path="/ministries-groups" element={<Layout><MinistriesGroups /></Layout>} />
          <Route path="/giving-donations" element={<Layout><GivingDonations /></Layout>} />
          <Route path="/announcements-news" element={<Layout><AnnouncementsNews /></Layout>} />
          <Route path="/volunteer-service" element={<Layout><VolunteerService /></Layout>} />
          <Route path="/resources-media" element={<Layout><ResourcesMedia /></Layout>} />
          <Route path="/messaging-communication" element={<Layout><MessagingCommunication /></Layout>} />
          <Route path="/settings-preferences" element={<Layout><SettingsPreferences /></Layout>} />
          <Route path="/feedback-testimonies" element={<Layout><FeedbackTestimonies /></Layout>} />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
