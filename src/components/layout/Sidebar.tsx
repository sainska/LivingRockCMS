
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  ChevronLeft, 
  ChevronRight, 
  Home, 
  Users, 
  Calendar, 
  DollarSign, 
  BookOpen, 
  MessageCircle, 
  Settings, 
  BarChart, 
  Shield
} from "lucide-react";
import { cn } from "@/lib/utils";

type NavItemProps = {
  href: string;
  icon: React.ReactNode;
  title: string;
  isCollapsed: boolean;
};

const NavItem = ({ href, icon, title, isCollapsed }: NavItemProps) => {
  const location = useLocation();
  const isActive = location.pathname === href;

  return (
    <Link
      to={href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 transition-all",
        isActive
          ? "bg-sidebar-primary text-sidebar-primary-foreground"
          : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
      )}
    >
      {icon}
      {!isCollapsed && <span>{title}</span>}
    </Link>
  );
};

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "flex flex-col bg-sidebar h-screen border-r shadow-sm transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex items-center justify-between p-4">
        {!collapsed && <span className="text-xl font-bold text-sidebar-foreground">ChurchTreasurer</span>}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-lg hover:bg-sidebar-accent text-sidebar-foreground"
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      <div className="flex-1 overflow-auto py-4 px-2">
        <nav className="flex flex-col gap-1">
          <NavItem
            href="/"
            icon={<Home size={20} />}
            title="Dashboard"
            isCollapsed={collapsed}
          />
          <NavItem
            href="/members"
            icon={<Users size={20} />}
            title="Members"
            isCollapsed={collapsed}
          />
          <NavItem
            href="/finances"
            icon={<DollarSign size={20} />}
            title="Finances"
            isCollapsed={collapsed}
          />
          <NavItem
            href="/events"
            icon={<Calendar size={20} />}
            title="Events"
            isCollapsed={collapsed}
          />
          <NavItem
            href="/ministry"
            icon={<BookOpen size={20} />}
            title="Ministry"
            isCollapsed={collapsed}
          />
          <NavItem
            href="/communication"
            icon={<MessageCircle size={20} />}
            title="Communication"
            isCollapsed={collapsed}
          />
          <NavItem
            href="/reports"
            icon={<BarChart size={20} />}
            title="Reports"
            isCollapsed={collapsed}
          />
          <NavItem
            href="/security"
            icon={<Shield size={20} />}
            title="Security"
            isCollapsed={collapsed}
          />
          <NavItem
            href="/settings"
            icon={<Settings size={20} />}
            title="Settings"
            isCollapsed={collapsed}
          />
        </nav>
      </div>

      <div className="p-4">
        {!collapsed && (
          <div className="text-xs text-sidebar-foreground opacity-70">
            © {new Date().getFullYear()} ChurchTreasurer
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
