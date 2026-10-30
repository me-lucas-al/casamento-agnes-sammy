"use server";

import { z } from "zod";
import { getSessionUser } from "@/modules/auth/controllers/get-session-user";
import { nextCacheInvalidator } from "@/shared/lib/cache/invalidate";
import { failure, success, type ActionResult } from "@/shared/lib/result";
import { describeMessageError } from "../errors";
import { getMessageModule } from "../factory";
import { invalidateApprovedMessagesCache } from "../lib/invalidate-messages-cache";
import { moderateMessageSchema } from "../schemas/moderate-message.schema";
import { sendMessageSchema } from "../schemas/send-message.schema";

const updateMessageSchema = sendMessageSchema.extend({ messageId: z.uuid() });

export async function sendMessageAction(input: unknown): Promise<ActionResult> {
  const parsed = sendMessageSchema.safeParse(input);
  if (!parsed.success) return failure("Escreva um recado de 1 a 500 caracteres.");
  try {
    await getMessageModule().sendMessage(await getSessionUser(), parsed.data);
    nextCacheInvalidator.invalidatePath("/painel/recados");
    return success();
  } catch (error) {
    return failure(describeMessageError(error));
  }
}

export async function moderateMessageAction(input: unknown): Promise<ActionResult> {
  const parsed = moderateMessageSchema.safeParse(input);
  if (!parsed.success) return failure("Dados inválidos.");
  try {
    await getMessageModule().moderateMessage(await getSessionUser(), parsed.data);
    invalidateApprovedMessagesCache(nextCacheInvalidator);
    return success();
  } catch (error) {
    return failure(describeMessageError(error));
  }
}

export async function updateMessageAction(input: unknown): Promise<ActionResult> {
  const parsed = updateMessageSchema.safeParse(input);
  if (!parsed.success) return failure("Dados inválidos.");
  try {
    await getMessageModule().updateMessage(await getSessionUser(), parsed.data);
    invalidateApprovedMessagesCache(nextCacheInvalidator);
    return success();
  } catch (error) {
    return failure(describeMessageError(error));
  }
}

export async function deleteMessageAction(messageId: string): Promise<ActionResult> {
  const parsed = z.uuid().safeParse(messageId);
  if (!parsed.success) return failure("Dados inválidos.");
  try {
    await getMessageModule().deleteMessage(await getSessionUser(), parsed.data);
    invalidateApprovedMessagesCache(nextCacheInvalidator);
    return success();
  } catch (error) {
    return failure(describeMessageError(error));
  }
}
