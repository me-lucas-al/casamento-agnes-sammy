"use server";

import { z } from "zod";
import { getSessionUser } from "@/modules/auth/controllers/get-session-user";
import { nextCacheInvalidator } from "@/shared/lib/cache/invalidate";
import { failure, success, type ActionResult } from "@/shared/lib/result";
import { describeUserError } from "../errors";
import { getUserModule } from "../factory";

const setUserActiveSchema = z.object({ userId: z.uuid(), isActive: z.boolean() });

export async function setUserActiveAction(input: unknown): Promise<ActionResult> {
  const parsed = setUserActiveSchema.safeParse(input);
  if (!parsed.success) return failure("Dados inválidos.");
  try {
    const actor = await getSessionUser();
    await getUserModule().setUserActive(actor, parsed.data.userId, parsed.data.isActive);
    nextCacheInvalidator.invalidatePath("/painel/usuarios");
    return success();
  } catch (error) {
    return failure(describeUserError(error));
  }
}
