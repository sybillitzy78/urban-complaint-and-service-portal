import {
  FileText, Clock, Activity, CheckCircle, Wrench, AlertTriangle, Timer, BarChart2,
} from "lucide-react";
import {
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import StatsCard from "./StatsCard";
import StatusBadge from "../shared/StatusBadge";
import PriorityBadge from "../shared/PriorityBadge";
import type { AppState } from "../../types";
import {
  getComplaintStats, getAvgResolutionTime, getCategoryData,
  getStatusData, getDepartmentStats, getMonthlyData,
} from "../../store/dataStore";
import { Button } from "@/components/ui/button";

const PIE_COLORS = ["#3b82f6", "#f59e0b", "#f97316", "#22c55e", "#8b5cf6", "#06b6d4"];

interface DashboardProps {
  state: AppState;
  onNavigate: (page: string) => void;
}

export default function Dashboard({ state, onNavigate }: DashboardProps) {
  const stats = getComplaintStats(state.complaints);
  const avgTime = getAvgResolutionTime(state.complaints);
  const categoryData = getCategoryData(state.complaints);
  const statusData = getStatusData(state.complaints).filter((d) => d.value > 0);
  const deptStats = getDepartmentStats(state.departments, state.complaints);
  const monthlyData = getMonthlyData(state.complaints);
  const recent = [...state.complaints].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);
  const recentServices = [...state.serviceRequests].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 3);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Dashboard</h2>
        <p className="text-slate-500 text-sm mt-1">Overview of complaint management system</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Total Complaints" value={stats.total} icon={FileText} color="blue" trend="All time" />
        <StatsCard title="Pending" value={stats.pending} icon={Clock} color="yellow" trend="Submitted + Under Review" />
        <StatsCard title="In Progress" value={stats.inProgress} icon={Activity} color="orange" trend="Assigned + In Progress" />
        <StatsCard title="Resolved" value={stats.resolved} icon={CheckCircle} color="green" trend="Resolved + Closed" />
        <StatsCard title="Service Requests" value={state.serviceRequests.length} icon={Wrench} color="cyan" trend="All requests" />
        <StatsCard title="High Priority" value={stats.highPriority} icon={AlertTriangle} color="red" trend="High + Critical" />
        <StatsCard title="Avg Resolution" value={avgTime} icon={Timer} color="purple" trend="Based on resolved cases" />
        <StatsCard title="Departments" value={state.departments.length} icon={BarChart2} color="indigo" trend="Active departments" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <h3 className="font-semibold text-slate-700 mb-4">Complaint Status Distribution</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label={({ name, value }) => value > 0 ? `${name}: ${value}` : ""} labelLine={false} fontSize={10}>
                {statusData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <h3 className="font-semibold text-slate-700 mb-4">Complaints by Category</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={categoryData} layout="vertical" margin={{ left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" tick={{ fontSize: 11 }} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 10 }} width={90} />
              <Tooltip />
              <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <h3 className="font-semibold text-slate-700 mb-4">Monthly Trend</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="total" stroke="#3b82f6" strokeWidth={2} name="Total" dot={{ r: 4 }} />
              <Line type="monotone" dataKey="resolved" stroke="#22c55e" strokeWidth={2} name="Resolved" dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-700">Recent Complaints</h3>
            <Button size="sm" variant="outline" onClick={() => onNavigate("complaints")}>View All</Button>
          </div>
          <div className="space-y-3">
            {recent.map((c) => (
              <div key={c.id} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                <div className="flex-1 min-w-0 mr-3">
                  <p className="font-medium text-sm text-slate-700 truncate">{c.title}</p>
                  <p className="text-xs text-slate-400">{c.id} · {c.citizenName}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <PriorityBadge priority={c.priority} />
                  <StatusBadge status={c.status} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-700">Department Performance</h3>
            <Button size="sm" variant="outline" onClick={() => onNavigate("departments")}>View All</Button>
          </div>
          <div className="space-y-3">
            {deptStats.filter(d => d.assignedCount > 0).map((d) => {
              const pct = d.assignedCount > 0 ? Math.round((d.resolvedCount / d.assignedCount) * 100) : 0;
              return (
                <div key={d.id} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600 font-medium truncate mr-2">{d.name}</span>
                    <span className="text-slate-500 text-xs flex-shrink-0">{d.resolvedCount}/{d.assignedCount}</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100">
            <h4 className="font-semibold text-slate-700 text-sm mb-3">Recent Service Requests</h4>
            {recentServices.map((sr) => (
              <div key={sr.id} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                <div className="flex-1 min-w-0 mr-2">
                  <p className="text-sm text-slate-700 truncate font-medium">{sr.serviceType}</p>
                  <p className="text-xs text-slate-400">{sr.id} · {sr.citizenName}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-medium flex-shrink-0 ${
                  sr.status === "Completed" ? "bg-green-100 text-green-700" :
                  sr.status === "In Progress" ? "bg-blue-100 text-blue-700" :
                  sr.status === "Assigned" ? "bg-purple-100 text-purple-700" :
                  "bg-slate-100 text-slate-600"
                }`}>{sr.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
        <h3 className="font-semibold text-slate-700 mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          <Button onClick={() => onNavigate("register-complaint")} className="bg-blue-600 hover:bg-blue-700">
            <FileText className="w-4 h-4 mr-2" /> Register Complaint
          </Button>
          <Button onClick={() => onNavigate("complaints")} variant="outline">
            <Activity className="w-4 h-4 mr-2" /> Manage Complaints
          </Button>
          <Button onClick={() => onNavigate("services")} variant="outline">
            <Wrench className="w-4 h-4 mr-2" /> Service Requests
          </Button>
          <Button onClick={() => onNavigate("reports")} variant="outline">
            <BarChart2 className="w-4 h-4 mr-2" /> View Reports
          </Button>
          <Button onClick={() => onNavigate("citizens")} variant="outline">
            <FileText className="w-4 h-4 mr-2" /> Manage Citizens
          </Button>
        </div>
      </div>
    </div>
  );
}
