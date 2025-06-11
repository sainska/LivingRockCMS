
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  ChevronLeft, 
  ChevronRight, 
  Home, 
  User,
  Calendar,
  Heart,
  Users,
  DollarSign,
  Bell,
  HandHeart,
  BookOpen,
  MessageCircle,
  Settings,
  FileText
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
            <div className="text-sm opacity-80">Church Management</div>
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
            icon={<Home size={20} />}
            title="Dashboard Overview"
            isCollapsed={collapsed}
          />
          <NavItem
            href="/member-profile"
            icon={<User size={20} />}
            title="Member Profile"
            isCollapsed={collapsed}
          />
          <NavItem
            href="/events-services"
            icon={<Calendar size={20} />}
            title="Events & Services"
            isCollapsed={collapsed}
          />
          <NavItem
            href="/spiritual-journey"
            icon={<Heart size={20} />}
            title="Spiritual Journey"
            isCollapsed={collapsed}
          />
          <NavItem
            href="/ministries-groups"
            icon={<Users size={20} />}
            title="Ministries & Groups"
            isCollapsed={collapsed}
          />
          <NavItem
            href="/giving-donations"
            icon={<DollarSign size={20} />}
            title="Giving & Donations"
            isCollapsed={collapsed}
          />
          <NavItem
            href="/announcements-news"
            icon={<Bell size={20} />}
            title="Announcements & News"
            isCollapsed={collapsed}
          />
          <NavItem
            href="/volunteer-service"
            icon={<HandHeart size={20} />}
            title="Volunteer & Service"
            isCollapsed={collapsed}
          />
          <NavItem
            href="/resources-media"
            icon={<BookOpen size={20} />}
            title="Resources & Media"
            isCollapsed={collapsed}
          />
          <NavItem
            href="/messaging-communication"
            icon={<MessageCircle size={20} />}
            title="Messaging & Communication"
            isCollapsed={collapsed}
          />
          <NavItem
            href="/settings-preferences"
            icon={<Settings size={20} />}
            title="Settings & Preferences"
            isCollapsed={collapsed}
          />
          <NavItem
            href="/feedback-testimonies"
            icon={<FileText size={20} />}
            title="Feedback & Testimonies"
            isCollapsed={collapsed}
          />
        </nav>
      </div>

      <div className="p-4">
        {!collapsed && (
          <div className="text-xs text-sidebar-foreground opacity-70">
            © {new Date().getFullYear()} Living Rock Church
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
