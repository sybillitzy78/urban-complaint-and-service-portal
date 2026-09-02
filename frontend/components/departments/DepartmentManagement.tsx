import { Building2, Users, CheckCircle, Clock } from "lucide-react";
import { getDepartmentStats } from "../../store/dataStore";
import type { AppState } from "../../types";

interface DepartmentManagementProps {
  state: AppState;
}

export default function DepartmentManagement({ state }: DepartmentManagementProps) {
  const deptStats = getDepartmentStats(state.departments, state.complaints);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Department Management</h2>
        <p className="text-slate-500 text-sm mt-1">Overview of departments and their complaint handling performance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {deptStats.map((dept) => {
          const pct = dept.assignedCount > 0 ? Math.round((dept.resolvedCount / dept.assignedCount) * 100) : 0;
          return (
            <div key={dept.id} className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                  <Building2 className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-slate-800 text-sm leading-tight">{dept.name}</h3>
                  <p className="text-xs text-slate-400 mt-0.5 font-mono">{dept.id}</p>
                </div>
              </div>

              <div className="space-y-2 text-sm mb-4">
                <div className="flex items-center gap-2 text-slate-600">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-medium">Officer:</span> {dept.officer}
                </div>
                <div className="text-slate-500 text-xs ml-5">{dept.contact}</div>
                <div className="text-slate-500 text-xs ml-5">{dept.email}</div>
              </div>

              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="text-center bg-blue-50 rounded-lg p-2">
                  <p className="text-lg font-bold text-blue-600">{dept.assignedCount}</p>
                  <p className="text-xs text-slate-500">Total</p>
                </div>
                <div className="text-center bg-orange-50 rounded-lg p-2">
                  <p className="text-lg font-bold text-orange-500">{dept.pendingCount}</p>
                  <p className="text-xs text-slate-500">Pending</p>
                </div>
                <div className="text-center bg-green-50 rounded-lg p-2">
                  <p className="text-lg font-bold text-green-600">{dept.resolvedCount}</p>
                  <p className="text-xs text-slate-500">Resolved</p>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs text-slate-500">
                  <span>Resolution Rate</span>
                  <span className="font-semibold">{pct}%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${pct >= 75 ? "bg-green-500" : pct >= 40 ? "bg-blue-500" : "bg-orange-400"}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <h3 className="font-semibold text-slate-700">Department Summary Table</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Dept ID</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Department</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600 hidden md:table-cell">Officer</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600 hidden lg:table-cell">Contact</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600 text-center">Assigned</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600 text-center hidden md:table-cell">Pending</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600 text-center hidden md:table-cell">Resolved</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600 hidden lg:table-cell">Rate</th>
              </tr>
            </thead>
            <tbody>
              {deptStats.map((d) => {
                const pct = d.assignedCount > 0 ? Math.round((d.resolvedCount / d.assignedCount) * 100) : 0;
                return (
                  <tr key={d.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3">
                      <span className="font-mono text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded">{d.id}</span>
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-700">{d.name}</td>
                    <td className="px-4 py-3 text-slate-500 hidden md:table-cell">{d.officer}</td>
                    <td className="px-4 py-3 text-slate-500 hidden lg:table-cell">{d.contact}</td>
                    <td className="px-4 py-3 text-center">
                      <span className="font-bold text-blue-600">{d.assignedCount}</span>
                    </td>
                    <td className="px-4 py-3 text-center hidden md:table-cell">
                      <span className="font-bold text-orange-500">{d.pendingCount}</span>
                    </td>
                    <td className="px-4 py-3 text-center hidden md:table-cell">
                      <span className="font-bold text-green-600">{d.resolvedCount}</span>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${pct >= 75 ? "bg-green-500" : pct >= 40 ? "bg-blue-500" : "bg-orange-400"}`} style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-xs text-slate-500 w-8 text-right">{pct}%</span>
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
