import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export const themes = [
  { id: "crimson", name: "Crimson", a: "#f43f5e", b: "#fb923c" },
  { id: "aurora", name: "Aurora", a: "#8b5cf6", b: "#ec4899" },
  { id: "ocean", name: "Ocean", a: "#06b6d4", b: "#6366f1" },
  { id: "emerald", name: "Emerald", a: "#10b981", b: "#84cc16" },
] as const;

export type ThemeId = (typeof themes)[number]["id"];

interface ThemeCtx {
  themeId: ThemeId;
  a: string;
  b: string;
  setTheme: (id: ThemeId) => void;
}

const Ctx = createContext<ThemeCtx | null>(null);
const KEY = "nk-theme-v2";

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeId, setThemeId] = useState<ThemeId>(() => {
    try {
      const saved = localStorage.getItem(KEY);
      return themes.find((t) => t.id === saved)?.id ?? "crimson";
    } catch {
      return "crimson";
    }
  });

  const theme = themes.find((t) => t.id === themeId) ?? themes[0];

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--a", theme.a);
    root.style.setProperty("--b", theme.b);
    try {
      localStorage.setItem(KEY, themeId);
    } catch {
      /* ignore */
    }
  }, [theme, themeId]);

  const setTheme = useCallback((id: ThemeId) => setThemeId(id), []);
  const value = useMemo(
    () => ({ themeId, a: theme.a, b: theme.b, setTheme }),
    [themeId, theme.a, theme.b, setTheme]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useTheme() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useTheme must be used inside ThemeProvider");
  return ctx;
}
