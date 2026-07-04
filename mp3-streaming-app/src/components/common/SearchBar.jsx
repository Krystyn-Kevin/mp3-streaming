import { Search, X } from "lucide-react";

export default function SearchBar({ value, onChange, placeholder = "Search your library" }) {
  return (
    <div className="relative w-full max-w-md">
      <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-text-tertiary" size={16} />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label="Search songs"
        className="w-full rounded-full border border-border-subtle bg-surface-glass py-2.5 pl-11 pr-9 text-sm
          text-text-primary placeholder:text-text-tertiary outline-none backdrop-blur-glass
          transition-colors focus:border-accent"
      />
      {value && (
        <button
          onClick={() => onChange("")}
          aria-label="Clear search"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-primary"
        >
          <X size={15} />
        </button>
      )}
    </div>
  );
}
