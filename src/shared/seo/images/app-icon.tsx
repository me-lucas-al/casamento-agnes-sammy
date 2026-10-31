const PAPER = "#f6f1ea";
const GOLD = "#b8997a";

type AppIconProps = { monogramSrc: string; edge: number };

export function AppIcon({ monogramSrc, edge }: AppIconProps) {
  const monogramHeight = Math.round(edge * 0.72);
  const monogramWidth = Math.round(monogramHeight * (168 / 300));
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: PAPER,
        border: `${Math.max(2, Math.round(edge * 0.02))}px solid ${GOLD}`,
        borderRadius: Math.round(edge * 0.22),
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={monogramSrc} alt="" width={monogramWidth} height={monogramHeight} />
    </div>
  );
}
