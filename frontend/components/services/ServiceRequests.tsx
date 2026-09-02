import { useState } from "react";
import { Wrench, Plus, Search, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import StatusBadge from "../shared/StatusBadge";
import PriorityBadge from "../shared/PriorityBadge";
import type { AppState, ServiceRequest, ServiceType, Priority, ServiceStatus } from "../../types";
import { generateId, addNotification } from "../../store/dataStore";

interface ServiceRequestsProps {
  state: AppState;
  onUpdate: (state: AppState) => void;
  role: string;
}

const SERVICE_TYPES: ServiceType[] = ["Road Repair", "Water Connection", "Garbage Collection", "Drain Cleaning", "Street Light Installation", "Sanitation Service", "Tree Trimming", "Other"];
const PRIORITIES: Priority[] = ["Low", "Medium", "High", "Critical"];
const STATUSES: ServiceStatus[] = ["Pending", "Assigned", "In Progress", "Completed", "Cancelled"];
const WARDS = ["Ward 1", "Ward 2", "Ward 3", "Ward 4", "Ward 5", "Ward 6"];

const emptyForm = {
  citizenId: "", citizenName: "", serviceType: "Road Repair" as ServiceType,
  description: "", location: "", ward: "Ward 1", priority: "Medium" as Priority,
  departmentId: "",
};

export default function ServiceRequests({ state, onUpdate, role }: ServiceRequestsProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [open, setOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState<ServiceRequest | null>(null);
  const [form, setForm] = useState({ ...emptyForm });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [editStatus, setEditStatus] = useState<ServiceStatus>("Pending");
  const { toast } = useToast();

  function setF(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: "" }));
  }

  function validate() {
    const e: Record<string, string> = {};
    if (!form.citizenName.trim()) e.citizenName = "Citizen name is required";
    if (!form.description.trim()) e.description = "Description is required";
    if (!form.location.trim()) e.location = "Location is required";
    return e;
  }

  function handleSubmit() {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    const dept = state.departments.find((d) => d.id === form.departmentId);
    const sr: ServiceRequest = {
      id: generateId("SRQ", state.serviceRequests),
      citizenId: form.citizenId.trim() || "CIT-000",
      citizenName: form.citizenName.trim(),
      serviceType: form.serviceType,
      description: form.description.trim(),
      location: form.location.trim(),
      requestDate: new Date().toISOString().split("T")[0],
      priority: form.priority,
      departmentId: form.departmentId,
      departmentName: dept?.name || "",
      status: "Pending",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    let newState = { ...state, serviceRequests: [...state.serviceRequests, sr] };
    newState = addNotification(newState, "New Service Request", `${sr.id} submitted by ${sr.citizenName}.`, "info");
    onUpdate(newState);
    setOpen(false);
    setForm({ ...emptyForm });
    setErrors({});
    toast({ title: "Service Request Submitted", description: `Your request has been registered with ID: ${sr.id}` });
  }

  function handleStatusUpdate() {
    if (!detailOpen) return;
    const now = new Date().toISOString();
    const updated: ServiceRequest = { ...detailOpen, status: editStatus, updatedAt: now };
    let newState = { ...state, serviceRequests: state.serviceRequests.map((s) => s.id === detailOpen.id ? updated : s) };
    newState = addNotification(newState, "Service Request Updated", `${detailOpen.id} status changed to ${editStatus}.`, "info");
    onUpdate(newState);
    setDetailOpen(null);
    toast({ title: "Status Updated", description: `Service request status changed to ${editStatus}.` });
  }

  const filtered = state.serviceRequests.filter((sr) => {
    const q = search.toLowerCase();
    const matchSearch = !q || sr.id.toLowerCase().includes(q) || sr.citizenName.toLowerCase().includes(q) || sr.serviceType.toLowerCase().includes(q);
    const matchStatus = statusFilter === "All" || sr.status === statusFilter;
    return matchSearch && matchStatus;
  }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Service Requests</h2>
          <p className="text-slate-500 text-sm mt-1">Submit and manage municipal service requests</p>
        </div>
        <Button onClick={() => setOpen(true)} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" /> New Request
        </Button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="p-4 border-b border-slate-100 flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input placeholder="Search requests..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
          </div>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="rounded-md border border-input bg-background px-3 py-2 text-sm">
            <option value="All">All Statuses</option>
            {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <span className="text-sm text-slate-500">{filtered.length} requests</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left px-4 py-3 font-semibold text-slate-600">ID</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Citizen</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Service Type</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600 hidden md:table-cell">Location</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600 hidden lg:table-cell">Department</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Priority</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Status</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((sr) => (
                <tr key={sr.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3">
                    <span className="font-mono text-xs bg-cyan-50 text-cyan-700 px-2 py-0.5 rounded">{sr.id}</span>
                  </td>
                  <td className="px-4 py-3 font-medium text-slate-700">{sr.citizenName}</td>
                  <td className="px-4 py-3 text-slate-600">{sr.serviceType}</td>
                  <td className="px-4 py-3 text-slate-500 hidden md:table-cell max-w-[120px] truncate">{sr.location}</td>
                  <td className="px-4 py-3 text-slate-500 hidden lg:table-cell">
                    {sr.departmentName || <span className="text-slate-300 italic">Unassigned</span>}
                  </td>
                  <td className="px-4 py-3"><PriorityBadge priority={sr.priority} /></td>
                  <td className="px-4 py-3"><StatusBadge status={sr.status} /></td>
                  <td className="px-4 py-3">
                    <Button size="sm" variant="outline" onClick={() => { setDetailOpen(sr); setEditStatus(sr.status); }}>
                      <Eye className="w-3 h-3 mr-1" /> View
                    </Button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={8} className="px-4 py-8 text-center text-slate-400">No service requests found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>New Service Request</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>Citizen Name <span className="text-red-500">*</span></Label>
                <Input value={form.citizenName} onChange={(e) => setF("citizenName", e.target.value)} placeholder="Full name" />
                {errors.citizenName && <p className="text-xs text-red-500">{errors.citizenName}</p>}
              </div>
              <div className="space-y-1">
                <Label>Citizen ID (optional)</Label>
                <Input value={form.citizenId} onChange={(e) => setF("citizenId", e.target.value)} placeholder="e.g. CIT-001" />
              </div>
            </div>
            <div className="space-y-1">
              <Label>Service Type <span className="text-red-500">*</span></Label>
              <select value={form.serviceType} onChange={(e) => setF("serviceType", e.target.value)} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                {SERVICE_TYPES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <Label>Description <span className="text-red-500">*</span></Label>
              <Textarea value={form.description} onChange={(e) => setF("description", e.target.value)} rows={3} placeholder="Describe the service needed..." />
              {errors.description && <p className="text-xs text-red-500">{errors.description}</p>}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>Location <span className="text-red-500">*</span></Label>
                <Input value={form.location} onChange={(e) => setF("location", e.target.value)} placeholder="Address / Area" />
                {errors.location && <p className="text-xs text-red-500">{errors.location}</p>}
              </div>
              <div className="space-y-1">
                <Label>Ward</Label>
                <select value={form.ward} onChange={(e) => setF("ward", e.target.value)} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                  {WARDS.map((w) => <option key={w} value={w}>{w}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <Label>Priority</Label>
                <select value={form.priority} onChange={(e) => setF("priority", e.target.value)} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                  {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <Label>Assign Department</Label>
                <select value={form.departmentId} onChange={(e) => setF("departmentId", e.target.value)} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                  <option value="">— Select —</option>
                  {state.departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
                </select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setOpen(false); setErrors({}); }}>Cancel</Button>
            <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700">Submit Request</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {detailOpen && (
        <Dialog open={!!detailOpen} onOpenChange={() => setDetailOpen(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <span className="font-mono text-cyan-600">{detailOpen.id}</span>
                <StatusBadge status={detailOpen.status} />
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                {[
                  ["Citizen", detailOpen.citizenName],
                  ["Service Type", detailOpen.serviceType],
                  ["Location", detailOpen.location],
                  ["Priority", detailOpen.priority],
                  ["Department", detailOpen.departmentName || "Unassigned"],
                  ["Request Date", new Date(detailOpen.requestDate).toLocaleDateString()],
                ].map(([l, v]) => (
                  <div key={l} className="bg-slate-50 rounded-lg p-3">
                    <p className="text-slate-400 text-xs">{l}</p>
                    <p className="font-medium text-slate-700 text-xs">{v}</p>
                  </div>
                ))}
              </div>
              <div className="bg-slate-50 rounded-lg p-3 text-sm">
                <p className="text-slate-400 text-xs mb-1">Description</p>
                <p className="text-slate-700">{detailOpen.description}</p>
              </div>
              {role === "admin" && (
                <div className="space-y-1">
                  <Label>Update Status</Label>
                  <select value={editStatus} onChange={(e) => setEditStatus(e.target.value as ServiceStatus)} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                    {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDetailOpen(null)}>Close</Button>
              {role === "admin" && <Button onClick={handleStatusUpdate} className="bg-blue-600 hover:bg-blue-700">Update Status</Button>}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
