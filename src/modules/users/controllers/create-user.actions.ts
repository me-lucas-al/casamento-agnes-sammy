"use server";

import { getSessionUser } from "@/modules/auth/controllers/get-session-user";
import { nextCacheInvalidator } from "@/shared/lib/cache/invalidate";
import { safeAction } from "@/shared/lib/safe-action";
import { invalidInput } from "@/shared/lib/validation-failure";
import { success, type ActionResult } from "@/shared/lib/result";
import { describeUserError } from "../errors";
import { getUserModule } from "../factory";
import { createUserSchema } from "../schemas/create-user.schema";

export async function createUserAction(input: unknown): Promise<ActionResult<{ userId: string }>> {
  const parsed = createUserSchema.safeParse(input);
  if (!parsed.success) return invalidInput(parsed);
  return safeAction(describeUserError, async () => {
    const actor = await getSessionUser();
    const user = await getUserModule().createUser(actor, parsed.data);
    nextCacheInvalidator.invalidatePath("/painel/usuarios");
    return success({ userId: user.id });
  }, "createUserAction");
}
