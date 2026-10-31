import type { VerifiedProductRecord } from "../../../types";
import { SALA_DECORACAO_1 } from "./decoracao-1";
import { SALA_DECORACAO_2 } from "./decoracao-2";
import { SALA_DECORACAO_3 } from "./decoracao-3";
import { SALA_ELETRONICO_1 } from "./eletronico-1";
import { SALA_ELETROPORTATIL_1 } from "./eletroportatil-1";
import { SALA_MOVEL_1 } from "./movel-1";
import { SALA_MOVEL_2 } from "./movel-2";

export const SALA_VERIFIED: readonly VerifiedProductRecord[] = [
  ...SALA_DECORACAO_1,
  ...SALA_DECORACAO_2,
  ...SALA_DECORACAO_3,
  ...SALA_ELETRONICO_1,
  ...SALA_ELETROPORTATIL_1,
  ...SALA_MOVEL_1,
  ...SALA_MOVEL_2,
];
