export type ComplaintCategory =
  | "Road Damage"
  | "Water Supply"
  | "Waste Management"
  | "Drainage"
  | "Streetlight"
  | "Public Sanitation"
  | "Traffic"
  | "Other";

export type Priority = "Low" | "Medium" | "High" | "Critical";

export type ComplaintStatus =
  | "Submitted"
  | "Under Review"
  | "Assigned"
  | "In Progress"
  | "Resolved"
  | "Closed";

export type ServiceStatus =
  | "Pending"
  | "Assigned"
  | "In Progress"
  | "Completed"
  | "Cancelled";

export type ServiceType =
  | "Road Repair"
  | "Water Connection"
  | "Garbage Collection"
  | "Drain Cleaning"
  | "Street Light Installation"
  | "Sanitation Service"
  | "Tree Trimming"
  | "Other";

export interface Citizen {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  ward: string;
  registeredAt: string;
}

export interface ComplaintHistoryEntry {
  date: string;
  status: ComplaintStatus;
  note: string;
  updatedBy: string;
}

export interface Complaint {
  id: string;
  citizenId: string;
  citizenName: string;
  title: string;
  description: string;
  category: ComplaintCategory;
  location: string;
  ward: string;
  date: string;
  priority: Priority;
  status: ComplaintStatus;
  departmentId: string;
  departmentName: string;
  resolutionRemarks: string;
  imageUrl?: string;
  history: ComplaintHistoryEntry[];
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
}

export interface Department {
  id: string;
  name: string;
  officer: string;
  contact: string;
  email: string;
}

export interface ServiceRequest {
  id: string;
  citizenId: string;
  citizenName: string;
  serviceType: ServiceType;
  description: string;
  location: string;
  requestDate: string;
  priority: Priority;
  departmentId: string;
  departmentName: string;
  status: ServiceStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  read: boolean;
  createdAt: string;
}

export type UserRole = "citizen" | "admin";

export interface AppState {
  citizens: Citizen[];
  complaints: Complaint[];
  departments: Department[];
  serviceRequests: ServiceRequest[];
  notifications: Notification[];
}
