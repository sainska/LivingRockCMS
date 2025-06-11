
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
  const [pageTitle, setPageTitle] = useState("Dashboard");

  useEffect(() => {
    // Update page title based on current route
    const path = location.pathname;
    if (path === "/") setPageTitle("Dashboard");
    else if (path === "/members") setPageTitle("Member Management");
    else if (path === "/finances") setPageTitle("Financial Management");
    else if (path === "/events") setPageTitle("Events & Scheduling");
    else if (path === "/ministry") setPageTitle("Ministry Support");
    else if (path === "/communication") setPageTitle("Communication Tools");
    else if (path === "/reports") setPageTitle("Reports & Analytics");
    else if (path === "/security") setPageTitle("Security & Access");
    else if (path === "/settings") setPageTitle("System Settings");
    else setPageTitle("Dashboard");

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
