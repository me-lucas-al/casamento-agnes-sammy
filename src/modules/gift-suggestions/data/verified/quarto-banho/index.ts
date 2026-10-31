import type { VerifiedProductRecord } from "../../../types";
import { QUARTO_BANHO_CAMA_BANHO_1 } from "./cama-banho-1";
import { QUARTO_BANHO_CAMA_BANHO_2 } from "./cama-banho-2";
import { QUARTO_BANHO_CAMA_BANHO_3 } from "./cama-banho-3";
import { QUARTO_BANHO_CAMA_BANHO_4 } from "./cama-banho-4";
import { QUARTO_BANHO_CAMA_BANHO_5 } from "./cama-banho-5";
import { QUARTO_BANHO_CAMA_BANHO_6 } from "./cama-banho-6";
import { QUARTO_BANHO_ELETROPORTATIL_1 } from "./eletroportatil-1";
import { QUARTO_BANHO_ORGANIZACAO_1 } from "./organizacao-1";

export const QUARTO_BANHO_VERIFIED: readonly VerifiedProductRecord[] = [
  ...QUARTO_BANHO_CAMA_BANHO_1,
  ...QUARTO_BANHO_CAMA_BANHO_2,
  ...QUARTO_BANHO_CAMA_BANHO_3,
  ...QUARTO_BANHO_CAMA_BANHO_4,
  ...QUARTO_BANHO_CAMA_BANHO_5,
  ...QUARTO_BANHO_CAMA_BANHO_6,
  ...QUARTO_BANHO_ELETROPORTATIL_1,
  ...QUARTO_BANHO_ORGANIZACAO_1,
];
