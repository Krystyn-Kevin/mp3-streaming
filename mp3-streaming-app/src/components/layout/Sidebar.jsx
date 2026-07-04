import { NavLink } from "react-router-dom";
import { Home, Library, ListMusic, Clock, Heart, Settings, LogOut, UploadCloud } from "lucide-react";
import clsx from "clsx";
import { useAuth } from "../../context/AuthContext";
import { useIsAdmin } from "../../hooks/useIsAdmin";

const NAV_ITEMS = [
  { to: "/", label: "Home", icon: Home, end: true },
  { to: "/library", label: "Library", icon: Library },
  { to: "/queue", label: "Queue", icon: ListMusic },
  { to: "/recent", label: "Recently Played", icon: Clock },
  { to: "/favorites", label: "Favorites", icon: Heart },
  { to: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar({ className }) {
  const { user, logout } = useAuth();
  const isAdmin = useIsAdmin();

  const items = isAdmin
    ? [...NAV_ITEMS.slice(0, 2), { to: "/upload", label: "Upload", icon: UploadCloud }, ...NAV_ITEMS.slice(2)]
    : NAV_ITEMS;

  return (
    <aside className={clsx("flex h-full flex-col gap-8 border-r border-border-subtle bg-bg-elevated p-5", className)}>
      <div className="flex items-center gap-2.5 px-1">
        <div className="relative flex h-8 w-8 items-center justify-center rounded-full border border-accent">
          <span className="absolute h-3.5 w-px rotate-[35deg] bg-accent" style={{ top: -4, right: 6 }} />
        </div>
        <span className="font-display text-lg font-semibold tracking-tight">Wavelength</span>
      </div>

      <nav className="flex flex-1 flex-col gap-1">
        {items.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) => clsx("nav-item", isActive && "nav-item-active")}
          >
            {({ isActive }) => (
              <>
                <Icon size={18} className={isActive ? "text-accent" : "opacity-80"} />
                {label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2.5 rounded-md border border-border-subtle p-2.5">
          <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-accent to-accent2 text-xs font-semibold text-white">
            {(user?.displayName || user?.email || "?").charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="truncate text-xs font-semibold text-text-primary">
              {user?.displayName || "Music lover"}
            </p>
            <p className="truncate text-[11px] text-text-tertiary">{user?.email}</p>
          </div>
        </div>
        <button onClick={logout} className="nav-item text-text-secondary">
          <LogOut size={18} className="opacity-80" />
          Log out
        </button>
      </div>
    </aside>
  );
}
