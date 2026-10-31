import type { SocialCardCopy } from "./social-card-copy";

const PAPER = "#f6f1ea";
const WINE = "#5b1a2e";
const ROSE = "#b83a6b";
const GOLD = "#b8997a";

type SocialCardProps = { copy: SocialCardCopy; monogramSrc: string };

export function SocialCard({ copy, monogramSrc }: SocialCardProps) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: PAPER,
        fontFamily: "Cormorant",
        padding: 28,
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          border: `3px solid ${GOLD}`,
          borderRadius: 24,
          padding: "0 72px",
          gap: 72,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={monogramSrc} alt="" width={224} height={400} />
        <div style={{ display: "flex", flexDirection: "column", color: WINE }}>
          <div style={{ fontSize: 40, fontStyle: "italic", color: GOLD }}>vamos nos casar</div>
          <div style={{ fontSize: 112, fontStyle: "italic", lineHeight: 1.05 }}>{copy.coupleNames}</div>
          <div style={{ width: 280, height: 3, background: GOLD, margin: "28px 0" }} />
          <div style={{ fontSize: 58, color: ROSE }}>{copy.dateText}</div>
          <div style={{ fontSize: 38, marginTop: 8 }}>{copy.venueText}</div>
        </div>
      </div>
    </div>
  );
}
