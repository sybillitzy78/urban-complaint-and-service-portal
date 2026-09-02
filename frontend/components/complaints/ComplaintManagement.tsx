import { useState } from "react";
import { Search, Filter, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import StatusBadge from "../shared/StatusBadge";
import PriorityBadge from "../shared/PriorityBadge";
import ComplaintDetails from "./ComplaintDetails";
import type { AppState, Complaint, ComplaintStatus, ComplaintCategory, Priority } from "../../types";

interface ComplaintManagementProps {
  state: AppState;
  onUpdate: (state: AppState) => void;
}

const ALL = "All";
const STATUSES: (ComplaintStatus | typeof ALL)[] = [ALL, "Submitted", "Under Review", "Assigned", "In Progress", "Resolved", "Closed"];
const CATEGORIES: (ComplaintCategory | typeof ALL)[] = [ALL, "Road Damage", "Water Supply", "Waste Management", "Drainage", "Streetlight", "Public Sanitation", "Traffic", "Other"];
const PRIORITIES: (Priority | typeof ALL)[] = [ALL, "Low", "Medium", "High", "Critical"];

export default function ComplaintManagement({ state, onUpdate }: ComplaintManagementProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>(ALL);
  const [catFilter, setCatFilter] = useState<string>(ALL);
  const [priorityFilter, setPriorityFilter] = useState<string>(ALL);
  const [deptFilter, setDeptFilter] = useState<string>(ALL);
  const [selected, setSelected] = useState<Complaint | null>(null);

  const filtered = state.complaints.filter((c) => {
    const q = search.toLowerCase();
    const matchSearch = !q || c.id.toLowerCase().includes(q) || c.citizenName.toLowerCase().includes(q) || c.title.toLowerCase().includes(q) || c.location.toLowerCase().includes(q);
    const matchStatus = statusFilter === ALL || c.status === statusFilter;
    const matchCat = catFilter === ALL || c.category === catFilter;
    const matchPriority = priorityFilter === ALL || c.priority === priorityFilter;
    const matchDept = deptFilter === ALL || c.departmentName === deptFilter || (deptFilter === "Unassigned" && !c.departmentId);
    return matchSearch && matchStatus && matchCat && matchPriority && matchDept;
  }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const deptOptions = [ALL, "Unassigned", ...state.departments.map((d) => d.name)];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Complaint Management</h2>
        <p className="text-slate-500 text-sm mt-1">View, assign, and manage all complaints</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="p-4 border-b border-slate-100 space-y-3">
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input placeholder="Search complaints..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
            </div>
            <div className="flex items-center gap-1 text-slate-500 text-sm">
              <Filter className="w-4 h-4" />
              <span>{filtered.length} result{filtered.length !== 1 ? "s" : ""}</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {([
              { label: "Status", value: statusFilter, opts: STATUSES, set: setStatusFilter },
              { label: "Category", value: catFilter, opts: CATEGORIES, set: setCatFilter },
              { label: "Priority", value: priorityFilter, opts: PRIORITIES, set: setPriorityFilter },
              { label: "Department", value: deptFilter, opts: deptOptions, set: setDeptFilter },
            ] as const).map((f) => (
              <select
                key={f.label}
                value={f.value}
                onChange={(e) => f.set(e.target.value)}
                className="rounded-md border border-input bg-background px-3 py-1.5 text-sm"
              >
                {f.opts.map((o) => <option key={String(o)} value={String(o)}>{o === ALL ? `All ${f.label}s` : String(o)}</option>)}
              </select>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left px-4 py-3 font-semibold text-slate-600">ID</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Title</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600 hidden md:table-cell">Category</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600 hidden lg:table-cell">Citizen</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600 hidden xl:table-cell">Department</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Priority</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Status</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600 hidden lg:table-cell">Date</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3">
                    <span className="font-mono text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded">{c.id}</span>
                  </td>
                  <td className="px-4 py-3 font-medium text-slate-700 max-w-[180px] truncate">{c.title}</td>
                  <td className="px-4 py-3 text-slate-500 hidden md:table-cell">{c.category}</td>
                  <td className="px-4 py-3 text-slate-500 hidden lg:table-cell">{c.citizenName}</td>
                  <td className="px-4 py-3 text-slate-500 hidden xl:table-cell">
                    {c.departmentName || <span className="text-slate-300 italic">Unassigned</span>}
                  </td>
                  <td className="px-4 py-3"><PriorityBadge priority={c.priority} /></td>
                  <td className="px-4 py-3"><StatusBadge status={c.status} /></td>
                  <td className="px-4 py-3 text-slate-400 text-xs hidden lg:table-cell">
                    {new Date(c.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <Button size="sm" variant="outline" onClick={() => setSelected(c)}>
                      <Eye className="w-3 h-3 mr-1" /> View
                    </Button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-slate-400">No complaints found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selected && (
        <ComplaintDetails
          complaint={selected}
          open={!!selected}
          onClose={() => setSelected(null)}
          state={state}
          onUpdate={(s) => { onUpdate(s); setSelected(null); }}
        />
      )}
    </div>
  );
}
