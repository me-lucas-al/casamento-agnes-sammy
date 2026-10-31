import { StepFrame } from "@/modules/tour/components/dialog/step-frame";
import { PaymentsMockup } from "@/modules/tour/components/mockups/panel/payments-mockup";

export function PaymentsStep() {
  return (
    <StepFrame
      stepId="payments"
      eyebrow="Para Agnes e Sammy"
      title="Pagamentos: confirmar o Pix"
      tips={[
        "O Pix cai direto na conta de vocês. Depois, confirmem aqui para o presente contar como pago.",
        "A reserva expira em 48 horas se ninguém confirmar, e a cota volta para a lista.",
        "Cada etiqueta de status tem um significado simples, listado no exemplo.",
      ]}
      mockup={<PaymentsMockup />}
    >
      <p>O site não mexe no dinheiro, só organiza. Quando o Pix chegar, é só um toque.</p>
    </StepFrame>
  );
}
