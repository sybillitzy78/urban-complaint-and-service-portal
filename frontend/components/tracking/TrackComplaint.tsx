import { useState } from "react";
import { Search, CheckCircle2, Circle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import StatusBadge from "../shared/StatusBadge";
import PriorityBadge from "../shared/PriorityBadge";
import type { AppState, Complaint, ComplaintStatus } from "../../types";

const STATUSES: ComplaintStatus[] = ["Submitted", "Under Review", "Assigned", "In Progress", "Resolved", "Closed"];

interface TrackComplaintProps {
  state: AppState;
}

export default function TrackComplaint({ state }: TrackComplaintProps) {
  const [query, setQuery] = useState("");
  const [found, setFound] = useState<Complaint | null | undefined>(undefined);

  function handleSearch() {
    const q = query.trim().toUpperCase();
    if (!q) return;
    const result = state.complaints.find((c) => c.id.toUpperCase() === q);
    setFound(result || null);
  }

  const statusIdx = found ? STATUSES.indexOf(found.status) : -1;

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Track Complaint</h2>
        <p className="text-slate-500 text-sm mt-1">Enter your Complaint ID to check the current status</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Enter Complaint ID (e.g. CMP-001)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="pl-9 font-mono"
            />
          </div>
          <Button onClick={handleSearch} className="bg-blue-600 hover:bg-blue-700">Track</Button>
        </div>
        <p className="text-xs text-slate-400 mt-2">Example IDs: CMP-001, CMP-002, CMP-003</p>
      </div>

      {found === null && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="text-red-700 font-semibold">Complaint not found</p>
          <p className="text-red-500 text-sm mt-1">No complaint with ID "{query}" was found. Please check the ID and try again.</p>
        </div>
      )}

      {found && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="font-mono text-lg font-bold text-blue-600">{found.id}</span>
              <StatusBadge status={found.status} />
              <PriorityBadge priority={found.priority} />
            </div>
            <h3 className="text-xl font-semibold text-slate-800 mb-2">{found.title}</h3>
            <p className="text-slate-500 text-sm">{found.description}</p>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-5">
              {[
                ["Citizen", found.citizenName],
                ["Category", found.category],
                ["Location", found.location],
                ["Ward", found.ward],
                ["Filed On", new Date(found.createdAt).toLocaleDateString()],
                ["Last Updated", new Date(found.updatedAt).toLocaleDateString()],
                ["Department", found.departmentName || "Not yet assigned"],
                ...(found.resolvedAt ? [["Resolved On", new Date(found.resolvedAt).toLocaleDateString()]] : []),
              ].map(([l, v]) => (
                <div key={l} className="bg-slate-50 rounded-lg p-3">
                  <p className="text-slate-400 text-xs mb-0.5">{l}</p>
                  <p className="font-medium text-slate-700 text-sm">{v}</p>
                </div>
              ))}
            </div>

            {found.resolutionRemarks && (
              <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm font-semibold text-green-700 mb-1">Resolution Remarks</p>
                <p className="text-sm text-green-600">{found.resolutionRemarks}</p>
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <h4 className="font-semibold text-slate-700 mb-4">Status Timeline</h4>
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-slate-200" />
              <div className="space-y-4">
                {STATUSES.map((s, i) => {
                  const past = i < statusIdx;
                  const current = i === statusIdx;
                  const future = i > statusIdx;
                  const histEntry = found.history.find((h) => h.status === s);
                  return (
                    <div key={s} className="flex gap-4 items-start pl-2">
                      <div className={`relative z-10 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${current ? "bg-blue-600 ring-4 ring-blue-100" : past ? "bg-green-500" : "bg-slate-200"}`}>
                        {past ? <CheckCircle2 className="w-3.5 h-3.5 text-white" /> : current ? <Circle className="w-3.5 h-3.5 text-white fill-white" /> : <Clock className="w-3 h-3 text-slate-400" />}
                      </div>
                      <div className={`pb-2 ${future ? "opacity-40" : ""}`}>
                        <p className={`font-semibold text-sm ${current ? "text-blue-600" : past ? "text-green-600" : "text-slate-400"}`}>{s}</p>
                        {histEntry && (
                          <>
                            <p className="text-xs text-slate-500 mt-0.5">{histEntry.note}</p>
                            <p className="text-xs text-slate-400">{new Date(histEntry.date).toLocaleString()} · {histEntry.updatedBy}</p>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
