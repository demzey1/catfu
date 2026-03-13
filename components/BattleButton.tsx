"use client";

interface BattleButtonProps {
  onClick: () => void;
  isLoading?: boolean;
  disabled?: boolean;
}

export default function BattleButton({ onClick, isLoading = false, disabled = false }: BattleButtonProps) {
  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
      <button
        onClick={onClick}
        disabled={disabled || isLoading}
        className="btn-battle"
        aria-label="Begin the battle"
      >
        <span
          style={{
            position: "relative",
            zIndex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "14px",
          }}
        >
          {isLoading ? (
            <>
              <Spinner />
              <span>Summoning fate…</span>
            </>
          ) : (
            <>
              <span style={{ opacity: 0.7, fontSize: "0.85em" }}>⚔</span>
              <span>Begin Battle</span>
              <span style={{ opacity: 0.7, fontSize: "0.85em" }}>⚔</span>
            </>
          )}
        </span>
      </button>

      {/* Helper text */}
      <div
        style={{
          height: "16px",
          transition: "opacity 0.2s ease",
          opacity: disabled && !isLoading ? 1 : 0,
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-b)",
            fontSize: "0.78rem",
            fontStyle: "italic",
            color: "var(--parchment-dim)",
            opacity: 0.6,
            textAlign: "center",
          }}
        >
          Name both warriors to begin
        </p>
      </div>
    </div>
  );
}

function Spinner() {
  return (
    <svg
      width="15" height="15"
      viewBox="0 0 24 24"
      fill="none"
      style={{ animation: "spin 0.75s linear infinite" }}
      aria-hidden
    >
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25" />
      <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}
