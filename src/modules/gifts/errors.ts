import { describeAuthError } from "@/modules/auth/errors";
import type { ImageRejectionReason } from "./lib/image-upload-validator";

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
  if (error instanceof GiftCategoryInUseError) {
    return "Esta categoria ainda possui presentes. Mova ou exclua-os antes.";
  }
  if (error instanceof GiftHasConfirmedContributionError) {
    return "Este presente já recebeu uma contribuição confirmada. Oculte-o em vez de excluir.";
  }
  if (error instanceof InvalidGiftConfigurationError) return error.userMessage;
  if (error instanceof InvalidImageUploadError) return describeImageRejection(error.reason);
  return describeAuthError(error) ?? "Não foi possível concluir a operação.";
}
  if (error instanceof GiftHasActiveReservationsError) {
    return "Este presente tem reservas pendentes. Aguarde o pagamento ou cancele as reservas antes de excluir.";
  }
