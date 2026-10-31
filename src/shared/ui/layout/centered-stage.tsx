import Image from "next/image";
import type { ReactNode } from "react";
import { BrandFooter } from "./brand-footer";
import { FloralCorners } from "./floral-corners";

type CenteredStageProps = { children: ReactNode };

export function CenteredStage({ children }: CenteredStageProps) {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden">
      <FloralCorners area="top" className="w-28 sm:w-52" />
      <main className="relative z-10 mx-auto flex w-full max-w-sm flex-1 flex-col items-center justify-center gap-5 px-6 py-24 text-center">
        <Image src="/brand/monogram.png" alt="" width={168} height={300} priority className="h-28 w-auto" />
        {children}
      </main>
      <BrandFooter />
    </div>
  );
}
