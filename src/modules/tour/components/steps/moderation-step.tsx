import { StepFrame } from "../step-frame";
import { ModerationMockup } from "../mockups/moderation-mockup";

export function ModerationStep() {
  return (
    <StepFrame
      stepId="moderation"
      eyebrow="Para Agnes e Sammy"
      title="Recados e fotos com o seu aval"
      tips={[
        "Tudo que os convidados enviam chega como pendente.",
        "Só o que vocês aprovam aparece para os outros convidados.",
        "Vocês também podem enviar as fotos do casal pela tela Fotos.",
      ]}
      mockup={<ModerationMockup />}
    >
      <p>Testem os botões: aprovar publica, rejeitar esconde. Vocês têm sempre a palavra final.</p>
    </StepFrame>
  );
}
