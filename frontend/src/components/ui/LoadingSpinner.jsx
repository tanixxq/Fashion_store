export default function LoadingSpinner({ label = "Loading…", className = "" }) {
  return (
    <div className={`loading-spinner ${className}`} role="status" aria-live="polite">
      <span className="loading-spinner__ring" aria-hidden="true" />
      <span className="loading-spinner__label">{label}</span>
    </div>
  );
}
