import { NavLink } from "react-router-dom";
import { Home, Library, ListMusic, UploadCloud } from "lucide-react";
import clsx from "clsx";
import { useIsAdmin } from "../../hooks/useIsAdmin";

const BASE_ITEMS = [
  { to: "/", label: "Home", icon: Home, end: true },
  { to: "/library", label: "Library", icon: Library },
  { to: "/queue", label: "Queue", icon: ListMusic },
];

export default function MobileNav() {
  const isAdmin = useIsAdmin();
  const items = isAdmin
    ? [...BASE_ITEMS.slice(0, 2), { to: "/upload", label: "Upload", icon: UploadCloud }, ...BASE_ITEMS.slice(2)]
    : BASE_ITEMS;

  return (
    <nav className="fixed inset-x-0 bottom-[76px] z-40 flex justify-around border-t border-border-subtle bg-bg-elevated/95 py-2 backdrop-blur-glass md:hidden">
      {items.map(({ to, label, icon: Icon, end }, i) => (
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
