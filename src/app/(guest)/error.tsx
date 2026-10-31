"use client";

import { RouteErrorView } from "@/shared/ui/feedback/route-error-view";

type GuestErrorProps = { error: Error & { digest?: string }; reset: () => void };

export default function GuestError({ reset }: GuestErrorProps) {
  return <RouteErrorView reset={reset} />;
}
