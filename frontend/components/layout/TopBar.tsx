import { Bell, User, ChevronDown, Shield, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import type { UserRole, Notification } from "../../types";

interface TopBarProps {
  role: UserRole;
  onRoleChange: (role: UserRole) => void;
  notifications: Notification[];
  onNavigate: (page: string) => void;
}

export default function TopBar({ role, onRoleChange, notifications, onNavigate }: TopBarProps) {
  const unread = notifications.filter((n) => !n.read).length;

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-6 flex-shrink-0">
      <div>
        <h1 className="text-base lg:text-lg font-bold text-slate-800 leading-tight">
          Urban Complaint Management System
        </h1>
        <p className="text-xs text-slate-500 hidden sm:block">Municipal Service Portal</p>
      </div>

      <div className="flex items-center gap-2 lg:gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onNavigate("notifications")}
          className="relative"
        >
          <Bell className="w-4 h-4" />
          {unread > 0 && (
            <Badge className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center p-0 text-xs bg-red-500 text-white border-0">
              {unread}
            </Badge>
          )}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              {role === "admin" ? (
                <Shield className="w-4 h-4 text-blue-600" />
              ) : (
                <UserCircle className="w-4 h-4 text-green-600" />
              )}
              <span className="hidden sm:inline capitalize font-medium">{role === "admin" ? "Administrator" : "Citizen"}</span>
              <ChevronDown className="w-3 h-3 text-slate-500" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>Switch Role</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onRoleChange("admin")} className="gap-2">
              <Shield className="w-4 h-4 text-blue-600" /> Administrator
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onRoleChange("citizen")} className="gap-2">
              <UserCircle className="w-4 h-4 text-green-600" /> Citizen
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
          <div className="hidden lg:block">
            <p className="text-sm font-medium text-slate-700">
              {role === "admin" ? "Admin User" : "Jane Citizen"}
            </p>
            <p className="text-xs text-slate-500">{role === "admin" ? "System Admin" : "Registered Citizen"}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
