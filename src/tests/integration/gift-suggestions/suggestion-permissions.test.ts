import { describe, expect, it } from "vitest";
import { ForbiddenError, UnauthenticatedError } from "@/modules/auth/errors";
import { asUser } from "@/tests/helpers/fake-session";
import { useTestDatabase } from "@/tests/helpers/use-test-database";
import { createTestSuggestionModule, idOf, queryOf } from "./gift-suggestion-test-module";

describe("gift suggestions permissions", () => {
  const testDatabase = useTestDatabase();

  it.each(["admin", "couple"] as const)("lets %s list and add suggestions", async (role) => {
    const { suggestionModule } = createTestSuggestionModule(testDatabase.db);
    const actor = asUser(role);

    const listed = await suggestionModule.listSuggestionsWithStatus(actor, queryOf());
    const added = await suggestionModule.addSuggestedGifts(actor, [idOf("Air fryer")]);

    expect(listed.total).toBeGreaterThan(250);
    expect(added.createdCount).toBe(1);
  });

  it("forbids guests from listing and adding", async () => {
    const { suggestionModule } = createTestSuggestionModule(testDatabase.db);
    const guest = asUser("guest");

    await expect(suggestionModule.listSuggestionsWithStatus(guest, queryOf())).rejects.toBeInstanceOf(ForbiddenError);
    await expect(suggestionModule.addSuggestedGifts(guest, [idOf("Air fryer")])).rejects.toBeInstanceOf(ForbiddenError);
  });

  it("rejects anonymous users from listing and adding", async () => {
    const { suggestionModule } = createTestSuggestionModule(testDatabase.db);

    await expect(suggestionModule.listSuggestionsWithStatus(null, queryOf())).rejects.toBeInstanceOf(UnauthenticatedError);
    await expect(suggestionModule.addSuggestedGifts(null, [idOf("Air fryer")])).rejects.toBeInstanceOf(UnauthenticatedError);
  });
});
