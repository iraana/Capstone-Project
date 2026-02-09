import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export const DarkModeToggle = () => {
  const [isDark, setIsDark] = useState<boolean>(false);

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");

    if (storedTheme === "dark") {
      document.documentElement.classList.add("dark");
      setIsDark(true);
    } else if (storedTheme === "light") {
      document.documentElement.classList.remove("dark");
      setIsDark(false);
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      document.documentElement.classList.toggle("dark", prefersDark);
      setIsDark(prefersDark);
    }
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);

    if (next) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle dark mode"
      aria-pressed={isDark}
      className="
        group flex items-center gap-2 px-3 py-2 rounded-lg
        bg-gray-200 dark:bg-gray-800
        text-gray-900 dark:text-gray-100
        transition-colors duration-300
      "
    >
      <span className="relative h-5 w-5">
        <Sun
          className="
            absolute inset-0 h-5 w-5
            text-amber-500 dark:text-amber-400
            transition-all duration-300
            rotate-0 scale-100
            dark:-rotate-90 dark:scale-0
            group-hover:drop-shadow-[0_0_6px_rgba(245,158,11,0.6)]
          "
        />
        <Moon
          className="
            absolute inset-0 h-5 w-5
            text-indigo-400 dark:text-indigo-300
            transition-all duration-300
            rotate-90 scale-0
            dark:rotate-0 dark:scale-100
            group-hover:drop-shadow-[0_0_6px_rgba(129,140,248,0.6)]
          "
        />
      </span>
      <span className="select-none">
        {isDark ? "Dark" : "Light"}
      </span>
    </button>
  );
};