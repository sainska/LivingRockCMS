import React, { useState } from "react";
import { Link, useLocation, NavLink } from "react-router-dom";
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
  User,
  Home,
  Server,
  Bell,
  ClipboardList,
  Info,
  BarChart3
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useUserRole } from "@/hooks/useUserRole";

const NavItem = ({ href, icon, title, isCollapsed }) => {
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

const adminLinks = [
  { to: "/admin/dashboard", label: "Dashboard", icon: Home },
  { to: "/admin/church-info", label: "Church Info", icon: Info },
  { to: "/admin/system-settings", label: "System Settings", icon: Settings },
  { to: "/admin/user-management", label: "User Management", icon: Users },
  { to: "/admin/backup", label: "Backup & Data", icon: Database },
  { to: "/admin/system-events", label: "System Events", icon: ClipboardList },
  { to: "/admin/content", label: "Content Management", icon: FileText },
  { to: "/admin/communications", label: "System Communications", icon: Bell },
  { to: "/admin/reports", label: "System Reports", icon: BarChart3 },
  { to: "/admin/security", label: "Security & Access", icon: Shield },
];

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useAuth();
  const { role: userRole, loading } = useUserRole();

  // Default to member role while loading or if no role found
  const currentRole = userRole || "member";

  const getDashboardItems = () => {
    const items = [];
    
    // Role-specific dashboard items
    switch (currentRole) {
      case "system_admin":
        items.push(
          { href: "/admin/dashboard", icon: <LayoutDashboard size={20} />, title: "Admin Dashboard" }
        );
        break;
      case "treasurer":
        items.push(
          { href: "/treasurer/dashboard", icon: <DollarSign size={20} />, title: "Treasurer Dashboard" }
        );
        break;
      case "secretary":
        items.push(
          { href: "/secretary/dashboard", icon: <FileText size={20} />, title: "Secretary Dashboard" }
        );
        break;
      case "clergy":
        items.push(
          { href: "/clergy/dashboard", icon: <Church size={20} />, title: "Clergy Dashboard" }
        );
        break;
      default:
        items.push(
          { href: "/welcome", icon: <User size={20} />, title: "Welcome" }
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
    const adminItems = currentRole === "system_admin" ? [
      { href: "/admin/system-settings", icon: <Settings size={20} />, title: "System Settings" },
      { href: "/admin/user-management", icon: <Users size={20} />, title: "User Management" },
      { href: "/admin/backup", icon: <Database size={20} />, title: "Backup & Data" },
      { href: "/admin/security", icon: <Shield size={20} />, title: "Security & Access" },
      { href: "/admin/system-events", icon: <ClipboardList size={20} />, title: "System Events" },
      { href: "/admin/content", icon: <FileText size={20} />, title: "Content Management" },
      { href: "/admin/communications", icon: <Bell size={20} />, title: "Communications" },
      { href: "/admin/reports", icon: <BarChart3 size={20} />, title: "System Reports" },
      { href: "/admin/church-info", icon: <Info size={20} />, title: "Church Info" },
    ] : [];

    return [...dashboardItems, ...commonItems, ...adminItems];
  };

  const getRoleDisplayText = (role) => {
    switch (role) {
      case "system_admin":
        return "System Administration";
      case "treasurer":
        return "Financial Management";
      case "secretary":
        return "Administrative Portal";
      case "clergy":
        return "Ministry Oversight";
      default:
        return "Member Portal";
    }
  };

  const getRoleFooterText = (role) => {
    switch (role) {
      case "system_admin":
        return "System Administration Panel";
      case "treasurer":
        return "Financial Management System";
      case "secretary":
        return "Administrative System";
      case "clergy":
        return "Ministry Management System";
      default:
        return "Member Portal";
    }
  };

  if (loading) {
    return (
      <aside className="flex flex-col min-h-screen h-full bg-blue-800 border-r shadow-sm w-64">
        <div className="p-4">
          <div className="text-white">
            <div className="text-xl font-bold">Living Rock</div>
            <div className="text-sm opacity-80">Loading...</div>
          </div>
        </div>
      </aside>
    );
  }

  return (
    <aside
      className={cn(
        "flex flex-col min-h-screen h-full bg-blue-800 border-r border-sidebar-border shadow-sm transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
        {!collapsed && (
          <div className="text-white">
            <div className="text-xl font-bold">Living Rock</div>
            <div className="text-sm opacity-80">
              {getRoleDisplayText(currentRole)}
            </div>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-lg hover:bg-blue-700 text-white transition-colors"
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
          <div className="text-xs text-white opacity-70">
            © {new Date().getFullYear()} Living Rock Church
            <br />
            {getRoleFooterText(currentRole)}
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
