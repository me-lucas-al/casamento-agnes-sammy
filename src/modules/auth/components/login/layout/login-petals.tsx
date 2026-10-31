const PETALS = [
  { left: "8%", size: 14, delay: "0s", duration: "16s" },
  { left: "24%", size: 10, delay: "5s", duration: "19s" },
  { left: "41%", size: 16, delay: "9s", duration: "22s" },
  { left: "58%", size: 11, delay: "2s", duration: "18s" },
  { left: "74%", size: 15, delay: "7s", duration: "21s" },
  { left: "90%", size: 12, delay: "12s", duration: "17s" },
] as const;

export function LoginPetals() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {PETALS.map((petal) => (
        <span
          key={petal.left}
          className="login-petal"
          style={{
            left: petal.left,
            width: petal.size,
            height: petal.size,
            animationDelay: petal.delay,
            animationDuration: petal.duration,
          }}
        />
      ))}
    </div>
  );
}
