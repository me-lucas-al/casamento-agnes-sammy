import { StepFrame } from "../step-frame";
import { WelcomeMockup } from "../mockups/welcome-mockup";

export function WelcomeStep() {
  return (
    <StepFrame
      stepId="welcome"
      eyebrow="Para Agnes e Sammy"
      title="Bem-vindos ao site de vocês"
      tips={[
        "Lista de presentes com Pix direto na conta de vocês, sem taxa.",
        "Confirmação de presença (RSVP) com acompanhantes.",
        "Recados carinhosos e galeria de fotos, tudo moderado por vocês.",
      ]}
      mockup={<WelcomeMockup />}
    >
      <p>Que alegria ter vocês aqui! Este é o cantinho digital do casamento, feito com o mesmo carinho do convite.</p>
      <p>Em poucos passos vocês veem o que o site faz e o que falta preencher. Dá para pular a qualquer momento.</p>
    </StepFrame>
  );
}
