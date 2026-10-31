import { StepFrame } from "../step-frame";
import { InviteMockup } from "../mockups/invite-mockup";

export function InviteStep() {
  return (
    <StepFrame
      stepId="invite"
      eyebrow="Como convidar"
      title="Cada convidado ganha um código"
      tips={[
        "Cadastre o nome e quantas vagas o grupo tem (família conta como um só convite).",
        "O site cria o código de 8 caracteres e o link /?codigo=XXXX.",
        "Toque em Enviar por WhatsApp: a mensagem já vai pronta.",
        "Mandou para a pessoa errada? Gere um novo código e o antigo deixa de valer.",
      ]}
      mockup={<InviteMockup />}
    >
      <p>Sem senha para decorar: quem tem o código entra. Veja a mensagem que sai pelo WhatsApp.</p>
    </StepFrame>
  );
}
