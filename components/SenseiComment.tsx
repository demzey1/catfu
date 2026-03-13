"use client";

interface SenseiCommentProps {
  senseiName: string;
  comment: string;
}

export default function SenseiComment({ senseiName, comment }: SenseiCommentProps) {
  return (
    <div
      style={{
        position: "relative",
        padding: "20px 22px 18px",
        background: "linear-gradient(135deg, rgba(201,162,39,0.05) 0%, rgba(26,20,16,0.9) 100%)",
        border: "1px solid rgba(201,162,39,0.2)",
        animation: "senseiReveal 0.6s cubic-bezier(0.16,1,0.3,1) 0.9s both",
        opacity: 0,
      }}
    >
      {/* Left accent bar */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: 0, left: 0,
          width: "2px", height: "100%",
          background: "linear-gradient(180deg, var(--gold), transparent)",
          opacity: 0.6,
        }}
      />

      {/* Sensei label */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
        <span aria-hidden style={{ fontSize: "1rem" }}>🧘</span>
        <span
          style={{
            fontFamily: "var(--font-d)",
            fontSize: "0.54rem",
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            color: "var(--gold)",
            opacity: 0.75,
          }}
        >
          {senseiName} weighs in
        </span>
      </div>

      {/* The comment */}
      <p
        style={{
          fontFamily: "var(--font-b)",
          fontSize: "clamp(0.92rem, 2.8vw, 1.05rem)",
          fontStyle: "italic",
          color: "var(--parchment)",
          lineHeight: 1.72,
          opacity: 0.92,
        }}
      >
        {comment}
      </p>
    </div>
  );
}
