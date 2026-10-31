import { cn } from "@/shared/lib/styling/utils";

const TONES = {
  neutral: "bg-paper-dark text-wine",
  warning: "bg-gold/30 text-wine",
  success: "bg-rose text-white",
  danger: "bg-crimson/15 text-crimson",
} as const;

type MockBadgeProps = { tone?: keyof typeof TONES; children: string };

export function MockBadge({ tone = "neutral", children }: MockBadgeProps) {
  return (
    <span className={cn("inline-flex w-fit items-center rounded-full px-3 py-0.5 text-sm font-semibold", TONES[tone])}>
      {children}
    </span>
  );
}
