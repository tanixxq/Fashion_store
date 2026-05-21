/**
 * Step 6 — Protected route wrapper
 * If user is not logged in, show login prompt instead of children.
 */
export default function ProtectedRoute({ user, onLogin, children }) {
  if (!user) {
    return (
      <div className="page-shell">
        <div className="page-card empty-page auth-gate">
          <span className="eyebrow">Members only</span>
          <h2>Please sign in</h2>
          <p>You need an account to access checkout and order history.</p>
          <button type="button" className="btn-primary" onClick={onLogin}>
            Go to Login
          </button>
        </div>
      </div>
    );
  }
  return children;
}
