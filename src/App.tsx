import { useState } from "react";
import AdminPortal from "./AdminPortal";
import { LoginPage } from "./components/LoginPage";
import { AdminDataProvider } from "./context/AdminDataContext";
import { loadAdminToken } from "./lib/admin-session";

export default function App() {
  const [authed, setAuthed] = useState(() => Boolean(loadAdminToken()));

  if (!authed) {
    return (
      <div className="admin-app workspace-paper-bg min-h-screen">
        <LoginPage onSuccess={() => setAuthed(true)} />
      </div>
    );
  }

  return (
    <div className="admin-app workspace-paper-bg min-h-screen">
      <AdminDataProvider>
        <AdminPortal onLogout={() => setAuthed(false)} />
      </AdminDataProvider>
    </div>
  );
}
