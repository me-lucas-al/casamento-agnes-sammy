import { describe, expect, it } from "vitest";
import { UnauthenticatedError } from "@/modules/auth/errors";
import { createPaymentModule } from "@/modules/payments/factory";
import { PixNotConfiguredError } from "@/modules/payments/errors";
import { crc16Ccitt } from "@/modules/payments/lib/crc16";
import { eventSettings } from "@/shared/db/schema";
import { asUser } from "@/tests/helpers/fake-session";
import { useTestDatabase } from "@/tests/helpers/use-test-database";

describe("pix payment details", () => {
  const testDatabase = useTestDatabase();
  const paymentModule = () => createPaymentModule(testDatabase.db);

  async function seedSettings(overrides: Partial<typeof eventSettings.$inferInsert> = {}) {
    await testDatabase.db.insert(eventSettings).values({
      coupleNames: "Agnes e Sammy",
      eventAt: new Date("2026-11-07T22:00:00Z"),
      venueName: "Restaurante Fazenda",
      address: "Itatiba",
      pixKey: "(11) 91234-5678",
      pixKeyType: "phone",
      pixReceiverName: "Agnes Sammy",
      pixCity: "Itatiba",
      ...overrides,
    });
  }

  it("builds a valid br code and qr from event settings", async () => {
    await seedSettings();

    const details = await paymentModule().getPixPaymentDetails(asUser("guest"), 15000);

    expect(details.pixKey).toBe("+5511912345678");
    expect(details.brCode).toContain("5406150.00");
    expect(details.brCode.slice(-4)).toBe(crc16Ccitt(details.brCode.slice(0, -4)));
    expect(details.qrDataUrl.startsWith("data:image/svg+xml;base64,")).toBe(true);
  });

  it("fails when pix is not configured", async () => {
    await expect(paymentModule().getPixPaymentDetails(asUser("guest"), 1000)).rejects.toBeInstanceOf(
      PixNotConfiguredError,
    );
    await seedSettings({ pixKey: null });
    await expect(paymentModule().getPixPaymentDetails(asUser("guest"), 1000)).rejects.toBeInstanceOf(
      PixNotConfiguredError,
    );
  });

  it("requires an authenticated actor", async () => {
    await seedSettings();

    await expect(paymentModule().getPixPaymentDetails(null, 1000)).rejects.toBeInstanceOf(
      UnauthenticatedError,
    );
  });
});
