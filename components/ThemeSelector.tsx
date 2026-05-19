"use client";

import { useEffect, useState } from "react";
import { Palette } from "lucide-react";
import { ShimmerBlock } from "@/components/Shimmer";

const THEMES = [
  { id: "valentine", label: "Valentine (default)" },
  { id: "light", label: "Light" },
  { id: "dark", label: "Dark" },
  { id: "cupcake", label: "Cupcake" },
  { id: "synthwave", label: "Synthwave" },
  { id: "forest", label: "Forest" },
] as const;

type ThemeId = (typeof THEMES)[number]["id"];

export default function ThemeSelector({ compact = false }: { compact?: boolean }) {
  const [theme, setTheme] = useState<ThemeId>("valentine");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("concert-theme") as ThemeId | null;
    const valid = THEMES.some((t) => t.id === saved);
    const initial = valid && saved ? saved : "valentine";
    setTheme(initial);
    document.documentElement.setAttribute("data-theme", initial);
  }, []);

  function handleChange(nextTheme: ThemeId) {
    setTheme(nextTheme);
    document.documentElement.setAttribute("data-theme", nextTheme);
    localStorage.setItem("concert-theme", nextTheme);
  }

  if (!mounted) {
    return (
      <div className={`form-control ${compact ? "w-full" : "w-48"}`}>
        <ShimmerBlock className="h-10" />
      </div>
    );
  }

  return (
    <label className={`form-control ${compact ? "w-full" : "w-48"}`}>
      <div className="label py-0">
        <span className="label-text flex items-center gap-1 text-xs">
          <Palette className="h-3.5 w-3.5" />
          Theme
        </span>
      </div>
      <select
        className="select select-bordered select-sm w-full rounded-xl"
        value={theme}
        onChange={(e) => handleChange(e.target.value as ThemeId)}
        aria-label="Choose app theme"
      >
        {THEMES.map((item) => (
          <option key={item.id} value={item.id}>
            {item.label}
          </option>
        ))}
      </select>
    </label>
  );
}
