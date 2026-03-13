"use client";

export type DojoMode = "serious" | "chaotic";

interface ModeToggleProps {
  mode: DojoMode;
  onChange: (mode: DojoMode) => void;
}

const MODES = [
  {
    id: "serious" as DojoMode,
    emoji: "⚔️",
    label: "Serious Dojo",
    sub: "Honour. Discipline. Ancient technique.",
    accentColor: "var(--gold)",
    activeBg: "rgba(201,162,39,0.07)",
    activeBorder: "rgba(201,162,39,0.5)",
    inactiveBorder: "rgba(255,255,255,0.07)",
    barColor: "var(--gold)",
    labelColor: "var(--gold)",
  },
  {
    id: "chaotic" as DojoMode,
    emoji: "🌀",
    label: "Chaotic Dojo",
    sub: "Mayhem. Hairballs. Pure chaos.",
    accentColor: "var(--crimson-hot)",
    activeBg: "rgba(185,28,28,0.1)",
    activeBorder: "rgba(239,68,68,0.5)",
    inactiveBorder: "rgba(255,255,255,0.07)",
    barColor: "var(--crimson-hot)",
    labelColor: "var(--crimson-hot)",
  },
] as const;

export default function ModeToggle({ mode, onChange }: ModeToggleProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      <p className="micro-label" style={{ textAlign: "center" }}>
        Choose Your Dojo
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
        {MODES.map((m) => {
          const active = mode === m.id;
          return (
            <button
              key={m.id}
              onClick={() => onChange(m.id)}
              aria-pressed={active}
              className="mode-btn"
              style={{
                background: active ? m.activeBg : "var(--ink-panel)",
                borderColor: active ? m.activeBorder : m.inactiveBorder,
                padding: "16px 12px 14px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "5px",
              }}
            >
              {/* Active top bar */}
              <div
                className="mode-btn-active-bar"
                style={{
                  background: m.barColor,
                  opacity: active ? 0.9 : 0,
                  transition: "opacity 0.2s ease",
                }}
              />

              <span style={{ fontSize: "1.5rem", lineHeight: 1 }}>{m.emoji}</span>

              <span
                style={{
                  fontFamily: "var(--font-d)",
                  fontSize: "0.65rem",
                  fontWeight: 700,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: active ? m.labelColor : "var(--parchment-dim)",
                  transition: "color 0.2s ease",
                  marginTop: "2px",
                }}
              >
                {m.label}
              </span>

              <span
                style={{
                  fontFamily: "var(--font-b)",
                  fontSize: "0.72rem",
                  fontStyle: "italic",
                  color: "var(--parchment-dim)",
                  opacity: active ? 0.65 : 0.4,
                  textAlign: "center",
                  lineHeight: 1.35,
                  transition: "opacity 0.2s ease",
                }}
              >
                {m.sub}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
