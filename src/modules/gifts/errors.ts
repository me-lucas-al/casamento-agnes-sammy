import { describeAuthError } from "@/modules/auth/errors";
import type { ImageRejectionReason } from "./lib/images/image-upload-validator";

export class GiftNotFoundError extends Error {
  constructor() {
    super("Gift not found");
  }
}

export class GiftCategoryNotFoundError extends Error {
  constructor() {
    super("Gift category not found");
  }
}

export class GiftCategoryInUseError extends Error {
  constructor() {
    super("Gift category still has gifts");
  }
}

export class GiftNameTakenError extends Error {
  constructor() {
    super("Gift name already in use");
  }
}

export class GiftCategoryNameTakenError extends Error {
  constructor() {
    super("Gift category name already in use");
  }
}

export class GiftHasConfirmedContributionError extends Error {
  constructor() {
    super("Gift has a confirmed contribution");
  }
}

export class GiftHasActiveReservationsError extends Error {
  constructor() {
    super("Gift has active reservations");
  }
}

export class GiftPricingLockedError extends Error {
  constructor() {
    super("Gift pricing is locked by contributions");
  }
}

export class InvalidGiftConfigurationError extends Error {
  constructor(readonly userMessage: string) {
    super(userMessage);
  }
}

export class InvalidImageUploadError extends Error {
  constructor(readonly reason: ImageRejectionReason) {
    super(`Invalid image upload: ${reason}`);
  }
}

export class InvalidGiftImageError extends Error {
  constructor() {
    super("Gift image does not belong to an upload of this site");
  }
}

export class InvalidGiftProductLinkError extends Error {
  constructor() {
    super("Gift product link or external image is not allowed");
  }
}

const IMAGE_REJECTION_MESSAGES: Record<ImageRejectionReason, string> = {
  type: "Use uma imagem JPG, PNG ou WebP.",
  size: "A imagem deve ter no máximo 8 MB.",
  empty: "O arquivo está vazio.",
};

export function describeImageRejection(reason: ImageRejectionReason): string {
  return IMAGE_REJECTION_MESSAGES[reason];
}

export function describeGiftError(error: unknown): string {
  if (error instanceof GiftNotFoundError) return "Presente não encontrado.";
  if (error instanceof GiftCategoryNotFoundError) return "Categoria não encontrada.";
  if (error instanceof GiftNameTakenError) return "Já existe um presente com esse nome.";
  if (error instanceof GiftCategoryNameTakenError) return "Já existe uma categoria com esse nome.";
  if (error instanceof GiftCategoryInUseError) {
    return "Esta categoria ainda possui presentes. Mova ou exclua-os antes.";
  }
  if (error instanceof GiftHasConfirmedContributionError) {
    return "Este presente já recebeu uma contribuição confirmada. Oculte-o em vez de excluir.";
  }
  if (error instanceof GiftHasActiveReservationsError) {
    return "Este presente tem reservas pendentes. Aguarde o pagamento ou cancele as reservas antes de excluir.";
  }
  if (error instanceof GiftPricingLockedError) {
    return "Este presente já tem contribuições. Não é possível mudar o modo, o valor ou as cotas.";
  }
  if (error instanceof InvalidGiftConfigurationError) return error.userMessage;
  if (error instanceof InvalidGiftImageError) return "Imagem inválida. Envie a imagem novamente.";
  if (error instanceof InvalidGiftProductLinkError) return "Link do produto ou da foto não permitido. Use uma loja conhecida com https.";
  if (error instanceof InvalidImageUploadError) return describeImageRejection(error.reason);
  return describeAuthError(error) ?? "Não foi possível concluir a operação.";
}
