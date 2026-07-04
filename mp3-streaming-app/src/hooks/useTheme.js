import { useEffect, useState } from "react";

const STORAGE_KEY = "theme-preference";

function getInitialTheme() {
  if (typeof window === "undefined") return "dark";
  return localStorage.getItem(STORAGE_KEY) || "dark";
}

export function useTheme() {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    document.documentElement.classList.toggle("light", theme === "light");
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  return { theme, setTheme, toggleTheme: () => setTheme((t) => (t === "dark" ? "light" : "dark")) };
}
