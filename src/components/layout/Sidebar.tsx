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
  ShieldCheck,
  DollarSign,
  FileText,
  Church,
  User
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useUserRole } from "@/hooks/useUserRole";

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
        "flex items-center gap-3 rounded-lg px-3 py-2 transition-all duration-200 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        isActive
          ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
          : "text-sidebar-foreground"
      )}
    >
      {icon}
      {!isCollapsed && <span className="font-medium">{title}</span>}
    </Link>
  );
};

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useAuth();
  const { userRole } = useUserRole();

  const getDashboardItems = () => {
    const items = [];
    
    // Role-specific dashboard items
    switch (userRole) {
      case "system_admin":
        items.push(
          { href: "/", icon: <LayoutDashboard size={20} />, title: "Admin Dashboard" },
          { href: "/system-dashboard", icon: <Activity size={20} />, title: "System Dashboard" }
        );
        break;
      case "treasurer":
        items.push(
          { href: "/treasurer-dashboard", icon: <DollarSign size={20} />, title: "Treasurer Dashboard" }
        );
        break;
      case "secretary":
        items.push(
          { href: "/secretary-dashboard", icon: <FileText size={20} />, title: "Secretary Dashboard" }
        );
        break;
      case "clergy":
        items.push(
          { href: "/clergy-dashboard", icon: <Church size={20} />, title: "Clergy Dashboard" }
        );
        break;
      default:
        items.push(
          { href: "/user-dashboard", icon: <User size={20} />, title: "My Dashboard" }
        );
    }

    return items;
  };

  const getMenuItems = () => {
    const dashboardItems = getDashboardItems();
    
    // Common items available to all roles (with different access levels)
    const commonItems = [
      { href: "/church-info", icon: <BookOpen size={20} />, title: "Church Info" },
    ];

    // Admin-only items
    const adminItems = userRole === "system_admin" ? [
      { href: "/system-overview", icon: <Settings size={20} />, title: "System Overview" },
      { href: "/users", icon: <Users size={20} />, title: "User Management" },
      { href: "/backup", icon: <Database size={20} />, title: "Backup & Data Management" },
      { href: "/security-overview", icon: <Shield size={20} />, title: "Security Overview" },
      { href: "/access-control", icon: <UserCog size={20} />, title: "Access Control" },
      { href: "/data-protection", icon: <ShieldCheck size={20} />, title: "Data Protection" },
      { href: "/security-logs", icon: <Eye size={20} />, title: "Security Logs" },
      { href: "/checkin-security", icon: <Lock size={20} />, title: "Check-in Security" },
      { href: "/integrations", icon: <BarChart size={20} />, title: "Integrations" },
    ] : [];

    return [...dashboardItems, ...commonItems, ...adminItems];
  };

  return (
    <aside
      className={cn(
        "flex flex-col bg-sidebar h-full border-r border-sidebar-border shadow-sm transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
        {!collapsed && (
          <div className="text-sidebar-foreground">
            <div className="text-xl font-bold">Living Rock</div>
            <div className="text-sm opacity-80">
              {userRole === "system_admin" && "System Administration"}
              {userRole === "treasurer" && "Financial Management"}
              {userRole === "secretary" && "Administrative Portal"}
              {userRole === "clergy" && "Ministry Oversight"}
              {!["system_admin", "treasurer", "secretary", "clergy"].includes(userRole || "") && "Member Portal"}
            </div>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-lg hover:bg-sidebar-accent text-sidebar-foreground transition-colors"
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-4 px-2">
        <nav className="flex flex-col gap-1">
          {getMenuItems().map((item, index) => (
            <NavItem
              key={index}
              href={item.href}
              icon={item.icon}
              title={item.title}
              isCollapsed={collapsed}
            />
          ))}
        </nav>
      </div>

      <div className="p-4 border-t border-sidebar-border">
        {!collapsed && (
          <div className="text-xs text-sidebar-foreground opacity-70">
            © {new Date().getFullYear()} Living Rock Church
            <br />
            {userRole === "system_admin" && "System Administration Panel"}
            {userRole === "treasurer" && "Financial Management System"}
            {userRole === "secretary" && "Administrative System"}
            {userRole === "clergy" && "Ministry Management System"}
            {!["system_admin", "treasurer", "secretary", "clergy"].includes(userRole || "") && "Member Portal"}
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
