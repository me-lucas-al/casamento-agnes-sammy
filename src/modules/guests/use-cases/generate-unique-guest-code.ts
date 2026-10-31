import { GuestCodeGenerationError } from "../errors";
import type { GuestCodeGenerator } from "../lib/guest-code";
import type { GuestRepository } from "../repositories/contracts/guest-repository";

const MAX_ATTEMPTS = 10;

type Dependencies = {
  guestRepository: GuestRepository;
  generateCode: GuestCodeGenerator;
};

export function makeGenerateUniqueGuestCode({ guestRepository, generateCode }: Dependencies) {
  return async function generateUniqueGuestCode(): Promise<string> {
    for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt += 1) {
      const code = generateCode();
      if (!(await guestRepository.codeExists(code))) return code;
    }
    throw new GuestCodeGenerationError();
  };
}

export type GenerateUniqueGuestCode = ReturnType<typeof makeGenerateUniqueGuestCode>;
