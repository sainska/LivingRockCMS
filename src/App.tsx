
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
import Members from "./pages/Members";
import Finances from "./pages/Finances";
import Events from "./pages/Events";
import Ministry from "./pages/Ministry";
import Communication from "./pages/Communication";
import Reports from "./pages/Reports";
import Security from "./pages/Security";
import Settings from "./pages/Settings";
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
          
          {/* Admin Routes with Layout */}
          <Route path="/" element={<Layout><Dashboard /></Layout>} />
          
          {/* New admin dashboard routes */}
          <Route path="/system-dashboard" element={<Layout><Settings /></Layout>} />
          <Route path="/church-info" element={<Layout><Settings /></Layout>} />
          <Route path="/system-overview" element={<Layout><Settings /></Layout>} />
          <Route path="/users" element={<Layout><Members /></Layout>} />
          <Route path="/backup" element={<Layout><Settings /></Layout>} />
          <Route path="/security-overview" element={<Layout><Security /></Layout>} />
          <Route path="/access-control" element={<Layout><Security /></Layout>} />
          <Route path="/data-protection" element={<Layout><Security /></Layout>} />
          <Route path="/security-logs" element={<Layout><Security /></Layout>} />
          <Route path="/checkin-security" element={<Layout><Security /></Layout>} />
          <Route path="/integrations" element={<Layout><Settings /></Layout>} />
          
          {/* Legacy routes for backward compatibility */}
          <Route path="/dashboard/admin" element={<Layout><Dashboard /></Layout>} />
          <Route path="/members" element={<Layout><Members /></Layout>} />
          <Route path="/finances" element={<Layout><Finances /></Layout>} />
          <Route path="/events" element={<Layout><Events /></Layout>} />
          <Route path="/ministry" element={<Layout><Ministry /></Layout>} />
          <Route path="/communication" element={<Layout><Communication /></Layout>} />
          <Route path="/reports" element={<Layout><Reports /></Layout>} />
          <Route path="/security" element={<Layout><Security /></Layout>} />
          <Route path="/settings" element={<Layout><Settings /></Layout>} />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
