import { cn } from "@/lib/utils";
import type { ComplaintStatus, ServiceStatus } from "../../types";

const statusConfig: Record<string, { label: string; className: string }> = {
  "Submitted": { label: "Submitted", className: "bg-slate-100 text-slate-700" },
  "Under Review": { label: "Under Review", className: "bg-blue-100 text-blue-700" },
  "Assigned": { label: "Assigned", className: "bg-purple-100 text-purple-700" },
  "In Progress": { label: "In Progress", className: "bg-orange-100 text-orange-700" },
  "Resolved": { label: "Resolved", className: "bg-green-100 text-green-700" },
  "Closed": { label: "Closed", className: "bg-slate-200 text-slate-600" },
  "Pending": { label: "Pending", className: "bg-yellow-100 text-yellow-700" },
  "Completed": { label: "Completed", className: "bg-green-100 text-green-700" },
  "Cancelled": { label: "Cancelled", className: "bg-red-100 text-red-700" },
};

interface StatusBadgeProps {
  status: ComplaintStatus | ServiceStatus;
  className?: string;
}

export default function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status] || { label: status, className: "bg-slate-100 text-slate-600" };
  return (
    <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap", config.className, className)}>
      {config.label}
    </span>
  );
}
