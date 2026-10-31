import { getSessionUser } from "@/modules/auth/controllers/get-session-user";
import { guardedQuery } from "@/shared/lib/guarded-query";
import { getTourModule } from "../factory";

export async function getTourStatusQuery() {
  return guardedQuery("getTourStatusQuery", async () => {
    const actor = await getSessionUser();
    return getTourModule().getTourStatus(actor);
  });
}
