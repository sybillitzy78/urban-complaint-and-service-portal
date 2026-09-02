import { useState, useEffect } from "react";
import Layout from "./components/layout/Layout";
import Dashboard from "./components/dashboard/Dashboard";
import CitizenManagement from "./components/citizens/CitizenManagement";
import RegisterComplaint from "./components/complaints/RegisterComplaint";
import ComplaintManagement from "./components/complaints/ComplaintManagement";
import DepartmentManagement from "./components/departments/DepartmentManagement";
import ServiceRequests from "./components/services/ServiceRequests";
import TrackComplaint from "./components/tracking/TrackComplaint";
import CompareComplaints from "./components/compare/CompareComplaints";
import Reports from "./components/reports/Reports";
import NotificationPanel from "./components/notifications/NotificationPanel";
import { Toaster } from "@/components/ui/toaster";
import type { AppState, UserRole } from "./types";
import { loadState, saveState } from "./store/dataStore";

const CITIZEN_PAGES = ["register-complaint", "services", "track", "notifications"];
const DEFAULT_ADMIN_PAGE = "dashboard";
const DEFAULT_CITIZEN_PAGE = "register-complaint";

export default function App() {
  const [state, setState] = useState<AppState>(loadState);
  const [role, setRole] = useState<UserRole>("admin");
  const [page, setPage] = useState<string>(DEFAULT_ADMIN_PAGE);

  useEffect(() => {
    saveState(state);
  }, [state]);

  function handleRoleChange(newRole: UserRole) {
    setRole(newRole);
    setPage(newRole === "admin" ? DEFAULT_ADMIN_PAGE : DEFAULT_CITIZEN_PAGE);
  }

  function handleNavigate(p: string) {
    if (role === "citizen" && !CITIZEN_PAGES.includes(p)) return;
    setPage(p);
  }

  function handleUpdate(newState: AppState) {
    setState(newState);
  }

  function renderPage() {
    switch (page) {
      case "dashboard":
        return <Dashboard state={state} onNavigate={handleNavigate} />;
      case "citizens":
        return <CitizenManagement state={state} onUpdate={handleUpdate} />;
      case "register-complaint":
        return <RegisterComplaint state={state} onUpdate={handleUpdate} role={role} />;
      case "complaints":
        return <ComplaintManagement state={state} onUpdate={handleUpdate} />;
      case "departments":
        return <DepartmentManagement state={state} />;
      case "services":
        return <ServiceRequests state={state} onUpdate={handleUpdate} role={role} />;
      case "track":
        return <TrackComplaint state={state} />;
      case "compare":
        return <CompareComplaints state={state} />;
      case "reports":
        return <Reports state={state} />;
      case "notifications":
        return <NotificationPanel state={state} onUpdate={handleUpdate} />;
      default:
        return <Dashboard state={state} onNavigate={handleNavigate} />;
    }
  }

  return (
    <>
      <Layout
        currentPage={page}
        onNavigate={handleNavigate}
        role={role}
        onRoleChange={handleRoleChange}
        notifications={state.notifications}
      >
        {renderPage()}
      </Layout>
      <Toaster />
    </>
  );
}
