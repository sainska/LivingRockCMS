
import { ReactNode, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

const Layout = ({ children }) => {
  const location = useLocation();
  const [pageTitle, setPageTitle] = useState("Dashboard");

  useEffect(() => {
    // Update page title based on current route - each route has specific functionality
    const path = location.pathname;
    if (path === "/") setPageTitle("Admin Dashboard");
    else if (path === "/system-dashboard") setPageTitle("System Dashboard");
    else if (path === "/treasurer-dashboard") setPageTitle("Treasurer Dashboard");
    else if (path === "/secretary-dashboard") setPageTitle("Secretary Dashboard");
    else if (path === "/clergy-dashboard") setPageTitle("Clergy Dashboard");
    else if (path === "/user-dashboard") setPageTitle("My Dashboard");
    else if (path === "/church-info") setPageTitle("Church Information");
    else if (path === "/events") setPageTitle("Events Management");
    else if (path === "/members") setPageTitle("Member Management");
    else if (path === "/ministry") setPageTitle("Ministry Management");
    else if (path === "/communication") setPageTitle("Communication");
    else if (path === "/finances") setPageTitle("Financial Management");
    else if (path === "/reports") setPageTitle("Reports & Analytics");
    else if (path === "/system-overview") setPageTitle("System Overview");
    else if (path === "/users") setPageTitle("User Management");
    else if (path === "/backup") setPageTitle("Backup & Data Management");
    else if (path === "/security-overview") setPageTitle("Security Overview");
    else if (path === "/access-control") setPageTitle("Access Control");
    else if (path === "/data-protection") setPageTitle("Data Protection");
    else if (path === "/security-logs") setPageTitle("Security Logs");
    else if (path === "/checkin-security") setPageTitle("Check-in Security");
    else if (path === "/integrations") setPageTitle("Integrations");
    else setPageTitle("Dashboard");

    // Update page title in browser
    document.title = `Living Rock Church - ${pageTitle}`;
  }, [location.pathname, pageTitle]);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header pageTitle={pageTitle} />
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
