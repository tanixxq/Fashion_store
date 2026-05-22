import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { PATHS } from "../navigation";

/**
 * Auth guard — redirects to login with return path.
 */
export default function ProtectedRoute({ children }) {
  const { user, authReady } = useAuth();
  const location = useLocation();

  if (!authReady) {
    return (
      <div className="page-shell">
        <div className="page-card empty-page">
          <p>Loading…</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <Navigate
        to={PATHS.login}
        replace
        state={{ from: location.pathname, message: "Please sign in to continue." }}
      />
    );
  }

  return children;
}
