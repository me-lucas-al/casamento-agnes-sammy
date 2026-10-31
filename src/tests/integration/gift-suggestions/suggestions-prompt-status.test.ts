import { describe, expect, it } from "vitest";
import { ForbiddenError } from "@/modules/auth/errors";
import { asUser } from "@/tests/helpers/fake-session";
import { seedGift } from "@/tests/helpers/seeds/seed-gift";
import { useTestDatabase } from "@/tests/helpers/use-test-database";
import { createTestSuggestionModule } from "./gift-suggestion-test-module";

describe("getSuggestionsPromptStatus", () => {
  const testDatabase = useTestDatabase();

  it("promotes suggestions while the list has fewer than five gifts", async () => {
    const { suggestionModule } = createTestSuggestionModule(testDatabase.db);
    await seedGift(testDatabase.db, { name: "Um" });

    const status = await suggestionModule.getSuggestionsPromptStatus(asUser("couple"));

    expect(status).toEqual({ giftCount: 1, shouldPromote: true });
  });

  it("stops promoting once the list has five gifts, counting hidden ones", async () => {
    const { suggestionModule } = createTestSuggestionModule(testDatabase.db);
    for (const name of ["A", "B", "C", "D"]) await seedGift(testDatabase.db, { name });
    await seedGift(testDatabase.db, { name: "E", isVisible: false });

    const status = await suggestionModule.getSuggestionsPromptStatus(asUser("admin"));

    expect(status).toEqual({ giftCount: 5, shouldPromote: false });
  });

  it("forbids guests", async () => {
    const { suggestionModule } = createTestSuggestionModule(testDatabase.db);

    await expect(suggestionModule.getSuggestionsPromptStatus(asUser("guest"))).rejects.toBeInstanceOf(ForbiddenError);
  });
});
