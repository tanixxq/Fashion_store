import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { PATHS } from "../navigation";
import LoadingSpinner from "./ui/LoadingSpinner";

export default function AdminRoute({ children }) {
  const { user, authReady } = useAuth();

  if (!authReady) {
    return (
      <div className="page-shell">
        <LoadingSpinner label="Checking access…" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to={PATHS.login} replace state={{ from: PATHS.admin }} />;
  }

  if (user.role !== "admin") {
    return (
      <div className="page-shell">
        <div className="page-card empty-page">
          <h2>Admin only</h2>
          <p>You need an administrator account to view this page.</p>
        </div>
      </div>
    );
  }

  return children;
}
