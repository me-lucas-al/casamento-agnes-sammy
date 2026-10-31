import { StepFrame } from "../step-frame";
import { GiftModesMockup } from "../mockups/gift-modes-mockup";

export function GiftsStep() {
  return (
    <StepFrame
      stepId="gifts"
      eyebrow="Para Agnes e Sammy"
      title="A lista de presentes, do jeito de vocês"
      tips={[
        "Organize por categorias: casa, cozinha, lua de mel.",
        "Cada presente tem uma foto e pode ficar oculto até estar pronto.",
        "Item único, cotas fixas ou valor livre: escolha o modo de cada presente.",
      ]}
      mockup={<GiftModesMockup />}
    >
      <p>Cotas deixam vários convidados dividirem um presente maior. Brinquem com a simulação e vejam o que o convidado enxerga.</p>
    </StepFrame>
  );
}
