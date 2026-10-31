import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { SessionUser } from "@/modules/auth/types";
import { createContributionController } from "@/modules/contributions/controllers/handlers/contribution-controller";
import type { ContributionModule } from "@/modules/contributions/factory";
import { FakeCacheInvalidator } from "@/tests/helpers/fakes/fake-cache-invalidator";
import { asUser } from "@/tests/helpers/fakes/fake-session";
import { createRedirectError } from "@/tests/helpers/fakes/next-control-flow-errors";
import { seedGift } from "@/tests/helpers/database/seeds/seed-gift";
import { useTestDatabase } from "@/tests/helpers/database/use-test-database";
import { createContributionContext, seedGuestActor } from "../contributions/contribution-context";

describe("server action error handling", () => {
  const testDatabase = useTestDatabase();
  let consoleError: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    consoleError = vi.spyOn(console, "error").mockImplementation(() => undefined);
  });

  afterEach(() => consoleError.mockRestore());

  function buildController(
    getActor: () => Promise<SessionUser | null>,
    contributions: ContributionModule = createContributionContext(testDatabase.db).contributions,
  ) {
    return createContributionController({ contributions, invalidator: new FakeCacheInvalidator(), getActor });
  }

  it("maps a business error to its pt-BR message without logging", async () => {
    const controller = buildController(async () => asUser("guest"));
    const result = await controller.confirmPixPayment({ contributionId: crypto.randomUUID() });
    expect(result).toEqual({ ok: false, error: "Você não tem permissão para esta ação." });
    expect(consoleError).not.toHaveBeenCalled();
  });

  it("reports an unauthenticated visitor in pt-BR", async () => {
    const gift = await seedGift(testDatabase.db);
    const result = await buildController(async () => null).reserveGift({ giftId: gift.id });
    expect(result).toEqual({ ok: false, error: "Faça login para continuar." });
  });

  it("returns field-level pt-BR guidance for invalid input", async () => {
    const result = await buildController(async () => asUser("guest")).reserveGift({ giftId: "x" });
    expect(result).toEqual({ ok: false, error: "Dados inválidos. Revise: presente." });
  });

  it("logs unknown failures and returns a generic message without leaking internals", async () => {
    const guest = await seedGuestActor(testDatabase.db);
    const brokenModule = {
      reserveGift: async () => {
        throw new Error("password authentication failed for user admin@example.com at 10.0.0.9");
      },
    } as unknown as ContributionModule;
    const result = await buildController(async () => guest, brokenModule).reserveGift({
      giftId: crypto.randomUUID(),
    });
    expect(result).toEqual({ ok: false, error: "Não foi possível concluir a operação." });
    expect(consoleError).toHaveBeenCalledTimes(1);
    const logged = String(consoleError.mock.calls[0][0]);
    expect(logged).toContain("action.unexpected_error");
    expect(logged).not.toContain("admin@example.com");
  });

  it("rethrows Next redirect errors instead of swallowing them", async () => {
    const redirectError = createRedirectError("/entrar");
    const controller = buildController(async () => {
      throw redirectError;
    });
    await expect(controller.reserveGift({ giftId: crypto.randomUUID() })).rejects.toBe(redirectError);
    expect(consoleError).not.toHaveBeenCalled();
  });
});
