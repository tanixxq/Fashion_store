import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "./ui/LoadingSpinner";

/** Blocks UI until JWT session restore completes (persistent login). */
export default function AuthBootstrap({ children }) {
  const { authReady } = useAuth();

  if (!authReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-950">
        <LoadingSpinner label="Restoring session…" />
      </div>
    );
  }

  return children;
}
