import { StepFrame } from "../step-frame";
import { UsersMockup } from "../mockups/users-mockup";

export function UsersStep() {
  return (
    <StepFrame
      stepId="users"
      eyebrow="Só para administradores"
      title="Quem pode entrar no painel"
      tips={[
        "Adicione Agnes e Sammy pelo e-mail da conta Google.",
        "Quem não estiver na lista, ou estiver desativado, não consegue entrar.",
      ]}
      mockup={<UsersMockup />}
    >
      <p>Este passo aparece só para você, administrador. Os noivos não veem a tela Usuários.</p>
    </StepFrame>
  );
}
