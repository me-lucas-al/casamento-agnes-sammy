import type { GiftSuggestion } from "../../types";
import { hydrateVerifiedProducts } from "./hydrate-verified-products";
import { COZINHA_VERIFIED } from "./cozinha";
import { DIVERTIDOS_VERIFIED } from "./divertidos";
import { QUARTO_BANHO_VERIFIED } from "./quarto-banho";
import { SALA_VERIFIED } from "./sala";

export const VERIFIED_SUGGESTIONS: readonly GiftSuggestion[] = [
  ...hydrateVerifiedProducts("cozinha", COZINHA_VERIFIED),
  ...hydrateVerifiedProducts("divertidos", DIVERTIDOS_VERIFIED),
  ...hydrateVerifiedProducts("quarto-banho", QUARTO_BANHO_VERIFIED),
  ...hydrateVerifiedProducts("sala", SALA_VERIFIED),
];
