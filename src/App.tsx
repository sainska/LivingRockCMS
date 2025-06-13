
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./components/layout/Layout";
import Welcome from "./pages/Welcome";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./components/admin/AdminDashboard";
import SystemDashboard from "./components/admin/SystemDashboard";
import ChurchSettings from "./components/settings/ChurchSettings";
import SystemSettings from "./components/settings/SystemSettings";
import UserManagement from "./components/settings/UserManagement";
import BackupSettings from "./components/settings/BackupSettings";
import SecurityOverview from "./components/security/SecurityOverview";
import UserAccessControl from "./components/security/UserAccessControl";
import DataProtection from "./components/security/DataProtection";
import SecurityLogs from "./components/security/SecurityLogs";
import CheckInSecurity from "./components/security/CheckInSecurity";
import IntegrationSettings from "./components/settings/IntegrationSettings";
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
          
          {/* Admin Routes with Layout - Each route maps to specific functionality */}
          <Route path="/" element={<Layout><AdminDashboard /></Layout>} />
          <Route path="/system-dashboard" element={<Layout><SystemDashboard /></Layout>} />
          <Route path="/church-info" element={<Layout><ChurchSettings /></Layout>} />
          <Route path="/system-overview" element={<Layout><SystemSettings /></Layout>} />
          <Route path="/users" element={<Layout><UserManagement /></Layout>} />
          <Route path="/backup" element={<Layout><BackupSettings /></Layout>} />
          <Route path="/security-overview" element={<Layout><SecurityOverview /></Layout>} />
          <Route path="/access-control" element={<Layout><UserAccessControl /></Layout>} />
          <Route path="/data-protection" element={<Layout><DataProtection /></Layout>} />
          <Route path="/security-logs" element={<Layout><SecurityLogs /></Layout>} />
          <Route path="/checkin-security" element={<Layout><CheckInSecurity /></Layout>} />
          <Route path="/integrations" element={<Layout><IntegrationSettings /></Layout>} />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
