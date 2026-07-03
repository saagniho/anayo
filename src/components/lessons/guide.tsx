"use client";

import type { ReactNode } from "react";

/**
 * Shared guided-learning primitives (PLAN 4.1). Every toy shows exactly one
 * instruction at a time; the bar re-mounts on step change so the attention
 * animation replays.
 */
export function GuideBar({
  step,
  total,
  children,
}: {
  step: number;
  total: number;
  children: ReactNode;
}) {
  return (
    <div className="guidebar" key={step}>
      <div className="guidebar-dots" aria-label={`step ${step} of ${total}`}>
        {Array.from({ length: total }, (_, i) => (
          <span
            key={i}
            className={`gdot${i + 1 === step ? " on" : i + 1 < step ? " done" : ""}`}
          />
        ))}
      </div>
      <p className="guidebar-text">{children}</p>
    </div>
  );
}

/** The single unmistakable primary action of the current step. */
export function BigButton({ onClick, children }: { onClick: () => void; children: ReactNode }) {
  return (
    <div className="toy-actions">
      <button className="btn primary bigbtn" onClick={onClick}>
        {children}
      </button>
    </div>
  );
}
