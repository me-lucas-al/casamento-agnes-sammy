import Image from "next/image";
import { StepFrame } from "../step-frame";
import { TourChecklist } from "../tour-checklist";

function FinalMockup() {
  return (
    <div className="flex flex-col items-center gap-2 py-4 text-center">
      <Image src="/brand/monogram.png" alt="" width={168} height={300} className="h-36 w-auto" />
      <p className="font-script text-5xl leading-none text-rose">Save the Date</p>
      <p className="font-display text-2xl text-rose">
        07 <span className="text-base">&#9829;</span> 11 <span className="text-base">&#9829;</span> 26
      </p>
      <p className="rounded-full bg-blush px-5 py-1.5 text-lg">com carinho, Agnes e Sammy</p>
    </div>
  );
}

export function FinalStep() {
  return (
    <StepFrame stepId="final" eyebrow="Tudo pronto" title="Agora é com vocês" mockup={<FinalMockup />}>
      <p>Falta pouco para o site ficar completo. Toquem em um item para ir direto à tela certa:</p>
      <TourChecklist />
      <p>O tour fica sempre à mão em Rever tour, no menu e na tela inicial.</p>
    </StepFrame>
  );
}
