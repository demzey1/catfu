"use client";

import CABadge from "./CABadge";

export default function HeroSection() {
  return (
    <header
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        padding: "clamp(48px,10vw,80px) 24px clamp(32px,6vw,48px)",
        overflow: "hidden",
      }}
    >
      {/* Hero glow halo */}
      <div className="hero-glow" aria-hidden />

      {/* Kanji ghost */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: "50%", left: "50%",
          transform: "translate(-50%, -54%)",
          fontFamily: "var(--font-d)",
          fontSize: "clamp(180px, 38vw, 360px)",
          fontWeight: 900,
          color: "rgba(201,162,39,0.028)",
          userSelect: "none",
          pointerEvents: "none",
          lineHeight: 1,
          zIndex: 0,
        }}
      >
        武
      </div>

      {/* Content */}
      <div className="hero-float" style={{ position: "relative", zIndex: 1 }}>

        {/* Eyebrow */}
        <p
          style={{
            fontFamily: "var(--font-d)",
            fontSize: "0.6rem",
            letterSpacing: "0.5em",
            textTransform: "uppercase",
            color: "var(--gold)",
            opacity: 0.65,
            marginBottom: "16px",
          }}
        >
          ⚔ &ensp; Enter the Dojo &ensp; ⚔
        </p>

        {/* Main title */}
        <h1
          className="text-shimmer"
          style={{
            fontFamily: "var(--font-d)",
            fontSize: "clamp(3.8rem, 16vw, 8rem)",
            fontWeight: 900,
            lineHeight: 0.92,
            letterSpacing: "-0.03em",
            display: "block",
          }}
        >
          CatFu
        </h1>

        {/* Sub-title on a badge */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "10px",
            marginTop: "10px",
          }}
        >
          <span
            style={{
              display: "block",
              width: "28px",
              height: "1px",
              background: "var(--crimson)",
              opacity: 0.7,
            }}
          />
          <h2
            style={{
              fontFamily: "var(--font-d)",
              fontSize: "clamp(0.62rem, 2.2vw, 0.88rem)",
              fontWeight: 700,
              letterSpacing: "0.35em",
              textTransform: "uppercase",
              color: "var(--crimson-hot)",
            }}
          >
            Dojo Battle Generator
          </h2>
          <span
            style={{
              display: "block",
              width: "28px",
              height: "1px",
              background: "var(--crimson)",
              opacity: 0.7,
            }}
          />
        </div>

        {/* Subtitle */}
        <p
          style={{
            fontFamily: "var(--font-b)",
            fontSize: "clamp(0.95rem, 2.8vw, 1.1rem)",
            fontStyle: "italic",
            color: "var(--parchment-dim)",
            lineHeight: 1.65,
            marginTop: "20px",
            maxWidth: "340px",
          }}
        >
          Two cats enter. One legend leaves.<br />
          The dojo decides everything.
        </p>

        {/* CA Badge */}
        <CABadge />
      </div>

      {/* Ornamental divider */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "14px",
          marginTop: "clamp(24px, 5vw, 36px)",
          opacity: 0.55,
          position: "relative",
          zIndex: 1,
        }}
      >
        <div style={{ width: "clamp(40px,10vw,80px)", height: "1px",
          background: "linear-gradient(90deg, transparent, var(--gold))" }} />
        <span style={{ fontFamily: "var(--font-d)", fontSize: "1rem", color: "var(--gold)", letterSpacing: "0.1em" }}>
          猫
        </span>
        <div style={{ width: "clamp(40px,10vw,80px)", height: "1px",
          background: "linear-gradient(90deg, var(--gold), transparent)" }} />
      </div>
    </header>
  );
}
