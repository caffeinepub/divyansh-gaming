import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";

export type ThemeColor = "cyan" | "red" | "green" | "purple";

interface ThemeContextValue {
  isDark: boolean;
  setIsDark: (v: boolean) => void;
  theme: ThemeColor;
  setTheme: (v: ThemeColor) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDarkState] = useState<boolean>(() => {
    const stored = localStorage.getItem("dg-dark");
    return stored !== null ? stored === "true" : true;
  });

  const [theme, setThemeState] = useState<ThemeColor>(() => {
    const stored = localStorage.getItem("dg-theme");
    const valid: ThemeColor[] = ["cyan", "red", "green", "purple"];
    return valid.includes(stored as ThemeColor)
      ? (stored as ThemeColor)
      : "cyan";
  });

  const setIsDark = (v: boolean) => {
    setIsDarkState(v);
    localStorage.setItem("dg-dark", String(v));
  };

  const setTheme = (v: ThemeColor) => {
    setThemeState(v);
    localStorage.setItem("dg-theme", v);
  };

  // Apply data-theme and day-mode class to documentElement
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-theme", theme);
    if (isDark) {
      root.classList.remove("day-mode");
    } else {
      root.classList.add("day-mode");
    }
  }, [isDark, theme]);

  return (
    <ThemeContext.Provider value={{ isDark, setIsDark, theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
