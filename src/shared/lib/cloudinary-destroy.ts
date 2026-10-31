import type { CloudinaryClient } from "./cloudinary";
import { logger as defaultLogger, type Logger } from "./logger";
import { serializeError } from "./logging/serialize-error";

export async function destroyImageBestEffort(
  cloudinaryClient: CloudinaryClient,
  publicId: string,
  logger: Logger = defaultLogger,
): Promise<void> {
  try {
    await cloudinaryClient.destroyImage(publicId);
  } catch (error) {
    logger.error("cloudinary.destroy_failed", { publicId, error: serializeError(error) });
  }
}
