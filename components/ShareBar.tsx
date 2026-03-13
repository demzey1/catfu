"use client";

import React, { useState } from "react";
import type { BattleResult } from "@/lib/battleGenerator";
import { CA } from "@/components/CABadge";

// ─── Text builders ────────────────────────────────────────────────────────────

function buildCopyText(b: BattleResult, f1: string, f2: string): string {
  const rare = b.rareEvent
    ? `\n⚡ ${b.rareEvent.label}\n   ${b.rareEvent.description(f1, f2)}`
    : "";
  const divider = "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━";

  return [
    `⚔  CATFU DOJO  ⚔`,
    `OFFICIAL BATTLE RECORD`,
    divider,
    ``,
    `🏟  ${b.arena}`,
    ``,
    `🐱  ${b.fighter1Title} ${f1}`,
    `    opened with: ${b.openingMove1}`,
    ``,
    `😾  ${b.fighter2Title} ${f2}`,
    `    opened with: ${b.openingMove2}`,
    ``,
    `💥  FINAL TECHNIQUE`,
    `    ${b.finishingMove}`,
    ``,
    divider,
    ``,
    `🏆  WINNER: ${b.winnerTitle} ${b.winner}`,
    `    VERDICT: ${b.verdict}`,
    ``,
    `📜  ${b.endingLine}`,
    rare,
    ``,
    divider,
    ``,
    `🧘  ${b.senseiName} says:`,
    `    ${b.senseiComment}`,
    ``,
    divider,
    `catfudojo.xyz  ·  #CATFU  ·  @catfusolana`,
    `CA: ${CA}`,
  ].join("\n").trim();
}

function buildTweet(b: BattleResult, f1: string, f2: string): string {
  // Use actual winner/loser — not positional f1/f2
  const loser = b.winner === f1 ? f2 : f1;
  const ending = b.endingLine.length > 80 ? b.endingLine.slice(0, 77) + "…" : b.endingLine;
  return (
    `${b.winner} just defeated ${loser} in the CatFu Dojo ` +
    `using ${b.finishingMove} in ${b.arena}. ` +
    `${ending} ` +
    `#CATFU @catfusolana`
  );
}

// ─── ShareBar ────────────────────────────────────────────────────────────────

interface ShareBarProps {
  fighter1: string;
  fighter2: string;
  battleResult: BattleResult;
  onFightAgain: () => void;
  onReset: () => void;
}

export default function ShareBar({ fighter1, fighter2, battleResult, onFightAgain, onReset }: ShareBarProps) {
  const [copyState, setCopyState] = useState<"idle" | "copied" | "error">("idle");

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(buildCopyText(battleResult, fighter1, fighter2));
      setCopyState("copied");
      setTimeout(() => setCopyState("idle"), 2800);
    } catch {
      setCopyState("error");
      setTimeout(() => setCopyState("idle"), 2800);
    }
  };

  const handleTweet = () => {
    const text = buildTweet(battleResult, fighter1, fighter2);
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`,
      "_blank", "noopener,noreferrer"
    );
  };

  const copyColor  = copyState === "copied" ? "#4ade80" : copyState === "error" ? "var(--crimson-hot)" : "var(--gold)";
  const copyBorder = copyState === "copied" ? "rgba(74,222,128,0.38)" : copyState === "error" ? "rgba(239,68,68,0.38)" : "rgba(201,162,39,0.28)";
  const copyBg     = copyState === "copied" ? "rgba(74,222,128,0.08)" : copyState === "error" ? "rgba(239,68,68,0.08)" : "rgba(201,162,39,0.06)";
  const copyLabel  = copyState === "copied" ? "✓  Copied!" : copyState === "error" ? "✗  Failed" : "⎘  Copy Result";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>

      {/* Primary row: Copy + Tweet */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
        <Btn onClick={handleCopy} bg={copyBg} border={copyBorder} color={copyColor}>
          {copyLabel}
        </Btn>
        <Btn onClick={handleTweet} bg="rgba(255,255,255,0.04)" border="rgba(255,255,255,0.12)" color="var(--parchment)">
          <XLogo /> Share on X
        </Btn>
      </div>

      {/* Secondary row: Fight Again + Reset */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
        <Btn onClick={onFightAgain} bg="rgba(185,28,28,0.1)" border="rgba(185,28,28,0.32)" color="var(--crimson-hot)">
          ⚔  Fight Again
        </Btn>
        <Btn onClick={onReset} bg="transparent" border="rgba(255,255,255,0.06)" color="var(--parchment-dim)">
          ↺  Reset
        </Btn>
      </div>

      {/* Clipboard feedback toast */}
      <div
        role="status"
        aria-live="polite"
        style={{
          overflow: "hidden",
          maxHeight: copyState !== "idle" ? "56px" : "0px",
          opacity: copyState !== "idle" ? 1 : 0,
          transition: "max-height 0.25s ease, opacity 0.25s ease",
        }}
      >
        <div style={{
          display: "flex", alignItems: "center", gap: "10px",
          padding: "10px 14px", marginTop: "2px",
          background: copyState === "copied" ? "rgba(74,222,128,0.07)" : "rgba(239,68,68,0.07)",
          border: `1px solid ${copyState === "copied" ? "rgba(74,222,128,0.28)" : "rgba(239,68,68,0.28)"}`,
        }}>
          <span aria-hidden style={{ fontSize: "1rem" }}>{copyState === "copied" ? "📋" : "⚠️"}</span>
          <p style={{
            fontFamily: "var(--font-b)", fontSize: "0.85rem", fontStyle: "italic",
            color: copyState === "copied" ? "#4ade80" : "var(--crimson-hot)",
          }}>
            {copyState === "copied"
              ? "Scroll copied. Post it. Let the dojo know."
              : "Clipboard refused. The dojo spirits are not pleased. Try again."}
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Btn ─────────────────────────────────────────────────────────────────────

function Btn({ onClick, bg, border, color, children }: {
  onClick: () => void;
  bg: string; border: string; color: string;
  children: React.ReactNode;
}) {
  const [pressed, setPressed] = useState(false);
  return (
    <button
      onClick={() => { setPressed(true); setTimeout(() => setPressed(false), 130); onClick(); }}
      className="share-btn"
      style={{
        background: bg,
        border: `1px solid ${border}`,
        color,
        fontSize: "clamp(0.57rem,1.8vw,0.67rem)",
        fontWeight: 700,
        display: "flex", alignItems: "center", justifyContent: "center", gap: "7px",
        padding: "12px 14px",
        transform: pressed ? "scale(0.95) translateY(1px)" : undefined,
        transition: "transform 0.1s ease",
      }}
    >
      {children}
    </button>
  );
}

function XLogo() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.254 5.622 5.91-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}
