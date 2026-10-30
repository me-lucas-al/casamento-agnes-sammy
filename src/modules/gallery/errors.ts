import { describeAuthError } from "@/modules/auth/errors";

export class InvalidUploadError extends Error {
  constructor(readonly reason: "mime" | "size") {
    super(`Invalid upload: ${reason}`);
  }
}

export class InvalidPublicIdError extends Error {
  constructor() {
    super("Public id does not belong to the gallery folder");
  }
}

export class PhotoNotFoundError extends Error {
  constructor() {
    super("Photo not found");
  }
}

export function describePhotoError(error: unknown): string {
  if (error instanceof InvalidUploadError) {
    return error.reason === "mime"
      ? "Formato não suportado. Envie JPG, PNG ou WEBP."
      : "A foto deve ter no máximo 8 MB.";
  }
  if (error instanceof InvalidPublicIdError) return "Foto inválida.";
  if (error instanceof PhotoNotFoundError) return "Foto não encontrada.";
  return describeAuthError(error) ?? "Não foi possível concluir a operação.";
}
