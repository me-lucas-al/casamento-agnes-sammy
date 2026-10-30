import { requireRole } from "@/modules/auth/authorization";
import type { SessionUser } from "@/modules/auth/types";
import { PixNotConfiguredError } from "../errors";
import { buildPixBrCode } from "../lib/pix-brcode";
import { normalizePixKey } from "../lib/pix-key";
import type { PixSettingsRepository } from "../repositories/pix-settings-repository";
import type { PixPaymentDetails } from "../types";

type Dependencies = {
  pixSettingsRepository: PixSettingsRepository;
  renderQr: (brCode: string) => Promise<string>;
};

export function makeGetPixPaymentDetails({ pixSettingsRepository, renderQr }: Dependencies) {
  return async function getPixPaymentDetails(
    actor: SessionUser | null,
    amountCents: number,
  ): Promise<PixPaymentDetails> {
    requireRole(actor, ["guest", "couple", "admin"]);
    const settings = await pixSettingsRepository.find();
    if (!settings) throw new PixNotConfiguredError();
    const pixKey = normalizePixKey(settings.pixKey, settings.pixKeyType);
    const brCode = buildPixBrCode({
      pixKey,
      receiverName: settings.pixReceiverName,
      city: settings.pixCity,
      amountCents,
    });
    return {
      amountCents,
      pixKey,
      receiverName: settings.pixReceiverName,
      brCode,
      qrDataUrl: await renderQr(brCode),
    };
  };
}
