"use client";

import Link from "next/link";
import { useMode } from "@/lib/mode/mode-context";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="wrap nav">
        <Link href="/" className="logo">
          <span className="dot">
            <svg viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="9" stroke="#fff" strokeWidth="2" />
              <circle cx="9" cy="11" r="1.5" fill="#fff" />
              <circle cx="15" cy="11" r="1.5" fill="#fff" />
            </svg>
          </span>
          <span>
            <b>Anay</b>o
          </span>
        </Link>
        <div className="spacer" />
        <ModeToggle />
      </div>
    </header>
  );
}

export function ModeToggle() {
  const { mode, setMode } = useMode();
  return (
    <div className="mode">
      <span
        className="pill"
        style={{
          left: mode === "explorer" ? 3 : "50%",
          right: mode === "curious" ? 3 : "50%",
        }}
      />
      <button className={mode === "explorer" ? "on" : ""} onClick={() => setMode("explorer")}>
        🚀 Explorer
      </button>
      <button className={mode === "curious" ? "on" : ""} onClick={() => setMode("curious")}>
        🧠 Curious
      </button>
    </div>
  );
}
