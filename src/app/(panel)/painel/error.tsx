"use client";

import { RouteErrorView } from "@/shared/ui/feedback/route-error-view";

type PanelErrorProps = { error: Error & { digest?: string }; reset: () => void };

export default function PanelError({ reset }: PanelErrorProps) {
  return <RouteErrorView reset={reset} />;
}
