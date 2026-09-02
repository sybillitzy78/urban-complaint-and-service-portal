import {
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import StatsCard from "../dashboard/StatsCard";
import { FileText, CheckCircle, Clock, Timer } from "lucide-react";
import type { AppState } from "../../types";
import {
  getComplaintStats, getAvgResolutionTime, getCategoryData,
  getStatusData, getPriorityData, getMonthlyData, getDepartmentStats,
} from "../../store/dataStore";

const COLORS = ["#3b82f6", "#22c55e", "#f59e0b", "#f97316", "#8b5cf6", "#06b6d4", "#ec4899", "#10b981"];

interface ReportsProps {
  state: AppState;
}

export default function Reports({ state }: ReportsProps) {
  const stats = getComplaintStats(state.complaints);
  const avgTime = getAvgResolutionTime(state.complaints);
  const categoryData = getCategoryData(state.complaints);
  const statusData = getStatusData(state.complaints).filter((d) => d.value > 0);
  const priorityData = getPriorityData(state.complaints);
  const monthlyData = getMonthlyData(state.complaints);
  const deptStats = getDepartmentStats(state.departments, state.complaints);

  const deptPerformance = deptStats
    .filter((d) => d.assignedCount > 0)
    .map((d) => ({
      name: d.name.split(" ")[0],
      fullName: d.name,
      assigned: d.assignedCount,
      resolved: d.resolvedCount,
      pending: d.pendingCount,
      rate: d.assignedCount > 0 ? Math.round((d.resolvedCount / d.assignedCount) * 100) : 0,
    }));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Reports & Analytics</h2>
        <p className="text-slate-500 text-sm mt-1">Comprehensive performance metrics and analytics</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Total Complaints" value={stats.total} icon={FileText} color="blue" />
        <StatsCard title="Resolved" value={stats.resolved} icon={CheckCircle} color="green" />
        <StatsCard title="Pending" value={stats.pending} icon={Clock} color="yellow" />
        <StatsCard title="Avg. Resolution" value={avgTime} icon={Timer} color="purple" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <h3 className="font-semibold text-slate-700 mb-4">Complaints by Category</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} angle={-20} textAnchor="end" height={50} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Complaints" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <h3 className="font-semibold text-slate-700 mb-4">Status Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine fontSize={10}>
                {statusData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <h3 className="font-semibold text-slate-700 mb-4">Priority Distribution</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={priorityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="value" radius={[4, 4, 0, 0]} name="Count">
                {priorityData.map((_, i) => <Cell key={i} fill={["#94a3b8", "#3b82f6", "#f97316", "#ef4444"][i]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <h3 className="font-semibold text-slate-700 mb-4">Monthly Complaint Trends</h3>
          <ResponsiveContainer width="100%" height={220}>
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

      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
        <h3 className="font-semibold text-slate-700 mb-4">Department Resolution Performance</h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={deptPerformance} margin={{ left: 10, bottom: 30 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" tick={{ fontSize: 10 }} angle={-15} textAnchor="end" height={55} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip formatter={(value, name) => [value, name === "assigned" ? "Total Assigned" : name === "resolved" ? "Resolved" : "Pending"]} />
            <Legend />
            <Bar dataKey="assigned" fill="#3b82f6" radius={[4, 4, 0, 0]} name="assigned" />
            <Bar dataKey="resolved" fill="#22c55e" radius={[4, 4, 0, 0]} name="resolved" />
            <Bar dataKey="pending" fill="#f97316" radius={[4, 4, 0, 0]} name="pending" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <h3 className="font-semibold text-slate-700">Department Resolution Rate Summary</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Department</th>
                <th className="text-center px-4 py-3 font-semibold text-slate-600">Assigned</th>
                <th className="text-center px-4 py-3 font-semibold text-slate-600">Resolved</th>
                <th className="text-center px-4 py-3 font-semibold text-slate-600">Pending</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Resolution Rate</th>
              </tr>
            </thead>
            <tbody>
              {deptStats.map((d) => {
                const pct = d.assignedCount > 0 ? Math.round((d.resolvedCount / d.assignedCount) * 100) : 0;
                return (
                  <tr key={d.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-700">{d.name}</td>
                    <td className="px-4 py-3 text-center font-bold text-blue-600">{d.assignedCount}</td>
                    <td className="px-4 py-3 text-center font-bold text-green-600">{d.resolvedCount}</td>
                    <td className="px-4 py-3 text-center font-bold text-orange-500">{d.pendingCount}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${pct >= 75 ? "bg-green-500" : pct >= 40 ? "bg-blue-500" : "bg-orange-400"}`} style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-xs text-slate-500 w-10 text-right">{pct}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
