import { useState } from "react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import StatusBadge from "../shared/StatusBadge";
import PriorityBadge from "../shared/PriorityBadge";
import type { Complaint, ComplaintStatus, Priority, AppState, Department } from "../../types";
import { addNotification } from "../../store/dataStore";
import { CheckCircle2, Clock, Circle } from "lucide-react";

const STATUSES: ComplaintStatus[] = ["Submitted", "Under Review", "Assigned", "In Progress", "Resolved", "Closed"];
const PRIORITIES: Priority[] = ["Low", "Medium", "High", "Critical"];

interface ComplaintDetailsProps {
  complaint: Complaint;
  open: boolean;
  onClose: () => void;
  state: AppState;
  onUpdate: (state: AppState) => void;
  readOnly?: boolean;
}

export default function ComplaintDetails({ complaint, open, onClose, state, onUpdate, readOnly }: ComplaintDetailsProps) {
  const [editStatus, setEditStatus] = useState<ComplaintStatus>(complaint.status);
  const [editPriority, setEditPriority] = useState<Priority>(complaint.priority);
  const [editDept, setEditDept] = useState(complaint.departmentId);
  const [remarks, setRemarks] = useState(complaint.resolutionRemarks);
  const [saving, setSaving] = useState(false);

  const dept = state.departments.find((d) => d.id === editDept);

  function handleSave() {
    setSaving(true);
    const now = new Date().toISOString();
    const statusChanged = editStatus !== complaint.status;
    const updated: Complaint = {
      ...complaint,
      status: editStatus,
      priority: editPriority,
      departmentId: editDept,
      departmentName: dept?.name || complaint.departmentName,
      resolutionRemarks: remarks,
      updatedAt: now,
      resolvedAt: editStatus === "Resolved" && !complaint.resolvedAt ? now : complaint.resolvedAt,
      history: statusChanged
        ? [...complaint.history, { date: now, status: editStatus, note: remarks || `Status updated to ${editStatus}`, updatedBy: "Admin" }]
        : complaint.history,
    };
    let newState = { ...state, complaints: state.complaints.map((c) => (c.id === complaint.id ? updated : c)) };
    if (statusChanged) {
      newState = addNotification(newState, "Complaint Status Updated", `${complaint.id} status changed to ${editStatus}.`, editStatus === "Resolved" ? "success" : "info");
    }
    onUpdate(newState);
    setSaving(false);
    onClose();
  }

  const statusIdx = STATUSES.indexOf(complaint.status);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <span className="font-mono text-blue-600">{complaint.id}</span>
            <StatusBadge status={complaint.status} />
            <PriorityBadge priority={complaint.priority} />
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          <div>
            <h3 className="text-lg font-semibold text-slate-800">{complaint.title}</h3>
            <p className="text-slate-500 text-sm mt-1">{complaint.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            {[
              ["Citizen", complaint.citizenName],
              ["Category", complaint.category],
              ["Location", complaint.location],
              ["Ward", complaint.ward],
              ["Date Filed", new Date(complaint.createdAt).toLocaleDateString()],
              ["Last Updated", new Date(complaint.updatedAt).toLocaleDateString()],
            ].map(([label, value]) => (
              <div key={label} className="bg-slate-50 rounded-lg p-3">
                <p className="text-slate-400 text-xs mb-0.5">{label}</p>
                <p className="font-medium text-slate-700">{value}</p>
              </div>
            ))}
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-600 mb-3">Progress Timeline</p>
            <div className="flex items-center gap-1 flex-wrap">
              {STATUSES.map((s, i) => {
                const past = i < statusIdx;
                const current = i === statusIdx;
                return (
                  <div key={s} className="flex items-center gap-1">
                    <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${current ? "bg-blue-100 text-blue-700" : past ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-400"}`}>
                      {current ? <Circle className="w-3 h-3 fill-blue-500 text-blue-500" /> : past ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                      {s}
                    </div>
                    {i < STATUSES.length - 1 && <span className="text-slate-300">→</span>}
                  </div>
                );
              })}
            </div>
          </div>

          {!readOnly && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t pt-4">
              <div className="space-y-1">
                <Label>Update Status</Label>
                <select value={editStatus} onChange={(e) => setEditStatus(e.target.value as ComplaintStatus)} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                  {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <Label>Update Priority</Label>
                <select value={editPriority} onChange={(e) => setEditPriority(e.target.value as Priority)} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                  {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <Label>Assign Department</Label>
                <select value={editDept} onChange={(e) => setEditDept(e.target.value)} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                  <option value="">— Unassigned —</option>
                  {state.departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
                </select>
              </div>
              <div className="space-y-1 md:col-span-3">
                <Label>Resolution Remarks</Label>
                <Textarea value={remarks} onChange={(e) => setRemarks(e.target.value)} rows={2} placeholder="Add resolution notes..." />
              </div>
            </div>
          )}

          <div className="border-t pt-4">
            <p className="text-sm font-semibold text-slate-600 mb-3">Complaint History</p>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {[...complaint.history].reverse().map((h, i) => (
                <div key={i} className="flex gap-3 text-sm">
                  <div className="w-2 h-2 rounded-full bg-blue-400 mt-1.5 flex-shrink-0" />
                  <div>
                    <div className="flex items-center gap-2">
                      <StatusBadge status={h.status} />
                      <span className="text-slate-400 text-xs">{new Date(h.date).toLocaleString()}</span>
                    </div>
                    <p className="text-slate-600 mt-0.5">{h.note}</p>
                    <p className="text-slate-400 text-xs">by {h.updatedBy}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Close</Button>
          {!readOnly && <Button onClick={handleSave} disabled={saving} className="bg-blue-600 hover:bg-blue-700">Save Changes</Button>}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
