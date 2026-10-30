import { getDatabase } from "@/shared/db/client";
import type { Database } from "@/shared/db/types";
import { renderPixQrSvgDataUrl } from "./lib/pix-qr";
import { createDrizzlePixSettingsRepository } from "./repositories/drizzle-pix-settings-repository";
import { makeGetPixPaymentDetails } from "./use-cases/get-pix-payment-details";

export function createPaymentModule(database: Database) {
  const pixSettingsRepository = createDrizzlePixSettingsRepository(database);
  return {
    pixSettingsRepository,
    getPixPaymentDetails: makeGetPixPaymentDetails({
      pixSettingsRepository,
      renderQr: renderPixQrSvgDataUrl,
    }),
  };
}

export type PaymentModule = ReturnType<typeof createPaymentModule>;

export function getPaymentModule(): PaymentModule {
  return createPaymentModule(getDatabase());
}
