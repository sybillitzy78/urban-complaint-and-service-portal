import type {
  AppState,
  Citizen,
  Complaint,
  Department,
  ServiceRequest,
  Notification,
  ComplaintStatus,
  Priority,
} from "../types";

const STORAGE_KEY = "ucms_data";

const sampleDepartments: Department[] = [
  { id: "dept-1", name: "Roads & Infrastructure", officer: "Robert Chen", contact: "+1-555-0101", email: "roads@municipality.gov" },
  { id: "dept-2", name: "Water Supply", officer: "Sarah Johnson", contact: "+1-555-0102", email: "water@municipality.gov" },
  { id: "dept-3", name: "Sanitation", officer: "Michael Brown", contact: "+1-555-0103", email: "sanitation@municipality.gov" },
  { id: "dept-4", name: "Waste Management", officer: "Emily Davis", contact: "+1-555-0104", email: "waste@municipality.gov" },
  { id: "dept-5", name: "Electrical/Street Lighting", officer: "James Wilson", contact: "+1-555-0105", email: "electrical@municipality.gov" },
  { id: "dept-6", name: "Drainage", officer: "Linda Martinez", contact: "+1-555-0106", email: "drainage@municipality.gov" },
  { id: "dept-7", name: "Public Health", officer: "David Taylor", contact: "+1-555-0107", email: "health@municipality.gov" },
];

const sampleCitizens: Citizen[] = [
  { id: "CIT-001", name: "Alice Thompson", email: "alice@email.com", phone: "+1-555-1001", address: "123 Oak Street", ward: "Ward 1", registeredAt: "2024-01-15T10:00:00Z" },
  { id: "CIT-002", name: "Bob Martinez", email: "bob@email.com", phone: "+1-555-1002", address: "456 Maple Ave", ward: "Ward 2", registeredAt: "2024-01-20T11:00:00Z" },
  { id: "CIT-003", name: "Carol White", email: "carol@email.com", phone: "+1-555-1003", address: "789 Pine Road", ward: "Ward 3", registeredAt: "2024-02-01T09:00:00Z" },
  { id: "CIT-004", name: "Daniel Lee", email: "daniel@email.com", phone: "+1-555-1004", address: "321 Elm Street", ward: "Ward 1", registeredAt: "2024-02-10T14:00:00Z" },
  { id: "CIT-005", name: "Eva Green", email: "eva@email.com", phone: "+1-555-1005", address: "654 Birch Lane", ward: "Ward 4", registeredAt: "2024-02-15T08:00:00Z" },
  { id: "CIT-006", name: "Frank Harris", email: "frank@email.com", phone: "+1-555-1006", address: "987 Cedar Blvd", ward: "Ward 2", registeredAt: "2024-03-01T10:30:00Z" },
];

const sampleComplaints: Complaint[] = [
  {
    id: "CMP-001", citizenId: "CIT-001", citizenName: "Alice Thompson",
    title: "Large pothole on Oak Street", description: "There is a large pothole near the intersection causing vehicle damage.",
    category: "Road Damage", location: "Oak Street & 5th Ave", ward: "Ward 1",
    date: "2024-03-01", priority: "High", status: "In Progress",
    departmentId: "dept-1", departmentName: "Roads & Infrastructure",
    resolutionRemarks: "Crew dispatched for repair.",
    history: [
      { date: "2024-03-01T09:00:00Z", status: "Submitted", note: "Complaint submitted by citizen.", updatedBy: "System" },
      { date: "2024-03-02T10:00:00Z", status: "Under Review", note: "Under review by admin.", updatedBy: "Admin" },
      { date: "2024-03-03T11:00:00Z", status: "Assigned", note: "Assigned to Roads & Infrastructure.", updatedBy: "Admin" },
      { date: "2024-03-05T09:00:00Z", status: "In Progress", note: "Crew dispatched for repair.", updatedBy: "Robert Chen" },
    ],
    createdAt: "2024-03-01T09:00:00Z", updatedAt: "2024-03-05T09:00:00Z",
  },
  {
    id: "CMP-002", citizenId: "CIT-002", citizenName: "Bob Martinez",
    title: "No water supply for 3 days", description: "Our neighborhood has had no water supply for the past 3 days.",
    category: "Water Supply", location: "456 Maple Ave", ward: "Ward 2",
    date: "2024-03-05", priority: "Critical", status: "Resolved",
    departmentId: "dept-2", departmentName: "Water Supply",
    resolutionRemarks: "Main pipe repaired. Water supply restored.",
    history: [
      { date: "2024-03-05T08:00:00Z", status: "Submitted", note: "Complaint submitted.", updatedBy: "System" },
      { date: "2024-03-05T09:00:00Z", status: "Under Review", note: "Escalated due to critical priority.", updatedBy: "Admin" },
      { date: "2024-03-05T10:00:00Z", status: "Assigned", note: "Assigned to Water Supply dept.", updatedBy: "Admin" },
      { date: "2024-03-05T14:00:00Z", status: "In Progress", note: "Team working on pipe repair.", updatedBy: "Sarah Johnson" },
      { date: "2024-03-06T10:00:00Z", status: "Resolved", note: "Main pipe repaired. Water supply restored.", updatedBy: "Sarah Johnson" },
    ],
    createdAt: "2024-03-05T08:00:00Z", updatedAt: "2024-03-06T10:00:00Z", resolvedAt: "2024-03-06T10:00:00Z",
  },
  {
    id: "CMP-003", citizenId: "CIT-003", citizenName: "Carol White",
    title: "Garbage not collected for 2 weeks", description: "Garbage bins have not been emptied for two weeks. Health hazard.",
    category: "Waste Management", location: "789 Pine Road", ward: "Ward 3",
    date: "2024-03-08", priority: "High", status: "Assigned",
    departmentId: "dept-4", departmentName: "Waste Management",
    resolutionRemarks: "",
    history: [
      { date: "2024-03-08T10:00:00Z", status: "Submitted", note: "Complaint submitted.", updatedBy: "System" },
      { date: "2024-03-09T09:00:00Z", status: "Under Review", note: "Reviewed by admin.", updatedBy: "Admin" },
      { date: "2024-03-10T11:00:00Z", status: "Assigned", note: "Assigned to Waste Management.", updatedBy: "Admin" },
    ],
    createdAt: "2024-03-08T10:00:00Z", updatedAt: "2024-03-10T11:00:00Z",
  },
  {
    id: "CMP-004", citizenId: "CIT-004", citizenName: "Daniel Lee",
    title: "Broken street lights on Elm Street", description: "Multiple street lights are broken, causing safety concerns at night.",
    category: "Streetlight", location: "Elm Street", ward: "Ward 1",
    date: "2024-03-10", priority: "Medium", status: "Under Review",
    departmentId: "dept-5", departmentName: "Electrical/Street Lighting",
    resolutionRemarks: "",
    history: [
      { date: "2024-03-10T14:00:00Z", status: "Submitted", note: "Complaint submitted.", updatedBy: "System" },
      { date: "2024-03-11T10:00:00Z", status: "Under Review", note: "Under review.", updatedBy: "Admin" },
    ],
    createdAt: "2024-03-10T14:00:00Z", updatedAt: "2024-03-11T10:00:00Z",
  },
  {
    id: "CMP-005", citizenId: "CIT-005", citizenName: "Eva Green",
    title: "Clogged drainage causing flooding", description: "Drainage is blocked causing water flooding on the street after rain.",
    category: "Drainage", location: "654 Birch Lane", ward: "Ward 4",
    date: "2024-03-12", priority: "Critical", status: "In Progress",
    departmentId: "dept-6", departmentName: "Drainage",
    resolutionRemarks: "Drain cleaning crew on site.",
    history: [
      { date: "2024-03-12T08:00:00Z", status: "Submitted", note: "Complaint submitted.", updatedBy: "System" },
      { date: "2024-03-12T09:00:00Z", status: "Under Review", note: "Critical priority escalated.", updatedBy: "Admin" },
      { date: "2024-03-12T10:00:00Z", status: "Assigned", note: "Assigned to Drainage dept.", updatedBy: "Admin" },
      { date: "2024-03-13T08:00:00Z", status: "In Progress", note: "Drain cleaning crew on site.", updatedBy: "Linda Martinez" },
    ],
    createdAt: "2024-03-12T08:00:00Z", updatedAt: "2024-03-13T08:00:00Z",
  },
  {
    id: "CMP-006", citizenId: "CIT-006", citizenName: "Frank Harris",
    title: "Unsanitary public restroom", description: "Public restroom near Cedar Blvd park is in terrible condition.",
    category: "Public Sanitation", location: "Cedar Blvd Park", ward: "Ward 2",
    date: "2024-03-14", priority: "Medium", status: "Submitted",
    departmentId: "", departmentName: "",
    resolutionRemarks: "",
    history: [
      { date: "2024-03-14T11:00:00Z", status: "Submitted", note: "Complaint submitted.", updatedBy: "System" },
    ],
    createdAt: "2024-03-14T11:00:00Z", updatedAt: "2024-03-14T11:00:00Z",
  },
  {
    id: "CMP-007", citizenId: "CIT-001", citizenName: "Alice Thompson",
    title: "Traffic signal malfunction", description: "Traffic signal at main intersection is stuck on red.",
    category: "Traffic", location: "Main St & Broadway", ward: "Ward 1",
    date: "2024-03-15", priority: "High", status: "Resolved",
    departmentId: "dept-1", departmentName: "Roads & Infrastructure",
    resolutionRemarks: "Signal repaired and calibrated.",
    history: [
      { date: "2024-03-15T07:00:00Z", status: "Submitted", note: "Complaint submitted.", updatedBy: "System" },
      { date: "2024-03-15T08:00:00Z", status: "Under Review", note: "Reviewed.", updatedBy: "Admin" },
      { date: "2024-03-15T09:00:00Z", status: "Assigned", note: "Assigned to Roads dept.", updatedBy: "Admin" },
      { date: "2024-03-15T11:00:00Z", status: "In Progress", note: "Technician on site.", updatedBy: "Robert Chen" },
      { date: "2024-03-15T14:00:00Z", status: "Resolved", note: "Signal repaired and calibrated.", updatedBy: "Robert Chen" },
    ],
    createdAt: "2024-03-15T07:00:00Z", updatedAt: "2024-03-15T14:00:00Z", resolvedAt: "2024-03-15T14:00:00Z",
  },
  {
    id: "CMP-008", citizenId: "CIT-003", citizenName: "Carol White",
    title: "Road flooding near school", description: "Road floods every time it rains near Pine Road elementary school.",
    category: "Drainage", location: "Pine Road Elementary", ward: "Ward 3",
    date: "2024-03-16", priority: "High", status: "Closed",
    departmentId: "dept-6", departmentName: "Drainage",
    resolutionRemarks: "New drainage pipes installed. Issue resolved.",
    history: [
      { date: "2024-03-16T09:00:00Z", status: "Submitted", note: "Complaint submitted.", updatedBy: "System" },
      { date: "2024-03-17T09:00:00Z", status: "Under Review", note: "Reviewed.", updatedBy: "Admin" },
      { date: "2024-03-17T11:00:00Z", status: "Assigned", note: "Assigned to Drainage.", updatedBy: "Admin" },
      { date: "2024-03-18T08:00:00Z", status: "In Progress", note: "Installation started.", updatedBy: "Linda Martinez" },
      { date: "2024-03-20T16:00:00Z", status: "Resolved", note: "Drainage pipes installed.", updatedBy: "Linda Martinez" },
      { date: "2024-03-21T10:00:00Z", status: "Closed", note: "Case closed after citizen confirmation.", updatedBy: "Admin" },
    ],
    createdAt: "2024-03-16T09:00:00Z", updatedAt: "2024-03-21T10:00:00Z", resolvedAt: "2024-03-20T16:00:00Z",
  },
];

const sampleServiceRequests: ServiceRequest[] = [
  {
    id: "SRQ-001", citizenId: "CIT-001", citizenName: "Alice Thompson",
    serviceType: "Road Repair", description: "Request to resurface the entire block of Oak Street.",
    location: "Oak Street Block 4", requestDate: "2024-03-02", priority: "Medium",
    departmentId: "dept-1", departmentName: "Roads & Infrastructure",
    status: "In Progress", createdAt: "2024-03-02T10:00:00Z", updatedAt: "2024-03-08T11:00:00Z",
  },
  {
    id: "SRQ-002", citizenId: "CIT-002", citizenName: "Bob Martinez",
    serviceType: "Water Connection", description: "New water connection for house extension.",
    location: "456 Maple Ave Extension", requestDate: "2024-03-07", priority: "Low",
    departmentId: "dept-2", departmentName: "Water Supply",
    status: "Pending", createdAt: "2024-03-07T09:00:00Z", updatedAt: "2024-03-07T09:00:00Z",
  },
  {
    id: "SRQ-003", citizenId: "CIT-004", citizenName: "Daniel Lee",
    serviceType: "Street Light Installation", description: "Install new street light at dark alley near Elm Street.",
    location: "Elm Street Alley", requestDate: "2024-03-11", priority: "High",
    departmentId: "dept-5", departmentName: "Electrical/Street Lighting",
    status: "Assigned", createdAt: "2024-03-11T14:00:00Z", updatedAt: "2024-03-12T10:00:00Z",
  },
  {
    id: "SRQ-004", citizenId: "CIT-005", citizenName: "Eva Green",
    serviceType: "Garbage Collection", description: "Request for additional garbage bin and weekly collection.",
    location: "654 Birch Lane", requestDate: "2024-03-13", priority: "Medium",
    departmentId: "dept-4", departmentName: "Waste Management",
    status: "Completed", createdAt: "2024-03-13T08:00:00Z", updatedAt: "2024-03-16T15:00:00Z",
  },
  {
    id: "SRQ-005", citizenId: "CIT-006", citizenName: "Frank Harris",
    serviceType: "Drain Cleaning", description: "Monthly drain cleaning service for Cedar Blvd area.",
    location: "Cedar Blvd", requestDate: "2024-03-14", priority: "Low",
    departmentId: "dept-6", departmentName: "Drainage",
    status: "Pending", createdAt: "2024-03-14T11:00:00Z", updatedAt: "2024-03-14T11:00:00Z",
  },
];

const sampleNotifications: Notification[] = [
  { id: "notif-1", title: "New Complaint Registered", message: "CMP-006 has been submitted by Frank Harris.", type: "info", read: false, createdAt: "2024-03-14T11:00:00Z" },
  { id: "notif-2", title: "Complaint Resolved", message: "CMP-002 (No water supply) has been resolved.", type: "success", read: false, createdAt: "2024-03-06T10:00:00Z" },
  { id: "notif-3", title: "Critical Priority Alert", message: "CMP-005 (Drainage flooding) requires immediate attention.", type: "warning", read: false, createdAt: "2024-03-12T08:00:00Z" },
  { id: "notif-4", title: "Service Request Update", message: "SRQ-004 has been marked as Completed.", type: "success", read: true, createdAt: "2024-03-16T15:00:00Z" },
  { id: "notif-5", title: "Complaint Assigned", message: "CMP-003 assigned to Waste Management department.", type: "info", read: true, createdAt: "2024-03-10T11:00:00Z" },
];

function getDefaultState(): AppState {
  return {
    citizens: sampleCitizens,
    complaints: sampleComplaints,
    departments: sampleDepartments,
    serviceRequests: sampleServiceRequests,
    notifications: sampleNotifications,
  };
}

export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  const defaults = getDefaultState();
  saveState(defaults);
  return defaults;
}

export function saveState(state: AppState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function resetToDefaults(): void {
  saveState(getDefaultState());
}

export function generateId(prefix: string, items: { id: string }[]): string {
  const nums = items
    .map((i) => parseInt(i.id.split("-")[1] || "0", 10))
    .filter((n) => !isNaN(n));
  const next = nums.length > 0 ? Math.max(...nums) + 1 : 1;
  return `${prefix}-${String(next).padStart(3, "0")}`;
}

export function addNotification(
  state: AppState,
  title: string,
  message: string,
  type: Notification["type"]
): AppState {
  const notif: Notification = {
    id: `notif-${Date.now()}`,
    title,
    message,
    type,
    read: false,
    createdAt: new Date().toISOString(),
  };
  return { ...state, notifications: [notif, ...state.notifications] };
}

export function getComplaintStats(complaints: Complaint[]) {
  return {
    total: complaints.length,
    pending: complaints.filter((c) => c.status === "Submitted" || c.status === "Under Review").length,
    inProgress: complaints.filter((c) => c.status === "In Progress" || c.status === "Assigned").length,
    resolved: complaints.filter((c) => c.status === "Resolved" || c.status === "Closed").length,
    highPriority: complaints.filter((c) => c.priority === "High" || c.priority === "Critical").length,
  };
}

export function getAvgResolutionTime(complaints: Complaint[]): string {
  const resolved = complaints.filter((c) => c.resolvedAt);
  if (!resolved.length) return "N/A";
  const total = resolved.reduce((acc, c) => {
    const start = new Date(c.createdAt).getTime();
    const end = new Date(c.resolvedAt!).getTime();
    return acc + (end - start);
  }, 0);
  const avgMs = total / resolved.length;
  const avgHours = avgMs / (1000 * 60 * 60);
  if (avgHours < 24) return `${Math.round(avgHours)}h`;
  return `${Math.round(avgHours / 24)}d`;
}

export function getDepartmentStats(departments: Department[], complaints: Complaint[]) {
  return departments.map((dept) => {
    const assigned = complaints.filter((c) => c.departmentId === dept.id);
    return {
      ...dept,
      assignedCount: assigned.length,
      pendingCount: assigned.filter((c) => !["Resolved", "Closed"].includes(c.status)).length,
      resolvedCount: assigned.filter((c) => ["Resolved", "Closed"].includes(c.status)).length,
    };
  });
}

export function getCategoryData(complaints: Complaint[]) {
  const cats: Record<string, number> = {};
  complaints.forEach((c) => { cats[c.category] = (cats[c.category] || 0) + 1; });
  return Object.entries(cats).map(([name, value]) => ({ name, value }));
}

export function getStatusData(complaints: Complaint[]) {
  const statuses: ComplaintStatus[] = ["Submitted", "Under Review", "Assigned", "In Progress", "Resolved", "Closed"];
  return statuses.map((s) => ({ name: s, value: complaints.filter((c) => c.status === s).length }));
}

export function getPriorityData(complaints: Complaint[]) {
  const priorities: Priority[] = ["Low", "Medium", "High", "Critical"];
  return priorities.map((p) => ({ name: p, value: complaints.filter((c) => c.priority === p).length }));
}

export function getMonthlyData(complaints: Complaint[]) {
  const months: Record<string, { month: string; total: number; resolved: number }> = {};
  complaints.forEach((c) => {
    const d = new Date(c.createdAt);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const label = d.toLocaleString("default", { month: "short", year: "2-digit" });
    if (!months[key]) months[key] = { month: label, total: 0, resolved: 0 };
    months[key].total++;
    if (c.status === "Resolved" || c.status === "Closed") months[key].resolved++;
  });
  return Object.values(months).sort((a, b) => a.month.localeCompare(b.month));
}
