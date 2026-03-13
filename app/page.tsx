"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import HeroSection from "@/components/HeroSection";
import FighterInput from "@/components/FighterInput";
import ModeToggle, { DojoMode } from "@/components/ModeToggle";
import BattleButton from "@/components/BattleButton";
import ResultCard from "@/components/ResultCard";
import ShareBar from "@/components/ShareBar";
import SenseiComment from "@/components/SenseiComment";
import CABadge from "@/components/CABadge";
import { generateBattle, type BattleResult } from "@/lib/battleGenerator";

const LS_F1 = "catfu_f1";
const LS_F2 = "catfu_f2";

const lsGet = (k: string) => { try { return typeof window !== "undefined" ? localStorage.getItem(k) : null; } catch { return null; } };
const lsSet = (k: string, v: string) => { try { if (typeof window !== "undefined") localStorage.setItem(k, v); } catch {} };
const lsDel = (k: string) => { try { if (typeof window !== "undefined") localStorage.removeItem(k); } catch {} };

function normalize(s: string) { return s.trim().toLowerCase().replace(/\s+/g, " "); }

export default function HomePage() {
  const [f1, setF1] = useState("");
  const [f2, setF2] = useState("");
  const [mode, setMode]   = useState<DojoMode>("serious");
  const [result, setResult] = useState<BattleResult | null>(null);
  const [loading, setLoading]   = useState(false);
  const [shaking, setShaking]   = useState(false);
  const [flashing, setFlashing] = useState(false);
  const [sameNameWarn, setSameNameWarn] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  // Restore names from localStorage
  useEffect(() => {
    try {
      const a = lsGet(LS_F1);
      const b = lsGet(LS_F2);
      if (a) setF1(a);
      if (b) setF2(b);
    } catch {}
  }, []);

  const persist = (key: string, v: string) => lsSet(key, v);
  const setF1Persist = (v: string) => { setF1(v); persist(LS_F1, v); setSameNameWarn(false); };
  const setF2Persist = (v: string) => { setF2(v); persist(LS_F2, v); setSameNameWarn(false); };

  const canBattle = f1.trim().length > 0 && f2.trim().length > 0;
  const isSameName = canBattle && normalize(f1) === normalize(f2);

  const runBattle = useCallback(async (a: string, b: string, m: DojoMode) => {
    if (!a || !b) return;

    // Same-name guard — still allow it but it's a cat fighting itself, which is fine actually
    setLoading(true);
    setResult(null);
    setShaking(false);
    setFlashing(false);
    setSameNameWarn(false);

    await new Promise((r) => setTimeout(r, 1300));

    setResult(generateBattle(a, b, m));
    setLoading(false);
    setFlashing(true);
    setTimeout(() => setFlashing(false), 650);
    setTimeout(() => { setShaking(true); setTimeout(() => setShaking(false), 450); }, 90);
    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, 220);
  }, []);

  const handleBattle     = () => {
    if (isSameName) { setSameNameWarn(true); return; }
    runBattle(f1.trim(), f2.trim(), mode);
  };
  const handleFightAgain = () => runBattle(f1.trim(), f2.trim(), mode);
  const handleReset      = () => {
    setF1(""); setF2(""); setResult(null); setLoading(false); setSameNameWarn(false);
    lsDel(LS_F1); lsDel(LS_F2);
  };

  return (
    <main style={{ position: "relative", minHeight: "100dvh", display: "flex", flexDirection: "column", alignItems: "center" }}>

      {/* Ambient orbs */}
      <div className="orb orb-gold"    style={{ width: 560, height: 560, top: -120, left: -180, zIndex: 0 }} aria-hidden />
      <div className="orb orb-crimson" style={{ width: 480, height: 480, bottom: "8%", right: -140, zIndex: 0 }} aria-hidden />
      <div className="orb orb-gold"    style={{ width: 280, height: 280, top: "45%", right: -60, zIndex: 0, opacity: 0.5 }} aria-hidden />

      {/* Hero */}
      <div style={{ position: "relative", zIndex: 1, width: "100%" }}>
        <HeroSection />
      </div>

      {/* Main column */}
      <div style={{
        position: "relative", zIndex: 1,
        width: "100%", maxWidth: "540px",
        padding: "0 clamp(16px,5vw,24px) 64px",
        display: "flex", flexDirection: "column",
        gap: "clamp(20px,4vw,26px)",
      }}>

        {/* Fighter inputs — responsive grid */}
        <div className="fighter-grid">
          <FighterInput label="Fighter One" placeholder="e.g. Mr. Whiskers"
            value={f1} onChange={setF1Persist} side="left" inputId="fighter1" />
          <FighterInput label="Fighter Two" placeholder="e.g. Lady Clawsworth"
            value={f2} onChange={setF2Persist} side="right" inputId="fighter2" />
        </div>

        {/* Same-name warning */}
        {sameNameWarn && (
          <p style={{
            fontFamily: "var(--font-b)", fontSize: "0.85rem", fontStyle: "italic",
            color: "var(--crimson-hot)", textAlign: "center", opacity: 0.9,
            animation: "staggerIn 0.3s ease both",
          }}>
            ⚠ A cat cannot battle itself. The dojo requires two distinct warriors.
          </p>
        )}

        <ModeToggle mode={mode} onChange={setMode} />

        <BattleButton onClick={handleBattle} isLoading={loading} disabled={!canBattle} />

        {/* Result area */}
        <div ref={resultRef} className={shaking ? "dojo-shake" : ""} style={{ position: "relative" }}>
          {flashing && <div className="result-flash" aria-hidden />}
          <ResultCard fighter1={f1.trim()} fighter2={f2.trim()} mode={mode} battleResult={result} isLoading={loading} />
        </div>

        {/* Share bar */}
        {result && !loading && (
          <>
            <SenseiComment
              senseiName={result.senseiName}
              comment={result.senseiComment}
            />
            <ShareBar fighter1={f1.trim()} fighter2={f2.trim()} battleResult={result} onFightAgain={handleFightAgain} onReset={handleReset} />
          </>
        )}
      </div>

      {/* Footer */}
      <footer style={{
        position: "relative", zIndex: 1,
        width: "100%", padding: "0 24px 40px",
        display: "flex", flexDirection: "column", alignItems: "center", gap: 12,
      }}>
        <div style={{ width: "60px", height: "1px", opacity: 0.22,
          background: "linear-gradient(90deg, transparent, var(--gold), transparent)" }} />
        <CABadge large />
        <p style={{ fontFamily: "var(--font-d)", fontSize: "0.5rem",
          letterSpacing: "0.35em", textTransform: "uppercase",
          color: "var(--parchment-dim)", opacity: 0.22 }}>
          CatFu Dojo · Est. Ancient Times
        </p>
      </footer>
    </main>
  );
}
