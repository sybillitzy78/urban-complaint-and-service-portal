import { useState } from "react";
import { GitCompare, AlertTriangle, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import StatusBadge from "../shared/StatusBadge";
import PriorityBadge from "../shared/PriorityBadge";
import type { AppState, Complaint, Priority } from "../../types";

const PRIORITY_WEIGHT: Record<Priority, number> = { Low: 1, Medium: 2, High: 3, Critical: 4 };

interface CompareComplaintsProps {
  state: AppState;
}

export default function CompareComplaints({ state }: CompareComplaintsProps) {
  const [id1, setId1] = useState("");
  const [id2, setId2] = useState("");
  const [c1, setC1] = useState<Complaint | null>(null);
  const [c2, setC2] = useState<Complaint | null>(null);
  const [error, setError] = useState("");

  function handleCompare() {
    setError("");
    const a = state.complaints.find((c) => c.id.toUpperCase() === id1.trim().toUpperCase());
    const b = state.complaints.find((c) => c.id.toUpperCase() === id2.trim().toUpperCase());
    if (!a || !b) { setError("One or both complaint IDs not found. Please check and try again."); return; }
    if (a.id === b.id) { setError("Please enter two different complaint IDs."); return; }
    setC1(a);
    setC2(b);
  }

  function getResolutionHours(c: Complaint): number | null {
    if (!c.resolvedAt) return null;
    return (new Date(c.resolvedAt).getTime() - new Date(c.createdAt).getTime()) / (1000 * 60 * 60);
  }

  const p1 = c1 ? PRIORITY_WEIGHT[c1.priority] : 0;
  const p2 = c2 ? PRIORITY_WEIGHT[c2.priority] : 0;
  const r1 = c1 ? getResolutionHours(c1) : null;
  const r2 = c2 ? getResolutionHours(c2) : null;

  const higherPriority = p1 > p2 ? c1 : p2 > p1 ? c2 : null;
  const fasterResolved = r1 !== null && r2 !== null ? (r1 < r2 ? c1 : r2 < r1 ? c2 : null) : null;

  function ComparisonRow({ label, v1, v2, highlight1, highlight2 }: { label: string; v1: React.ReactNode; v2: React.ReactNode; highlight1?: boolean; highlight2?: boolean }) {
    return (
      <tr className="border-b border-slate-100">
        <td className="px-4 py-3 text-center text-sm">
          <div className={`${highlight1 ? "font-semibold text-blue-700 bg-blue-50 rounded-lg px-2 py-1 inline-block" : "text-slate-600"}`}>{v1}</div>
        </td>
        <td className="px-4 py-3 text-center font-medium text-slate-500 text-xs bg-slate-50">{label}</td>
        <td className="px-4 py-3 text-center text-sm">
          <div className={`${highlight2 ? "font-semibold text-green-700 bg-green-50 rounded-lg px-2 py-1 inline-block" : "text-slate-600"}`}>{v2}</div>
        </td>
      </tr>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Compare Complaints</h2>
        <p className="text-slate-500 text-sm mt-1">Compare two complaints side by side</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <div className="flex flex-wrap gap-3 items-end">
          <div className="flex-1 min-w-[180px] space-y-1">
            <label className="text-sm font-medium text-slate-600">Complaint ID #1</label>
            <input
              value={id1}
              onChange={(e) => setId1(e.target.value)}
              placeholder="e.g. CMP-001"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono"
            />
          </div>
          <div className="flex items-center justify-center w-8">
            <GitCompare className="w-5 h-5 text-slate-400" />
          </div>
          <div className="flex-1 min-w-[180px] space-y-1">
            <label className="text-sm font-medium text-slate-600">Complaint ID #2</label>
            <input
              value={id2}
              onChange={(e) => setId2(e.target.value)}
              placeholder="e.g. CMP-002"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono"
            />
          </div>
          <Button onClick={handleCompare} className="bg-blue-600 hover:bg-blue-700">
            Compare
          </Button>
        </div>
        {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
        <div className="flex flex-wrap gap-2 mt-3">
          <p className="text-xs text-slate-400">Available IDs: </p>
          {state.complaints.slice(0, 8).map((c) => (
            <span key={c.id} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono cursor-pointer hover:bg-blue-100 hover:text-blue-700 transition-colors" onClick={() => { if (!id1 || id1 === c.id) setId1(c.id); else setId2(c.id); }}>{c.id}</span>
          ))}
        </div>
      </div>

      {c1 && c2 && (
        <div className="space-y-4">
          {(higherPriority || fasterResolved) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {higherPriority && (
                <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 flex items-center gap-3">
                  <AlertTriangle className="w-6 h-6 text-orange-500 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-orange-700">Higher Priority Complaint</p>
                    <p className="text-sm text-orange-600"><span className="font-mono font-bold">{higherPriority.id}</span> has higher priority ({higherPriority.priority})</p>
                  </div>
                </div>
              )}
              {higherPriority === null && (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center gap-3">
                  <AlertTriangle className="w-6 h-6 text-slate-400 flex-shrink-0" />
                  <p className="text-slate-600 text-sm">Both complaints have equal priority ({c1.priority})</p>
                </div>
              )}
              {fasterResolved && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
                  <Zap className="w-6 h-6 text-green-500 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-green-700">Faster Resolution</p>
                    <p className="text-sm text-green-600"><span className="font-mono font-bold">{fasterResolved.id}</span> was resolved faster ({Math.round((fasterResolved.id === c1.id ? r1! : r2!)).toFixed(0)}h)</p>
                  </div>
                </div>
              )}
              {r1 === null && r2 === null && (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center gap-3">
                  <Zap className="w-6 h-6 text-slate-400 flex-shrink-0" />
                  <p className="text-slate-600 text-sm">Neither complaint has been resolved yet</p>
                </div>
              )}
            </div>
          )}

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="grid grid-cols-3 bg-blue-600 text-white">
              <div className="p-4 text-center">
                <p className="font-mono font-bold">{c1.id}</p>
                <p className="text-blue-200 text-xs mt-0.5 truncate">{c1.title}</p>
              </div>
              <div className="p-4 text-center text-blue-200 text-sm font-medium bg-blue-700">Comparison</div>
              <div className="p-4 text-center">
                <p className="font-mono font-bold">{c2.id}</p>
                <p className="text-blue-200 text-xs mt-0.5 truncate">{c2.title}</p>
              </div>
            </div>
            <table className="w-full text-sm">
              <tbody>
                <ComparisonRow label="Category" v1={c1.category} v2={c2.category} />
                <ComparisonRow
                  label="Priority"
                  v1={<PriorityBadge priority={c1.priority} />}
                  v2={<PriorityBadge priority={c2.priority} />}
                  highlight1={p1 > p2}
                  highlight2={p2 > p1}
                />
                <ComparisonRow label="Status" v1={<StatusBadge status={c1.status} />} v2={<StatusBadge status={c2.status} />} />
                <ComparisonRow label="Location" v1={c1.location} v2={c2.location} />
                <ComparisonRow label="Ward" v1={c1.ward} v2={c2.ward} />
                <ComparisonRow label="Department" v1={c1.departmentName || "Unassigned"} v2={c2.departmentName || "Unassigned"} />
                <ComparisonRow label="Filed On" v1={new Date(c1.createdAt).toLocaleDateString()} v2={new Date(c2.createdAt).toLocaleDateString()} />
                <ComparisonRow
                  label="Resolution Time"
                  v1={r1 !== null ? (r1 < 24 ? `${Math.round(r1)}h` : `${Math.round(r1 / 24)}d`) : "Not resolved"}
                  v2={r2 !== null ? (r2 < 24 ? `${Math.round(r2)}h` : `${Math.round(r2 / 24)}d`) : "Not resolved"}
                  highlight1={r1 !== null && r2 !== null && r1 < r2}
                  highlight2={r1 !== null && r2 !== null && r2 < r1}
                />
                <ComparisonRow label="Citizen" v1={c1.citizenName} v2={c2.citizenName} />
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
