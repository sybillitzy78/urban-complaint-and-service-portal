import { useState } from "react";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import type { UserRole, Notification } from "../../types";

interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
  role: UserRole;
  onRoleChange: (role: UserRole) => void;
  notifications: Notification[];
}

export default function Layout({ children, currentPage, onNavigate, role, onRoleChange, notifications }: LayoutProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <div className="relative flex-shrink-0 z-20">
        <Sidebar
          currentPage={currentPage}
          onNavigate={onNavigate}
          role={role}
          collapsed={collapsed}
          onToggle={() => setCollapsed(!collapsed)}
        />
      </div>
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <TopBar role={role} onRoleChange={onRoleChange} notifications={notifications} onNavigate={onNavigate} />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
