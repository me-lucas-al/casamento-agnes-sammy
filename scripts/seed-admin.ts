import { z } from "zod";
import { createUserModule } from "@/modules/users/factory";
import { getDatabase } from "@/shared/db/client";

const adminEnvSchema = z.object({
  ADMIN_EMAIL: z.email(),
  ADMIN_NAME: z.string().min(1).default("Admin"),
});

async function main() {
  const { ADMIN_EMAIL, ADMIN_NAME } = adminEnvSchema.parse(process.env);
  const { ensureAdminUser } = createUserModule(getDatabase());
  const admin = await ensureAdminUser({ name: ADMIN_NAME, email: ADMIN_EMAIL });
  console.log(`Admin ready: ${admin.email}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
