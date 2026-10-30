import { describe, expect, it } from "vitest";
import { DEFAULT_CATEGORIES } from "@/modules/gifts/lib/default-categories";
import { createDrizzleCategoryRepository } from "@/modules/gifts/repositories/drizzle-category-repository";
import { makeEnsureDefaultCategories } from "@/modules/gifts/use-cases/ensure-default-categories";
import { seedGiftCategory } from "@/tests/helpers/seeds/seed-gift";
import { useTestDatabase } from "@/tests/helpers/use-test-database";

describe("ensureDefaultCategories", () => {
  const testDatabase = useTestDatabase();
  const setup = () => {
    const categoryRepository = createDrizzleCategoryRepository(testDatabase.db);
    return { categoryRepository, ensureDefaultCategories: makeEnsureDefaultCategories({ categoryRepository }) };
  };

  it("creates the six initial categories in order", async () => {
    const { categoryRepository, ensureDefaultCategories } = setup();

    const created = await ensureDefaultCategories();

    expect(created).toHaveLength(6);
    const names = (await categoryRepository.list()).map((category) => category.name);
    expect(names).toEqual(DEFAULT_CATEGORIES.map((category) => category.name));
  });

  it("does not duplicate categories when run twice", async () => {
    const { categoryRepository, ensureDefaultCategories } = setup();

    await ensureDefaultCategories();
    const secondRun = await ensureDefaultCategories();

    expect(secondRun).toHaveLength(0);
    expect(await categoryRepository.list()).toHaveLength(6);
  });

  it("keeps an existing category with the same name", async () => {
    const { categoryRepository, ensureDefaultCategories } = setup();
    await seedGiftCategory(testDatabase.db, { name: "Sala & Decoração" });

    const created = await ensureDefaultCategories();

    expect(created).toHaveLength(5);
    expect(await categoryRepository.list()).toHaveLength(6);
  });
});
