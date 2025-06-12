
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
  const [pageTitle, setPageTitle] = useState("Clergy Dashboard");

  useEffect(() => {
    // Update page title based on current route - Clergy Dashboard only
    const path = location.pathname;
    if (path === "/") setPageTitle("Clergy Dashboard");
    else if (path === "/members") setPageTitle("Member Directory");
    else if (path === "/pastoral-care") setPageTitle("Pastoral Care");
    else if (path === "/sermons") setPageTitle("Sermon Library");
    else if (path === "/events") setPageTitle("Events & Ministry");
    else setPageTitle("Clergy Dashboard");

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
