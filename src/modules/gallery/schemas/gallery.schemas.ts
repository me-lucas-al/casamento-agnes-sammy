import { z } from "zod";

export const signUploadSchema = z.object({
  mimeType: z.string().min(1).max(100),
  sizeBytes: z.number().int(),
});

export const registerPhotoSchema = z.object({
  cloudinaryPublicId: z.string().min(1).max(200),
  url: z.url().max(500),
  caption: z.string().max(200).optional(),
});

export const photoIdSchema = z.uuid();

export const updateCaptionSchema = z.object({
  photoId: z.uuid(),
  caption: z.string().max(200).nullable(),
});
