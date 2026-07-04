import { ShieldAlert } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useIsAdmin } from "../../hooks/useIsAdmin";

/**
 * Wraps admin-only pages (currently just /upload). Unlike ProtectedRoute,
 * this doesn't redirect — it shows an explanatory message in place, since
 * "you're logged in but not allowed here" is a different situation from
 * "you're not logged in at all".
 */
export default function AdminRoute({ children }) {
  const { user } = useAuth();
  const isAdmin = useIsAdmin();

  if (isAdmin) return children;

  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-3 py-24 text-center">
      <ShieldAlert className="text-text-tertiary" size={28} />
      <p className="font-display text-lg font-medium text-text-secondary">This part of the library is locked</p>
      <p className="text-sm text-text-tertiary">
        Only the library owner can add or remove songs. You're signed in as{" "}
        <span className="text-text-secondary">{user?.email}</span> — everyone (including you) can still browse and
        listen to everything.
      </p>
    </div>
  );
}
