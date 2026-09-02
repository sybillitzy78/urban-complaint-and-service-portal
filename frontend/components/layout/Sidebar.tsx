import { cn } from "@/lib/utils";
import {
  LayoutDashboard, Users, FileText, ClipboardList, Building2,
  Wrench, Search, GitCompare, BarChart3, Bell, LogOut, ChevronLeft, ChevronRight,
} from "lucide-react";
import type { UserRole } from "../../types";

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  roles: UserRole[];
}

const navItems: NavItem[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, roles: ["admin"] },
  { id: "citizens", label: "Citizens", icon: Users, roles: ["admin"] },
  { id: "register-complaint", label: "Register Complaint", icon: FileText, roles: ["citizen", "admin"] },
  { id: "complaints", label: "Manage Complaints", icon: ClipboardList, roles: ["admin"] },
  { id: "departments", label: "Departments", icon: Building2, roles: ["admin"] },
  { id: "services", label: "Service Requests", icon: Wrench, roles: ["citizen", "admin"] },
  { id: "track", label: "Track Complaint", icon: Search, roles: ["citizen", "admin"] },
  { id: "compare", label: "Compare Complaints", icon: GitCompare, roles: ["admin"] },
  { id: "reports", label: "Reports", icon: BarChart3, roles: ["admin"] },
  { id: "notifications", label: "Notifications", icon: Bell, roles: ["citizen", "admin"] },
];

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  role: UserRole;
  collapsed: boolean;
  onToggle: () => void;
}

export default function Sidebar({ currentPage, onNavigate, role, collapsed, onToggle }: SidebarProps) {
  const filtered = navItems.filter((item) => item.roles.includes(role));

  return (
    <div
      className={cn(
        "flex flex-col h-full bg-blue-950 text-white transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex items-center justify-between px-4 py-4 border-b border-blue-800">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-400 rounded-lg flex items-center justify-center flex-shrink-0">
              <Building2 className="w-5 h-5 text-blue-950" />
            </div>
            <span className="font-bold text-sm leading-tight">UCMS Portal</span>
          </div>
        )}
        {collapsed && (
          <div className="w-8 h-8 bg-blue-400 rounded-lg flex items-center justify-center mx-auto">
            <Building2 className="w-5 h-5 text-blue-950" />
          </div>
        )}
        <button
          onClick={onToggle}
          className={cn("text-blue-300 hover:text-white transition-colors", collapsed && "absolute -right-3 top-5 bg-blue-950 rounded-full p-0.5 border border-blue-700")}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      <nav className="flex-1 py-4 overflow-y-auto">
        {filtered.map((item) => {
          const Icon = item.icon;
          const active = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all duration-150",
                active
                  ? "bg-blue-600 text-white border-r-2 border-blue-300"
                  : "text-blue-200 hover:bg-blue-800 hover:text-white",
                collapsed && "justify-center px-2"
              )}
              title={collapsed ? item.label : undefined}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-blue-800">
        <button
          className={cn(
            "w-full flex items-center gap-3 px-4 py-2 text-sm text-blue-300 hover:text-white hover:bg-blue-800 rounded-lg transition-colors",
            collapsed && "justify-center px-2"
          )}
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </div>
  );
}
