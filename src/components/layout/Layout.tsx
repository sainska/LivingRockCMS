
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
    if (path === "/") setPageTitle("Dashboard Overview");
    else if (path === "/member-profile") setPageTitle("Member Profile");
    else if (path === "/events-services") setPageTitle("Events & Services");
    else if (path === "/spiritual-journey") setPageTitle("Spiritual Journey");
    else if (path === "/ministries-groups") setPageTitle("Ministries & Groups");
    else if (path === "/giving-donations") setPageTitle("Giving & Donations");
    else if (path === "/announcements-news") setPageTitle("Announcements & News");
    else if (path === "/volunteer-service") setPageTitle("Volunteer & Service");
    else if (path === "/resources-media") setPageTitle("Resources & Media");
    else if (path === "/messaging-communication") setPageTitle("Messaging & Communication");
    else if (path === "/settings-preferences") setPageTitle("Settings & Preferences");
    else if (path === "/feedback-testimonies") setPageTitle("Feedback & Testimonies");
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
