import { getSessionUser } from "@/modules/auth/controllers/get-session-user";
import { guardedQuery } from "@/shared/lib/guarded-query";
import { getTourModule } from "../factory";

export async function getTourStatusQuery() {
  return guardedQuery("getTourStatusQuery", async () => {
    const actor = await getSessionUser();
    return getTourModule().getTourStatus(actor);
  });
}

export async function shouldAutoOpenTourQuery(): Promise<boolean> {
  try {
    const actor = await getSessionUser();
    const status = await getTourModule().getTourStatus(actor);
    return !status.isCompleted;
  } catch {
    return false;
  }
}
