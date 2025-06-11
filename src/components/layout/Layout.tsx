
import { ReactNode, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Footer from "./Footer";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const [pageTitle, setPageTitle] = useState("Admin Dashboard");

  useEffect(() => {
    // Update page title based on current route
    const path = location.pathname;
    if (path === "/") setPageTitle("Admin Dashboard");
    else if (path === "/system-dashboard") setPageTitle("System Dashboard");
    else if (path === "/church-info") setPageTitle("Church Information");
    else if (path === "/system-overview") setPageTitle("System Overview");
    else if (path === "/users") setPageTitle("User Management");
    else if (path === "/backup") setPageTitle("Backup & Data Management");
    else if (path === "/security-overview") setPageTitle("Security Overview");
    else if (path === "/access-control") setPageTitle("Access Control");
    else if (path === "/data-protection") setPageTitle("Data Protection");
    else if (path === "/security-logs") setPageTitle("Security Logs");
    else if (path === "/checkin-security") setPageTitle("Check-in Security");
    else if (path === "/integrations") setPageTitle("Integrations");
    // Legacy routes for backward compatibility
    else if (path === "/members") setPageTitle("User Management");
    else if (path === "/finances") setPageTitle("System Data Management");
    else if (path === "/events") setPageTitle("System Events");
    else if (path === "/ministry") setPageTitle("Content Management");
    else if (path === "/communication") setPageTitle("System Communications");
    else if (path === "/reports") setPageTitle("System Reports");
    else if (path === "/security") setPageTitle("Security & Access Control");
    else if (path === "/settings") setPageTitle("System Administration");
    else setPageTitle("Admin Dashboard");

    // Update page title in browser
    document.title = `Living Rock Church - ${pageTitle}`;
  }, [location.pathname, pageTitle]);

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header pageTitle={pageTitle} />
        <main className="flex-1 overflow-auto p-6 bg-gray-50">{children}</main>
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
