import { StepFrame } from "@/modules/tour/components/dialog/step-frame";
import { RsvpMockup } from "@/modules/tour/components/mockups/panel/rsvp-mockup";

export function RsvpStep() {
  return (
    <StepFrame
      stepId="rsvp"
      eyebrow="Para Agnes e Sammy"
      title="Quem vem à festa"
      tips={[
        "Veja quem confirmou, quem recusou e quem ainda não respondeu.",
        "O total de pessoas já soma os acompanhantes de cada grupo.",
      ]}
      mockup={<RsvpMockup />}
    >
      <p>Na tela Presenças, os números ficam sempre atualizados para vocês fecharem a lista com o restaurante.</p>
    </StepFrame>
  );
}
