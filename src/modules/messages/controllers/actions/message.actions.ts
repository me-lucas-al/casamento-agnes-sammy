"use server";

import { z } from "zod";
import { getSessionUser } from "@/modules/auth/controllers/session/get-session-user";
import { dashboardTag } from "@/shared/lib/cache/cache-tags";
import { nextCacheInvalidator } from "@/shared/lib/cache/invalidate";
import { safeAction } from "@/shared/lib/safe-action";
import { invalidInput } from "@/shared/lib/validation-failure";
import { failure, success, type ActionResult } from "@/shared/lib/result";
import { describeMessageError } from "@/modules/messages/errors";
import { getMessageModule } from "@/modules/messages/factory";
import { invalidateApprovedMessagesCache } from "@/modules/messages/lib/invalidate-messages-cache";
import { moderateMessageSchema } from "@/modules/messages/schemas/moderate-message.schema";
import { sendMessageSchema } from "@/modules/messages/schemas/send-message.schema";

const updateMessageSchema = sendMessageSchema.extend({ messageId: z.uuid() });

export async function sendMessageAction(input: unknown): Promise<ActionResult> {
  const parsed = sendMessageSchema.safeParse(input);
  if (!parsed.success) return failure("Escreva um recado de 1 a 500 caracteres.");
  return safeAction(describeMessageError, async () => {
    await getMessageModule().sendMessage(await getSessionUser(), parsed.data);
    nextCacheInvalidator.invalidateTags([dashboardTag()]);
    nextCacheInvalidator.invalidatePath("/painel/recados");
    return success();
  }, "sendMessageAction");
}

export async function moderateMessageAction(input: unknown): Promise<ActionResult> {
  const parsed = moderateMessageSchema.safeParse(input);
  if (!parsed.success) return invalidInput(parsed);
  return safeAction(describeMessageError, async () => {
    await getMessageModule().moderateMessage(await getSessionUser(), parsed.data);
    invalidateApprovedMessagesCache(nextCacheInvalidator);
    return success();
  }, "moderateMessageAction");
}

export async function updateMessageAction(input: unknown): Promise<ActionResult> {
  const parsed = updateMessageSchema.safeParse(input);
  if (!parsed.success) return invalidInput(parsed);
  return safeAction(describeMessageError, async () => {
    await getMessageModule().updateMessage(await getSessionUser(), parsed.data);
    invalidateApprovedMessagesCache(nextCacheInvalidator);
    return success();
  }, "updateMessageAction");
}

export async function deleteMessageAction(messageId: string): Promise<ActionResult> {
  const parsed = z.uuid().safeParse(messageId);
  if (!parsed.success) return invalidInput(parsed);
  return safeAction(describeMessageError, async () => {
    await getMessageModule().deleteMessage(await getSessionUser(), parsed.data);
    invalidateApprovedMessagesCache(nextCacheInvalidator);
    return success();
  }, "deleteMessageAction");
}
