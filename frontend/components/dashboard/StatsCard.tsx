import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: "blue" | "yellow" | "orange" | "green" | "red" | "purple" | "cyan" | "indigo";
  trend?: string;
}

const colorMap = {
  blue: { bg: "bg-blue-50", icon: "bg-blue-600 text-white", text: "text-blue-600", border: "border-l-blue-600" },
  yellow: { bg: "bg-yellow-50", icon: "bg-yellow-500 text-white", text: "text-yellow-600", border: "border-l-yellow-500" },
  orange: { bg: "bg-orange-50", icon: "bg-orange-500 text-white", text: "text-orange-600", border: "border-l-orange-500" },
  green: { bg: "bg-green-50", icon: "bg-green-600 text-white", text: "text-green-600", border: "border-l-green-600" },
  red: { bg: "bg-red-50", icon: "bg-red-600 text-white", text: "text-red-600", border: "border-l-red-600" },
  purple: { bg: "bg-purple-50", icon: "bg-purple-600 text-white", text: "text-purple-600", border: "border-l-purple-600" },
  cyan: { bg: "bg-cyan-50", icon: "bg-cyan-600 text-white", text: "text-cyan-600", border: "border-l-cyan-600" },
  indigo: { bg: "bg-indigo-50", icon: "bg-indigo-600 text-white", text: "text-indigo-600", border: "border-l-indigo-600" },
};

export default function StatsCard({ title, value, icon: Icon, color, trend }: StatsCardProps) {
  const c = colorMap[color];
  return (
    <div className={cn("bg-white rounded-xl border border-slate-200 border-l-4 p-5 shadow-sm hover:shadow-md transition-shadow", c.border)}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
          <p className={cn("text-3xl font-bold", c.text)}>{value}</p>
          {trend && <p className="text-xs text-slate-400 mt-1">{trend}</p>}
        </div>
        <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0", c.icon)}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}
