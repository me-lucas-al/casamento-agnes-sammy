"use server";

import { z } from "zod";
import { getSessionUser } from "@/modules/auth/controllers/get-session-user";
import { nextCacheInvalidator } from "@/shared/lib/cache/invalidate";
import { safeAction } from "@/shared/lib/safe-action";
import { invalidInput } from "@/shared/lib/validation-failure";
import { success, type ActionResult } from "@/shared/lib/result";
import { describeUserError } from "../errors";
import { getUserModule } from "../factory";

const setUserActiveSchema = z.object({ userId: z.uuid(), isActive: z.boolean() });

export async function setUserActiveAction(input: unknown): Promise<ActionResult> {
  const parsed = setUserActiveSchema.safeParse(input);
  if (!parsed.success) return invalidInput(parsed);
  return safeAction(describeUserError, async () => {
    const actor = await getSessionUser();
    await getUserModule().setUserActive(actor, parsed.data.userId, parsed.data.isActive);
    nextCacheInvalidator.invalidatePath("/painel/usuarios");
    return success();
  }, "setUserActiveAction");
}
