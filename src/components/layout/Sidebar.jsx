
import React, { useState } from "react";
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
  User,
  Calendar,
  MessageSquare,
  Heart,
  Music,
  UserCheck,
  Building,
  PieChart,
  CreditCard,
  Mail,
  Bell,
  Plus,
  Inbox,
  Send,
  Repeat,
  Target,
  Download,
  Edit,
  Clock,
  Gift
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

const SidebarSection = ({ title, items, isCollapsed }) => {
  return (
    <div className="mb-4">
      {!isCollapsed && (
        <h3 className="px-3 pb-2 text-xs font-semibold text-sidebar-foreground/70 uppercase tracking-wider">
          {title}
        </h3>
      )}
      <nav className="flex flex-col gap-1">
        {items.map((item, index) => (
          <NavItem
            key={index}
            href={item.href}
            icon={item.icon}
            title={item.title}
            isCollapsed={isCollapsed}
          />
        ))}
      </nav>
    </div>
  );
};

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

  const getChurchManagementItems = () => {
    const commonItems = [
      { href: "/church-info", icon: <Building size={20} />, title: "Church Info" },
      { href: "/events", icon: <Calendar size={20} />, title: "Events" },
      { href: "/members", icon: <Users size={20} />, title: "Members" },
      { href: "/ministry", icon: <Heart size={20} />, title: "Ministry" },
    ];

    // Role-specific items
    if (currentRole === "clergy" || currentRole === "system_admin") {
      commonItems.push(
        { href: "/communication", icon: <MessageSquare size={20} />, title: "Communication" }
      );
    }

    return commonItems;
  };

  const getFinancialItems = () => {
    if (currentRole === "treasurer" || currentRole === "system_admin") {
      return [
        { href: "/finances", icon: <CreditCard size={20} />, title: "Finances" },
        { href: "/reports", icon: <PieChart size={20} />, title: "Reports" },
      ];
    }
    return [];
  };

  const getSystemItems = () => {
    if (currentRole === "system_admin") {
      return [
        { href: "/system-overview", icon: <Settings size={20} />, title: "System Overview" },
        { href: "/users", icon: <UserCheck size={20} />, title: "User Management" },
        { href: "/backup", icon: <Database size={20} />, title: "Backup & Data" },
        { href: "/integrations", icon: <BarChart size={20} />, title: "Integrations" },
      ];
    }
    return [];
  };

  const getSecurityItems = () => {
    if (currentRole === "system_admin") {
      return [
        { href: "/security-overview", icon: <Shield size={20} />, title: "Security Overview" },
        { href: "/access-control", icon: <UserCog size={20} />, title: "Access Control" },
        { href: "/data-protection", icon: <ShieldCheck size={20} />, title: "Data Protection" },
        { href: "/security-logs", icon: <Eye size={20} />, title: "Security Logs" },
        { href: "/checkin-security", icon: <Lock size={20} />, title: "Check-in Security" },
      ];
    }
    return [];
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

  const getRoleBasedDashboardSections = (role) => {
    switch (role) {
      case 'system_admin':
        return [
          {
            title: 'System Admin',
            items: [
              { href: '/admin-dashboard', icon: <LayoutDashboard size={20} />, title: 'Admin Dashboard' },
              { href: '/system-dashboard', icon: <Activity size={20} />, title: 'System Dashboard' },
              { href: '/users', icon: <UserCheck size={20} />, title: 'User Management' },
              { href: '/backup', icon: <Database size={20} />, title: 'Backup & Data' },
              { href: '/integrations', icon: <BarChart size={20} />, title: 'Integrations' },
              { href: '/security-overview', icon: <Shield size={20} />, title: 'Security Overview' },
              { href: '/access-control', icon: <UserCog size={20} />, title: 'Access Control' },
              { href: '/data-protection', icon: <ShieldCheck size={20} />, title: 'Data Protection' },
              { href: '/security-logs', icon: <Eye size={20} />, title: 'Security Logs' },
              { href: '/checkin-security', icon: <Lock size={20} />, title: 'Check-in Security' },
              { href: '/finances', icon: <CreditCard size={20} />, title: 'Finances' },
              { href: '/reports', icon: <PieChart size={20} />, title: 'Reports' },
            ],
          },
        ];
      case 'member':
      default:
        return [
          {
            title: 'Profile',
            items: [
              { href: '/dashboard/member/profile', icon: <User size={20} />, title: 'Profile' },
            ],
          },
          {
            title: 'Ministries & Groups',
            items: [
              { href: '/dashboard/member/ministries', icon: <Users size={20} />, title: 'My Groups' },
              { href: '/dashboard/member/ministries#join', icon: <Plus size={20} />, title: 'Join Requests' },
            ],
          },
          {
            title: 'Events & Attendance',
            items: [
              { href: '/dashboard/member/attendance', icon: <Calendar size={20} />, title: 'Events & Attendance' },
            ],
          },
          {
            title: 'Giving',
            items: [
              { href: '/dashboard/member/giving', icon: <DollarSign size={20} />, title: 'Giving' },
            ],
          },
          {
            title: 'Pastoral Care',
            items: [
              { href: '/dashboard/member/pastoral', icon: <Heart size={20} />, title: 'Pastoral Care' },
            ],
          },
          {
            title: 'Messages & Announcements',
            items: [
              { href: '/dashboard/member/messages', icon: <Mail size={20} />, title: 'Messages' },
            ],
          },
          {
            title: 'Settings',
            items: [
              { href: '/dashboard/member/settings', icon: <Settings size={20} />, title: 'Settings' },
            ],
          },
        ];
      case 'secretary':
        return [
          {
            title: 'Members',
            items: [
              { href: '/dashboard/secretary/members', icon: <Users size={20} />, title: 'Directory' },
              { href: '/dashboard/secretary/members/add', icon: <Plus size={20} />, title: 'Add Member' },
              { href: '/dashboard/secretary/members/status', icon: <UserCheck size={20} />, title: 'Status Updates' },
              { href: '/dashboard/secretary/members/sacraments', icon: <BookOpen size={20} />, title: 'Sacraments' },
            ],
          },
          {
            title: 'Events & Scheduling',
            items: [
              { href: '/dashboard/secretary/events', icon: <Calendar size={20} />, title: 'Event Calendar' },
              { href: '/dashboard/secretary/events/manage', icon: <Settings size={20} />, title: 'Manage Events' },
              { href: '/dashboard/secretary/events/attendance', icon: <UserCheck size={20} />, title: 'Attendance Records' },
              { href: '/dashboard/secretary/events/recurring', icon: <Repeat size={20} />, title: 'Recurring Events' },
            ],
          },
          {
            title: 'Ministries',
            items: [
              { href: '/dashboard/secretary/ministries', icon: <Users size={20} />, title: 'Groups Overview' },
              { href: '/dashboard/secretary/ministries/assign', icon: <UserCheck size={20} />, title: 'Assign Members' },
              { href: '/dashboard/secretary/ministries/counts', icon: <BarChart size={20} />, title: 'Membership Counts' },
            ],
          },
          {
            title: 'Communication',
            items: [
              { href: '/dashboard/secretary/communication', icon: <Mail size={20} />, title: 'Announcements' },
              { href: '/dashboard/secretary/communication/inbox', icon: <Inbox size={20} />, title: 'Inbox' },
              { href: '/dashboard/secretary/communication/outbox', icon: <Send size={20} />, title: 'Outbox' },
              { href: '/dashboard/secretary/communication/bulk', icon: <Users size={20} />, title: 'Bulk Send' },
            ],
          },
          {
            title: 'Pastoral Care',
            items: [
              { href: '/dashboard/secretary/pastoral', icon: <Heart size={20} />, title: 'Visits Tracker' },
              { href: '/dashboard/secretary/pastoral/counseling', icon: <User size={20} />, title: 'Counseling Sessions' },
              { href: '/dashboard/secretary/pastoral/followups', icon: <Repeat size={20} />, title: 'Follow-Ups' },
            ],
          },
          {
            title: 'Reports',
            items: [
              { href: '/dashboard/secretary/reports/membership', icon: <BarChart size={20} />, title: 'Membership Reports' },
              { href: '/dashboard/secretary/reports/events', icon: <Calendar size={20} />, title: 'Event Attendance Reports' },
              { href: '/dashboard/secretary/reports/groups', icon: <Users size={20} />, title: 'Group Activity Reports' },
              { href: '/dashboard/secretary/reports/finances', icon: <DollarSign size={20} />, title: 'Financial Overview' },
            ],
          },
          {
            title: 'Tools',
            items: [
              { href: '/dashboard/secretary/tools/templates', icon: <FileText size={20} />, title: 'Document Templates' },
              { href: '/dashboard/secretary/tools/settings', icon: <Settings size={20} />, title: 'Settings' },
              { href: '/dashboard/secretary/tools/roles', icon: <UserCog size={20} />, title: 'Profile/Role Management' },
            ],
          },
        ];
      case 'treasurer':
        return [
          {
            title: 'Accounts',
            items: [
              { href: '/dashboard/treasurer/accounts', icon: <CreditCard size={20} />, title: 'Overview' },
              { href: '/dashboard/treasurer/accounts/create', icon: <Plus size={20} />, title: 'Create/Edit Account' },
              { href: '/dashboard/treasurer/accounts/status', icon: <UserCheck size={20} />, title: 'Account Status' },
            ],
          },
          {
            title: 'Transactions',
            items: [
              { href: '/dashboard/treasurer/transactions', icon: <DollarSign size={20} />, title: 'Record Transaction' },
              { href: '/dashboard/treasurer/transactions/view', icon: <Eye size={20} />, title: 'View Transactions' },
              { href: '/dashboard/treasurer/transactions/edit', icon: <Edit size={20} />, title: 'Edit/Reverse' },
              { href: '/dashboard/treasurer/transactions/receipts', icon: <FileText size={20} />, title: 'Attach Receipts' },
            ],
          },
          {
            title: 'Donations & Tithes',
            items: [
              { href: '/dashboard/treasurer/donations', icon: <DollarSign size={20} />, title: 'Tithes Summary' },
              { href: '/dashboard/treasurer/donations/offerings', icon: <Gift size={20} />, title: 'Offerings' },
              { href: '/dashboard/treasurer/donations/donors', icon: <Users size={20} />, title: 'Donor Records' },
              { href: '/dashboard/treasurer/donations/receipts', icon: <FileText size={20} />, title: 'Receipts' },
            ],
          },
          {
            title: 'Expenses',
            items: [
              { href: '/dashboard/treasurer/expenses', icon: <CreditCard size={20} />, title: 'Expense Categories' },
              { href: '/dashboard/treasurer/expenses/recurring', icon: <Repeat size={20} />, title: 'Recurring Expenses' },
              { href: '/dashboard/treasurer/expenses/approvals', icon: <UserCheck size={20} />, title: 'Approvals' },
            ],
          },
          {
            title: 'Reports',
            items: [
              { href: '/dashboard/treasurer/reports/income', icon: <BarChart size={20} />, title: 'Income vs Expense' },
              { href: '/dashboard/treasurer/reports/balances', icon: <PieChart size={20} />, title: 'Balances' },
              { href: '/dashboard/treasurer/reports/budget', icon: <Target size={20} />, title: 'Budget Tracking' },
              { href: '/dashboard/treasurer/reports/export', icon: <Download size={20} />, title: 'Export' },
            ],
          },
          {
            title: 'Audit & Security',
            items: [
              { href: '/dashboard/treasurer/audit/logs', icon: <FileText size={20} />, title: 'Transaction Logs' },
              { href: '/dashboard/treasurer/audit/users', icon: <User size={20} />, title: 'User Access' },
              { href: '/dashboard/treasurer/audit/backup', icon: <Database size={20} />, title: 'Backup/Restore' },
            ],
          },
        ];
      case 'clergy':
        return [
          {
            title: 'Members',
            items: [
              { href: '/dashboard/clergy/members', icon: <Users size={20} />, title: 'Directory' },
              { href: '/dashboard/clergy/members/sacraments', icon: <BookOpen size={20} />, title: 'Sacraments Records' },
              { href: '/dashboard/clergy/members/groups', icon: <Users size={20} />, title: 'Group Assignments' },
              { href: '/dashboard/clergy/members/notes', icon: <FileText size={20} />, title: 'Spiritual Notes' },
            ],
          },
          {
            title: 'Pastoral Care',
            items: [
              { href: '/dashboard/clergy/pastoral', icon: <Heart size={20} />, title: 'Visit Planner' },
              { href: '/dashboard/clergy/pastoral/history', icon: <Clock size={20} />, title: 'Care History' },
              { href: '/dashboard/clergy/pastoral/counseling', icon: <User size={20} />, title: 'Counseling Sessions' },
              { href: '/dashboard/clergy/pastoral/followups', icon: <Repeat size={20} />, title: 'Follow-Ups' },
            ],
          },
          {
            title: 'Ministries',
            items: [
              { href: '/dashboard/clergy/ministries', icon: <Users size={20} />, title: 'Groups Overview' },
              { href: '/dashboard/clergy/ministries/leaders', icon: <UserCheck size={20} />, title: 'Assign Leaders' },
              { href: '/dashboard/clergy/ministries/growth', icon: <BarChart size={20} />, title: 'Track Growth' },
              { href: '/dashboard/clergy/ministries/activities', icon: <Activity size={20} />, title: 'Group Activities' },
            ],
          },
          {
            title: 'Events & Services',
            items: [
              { href: '/dashboard/clergy/events', icon: <Calendar size={20} />, title: 'Event Calendar' },
              { href: '/dashboard/clergy/events/services', icon: <BookOpen size={20} />, title: 'Service Details' },
              { href: '/dashboard/clergy/events/attendance', icon: <UserCheck size={20} />, title: 'Attendance Monitoring' },
              { href: '/dashboard/clergy/events/reports', icon: <BarChart size={20} />, title: 'Event Reports' },
            ],
          },
          {
            title: 'Communication',
            items: [
              { href: '/dashboard/clergy/communication', icon: <Mail size={20} />, title: 'Announcements' },
              { href: '/dashboard/clergy/communication/messages', icon: <MessageSquare size={20} />, title: 'Messages' },
              { href: '/dashboard/clergy/communication/alerts', icon: <Bell size={20} />, title: 'Urgent Alerts' },
            ],
          },
          {
            title: 'Reports & Insights',
            items: [
              { href: '/dashboard/clergy/reports/growth', icon: <BarChart size={20} />, title: 'Member Growth Reports' },
              { href: '/dashboard/clergy/reports/attendance', icon: <PieChart size={20} />, title: 'Attendance Trends' },
              { href: '/dashboard/clergy/reports/pastoral', icon: <Heart size={20} />, title: 'Pastoral Care Stats' },
              { href: '/dashboard/clergy/reports/engagement', icon: <Users size={20} />, title: 'Ministry Engagement' },
            ],
          },
        ];
    }
  };

  if (loading) {
    return (
      <aside className="flex flex-col bg-sidebar h-screen border-r shadow-sm w-64">
        <div className="p-4">
          <div className="text-sidebar-foreground">
            <div className="text-xl font-bold">Living Rock</div>
            <div className="text-sm opacity-80">Loading...</div>
          </div>
        </div>
      </aside>
    );
  }

  const dashboardItems = getDashboardItems();
  const churchManagementItems = getChurchManagementItems();
  const financialItems = getFinancialItems();
  const systemItems = getSystemItems();
  const securityItems = getSecurityItems();

  const sidebarSections = getRoleBasedDashboardSections(currentRole);

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
              {getRoleDisplayText(currentRole)}
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
        <div className="flex flex-col gap-2">
          {sidebarSections.map((section, idx) => (
            <SidebarSection
              key={idx}
              title={section.title}
              items={section.items}
              isCollapsed={collapsed}
            />
          ))}
        </div>
      </div>

      <div className="p-4 border-t border-sidebar-border">
        {!collapsed && (
          <div className="text-xs text-sidebar-foreground opacity-70">
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
