import { useState } from "react";
import { Search, UserPlus, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import type { AppState, Citizen } from "../../types";
import { generateId } from "../../store/dataStore";

interface CitizenManagementProps {
  state: AppState;
  onUpdate: (state: AppState) => void;
}

const WARDS = ["Ward 1", "Ward 2", "Ward 3", "Ward 4", "Ward 5", "Ward 6"];

const empty = { name: "", email: "", phone: "", address: "", ward: "Ward 1" };

export default function CitizenManagement({ state, onUpdate }: CitizenManagementProps) {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ ...empty });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();

  const filtered = state.citizens.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.id.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.ward.toLowerCase().includes(search.toLowerCase())
  );

  function validate() {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email";
    if (!form.phone.trim()) e.phone = "Phone is required";
    else if (!/^\+?[\d\s\-()]{7,15}$/.test(form.phone)) e.phone = "Enter a valid phone number";
    if (!form.address.trim()) e.address = "Address is required";
    return e;
  }

  function handleSubmit() {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    const newCitizen: Citizen = {
      id: generateId("CIT", state.citizens),
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      address: form.address.trim(),
      ward: form.ward,
      registeredAt: new Date().toISOString(),
    };
    onUpdate({ ...state, citizens: [...state.citizens, newCitizen] });
    setOpen(false);
    setForm({ ...empty });
    setErrors({});
    toast({ title: "Citizen Registered", description: `${newCitizen.name} has been registered with ID ${newCitizen.id}.` });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Citizen Management</h2>
          <p className="text-slate-500 text-sm mt-1">Manage registered citizens</p>
        </div>
        <Button onClick={() => setOpen(true)} className="bg-blue-600 hover:bg-blue-700">
          <UserPlus className="w-4 h-4 mr-2" /> Register Citizen
        </Button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="p-4 border-b border-slate-100 flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input placeholder="Search citizens..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Users className="w-4 h-4" />
            <span>{filtered.length} citizen{filtered.length !== 1 ? "s" : ""}</span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Citizen ID</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Name</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600 hidden md:table-cell">Email</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600 hidden lg:table-cell">Phone</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600 hidden lg:table-cell">Address</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Ward</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600 hidden md:table-cell">Registered</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3">
                    <span className="font-mono text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded">{c.id}</span>
                  </td>
                  <td className="px-4 py-3 font-medium text-slate-700">{c.name}</td>
                  <td className="px-4 py-3 text-slate-500 hidden md:table-cell">{c.email}</td>
                  <td className="px-4 py-3 text-slate-500 hidden lg:table-cell">{c.phone}</td>
                  <td className="px-4 py-3 text-slate-500 hidden lg:table-cell max-w-[200px] truncate">{c.address}</td>
                  <td className="px-4 py-3">
                    <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded text-xs font-medium">{c.ward}</span>
                  </td>
                  <td className="px-4 py-3 text-slate-400 text-xs hidden md:table-cell">
                    {new Date(c.registeredAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-slate-400">No citizens found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Register New Citizen</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            {(["name", "email", "phone", "address"] as const).map((field) => (
              <div key={field} className="space-y-1">
                <Label htmlFor={field} className="capitalize">{field === "phone" ? "Phone Number" : field}</Label>
                <Input
                  id={field}
                  value={form[field]}
                  onChange={(e) => { setForm({ ...form, [field]: e.target.value }); setErrors({ ...errors, [field]: "" }); }}
                  placeholder={field === "email" ? "citizen@email.com" : field === "phone" ? "+1-555-0000" : ""}
                />
                {errors[field] && <p className="text-xs text-red-500">{errors[field]}</p>}
              </div>
            ))}
            <div className="space-y-1">
              <Label htmlFor="ward">Ward/Area</Label>
              <select
                id="ward"
                value={form.ward}
                onChange={(e) => setForm({ ...form, ward: e.target.value })}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                {WARDS.map((w) => <option key={w} value={w}>{w}</option>)}
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setOpen(false); setErrors({}); }}>Cancel</Button>
            <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700">Register</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
