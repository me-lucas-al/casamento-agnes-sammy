import { describe, expect, it } from "vitest";
import { ForbiddenError, UnauthenticatedError } from "@/modules/auth/errors";
import {
  InvalidMessageError,
  MessageNotFoundError,
  TooManyPendingMessagesError,
} from "@/modules/messages/errors";
import { createMessageModule } from "@/modules/messages/factory";
import { asUser } from "@/tests/helpers/fakes/fake-session";
import { seedGuest } from "@/tests/helpers/database/seeds/seed-guest";
import { useTestDatabase } from "@/tests/helpers/database/use-test-database";

const pageInput = { page: 1, perPage: 12, offset: 0 };
const MISSING_ID = "00000000-0000-4000-8000-000000000000";

describe("message flow", () => {
  const testDatabase = useTestDatabase();
  const messageModule = () => createMessageModule(testDatabase.db);
  const couple = asUser("couple");

  async function guestSession() {
    const guest = await seedGuest(testDatabase.db);
    return asUser("guest", { guestId: guest.id });
  }

  async function sendAs(session: ReturnType<typeof asUser>, body = "Parabéns!") {
    return messageModule().sendMessage(session, { authorName: "Ana", body });
  }

  it("creates a sanitized pending message for a guest", async () => {
    const message = await sendAs(await guestSession(), "  Felicidades  ");

    expect(message).toMatchObject({ status: "pending", body: "Felicidades", authorName: "Ana" });
  });

  it("rejects invalid bodies and non-guest senders", async () => {
    const session = await guestSession();

    await expect(sendAs(session, "   ")).rejects.toBeInstanceOf(InvalidMessageError);
    await expect(sendAs(session, "a".repeat(501))).rejects.toBeInstanceOf(InvalidMessageError);
    await expect(sendAs(couple)).rejects.toBeInstanceOf(ForbiddenError);
    await expect(sendAs(null as never)).rejects.toBeInstanceOf(UnauthenticatedError);
  });

  it("limits each guest to five pending messages", async () => {
    const session = await guestSession();
    const other = await guestSession();
    for (let index = 0; index < 5; index += 1) await sendAs(session);

    await expect(sendAs(session)).rejects.toBeInstanceOf(TooManyPendingMessagesError);
    await expect(sendAs(other)).resolves.toBeDefined();
  });

  it("frees the pending slot after moderation", async () => {
    const session = await guestSession();
    const first = await sendAs(session);
    for (let index = 0; index < 4; index += 1) await sendAs(session);

    await messageModule().moderateMessage(couple, { messageId: first.id, decision: "approved" });

    await expect(sendAs(session)).resolves.toBeDefined();
  });

  it("shows only approved messages to guests, public list", async () => {
    const session = await guestSession();
    const approved = await sendAs(session, "aprovado");
    const rejected = await sendAs(session, "rejeitado");
    await sendAs(session, "pendente");
    await messageModule().moderateMessage(couple, { messageId: approved.id, decision: "approved" });
    await messageModule().moderateMessage(couple, { messageId: rejected.id, decision: "rejected" });

    const result = await messageModule().listApprovedMessagesPage(session, pageInput);

    expect(result.items.map(({ body }) => body)).toEqual(["aprovado"]);
    expect(result.total).toBe(1);
  });

  it("lets only couple and admin moderate, update and delete", async () => {
    const session = await guestSession();
    const message = await sendAs(session);
    const edit = { messageId: message.id, authorName: "Ana", body: "novo" };

    await expect(
      messageModule().moderateMessage(session, { messageId: message.id, decision: "approved" }),
    ).rejects.toBeInstanceOf(ForbiddenError);
    await expect(messageModule().updateMessage(session, edit)).rejects.toBeInstanceOf(ForbiddenError);
    await expect(messageModule().deleteMessage(session, message.id)).rejects.toBeInstanceOf(ForbiddenError);
    await expect(messageModule().deleteMessage(null, message.id)).rejects.toBeInstanceOf(UnauthenticatedError);
  });

  it("lets couple and admin edit content and delete", async () => {
    const message = await sendAs(await guestSession());

    const edited = await messageModule().updateMessage(couple, {
      messageId: message.id,
      authorName: "  Ana  Maria ",
      body: " editado ",
    });
    await messageModule().deleteMessage(asUser("admin"), message.id);

    expect(edited).toMatchObject({ authorName: "Ana Maria", body: "editado" });
    const remaining = await messageModule().listMessagesPage(couple, { ...pageInput, status: undefined });
    expect(remaining.total).toBe(0);
  });

  it("reports missing messages", async () => {
    const admin = asUser("admin");

    await expect(messageModule().deleteMessage(admin, MISSING_ID)).rejects.toBeInstanceOf(MessageNotFoundError);
    await expect(
      messageModule().moderateMessage(admin, { messageId: MISSING_ID, decision: "approved" }),
    ).rejects.toBeInstanceOf(MessageNotFoundError);
    await expect(
      messageModule().updateMessage(admin, { messageId: MISSING_ID, authorName: "Ana", body: "x" }),
    ).rejects.toBeInstanceOf(MessageNotFoundError);
  });
});
