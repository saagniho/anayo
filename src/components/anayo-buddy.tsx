/**
 * Anayo — the buddy. Pure presentational SVG; idle animations live in CSS
 * (float / blink / core-pulse). Reused on the landing, journey and lessons.
 */

type AbilitySlot = { icon: string; label: string; unlocked: boolean };

const DEFAULT_TRAY: AbilitySlot[] = [
  { icon: "📖", label: "READ", unlocked: true },
  { icon: "🔮", label: "GUESS", unlocked: false },
  { icon: "🎯", label: "FOCUS", unlocked: false },
  { icon: "🦾", label: "TOOLS", unlocked: false },
  { icon: "💻", label: "CODE", unlocked: false },
];

export function AnayoBuddy({
  speech,
  tray = DEFAULT_TRAY,
}: {
  speech?: string;
  tray?: AbilitySlot[];
}) {
  return (
    <div className="stage">
      <div className="halo" />
      <div className="buddy">
        {speech ? <div className="speech">{speech}</div> : null}
        <svg viewBox="0 0 220 240" role="img" aria-label="Anayo the AI buddy">
          <line x1="110" y1="44" x2="110" y2="20" stroke="#a98bff" strokeWidth="4" strokeLinecap="round" />
          <circle className="antorb" cx="110" cy="14" r="8" fill="#27e0f0" />
          <rect x="42" y="42" width="136" height="110" rx="34" fill="url(#a-g1)" stroke="#b9a6ff" strokeWidth="2" />
          <rect x="58" y="60" width="104" height="74" rx="22" fill="#120a28" />
          <g className="eye">
            <circle cx="90" cy="96" r="11" fill="#27e0f0" />
            <circle cx="93" cy="92" r="3.5" fill="#bff6fb" />
          </g>
          <g className="eye">
            <circle cx="130" cy="96" r="11" fill="#27e0f0" />
            <circle cx="133" cy="92" r="3.5" fill="#bff6fb" />
          </g>
          <path d="M92 116 Q110 128 128 116" stroke="#27e0f0" strokeWidth="4" fill="none" strokeLinecap="round" />
          <rect x="62" y="158" width="96" height="64" rx="26" fill="url(#a-g2)" stroke="#b9a6ff" strokeWidth="2" />
          <circle className="core" cx="110" cy="190" r="16" fill="url(#a-g3)" />
          <circle cx="110" cy="190" r="7" fill="#fff" opacity="0.85" />
          <defs>
            <linearGradient id="a-g1" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#7b5bff" /><stop offset="1" stopColor="#5a34e0" />
            </linearGradient>
            <linearGradient id="a-g2" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#6a47f0" /><stop offset="1" stopColor="#4a2bc0" />
            </linearGradient>
            <radialGradient id="a-g3">
              <stop offset="0" stopColor="#7af9ff" /><stop offset="1" stopColor="#27e0f0" />
            </radialGradient>
          </defs>
        </svg>
        <div className="b-shadow" />
        <div className="tray">
          {tray.map((a) => (
            <div key={a.label} className={`ab${a.unlocked ? "" : " locked"}`} title={a.label}>
              {a.icon}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
