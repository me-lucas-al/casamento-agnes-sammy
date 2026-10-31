"use client";

import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/shared/lib/utils";
import { getTourStepDefinition, type TourStepId } from "../lib/build-tour-steps";
import { TornPaperStage } from "./torn-paper-stage";
import { useTourControls } from "./tour-controls";

type StepFrameProps = {
  stepId: TourStepId;
  eyebrow: string;
  title: string;
  audience?: "noivos" | "convidado";
  tips?: readonly string[];
  mockup: ReactNode;
  children: ReactNode;
};

export function StepFrame({ stepId, eyebrow, title, audience = "noivos", tips = [], mockup, children }: StepFrameProps) {
  const { closeTour } = useTourControls();
  const { href, hrefLabel } = getTourStepDefinition(stepId);
  return (
    <article className="grid items-center gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-10">
      <div className="flex flex-col gap-3">
        <span
          className={cn(
            "w-fit rounded-full px-4 py-1 text-base font-semibold tracking-wide",
            audience === "noivos" ? "bg-blush text-wine" : "bg-wine text-paper",
          )}
        >
          {eyebrow}
        </span>
        <h2 data-tour-heading tabIndex={-1} className="font-heading text-4xl italic leading-tight text-wine outline-none md:text-5xl">
          {title}
        </h2>
        <div aria-hidden className="flex w-36 items-center gap-2 text-rose-soft">
          <span className="h-px flex-1 bg-gold/70" />
          <span className="text-xs">&#9829;</span>
          <span className="h-px flex-1 bg-gold/70" />
        </div>
        <div className="flex flex-col gap-2 text-lg leading-snug">{children}</div>
        {tips.length > 0 ? (
          <ul className="flex flex-col gap-1.5 text-lg">
            {tips.map((tip) => (
              <li key={tip} className="flex gap-2">
                <span aria-hidden className="mt-1 text-sm text-rose">&#9829;</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        ) : null}
        {href && hrefLabel ? (
          <Link
            href={href}
            onClick={closeTour}
            className="mt-1 inline-flex min-h-11 w-fit items-center gap-1.5 rounded-full bg-crimson px-5 text-base font-semibold text-paper transition-colors hover:bg-wine"
          >
            {hrefLabel}
            <ArrowUpRight aria-hidden className="size-4" />
          </Link>
        ) : null}
      </div>
      <TornPaperStage>{mockup}</TornPaperStage>
    </article>
  );
}
