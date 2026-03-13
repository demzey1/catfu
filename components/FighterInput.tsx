"use client";

interface FighterInputProps {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  side: "left" | "right";
  inputId: string;
}

const SIDE = {
  left: {
    accent:      "var(--gold)",
    accentMuted: "rgba(201,162,39,0.2)",
    labelColor:  "var(--gold)",
    icon:        "🐱",
    number:      "01",
    inputClass:  "dojo-input",
  },
  right: {
    accent:      "var(--crimson-hot)",
    accentMuted: "rgba(185,28,28,0.2)",
    labelColor:  "var(--crimson-hot)",
    icon:        "😾",
    number:      "02",
    inputClass:  "dojo-input dojo-input-crimson",
  },
};

export default function FighterInput({ label, placeholder, value, onChange, side, inputId }: FighterInputProps) {
  const s = SIDE[side];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "7px" }}>

      {/* Label */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <label
          htmlFor={inputId}
          style={{
            fontFamily: "var(--font-d)",
            fontSize: "0.56rem",
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            color: s.labelColor,
            display: "flex", alignItems: "center", gap: "6px",
            opacity: 0.88, cursor: "pointer",
          }}
        >
          <span role="img" aria-hidden="true">{s.icon}</span>
          <span>{label}</span>
        </label>
        <span style={{
          fontFamily: "var(--font-d)", fontSize: "0.52rem",
          color: s.accent, opacity: 0.3, letterSpacing: "0.1em",
        }}>{s.number}</span>
      </div>

      {/* Input with left accent bar */}
      <div style={{ position: "relative" }}>
        <div aria-hidden style={{
          position: "absolute", top: 0, left: 0,
          width: "2px", height: "100%",
          background: s.accent,
          opacity: value.trim() ? 0.85 : 0.28,
          transition: "opacity 0.2s ease",
          zIndex: 1,
        }} />
        <input
          id={inputId}
          type="text"
          className={s.inputClass}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            // Prevent leading spaces
            if (e.key === " " && !value) e.preventDefault();
          }}
          maxLength={32}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="words"
          spellCheck="false"
          style={{ paddingLeft: "16px", borderLeft: `1px solid ${value.trim() ? s.accent : s.accentMuted}` }}
        />
      </div>
    </div>
  );
}
