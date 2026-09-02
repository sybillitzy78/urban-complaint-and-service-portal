import { useState } from "react";
import { FileText, Upload, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import type { AppState, Complaint, ComplaintCategory, Priority, ComplaintStatus } from "../../types";
import { generateId, addNotification } from "../../store/dataStore";

interface RegisterComplaintProps {
  state: AppState;
  onUpdate: (state: AppState) => void;
  role: string;
}

const CATEGORIES: ComplaintCategory[] = ["Road Damage", "Water Supply", "Waste Management", "Drainage", "Streetlight", "Public Sanitation", "Traffic", "Other"];
const PRIORITIES: Priority[] = ["Low", "Medium", "High", "Critical"];
const WARDS = ["Ward 1", "Ward 2", "Ward 3", "Ward 4", "Ward 5", "Ward 6"];

const emptyForm = {
  citizenId: "", citizenName: "", title: "", description: "",
  category: "Road Damage" as ComplaintCategory, location: "", ward: "Ward 1",
  priority: "Medium" as Priority, department: "",
};

export default function RegisterComplaint({ state, onUpdate }: RegisterComplaintProps) {
  const [form, setForm] = useState({ ...emptyForm });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState<string | null>(null);
  const { toast } = useToast();

  function set(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: "" }));
  }

  function validate() {
    const e: Record<string, string> = {};
    if (!form.citizenName.trim()) e.citizenName = "Citizen name is required";
    if (!form.title.trim()) e.title = "Complaint title is required";
    if (!form.description.trim()) e.description = "Description is required";
    if (form.description.trim().length < 20) e.description = "Description must be at least 20 characters";
    if (!form.location.trim()) e.location = "Location is required";
    return e;
  }

  function handleSubmit() {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }

    const today = new Date().toISOString().split("T")[0];
    const newComplaint: Complaint = {
      id: generateId("CMP", state.complaints),
      citizenId: form.citizenId.trim() || "CIT-000",
      citizenName: form.citizenName.trim(),
      title: form.title.trim(),
      description: form.description.trim(),
      category: form.category,
      location: form.location.trim(),
      ward: form.ward,
      date: today,
      priority: form.priority,
      status: "Submitted",
      departmentId: "",
      departmentName: "",
      resolutionRemarks: "",
      history: [
        { date: new Date().toISOString(), status: "Submitted", note: "Complaint registered by citizen.", updatedBy: "System" },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    let newState = { ...state, complaints: [...state.complaints, newComplaint] };
    newState = addNotification(newState, "New Complaint Registered", `${newComplaint.id} has been submitted by ${newComplaint.citizenName}.`, "info");
    onUpdate(newState);
    setSuccess(newComplaint.id);
    setForm({ ...emptyForm });
    toast({ title: "Complaint Submitted", description: `Your complaint has been registered with ID: ${newComplaint.id}` });
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Register Complaint</h2>
        <p className="text-slate-500 text-sm mt-1">Submit a new complaint or service issue</p>
      </div>

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
          <div>
            <p className="font-semibold text-green-800">Complaint Submitted Successfully!</p>
            <p className="text-sm text-green-600">Your Complaint ID is <span className="font-mono font-bold">{success}</span>. Use this to track your complaint.</p>
          </div>
          <Button size="sm" variant="outline" onClick={() => setSuccess(null)} className="ml-auto flex-shrink-0">New Complaint</Button>
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1">
            <Label>Complaint ID</Label>
            <Input value={`Auto-generated (e.g. ${generateId("CMP", state.complaints)})`} disabled className="bg-slate-50 text-slate-500" />
          </div>
          <div className="space-y-1">
            <Label htmlFor="citizenId">Citizen ID (optional)</Label>
            <Input id="citizenId" value={form.citizenId} onChange={(e) => set("citizenId", e.target.value)} placeholder="e.g. CIT-001" />
          </div>

          <div className="space-y-1 md:col-span-2">
            <Label htmlFor="citizenName">Citizen Name <span className="text-red-500">*</span></Label>
            <Input id="citizenName" value={form.citizenName} onChange={(e) => set("citizenName", e.target.value)} placeholder="Full name" />
            {errors.citizenName && <p className="text-xs text-red-500">{errors.citizenName}</p>}
          </div>

          <div className="space-y-1 md:col-span-2">
            <Label htmlFor="title">Complaint Title <span className="text-red-500">*</span></Label>
            <Input id="title" value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="Brief title of the complaint" />
            {errors.title && <p className="text-xs text-red-500">{errors.title}</p>}
          </div>

          <div className="space-y-1 md:col-span-2">
            <Label htmlFor="description">Complaint Description <span className="text-red-500">*</span></Label>
            <Textarea id="description" value={form.description} onChange={(e) => set("description", e.target.value)} placeholder="Describe the issue in detail (minimum 20 characters)..." rows={4} />
            {errors.description && <p className="text-xs text-red-500">{errors.description}</p>}
          </div>

          <div className="space-y-1">
            <Label htmlFor="category">Category <span className="text-red-500">*</span></Label>
            <select id="category" value={form.category} onChange={(e) => set("category", e.target.value)} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="space-y-1">
            <Label htmlFor="priority">Priority <span className="text-red-500">*</span></Label>
            <select id="priority" value={form.priority} onChange={(e) => set("priority", e.target.value)} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
              {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>

          <div className="space-y-1">
            <Label htmlFor="location">Location <span className="text-red-500">*</span></Label>
            <Input id="location" value={form.location} onChange={(e) => set("location", e.target.value)} placeholder="Street, landmark, area" />
            {errors.location && <p className="text-xs text-red-500">{errors.location}</p>}
          </div>

          <div className="space-y-1">
            <Label htmlFor="ward">Ward/Area <span className="text-red-500">*</span></Label>
            <select id="ward" value={form.ward} onChange={(e) => set("ward", e.target.value)} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
              {WARDS.map((w) => <option key={w} value={w}>{w}</option>)}
            </select>
          </div>

          <div className="space-y-1 md:col-span-2">
            <Label>Upload Image/Document (optional)</Label>
            <div className="border-2 border-dashed border-slate-200 rounded-lg p-6 text-center hover:border-blue-300 transition-colors cursor-pointer">
              <Upload className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-sm text-slate-400">Click to upload or drag and drop</p>
              <p className="text-xs text-slate-300 mt-1">PNG, JPG, PDF up to 10MB</p>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <Button variant="outline" onClick={() => { setForm({ ...emptyForm }); setErrors({}); setSuccess(null); }}>
            Reset
          </Button>
          <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700">
            <FileText className="w-4 h-4 mr-2" /> Submit Complaint
          </Button>
        </div>
      </div>
    </div>
  );
}
