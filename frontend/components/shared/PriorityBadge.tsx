import { cn } from "@/lib/utils";
import type { Priority } from "../../types";

const priorityConfig: Record<Priority, { className: string }> = {
  Low: { className: "bg-slate-100 text-slate-600" },
  Medium: { className: "bg-blue-100 text-blue-700" },
  High: { className: "bg-orange-100 text-orange-700" },
  Critical: { className: "bg-red-100 text-red-700" },
};

interface PriorityBadgeProps {
  priority: Priority;
  className?: string;
}

export default function PriorityBadge({ priority, className }: PriorityBadgeProps) {
  const config = priorityConfig[priority];
  return (
    <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap", config.className, className)}>
      {priority}
    </span>
  );
}
