import { StepFrame } from "../step-frame";
import { GuestViewsMockup } from "../mockups/guest-views-mockup";

export function GuestViewStep() {
  return (
    <StepFrame
      stepId="guest-view"
      eyebrow="O que o convidado vê"
      audience="convidado"
      title="Como tudo aparece para ele"
      tips={[
        "Início com a contagem regressiva e o convite digital.",
        "Presentes mostram só o estado: disponível, X de N cotas ou completo. Nenhum nome de doador.",
        "Ao reservar, ele pode presentear sem mostrar o nome.",
        "A tela Pix traz QR code e copia e cola. Em Meus presentes ele acompanha tudo.",
      ]}
      mockup={<GuestViewsMockup />}
    >
      <p>Toque nas telas e passeie como se estivesse no celular de um convidado.</p>
    </StepFrame>
  );
}
