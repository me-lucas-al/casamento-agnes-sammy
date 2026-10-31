import { StepFrame } from "../step-frame";
import { GuestEntryMockup } from "../mockups/guest-entry-mockup";

export function GuestEntryStep() {
  return (
    <StepFrame
      stepId="guest-entry"
      eyebrow="O que o convidado faz"
      audience="convidado"
      title="Como o convidado entra e se apresenta"
      tips={[
        "Ele abre o link, o código já vem preenchido e basta entrar.",
        "No primeiro acesso, confirma nome, telefone e e-mail e cadastra os familiares (até vagas menos 1).",
        "Ele só edita o próprio perfil, a presença e o carrinho de presentes. Nada além disso.",
      ]}
      mockup={<GuestEntryMockup />}
    >
      <p>Alterne entre as duas telas para ver o caminho do convidado, do código ao primeiro cadastro.</p>
    </StepFrame>
  );
}
