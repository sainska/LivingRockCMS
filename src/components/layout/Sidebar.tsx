
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  ChevronLeft, 
  ChevronRight, 
  LayoutDashboard, 
  Users, 
  Database, 
  BookOpen, 
  Settings, 
  BarChart, 
  Shield,
  Activity,
  Lock,
  Eye,
  UserCog,
  ShieldCheck
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
            <div className="text-sm opacity-80">System Administration</div>
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
          <NavItem
            href="/"
            icon={<LayoutDashboard size={20} />}
            title="Admin Dashboard"
            isCollapsed={collapsed}
          />
          <NavItem
            href="/system-dashboard"
            icon={<Activity size={20} />}
            title="System Dashboard"
            isCollapsed={collapsed}
          />
          <NavItem
            href="/church-info"
            icon={<BookOpen size={20} />}
            title="Church Info"
            isCollapsed={collapsed}
          />
          <NavItem
            href="/system-overview"
            icon={<Settings size={20} />}
            title="System Overview"
            isCollapsed={collapsed}
          />
          <NavItem
            href="/users"
            icon={<Users size={20} />}
            title="User Management"
            isCollapsed={collapsed}
          />
          <NavItem
            href="/backup"
            icon={<Database size={20} />}
            title="Backup & Data Management"
            isCollapsed={collapsed}
          />
          <NavItem
            href="/security-overview"
            icon={<Shield size={20} />}
            title="Security Overview"
            isCollapsed={collapsed}
          />
          <NavItem
            href="/access-control"
            icon={<UserCog size={20} />}
            title="Access Control"
            isCollapsed={collapsed}
          />
          <NavItem
            href="/data-protection"
            icon={<ShieldCheck size={20} />}
            title="Data Protection"
            isCollapsed={collapsed}
          />
          <NavItem
            href="/security-logs"
            icon={<Eye size={20} />}
            title="Security Logs"
            isCollapsed={collapsed}
          />
          <NavItem
            href="/checkin-security"
            icon={<Lock size={20} />}
            title="Check-in Security"
            isCollapsed={collapsed}
          />
          <NavItem
            href="/integrations"
            icon={<BarChart size={20} />}
            title="Integrations"
            isCollapsed={collapsed}
          />
        </nav>
      </div>

      <div className="p-4">
        {!collapsed && (
          <div className="text-xs text-sidebar-foreground opacity-70">
            © {new Date().getFullYear()} Living Rock Church
            <br />
            System Administration Panel
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
