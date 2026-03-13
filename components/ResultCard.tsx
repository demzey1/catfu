"use client";

import React, { useEffect, useState } from "react";
import type { BattleResult } from "@/lib/battleGenerator";
import type { DojoMode } from "./ModeToggle";

interface ResultCardProps {
  fighter1: string;
  fighter2: string;
  mode: DojoMode;
  battleResult?: BattleResult | null;
  isLoading?: boolean;
}

export default function ResultCard({ fighter1, fighter2, mode, battleResult, isLoading = false }: ResultCardProps) {
  const isEmpty = !battleResult && !isLoading;
  return (
    <section aria-label="Battle result">
      {isLoading    ? <LoadingState f1={fighter1} f2={fighter2} /> :
       isEmpty       ? <EmptyState /> :
       battleResult  ? <BattleCard f1={fighter1} f2={fighter2} mode={mode} b={battleResult} /> :
       null}
    </section>
  );
}

// ─── Empty ───────────────────────────────────────────────────────────────────

const EMPTY_LINES = [
  { icon: "🥋", copy: "Name your warriors above.\nThe dojo has been waiting." },
  { icon: "📜", copy: "The scroll is blank.\nTwo warriors must be named." },
  { icon: "⚔️", copy: "No battle has been declared.\nThe silence is deafening." },
];

function EmptyState() {
  const [which] = useState(() => EMPTY_LINES[Math.floor(Math.random() * EMPTY_LINES.length)]);
  return (
    <div style={{
      minHeight: "140px",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      gap: "12px", padding: "36px 24px", textAlign: "center",
      border: "1px dashed rgba(201,162,39,0.1)",
      background: "linear-gradient(180deg, var(--ink-panel) 0%, transparent 100%)",
      position: "relative",
    }}>
      <CornerBrackets color="rgba(201,162,39,0.18)" size={12} />
      <span aria-hidden style={{ fontSize: "1.8rem", opacity: 0.15 }}>{which.icon}</span>
      <div>
        <p className="micro-label" style={{ marginBottom: "8px" }}>Awaiting Combatants</p>
        <p style={{
          fontFamily: "var(--font-b)", fontSize: "0.9rem", fontStyle: "italic",
          color: "var(--parchment-dim)", opacity: 0.48, lineHeight: 1.65,
          whiteSpace: "pre-line",
        }}>{which.copy}</p>
      </div>
    </div>
  );
}

// ─── Loading ─────────────────────────────────────────────────────────────────

const LOADING_LINES = [
  "Consulting the ancient scrolls…",
  "Weighing the warriors' chi…",
  "Inspecting paw technique form…",
  "Flipping a celestial coin…",
  "Asking the referee (a pigeon)…",
  "Cross-referencing the Forbidden Scroll…",
  "Calculating hairball trajectory…",
  "Summoning the spirit of Grandmaster Fluffius…",
];

function LoadingState({ f1, f2 }: { f1: string; f2: string }) {
  const [idx, setIdx] = useState(0);
  const [vis, setVis] = useState(true);

  useEffect(() => {
    const id = setInterval(() => {
      setVis(false);
      setTimeout(() => { setIdx((i) => (i + 1) % LOADING_LINES.length); setVis(true); }, 220);
    }, 950);
    return () => clearInterval(id);
  }, []);

  return (
    <div style={{
      border: "1px solid rgba(201,162,39,0.18)",
      background: "var(--ink-panel)",
      padding: "32px 24px 28px",
      display: "flex", flexDirection: "column", alignItems: "center", gap: "20px",
      position: "relative",   // ← fixes the absolute stripe escaping
    }}>
      {/* Top stripe */}
      <div aria-hidden style={{
        position: "absolute", top: 0, left: 0, right: 0, height: "2px",
        background: "linear-gradient(90deg, transparent, rgba(201,162,39,0.4), transparent)",
      }} />

      {/* Fighter names */}
      <div className="loading-vs" style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <span style={{ fontFamily: "var(--font-d)", fontSize: "clamp(0.8rem,3vw,1rem)", fontWeight: 700, color: "var(--gold)" }}>
          {f1 || "Fighter 1"}
        </span>
        <div style={{
          width: "34px", height: "34px", borderRadius: "50%",
          border: "1px solid rgba(185,28,28,0.45)", background: "rgba(185,28,28,0.1)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <span style={{ fontFamily: "var(--font-d)", fontSize: "0.52rem", fontWeight: 900, color: "var(--crimson-hot)", letterSpacing: "0.1em" }}>VS</span>
        </div>
        <span style={{ fontFamily: "var(--font-d)", fontSize: "clamp(0.8rem,3vw,1rem)", fontWeight: 700, color: "var(--crimson)" }}>
          {f2 || "Fighter 2"}
        </span>
      </div>

      {/* Progress bar */}
      <div style={{ width: "100%", height: "1px", background: "rgba(201,162,39,0.08)", overflow: "hidden" }}>
        <div className="load-bar-fill" style={{ height: "100%", background: "linear-gradient(90deg, var(--gold-dim), var(--gold), var(--crimson))" }} />
      </div>

      {/* Cycling flavour text */}
      <p style={{
        fontFamily: "var(--font-b)", fontSize: "0.9rem", fontStyle: "italic",
        color: "var(--parchment-dim)", opacity: vis ? 0.75 : 0,
        transition: "opacity 0.22s ease", minHeight: "1.4em", textAlign: "center",
      }}>{LOADING_LINES[idx]}</p>

      {/* Skeleton */}
      <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "7px" }}>
        {[78, 92, 64, 85].map((w, i) => (
          <div key={i} className="skel" style={{ height: "7px", width: `${w}%`, margin: "0 auto", animationDelay: `${i * 0.18}s` }} />
        ))}
      </div>
    </div>
  );
}

// ─── Battle card ──────────────────────────────────────────────────────────────

function BattleCard({ f1, f2, mode, b }: { f1: string; f2: string; mode: DojoMode; b: BattleResult }) {
  const serious = mode === "serious";
  const f1wins  = b.winner === f1;

  return (
    <div style={{
      position: "relative",
      background: "linear-gradient(160deg, #141009 0%, #0b0804 55%, #150906 100%)",
      border: "1px solid rgba(201,162,39,0.28)",
      overflow: "hidden",
      animation: "cardIn 0.55s cubic-bezier(0.16,1,0.3,1) forwards",
    }}>
      {/* Atmosphere */}
      <div aria-hidden style={{ position: "absolute", inset: 0, pointerEvents: "none",
        backgroundImage:
          "radial-gradient(ellipse 100% 45% at 50% 0%, rgba(201,162,39,0.07) 0%, transparent 100%)," +
          "radial-gradient(ellipse 80% 35% at 50% 100%, rgba(185,28,28,0.06) 0%, transparent 100%)" }} />

      {/* Ghost kanji */}
      <div aria-hidden style={{
        position: "absolute", top: "50%", left: "50%",
        transform: "translate(-50%,-50%)",
        fontFamily: "var(--font-d)", fontSize: "clamp(160px,30vw,280px)",
        fontWeight: 900, color: "rgba(201,162,39,0.022)",
        pointerEvents: "none", userSelect: "none", lineHeight: 1,
      }}>武</div>

      {/* Top stripe */}
      <div aria-hidden style={{ height: "3px", background: "linear-gradient(90deg, transparent, var(--gold), var(--crimson), var(--gold), transparent)" }} />

      <div style={{ padding: "clamp(20px,5vw,32px)", position: "relative", zIndex: 1 }}>

        {/* Row 1: Header */}
        <Row delay="0.04s">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", opacity: 0.55 }}>
              <span aria-hidden style={{ fontSize: "0.85rem" }}>🐾</span>
              <span style={{ fontFamily: "var(--font-d)", fontSize: "0.52rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "var(--gold-dim)" }}>
                CatFu Dojo
              </span>
            </div>
            <ModeBadge mode={mode} />
          </div>
        </Row>

        <Spacer h={18} />

        {/* Row 2: Arena */}
        <Row delay="0.09s">
          <p className="micro-label" style={{ marginBottom: "5px" }}>📍 Arena</p>
          <p style={{
            fontFamily: "var(--font-d)", fontSize: "clamp(0.68rem,2.2vw,0.86rem)",
            color: "var(--parchment)", fontStyle: "italic", letterSpacing: "0.03em", lineHeight: 1.4,
            textAlign: "center",
          }}>{b.arena}</p>
        </Row>

        <Divider my={18} />

        {/* Row 3: Fighter clash */}
        <Row delay="0.15s">
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 4, padding: "6px 0 0" }}>

            {/* Left fighter */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1, gap: 4 }}>
              {f1wins && <span className="pulse-slow" aria-label="Champion" style={{ fontSize: "1.1rem", marginBottom: 2 }}>👑</span>}
              <div style={{ width: "clamp(72px,19vw,96px)" }}>
                <CatFighter fillColor={f1wins ? "#c9a227" : "#5a4e38"} glowColor={f1wins ? "#f5d050" : "#888"} winner={f1wins} defeated={!f1wins} />
              </div>
              <p style={{ fontFamily: "var(--font-d)", fontSize: "clamp(0.38rem,1.1vw,0.5rem)", letterSpacing: "0.14em", textTransform: "uppercase", color: f1wins ? "var(--gold-dim)" : "rgba(158,141,118,0.3)", lineHeight: 1.3, textAlign: "center", maxWidth: 90 }}>{b.fighter1Title}</p>
              <p style={{ fontFamily: "var(--font-d)", fontSize: "clamp(0.74rem,2.4vw,0.94rem)", fontWeight: 700, lineHeight: 1.15, color: f1wins ? "var(--gold)" : "var(--parchment-dim)", opacity: f1wins ? 1 : 0.38, wordBreak: "break-word", textAlign: "center" }}>{f1}</p>
              {!f1wins && <p style={{ fontFamily: "var(--font-b)", fontSize: "0.55rem", color: "var(--crimson)", fontStyle: "italic", opacity: 0.6 }}>defeated</p>}
            </div>

            {/* VS centre */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5, paddingBottom: 40, flexShrink: 0 }}>
              <div style={{ width: 42, height: 42, borderRadius: "50%", background: "radial-gradient(circle,rgba(185,28,28,0.28) 0%,transparent 75%)", border: "1px solid rgba(185,28,28,0.4)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontFamily: "var(--font-d)", fontSize: "0.58rem", fontWeight: 900, color: "var(--crimson-hot)", letterSpacing: "0.1em" }}>VS</span>
              </div>
              <span aria-hidden style={{ fontSize: "0.85rem", opacity: 0.5 }}>⚔️</span>
            </div>

            {/* Right fighter — mirrored */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1, gap: 4 }}>
              {!f1wins && <span className="pulse-slow" aria-label="Champion" style={{ fontSize: "1.1rem", marginBottom: 2 }}>👑</span>}
              <div style={{ width: "clamp(72px,19vw,96px)", transform: "scaleX(-1)" }}>
                <CatFighter fillColor={!f1wins ? "#c0392b" : "#5a4e38"} glowColor={!f1wins ? "#ff6060" : "#888"} winner={!f1wins} defeated={f1wins} />
              </div>
              <p style={{ fontFamily: "var(--font-d)", fontSize: "clamp(0.38rem,1.1vw,0.5rem)", letterSpacing: "0.14em", textTransform: "uppercase", color: !f1wins ? "rgba(192,57,43,0.85)" : "rgba(158,141,118,0.3)", lineHeight: 1.3, textAlign: "center", maxWidth: 90 }}>{b.fighter2Title}</p>
              <p style={{ fontFamily: "var(--font-d)", fontSize: "clamp(0.74rem,2.4vw,0.94rem)", fontWeight: 700, lineHeight: 1.15, color: !f1wins ? "var(--crimson-hot)" : "var(--parchment-dim)", opacity: !f1wins ? 1 : 0.38, wordBreak: "break-word", textAlign: "center" }}>{f2}</p>
              {f1wins && <p style={{ fontFamily: "var(--font-b)", fontSize: "0.55rem", color: "var(--crimson)", fontStyle: "italic", opacity: 0.6 }}>defeated</p>}
            </div>
          </div>
        </Row>

        <Divider my={18} />

        {/* Row 4: Opening moves */}
        <Row delay="0.22s">
          <p className="micro-label" style={{ textAlign: "center", marginBottom: "10px" }}>🐾 Opening Moves</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
            <MoveChip name={f1} move={b.openingMove1} color="gold" />
            <MoveChip name={f2} move={b.openingMove2} color="crimson" />
          </div>
        </Row>

        <Spacer h={14} />

        {/* Row 5: Finishing move */}
        <Row delay="0.29s">
          <p className="micro-label" style={{ textAlign: "center", marginBottom: "10px" }}>💥 Final Technique</p>
          <div style={{
            padding: "13px 18px",
            background: "linear-gradient(135deg, rgba(185,28,28,0.14) 0%, rgba(201,162,39,0.04) 100%)",
            border: "1px solid rgba(185,28,28,0.26)",
            position: "relative", overflow: "hidden",
          }}>
            <div aria-hidden style={{
              position: "absolute", top: 0, left: 0, width: "3px", height: "100%",
              background: "linear-gradient(180deg, var(--crimson-hot), var(--crimson))", opacity: 0.9,
            }} />
            <p style={{
              fontFamily: "var(--font-d)", fontSize: "clamp(0.78rem,2.5vw,0.96rem)",
              fontWeight: 700, color: "var(--crimson-hot)", textTransform: "uppercase",
              letterSpacing: "0.05em", lineHeight: 1.3,
            }}>{b.finishingMove}</p>
            <p style={{ fontFamily: "var(--font-b)", fontSize: "0.73rem", color: "var(--parchment-dim)", marginTop: "3px", opacity: 0.62 }}>
              delivered by {b.winnerTitle} {b.winner}
            </p>
          </div>
        </Row>

        <GoldDivider my={22} />

        {/* Row 6: Winner — centrepiece, delayed for drama */}
        <div style={{ animation: "winnerDrop 0.6s cubic-bezier(0.16,1,0.3,1) 0.36s both", opacity: 0 }}>

          <div style={{ textAlign: "center", marginBottom: "14px" }}>
            <p className="micro-label" style={{ marginBottom: "8px" }}>⚖ Verdict</p>
            <VerdictBadge verdict={b.verdict} mode={mode} />
          </div>

          <div style={{
            position: "relative", textAlign: "center",
            padding: "clamp(20px,5vw,28px) 20px",
            background: "radial-gradient(ellipse 100% 90% at 50% 50%, rgba(201,162,39,0.1) 0%, transparent 70%)",
            border: "1px solid rgba(201,162,39,0.26)",
          }}>
            <CornerBrackets color="rgba(201,162,39,0.45)" size={13} />

            <p style={{ fontFamily: "var(--font-d)", fontSize: "0.53rem", letterSpacing: "0.4em", textTransform: "uppercase", color: "var(--gold-dim)", marginBottom: "8px" }}>
              🏆 Champion
            </p>

            {/* THE WINNER — dominant type */}
            <p style={{
              fontFamily: "var(--font-d)",
              fontSize: "clamp(2.2rem,9vw,3.2rem)",
              fontWeight: 900, lineHeight: 1, letterSpacing: "-0.02em",
              background: "linear-gradient(160deg, var(--gold-dim) 0%, var(--gold-hot) 40%, #fff9e0 55%, var(--gold-hot) 70%, var(--gold-dim) 100%)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
              marginBottom: "6px",
              wordBreak: "break-word",
            }}>{b.winner}</p>

            <p style={{ fontFamily: "var(--font-d)", fontSize: "clamp(0.55rem,1.8vw,0.7rem)", letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--gold)", opacity: 0.65 }}>
              {b.winnerTitle}
            </p>

            <div aria-hidden style={{ width: "36px", height: "1px", background: "rgba(201,162,39,0.22)", margin: "12px auto 10px" }} />

            <p style={{ fontFamily: "var(--font-b)", fontSize: "0.73rem", color: "var(--parchment-dim)", opacity: 0.38, fontStyle: "italic" }}>
              {b.loser} has been defeated.
            </p>
          </div>
        </div>

        <Spacer h={20} />

        {/* Row 7: Ending line */}
        <Row delay="0.52s">
          <p className="micro-label" style={{ textAlign: "center", marginBottom: "10px" }}>📜 Ending Line</p>
          <p style={{
            fontFamily: "var(--font-b)", fontSize: "clamp(0.95rem,3vw,1.08rem)",
            color: "var(--parchment)", fontStyle: "italic", lineHeight: 1.72,
            textAlign: "center", opacity: 0.88,
          }}>{b.endingLine}</p>
        </Row>

        {/* Row 8: Rare event */}
        {b.rareEvent && (
          <div style={{
            marginTop: "20px", padding: "15px 18px",
            background: "linear-gradient(135deg, rgba(185,28,28,0.2) 0%, rgba(100,0,0,0.1) 100%)",
            border: "1px solid rgba(239,68,68,0.4)",
            position: "relative", overflow: "hidden",
            animation: "rareSlide 0.55s cubic-bezier(0.16,1,0.3,1) 0.62s both", opacity: 0,
          }}>
            <div className="pulse-slow" aria-hidden style={{
              position: "absolute", top: 0, left: 0, width: "3px", height: "100%",
              background: "var(--crimson-hot)",
            }} />
            <p style={{ fontFamily: "var(--font-d)", fontSize: "0.58rem", letterSpacing: "0.28em", textTransform: "uppercase", color: "var(--crimson-hot)", fontWeight: 700, marginBottom: "8px" }}>
              {b.rareEvent.label}
            </p>
            <p style={{ fontFamily: "var(--font-b)", fontSize: "clamp(0.88rem,2.5vw,1rem)", color: "var(--parchment)", fontStyle: "italic", lineHeight: 1.65 }}>
              {b.rareEvent.description(f1, f2)}
            </p>
          </div>
        )}

        {/* Footer seal */}
        <div aria-hidden style={{
          marginTop: "24px", display: "flex", alignItems: "center", gap: "12px", opacity: 0.28,
          animation: "staggerIn 0.4s ease 0.72s both",
        }}>
          <div style={{ flex: 1, height: "1px", background: "linear-gradient(90deg, transparent, var(--gold))" }} />
          <span style={{ fontFamily: "var(--font-d)", fontSize: "0.75rem", color: "var(--gold)" }}>猫</span>
          <div style={{ flex: 1, height: "1px", background: "linear-gradient(90deg, var(--gold), transparent)" }} />
        </div>
      </div>

      {/* Bottom stripe */}
      <div aria-hidden style={{ height: "3px", background: "linear-gradient(90deg, transparent, var(--crimson), var(--gold-dim), var(--crimson), transparent)" }} />
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Row({ children, delay = "0s" }: { children: React.ReactNode; delay?: string }) {
  return <div style={{ animation: `staggerIn 0.38s ease ${delay} both`, opacity: 0 }}>{children}</div>;
}
function Spacer({ h }: { h: number }) { return <div aria-hidden style={{ height: `${h}px` }} />; }
function Divider({ my = 16 }: { my?: number }) {
  return <div aria-hidden style={{ height: "1px", margin: `${my}px 0`, background: "linear-gradient(90deg, transparent, rgba(201,162,39,0.13), transparent)" }} />;
}
function GoldDivider({ my = 16 }: { my?: number }) {
  return <div aria-hidden style={{ height: "1px", margin: `${my}px 0`, background: "linear-gradient(90deg, transparent, rgba(201,162,39,0.42), var(--crimson), rgba(201,162,39,0.42), transparent)" }} />;
}

function CornerBrackets({ color, size }: { color: string; size: number }) {
  return (
    <>
      {[
        { top: 0, left: 0,  borderTop: "2px solid", borderLeft: "2px solid"   },
        { top: 0, right: 0, borderTop: "2px solid", borderRight: "2px solid"  },
        { bottom: 0, left: 0,  borderBottom: "2px solid", borderLeft: "2px solid"  },
        { bottom: 0, right: 0, borderBottom: "2px solid", borderRight: "2px solid" },
      ].map((c, i) => (
        <span key={i} aria-hidden style={{ position: "absolute", width: size, height: size, borderColor: color, ...c }} />
      ))}
    </>
  );
}

function CatFighter({ fillColor, glowColor, winner, defeated }: { fillColor: string; glowColor: string; winner: boolean; defeated: boolean }) {
  return (
    <svg viewBox="0 0 100 112" width="100%" style={{
      filter: `drop-shadow(0 3px 10px ${glowColor}55)`,
      animation: winner ? "catFloat 2.6s ease-in-out infinite alternate" : defeated ? "catDefeated 0.4s ease forwards" : "none",
      opacity: defeated ? 0.55 : 1,
      transformOrigin: "bottom center",
      display: "block",
    }}>
      <path d="M28 82 Q8 66 12 46 Q15 32 24 38" stroke={fillColor} strokeWidth="5" fill="none" strokeLinecap="round" opacity="0.82"/>
      <ellipse cx="48" cy="74" rx="22" ry="24" fill={fillColor} opacity="0.88"/>
      <ellipse cx="58" cy="56" rx="12" ry="10" fill={fillColor} opacity="0.88"/>
      <circle cx="63" cy="38" r="22" fill={fillColor} opacity="0.93"/>
      <polygon points="47,22 43,6 57,20" fill={fillColor}/>
      <polygon points="47,21 45,11 55,20" fill={glowColor} opacity="0.22"/>
      <polygon points="70,18 78,4 83,20" fill={fillColor}/>
      <polygon points="71,18 77,8 81,20" fill={glowColor} opacity="0.22"/>
      <ellipse cx="56" cy="36" rx="4.5" ry="5.5" fill="#060402"/>
      <ellipse cx="70" cy="35" rx="4.5" ry="5.5" fill="#060402"/>
      <circle cx="57.5" cy="34" r="1.6" fill="white" opacity="0.85"/>
      <circle cx="71.5" cy="33" r="1.6" fill="white" opacity="0.85"/>
      <line x1="52" y1="28" x2="60" y2="30" stroke={fillColor} strokeWidth="2.5" strokeLinecap="round" opacity="0.6"/>
      <line x1="66" y1="27" x2="74" y2="30" stroke={fillColor} strokeWidth="2.5" strokeLinecap="round" opacity="0.6"/>
      <polygon points="63,44 60,48 66,48" fill="#100806" opacity="0.7"/>
      <path d="M60 48 Q63 51 66 48" stroke="#100806" strokeWidth="1.5" fill="none" opacity="0.55" strokeLinecap="round"/>
      <line x1="41" y1="44" x2="24" y2="41" stroke={fillColor} strokeWidth="1.8" opacity="0.85" strokeLinecap="round"/>
      <line x1="41" y1="47" x2="24" y2="47" stroke={fillColor} strokeWidth="1.8" opacity="0.85" strokeLinecap="round"/>
      <line x1="41" y1="50" x2="24" y2="53" stroke={fillColor} strokeWidth="1.8" opacity="0.85" strokeLinecap="round"/>
      <path d="M76 52 Q90 44 95 38" stroke={fillColor} strokeWidth="7" fill="none" strokeLinecap="round"/>
      <circle cx="95" cy="36" r="8" fill={fillColor} opacity="0.93"/>
      <line x1="90" y1="30" x2="88" y2="25" stroke={glowColor} strokeWidth="2" strokeLinecap="round" opacity="0.8"/>
      <line x1="95" y1="28" x2="94" y2="23" stroke={glowColor} strokeWidth="2" strokeLinecap="round" opacity="0.8"/>
      <line x1="100" y1="30" x2="101" y2="25" stroke={glowColor} strokeWidth="2" strokeLinecap="round" opacity="0.8"/>
      <path d="M34 62 Q22 57 18 52" stroke={fillColor} strokeWidth="6" fill="none" strokeLinecap="round"/>
      <circle cx="17" cy="50" r="7" fill={fillColor} opacity="0.9"/>
      <path d="M57 90 Q60 102 62 108" stroke={fillColor} strokeWidth="6.5" fill="none" strokeLinecap="round"/>
      <ellipse cx="61" cy="109" rx="9" ry="4" fill={fillColor} opacity="0.7"/>
      <path d="M35 88 Q30 100 28 107" stroke={fillColor} strokeWidth="6.5" fill="none" strokeLinecap="round"/>
      <ellipse cx="27" cy="108" rx="9" ry="4" fill={fillColor} opacity="0.7"/>
      {winner && <circle cx="63" cy="38" r="28" fill="none" stroke={glowColor} strokeWidth="1.5" opacity="0.35" strokeDasharray="4 3" style={{ animation: "pulse 2s ease-in-out infinite" }}/>}
      {defeated && (<>
        <line x1="52" y1="31" x2="61" y2="41" stroke="#fff" strokeWidth="2.5" opacity="0.7" strokeLinecap="round"/>
        <line x1="61" y1="31" x2="52" y2="41" stroke="#fff" strokeWidth="2.5" opacity="0.7" strokeLinecap="round"/>
        <line x1="65" y1="30" x2="75" y2="41" stroke="#fff" strokeWidth="2.5" opacity="0.7" strokeLinecap="round"/>
        <line x1="75" y1="30" x2="65" y2="41" stroke="#fff" strokeWidth="2.5" opacity="0.7" strokeLinecap="round"/>
      </>)}
    </svg>
  );
}

function MoveChip({ name, move, color }: { name: string; move: string; color: "gold"|"crimson" }) {
  const g = color === "gold";
  return (
    <div style={{ padding: "10px 12px", background: g ? "rgba(201,162,39,0.05)" : "rgba(185,28,28,0.06)", border: `1px solid ${g ? "rgba(201,162,39,0.16)" : "rgba(185,28,28,0.16)"}` }}>
      <p style={{ fontFamily: "var(--font-d)", fontSize: "0.48rem", letterSpacing: "0.18em", textTransform: "uppercase", color: g ? "var(--gold-dim)" : "rgba(185,28,28,0.72)", opacity: 0.85, marginBottom: "4px" }}>{name}</p>
      <p style={{ fontFamily: "var(--font-b)", fontSize: "clamp(0.76rem,2vw,0.86rem)", color: "var(--parchment)", fontStyle: "italic", lineHeight: 1.4 }}>{move}</p>
    </div>
  );
}

function ModeBadge({ mode }: { mode: DojoMode }) {
  return (
    <span style={{ fontFamily: "var(--font-d)", fontSize: "0.48rem", letterSpacing: "0.22em", textTransform: "uppercase", padding: "3px 9px", border: `1px solid ${mode === "serious" ? "rgba(201,162,39,0.32)" : "rgba(239,68,68,0.38)"}`, color: mode === "serious" ? "var(--gold)" : "var(--crimson-hot)", background: mode === "serious" ? "rgba(201,162,39,0.05)" : "rgba(185,28,28,0.07)" }}>
      {mode === "serious" ? "⚔ Serious" : "🌀 Chaotic"}
    </span>
  );
}

function VerdictBadge({ verdict, mode }: { verdict: string; mode: DojoMode }) {
  const s = mode === "serious";
  return (
    <span style={{ display: "inline-block", fontFamily: "var(--font-d)", fontSize: "clamp(0.5rem,1.8vw,0.66rem)", fontWeight: 900, letterSpacing: "0.28em", textTransform: "uppercase", color: s ? "var(--gold)" : "var(--crimson-hot)", border: `1px solid ${s ? "rgba(201,162,39,0.38)" : "rgba(239,68,68,0.38)"}`, padding: "5px 14px", background: s ? "rgba(201,162,39,0.06)" : "rgba(239,68,68,0.07)" }}>
      {verdict}
    </span>
  );
}
