import type { ZodError } from "zod";
import { failure, type ActionFailure } from "./result";

const INVALID_INPUT_MESSAGE = "Dados inválidos.";

const FIELD_LABELS: Record<string, string> = {
  address: "endereço",
  amountCents: "valor",
  authorName: "nome do autor",
  body: "mensagem",
  caption: "legenda",
  categoryId: "categoria",
  companions: "acompanhantes",
  coupleNames: "nomes do casal",
  decision: "decisão",
  description: "descrição",
  dietaryNote: "restrição alimentar",
  email: "e-mail",
  eventAt: "data do evento",
  giftId: "presente",
  guestId: "convidado",
  image: "imagem",
  imagePublicId: "imagem",
  imageUrl: "imagem",
  isVisible: "visibilidade",
  kind: "tipo",
  mapUrl: "link do mapa",
  message: "mensagem",
  messageId: "recado",
  minAmountCents: "valor mínimo",
  mode: "modo",
  name: "nome",
  photoId: "foto",
  phone: "telefone",
  pixCity: "cidade do Pix",
  pixKey: "chave Pix",
  pixKeyType: "tipo da chave Pix",
  pixReceiverName: "nome do recebedor Pix",
  priceCents: "preço",
  quotas: "cotas",
  role: "papel",
  rsvpDeadline: "prazo de confirmação",
  seats: "vagas",
  sortOrder: "ordem",
  status: "situação",
  story: "nossa história",
  totalQuotas: "total de cotas",
  url: "link",
  venueName: "local",
};

type FailedParse = { success: boolean; error?: ZodError };

function collectLabels(failedParses: FailedParse[]): string[] {
  const labels = new Set<string>();
  for (const parse of failedParses) {
    for (const issue of parse.error?.issues ?? []) {
      const label = FIELD_LABELS[String(issue.path[0])];
      if (label) labels.add(label);
    }
  }
  return [...labels];
}

export function describeValidationFailure(...parses: FailedParse[]): string {
  const labels = collectLabels(parses.filter((parse) => !parse.success));
  if (labels.length === 0) return INVALID_INPUT_MESSAGE;
  return `${INVALID_INPUT_MESSAGE} Revise: ${labels.join(", ")}.`;
}

export function invalidInput(...parses: FailedParse[]): ActionFailure {
  return failure(describeValidationFailure(...parses));
}
