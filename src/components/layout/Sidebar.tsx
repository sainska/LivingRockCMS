
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  ChevronLeft, 
  ChevronRight, 
  Users, 
  BookOpen, 
  Heart,
  Calendar,
  LayoutDashboard
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
        {!collapsed && (
          <div className="text-sidebar-foreground">
            <div className="text-xl font-bold">Living Rock</div>
            <div className="text-sm opacity-80">Church Ministry</div>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-lg hover:bg-sidebar-accent text-sidebar-foreground"
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      <div className="flex-1 overflow-auto py-4 px-2">
        <nav className="flex flex-col gap-1">
          {/* Clergy Dashboard Section */}
          {!collapsed && (
            <div className="px-3 py-2 text-xs font-semibold text-sidebar-foreground opacity-70 uppercase tracking-wider">
              Ministry Dashboard
            </div>
          )}
          <NavItem
            href="/"
            icon={<LayoutDashboard size={20} />}
            title="Dashboard"
            isCollapsed={collapsed}
          />
          <NavItem
            href="/members"
            icon={<Users size={20} />}
            title="Member Directory"
            isCollapsed={collapsed}
          />
          <NavItem
            href="/pastoral-care"
            icon={<Heart size={20} />}
            title="Pastoral Care"
            isCollapsed={collapsed}
          />
          <NavItem
            href="/sermons"
            icon={<BookOpen size={20} />}
            title="Sermon Library"
            isCollapsed={collapsed}
          />
          <NavItem
            href="/events"
            icon={<Calendar size={20} />}
            title="Events & Ministry"
            isCollapsed={collapsed}
          />
        </nav>
      </div>

      <div className="p-4">
        {!collapsed && (
          <div className="text-xs text-sidebar-foreground opacity-70">
            © {new Date().getFullYear()} Living Rock Church
            <br />
            Ministry Management System
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
