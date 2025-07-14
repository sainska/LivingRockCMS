import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Footer from "./Footer";

const Layout = ({ children }) => {
  const location = useLocation();
  const [pageTitle, setPageTitle] = useState("Dashboard");

  useEffect(() => {
    // Update page title based on current route - each route has specific functionality
    const path = location.pathname;
    if (path === "/") setPageTitle("Dashboard");
    else if (path === "/admin/dashboard") setPageTitle("Admin Dashboard");
    else if (path === "/treasurer/dashboard") setPageTitle("Treasurer Dashboard");
    else if (path === "/secretary/dashboard") setPageTitle("Secretary Dashboard");
    else if (path === "/clergy/dashboard") setPageTitle("Clergy Dashboard");
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
    else if (path === "/members") setPageTitle("Members");
    else if (path === "/events") setPageTitle("Events");
    else if (path === "/finances") setPageTitle("Finances");
    else if (path === "/communication") setPageTitle("Communication");
    else if (path === "/reports") setPageTitle("Reports");
    else if (path === "/settings") setPageTitle("Settings");
    else if (path === "/security") setPageTitle("Security");
    else setPageTitle("Dashboard");

    // Update page title in browser
    document.title = `Living Rock Church - ${pageTitle}`;
  }, [location.pathname, pageTitle]);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 flex flex-col">
        <Header pageTitle={pageTitle} />
        <div className="flex-1 p-6">{children}</div>
        <Footer />
      </main>
    </div>
  );
};

export default Layout;
