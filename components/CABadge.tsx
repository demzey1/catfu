"use client";

import { useState } from "react";

const CA = "FP7NvFXQXoZL1nQC5QZtE1bzwgALdxj1TeA9J25epump";

export default function CABadge({ large = false }: { large?: boolean }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(CA);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const short = CA.slice(0, 6) + "…" + CA.slice(-6);

  return (
    <button
      onClick={copy}
      title="Copy contract address"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: large ? 10 : 7,
        background: copied ? "rgba(74,222,128,0.08)" : "rgba(201,162,39,0.05)",
        border: `1px solid ${copied ? "rgba(74,222,128,0.35)" : "rgba(201,162,39,0.22)"}`,
        padding: large ? "10px 18px" : "7px 13px",
        marginTop: large ? 0 : 18,
        cursor: "pointer",
        transition: "all 0.2s",
        WebkitTapHighlightColor: "transparent",
      }}
    >
      <span style={{ fontSize: large ? "0.9rem" : "0.75rem" }}>🪙</span>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 1 }}>
        <span style={{
          fontFamily: "var(--font-d)",
          fontSize: large ? "0.44rem" : "0.38rem",
          letterSpacing: "0.32em",
          textTransform: "uppercase",
          color: copied ? "#4ade80" : "var(--gold)",
          opacity: 0.75,
        }}>
          CA · pump.fun
        </span>
        <span style={{
          fontFamily: "'Courier New', monospace",
          fontSize: large ? "0.72rem" : "0.6rem",
          color: copied ? "#4ade80" : "var(--parchment)",
          letterSpacing: "0.04em",
          opacity: large ? 0.85 : 0.6,
          wordBreak: "break-all",
        }}>
          {large ? CA : short}
        </span>
      </div>
      <span style={{
        fontFamily: "var(--font-d)",
        fontSize: "0.45rem",
        letterSpacing: "0.2em",
        textTransform: "uppercase",
        color: copied ? "#4ade80" : "var(--gold-dim)",
        opacity: 0.7,
        marginLeft: 4,
        flexShrink: 0,
      }}>
        {copied ? "✓ copied" : "copy"}
      </span>
    </button>
  );
}

export { CA };
