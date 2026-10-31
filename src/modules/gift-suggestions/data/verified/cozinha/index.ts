import type { VerifiedProductRecord } from "../../../types";
import { COZINHA_ELETROPORTATIL_1 } from "./eletroportatil-1";
import { COZINHA_ELETROPORTATIL_2 } from "./eletroportatil-2";
import { COZINHA_ELETROPORTATIL_3 } from "./eletroportatil-3";
import { COZINHA_ELETROPORTATIL_4 } from "./eletroportatil-4";
import { COZINHA_ELETROPORTATIL_5 } from "./eletroportatil-5";
import { COZINHA_UTENSILIO_1 } from "./utensilio-1";
import { COZINHA_UTENSILIO_2 } from "./utensilio-2";
import { COZINHA_UTENSILIO_3 } from "./utensilio-3";
import { COZINHA_UTENSILIO_4 } from "./utensilio-4";
import { COZINHA_UTENSILIO_5 } from "./utensilio-5";

export const COZINHA_VERIFIED: readonly VerifiedProductRecord[] = [
  ...COZINHA_ELETROPORTATIL_1,
  ...COZINHA_ELETROPORTATIL_2,
  ...COZINHA_ELETROPORTATIL_3,
  ...COZINHA_ELETROPORTATIL_4,
  ...COZINHA_ELETROPORTATIL_5,
  ...COZINHA_UTENSILIO_1,
  ...COZINHA_UTENSILIO_2,
  ...COZINHA_UTENSILIO_3,
  ...COZINHA_UTENSILIO_4,
  ...COZINHA_UTENSILIO_5,
];
