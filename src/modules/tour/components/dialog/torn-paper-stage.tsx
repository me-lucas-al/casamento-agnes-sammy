import type { ReactNode } from "react";

const TORN_EDGE =
  "polygon(0 3%, 6% 0, 13% 2.5%, 21% 0.5%, 30% 3%, 39% 0, 48% 2%, 57% 0.5%, 66% 3%, 75% 0, 84% 2.5%, 92% 0.5%, 100% 2%, 100% 97%, 94% 100%, 86% 97.5%, 77% 100%, 68% 97%, 59% 100%, 50% 97.5%, 41% 100%, 32% 97%, 23% 100%, 14% 97.5%, 7% 100%, 0 97.5%)";

type TornPaperStageProps = { children: ReactNode };

export function TornPaperStage({ children }: TornPaperStageProps) {
  return (
    <div
      style={{ clipPath: TORN_EDGE }}
      className="flex min-w-0 justify-center bg-paper-dark px-3 py-7 shadow-inner sm:px-6"
    >
      <div className="flex w-full min-w-0 justify-center">{children}</div>
    </div>
  );
}
