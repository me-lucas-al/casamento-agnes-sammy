import { cn } from "@/shared/lib/utils";
import { describeAvailability } from "@/modules/gifts/lib/availability/describe-availability";
import type { AvailabilityState, GiftAvailability } from "@/modules/gifts/lib/availability/gift-availability";

const STATE_CLASS_NAMES: Record<AvailabilityState, string> = {
  available: "bg-blush text-wine",
  partial: "bg-rose/15 text-crimson",
  complete: "bg-wine text-paper",
};

export function GiftStatusBadge({ availability }: { availability: GiftAvailability }) {
  return (
    <span className={cn("inline-block rounded-full px-3 py-1 text-sm font-medium", STATE_CLASS_NAMES[availability.state])}>
      {describeAvailability(availability)}
    </span>
  );
}
