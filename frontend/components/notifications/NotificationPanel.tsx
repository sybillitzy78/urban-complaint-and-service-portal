import { Bell, CheckCheck, Info, CheckCircle, AlertTriangle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AppState, Notification } from "../../types";

interface NotificationPanelProps {
  state: AppState;
  onUpdate: (state: AppState) => void;
}

const typeConfig = {
  info: { icon: Info, className: "text-blue-500 bg-blue-50" },
  success: { icon: CheckCircle, className: "text-green-500 bg-green-50" },
  warning: { icon: AlertTriangle, className: "text-orange-500 bg-orange-50" },
  error: { icon: XCircle, className: "text-red-500 bg-red-50" },
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  const hrs = Math.floor(mins / 60);
  const days = Math.floor(hrs / 24);
  if (days > 0) return `${days}d ago`;
  if (hrs > 0) return `${hrs}h ago`;
  if (mins > 0) return `${mins}m ago`;
  return "Just now";
}

export default function NotificationPanel({ state, onUpdate }: NotificationPanelProps) {
  const unread = state.notifications.filter((n) => !n.read).length;

  function markAllRead() {
    onUpdate({ ...state, notifications: state.notifications.map((n) => ({ ...n, read: true })) });
  }

  function markRead(id: string) {
    onUpdate({ ...state, notifications: state.notifications.map((n) => n.id === id ? { ...n, read: true } : n) });
  }

  function dismissAll() {
    onUpdate({ ...state, notifications: state.notifications.filter((n) => n.read) });
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Notifications</h2>
          <p className="text-slate-500 text-sm mt-1">{unread} unread notification{unread !== 1 ? "s" : ""}</p>
        </div>
        <div className="flex gap-2">
          {unread > 0 && (
            <Button size="sm" variant="outline" onClick={markAllRead}>
              <CheckCheck className="w-4 h-4 mr-1" /> Mark all read
            </Button>
          )}
          <Button size="sm" variant="outline" onClick={dismissAll}>
            Clear read
          </Button>
        </div>
      </div>

      {state.notifications.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-12 text-center">
          <Bell className="w-12 h-12 text-slate-200 mx-auto mb-3" />
          <p className="text-slate-400 font-medium">No notifications</p>
          <p className="text-slate-300 text-sm mt-1">You're all caught up!</p>
        </div>
      ) : (
        <div className="space-y-2">
          {state.notifications.map((notif: Notification) => {
            const cfg = typeConfig[notif.type];
            const Icon = cfg.icon;
            return (
              <div
                key={notif.id}
                className={`bg-white rounded-xl border shadow-sm p-4 flex items-start gap-4 transition-all cursor-pointer hover:shadow-md ${notif.read ? "border-slate-200 opacity-70" : "border-l-4 border-l-blue-500 border-slate-200"}`}
                onClick={() => markRead(notif.id)}
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${cfg.className}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className={`font-semibold text-sm ${notif.read ? "text-slate-500" : "text-slate-800"}`}>{notif.title}</p>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-xs text-slate-400">{timeAgo(notif.createdAt)}</span>
                      {!notif.read && <span className="w-2 h-2 rounded-full bg-blue-500" />}
                    </div>
                  </div>
                  <p className="text-sm text-slate-500 mt-0.5">{notif.message}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
