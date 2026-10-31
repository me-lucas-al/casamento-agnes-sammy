import { createDrizzleCategoryRepository } from "@/modules/gifts/repositories/drizzle/drizzle-category-repository";
import { makeEnsureDefaultCategories } from "@/modules/gifts/use-cases/categories/ensure-default-categories";
import { getDatabase } from "@/shared/db/client";

async function main() {
  const categoryRepository = createDrizzleCategoryRepository(getDatabase());
  const ensureDefaultCategories = makeEnsureDefaultCategories({ categoryRepository });
  const createdCategories = await ensureDefaultCategories();
  console.log(`Categories ready: ${createdCategories.length} created`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
