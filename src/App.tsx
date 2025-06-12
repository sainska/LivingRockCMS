
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./components/layout/Layout";
import Welcome from "./pages/Welcome";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ClergyDashboard from "./components/clergy/ClergyDashboard";
import MemberDirectory from "./components/clergy/MemberDirectory";
import PastoralCare from "./components/clergy/PastoralCare";
import SermonLibrary from "./components/clergy/SermonLibrary";
import EventsMinistry from "./components/clergy/EventsMinistry";
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
          
          {/* Clergy Dashboard Routes */}
          <Route path="/" element={<Layout><ClergyDashboard /></Layout>} />
          <Route path="/members" element={<Layout><MemberDirectory /></Layout>} />
          <Route path="/pastoral-care" element={<Layout><PastoralCare /></Layout>} />
          <Route path="/sermons" element={<Layout><SermonLibrary /></Layout>} />
          <Route path="/events" element={<Layout><EventsMinistry /></Layout>} />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
