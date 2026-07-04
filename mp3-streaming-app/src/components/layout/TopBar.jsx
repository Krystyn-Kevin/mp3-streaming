import { useLocation } from "react-router-dom";
import SearchBar from "../common/SearchBar";

const TITLES = {
  "/": "Home",
  "/library": "Library",
  "/upload": "Upload",
  "/queue": "Queue",
  "/recent": "Recently Played",
  "/favorites": "Favorites",
  "/settings": "Settings",
};

export default function TopBar({ searchQuery, onSearchChange, showSearch = true }) {
  const location = useLocation();
  const title = TITLES[location.pathname] || "";

  return (
    <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
      <h1 className="font-display text-2xl font-semibold tracking-tight">{title}</h1>
      {showSearch && <SearchBar value={searchQuery} onChange={onSearchChange} />}
    </div>
  );
}
