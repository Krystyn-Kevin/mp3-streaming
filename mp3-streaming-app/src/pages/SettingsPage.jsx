import { Moon, Sun, LogOut } from "lucide-react";
import clsx from "clsx";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../hooks/useTheme";

const SHORTCUTS = [
  { keys: "Space", action: "Play / pause" },
  { keys: "→", action: "Next track" },
  { keys: "←", action: "Previous track / restart" },
  { keys: "↑ / ↓", action: "Volume up / down" },
  { keys: "M", action: "Mute / unmute" },
  { keys: "S", action: "Toggle shuffle" },
  { keys: "R", action: "Cycle repeat mode" },
];

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-8">
      <section className="glass-panel rounded-lg p-5">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-text-tertiary">Account</h2>
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-accent to-accent2 text-lg font-semibold text-white">
            {(user?.displayName || user?.email || "?").charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="truncate font-display text-base font-medium">{user?.displayName || "Music lover"}</p>
            <p className="truncate text-sm text-text-tertiary">{user?.email}</p>
          </div>
        </div>
      </section>

      <section className="glass-panel rounded-lg p-5">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-text-tertiary">Appearance</h2>
        <div className="flex gap-3">
          <button
            onClick={() => setTheme("dark")}
            className={clsx(
              "flex flex-1 items-center justify-center gap-2 rounded-md border px-4 py-3 text-sm font-medium transition-colors",
              theme === "dark" ? "border-accent bg-accent/10 text-accent" : "border-border-subtle text-text-secondary hover:bg-surface-hover"
            )}
          >
            <Moon size={15} /> Dark
          </button>
          <button
            onClick={() => setTheme("light")}
            className={clsx(
              "flex flex-1 items-center justify-center gap-2 rounded-md border px-4 py-3 text-sm font-medium transition-colors",
              theme === "light" ? "border-accent bg-accent/10 text-accent" : "border-border-subtle text-text-secondary hover:bg-surface-hover"
            )}
          >
            <Sun size={15} /> Light
          </button>
        </div>
      </section>

      <section className="glass-panel rounded-lg p-5">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-text-tertiary">Keyboard Shortcuts</h2>
        <div className="flex flex-col gap-2.5">
          {SHORTCUTS.map((s) => (
            <div key={s.action} className="flex items-center justify-between text-sm">
              <span className="text-text-secondary">{s.action}</span>
              <kbd className="rounded-sm border border-border-subtle bg-surface px-2 py-1 font-mono text-xs text-text-primary">
                {s.keys}
              </kbd>
            </div>
          ))}
        </div>
      </section>

      <button onClick={logout} className="btn-ghost w-full justify-center text-danger hover:bg-danger/10">
        <LogOut size={15} />
        Log out
      </button>
    </div>
  );
}
