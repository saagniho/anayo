"use client";

import { createContext, useContext, useEffect, useState } from "react";

/** Dual-audience mode: Explorer (kids 8-12) vs Curious (teens + adults). */
export type Mode = "explorer" | "curious";

type ModeContextValue = {
  mode: Mode;
  setMode: (m: Mode) => void;
  toggle: () => void;
};

const ModeContext = createContext<ModeContextValue | null>(null);

const STORAGE_KEY = "anayo:mode";

export function ModeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<Mode>("explorer");

  // hydrate from last choice
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "explorer" || saved === "curious") setMode(saved);
  }, []);

  // persist + expose to CSS via data-mode on <html>
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, mode);
    document.documentElement.dataset.mode = mode;
  }, [mode]);

  const toggle = () => setMode((m) => (m === "explorer" ? "curious" : "explorer"));

  return (
    <ModeContext.Provider value={{ mode, setMode, toggle }}>
      {children}
    </ModeContext.Provider>
  );
}

export function useMode(): ModeContextValue {
  const ctx = useContext(ModeContext);
  if (!ctx) throw new Error("useMode must be used inside <ModeProvider>");
  return ctx;
}
