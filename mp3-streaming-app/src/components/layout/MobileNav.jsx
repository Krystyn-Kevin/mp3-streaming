import { NavLink } from "react-router-dom";
import { Home, Library, ListMusic, UploadCloud } from "lucide-react";
import clsx from "clsx";

const ITEMS = [
  { to: "/", label: "Home", icon: Home, end: true },
  { to: "/library", label: "Library", icon: Library },
  { to: "/upload", label: "Upload", icon: UploadCloud },
  { to: "/queue", label: "Queue", icon: ListMusic },
];

export default function MobileNav() {
  return (
    <nav className="fixed inset-x-0 bottom-[76px] z-40 flex justify-around border-t border-border-subtle bg-bg-elevated/95 py-2 backdrop-blur-glass md:hidden">
      {ITEMS.map(({ to, label, icon: Icon, end }, i) => (
        <NavLink
          key={label + i}
          to={to}
          end={end}
          className={({ isActive }) =>
            clsx(
              "flex flex-col items-center gap-1 px-3 py-1 text-[10px] font-medium",
              isActive ? "text-accent" : "text-text-tertiary"
            )
          }
        >
          <Icon size={19} />
          {label}
        </NavLink>
      ))}
    </nav>
  );
}
