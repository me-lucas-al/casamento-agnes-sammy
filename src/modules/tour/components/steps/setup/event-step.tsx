import { StepFrame } from "@/modules/tour/components/dialog/step-frame";
import { EventFormMockup } from "@/modules/tour/components/mockups/panel/event-form-mockup";

export function EventStep() {
  return (
    <StepFrame
      stepId="event"
      eyebrow="Para Agnes e Sammy"
      title="Primeiro, os dados da festa"
      tips={[
        "Chave Pix: tipo, nome do recebedor e cidade. Sem isso, ninguém consegue presentear.",
        "Endereço e link do mapa para os convidados chegarem sem se perder.",
        "Nossa história: conte como tudo começou. Aparece na página do casamento.",
        "Prazo para confirmar presença: vocês podem estender quando quiserem.",
      ]}
      mockup={<EventFormMockup />}
    >
      <p>Tudo nasce na tela Evento. Os campos destacados no exemplo são os que mais importam.</p>
    </StepFrame>
  );
}
