import type { VerifiedProductRecord } from "../../../types";
import { DIVERTIDOS_DIVERTIDO_1 } from "./divertido-1";
import { DIVERTIDOS_DIVERTIDO_2 } from "./divertido-2";
import { DIVERTIDOS_DIVERTIDO_3 } from "./divertido-3";
import { DIVERTIDOS_ELETRONICO_1 } from "./eletronico-1";
import { DIVERTIDOS_ELETROPORTATIL_1 } from "./eletroportatil-1";
import { DIVERTIDOS_MESA_POSTA_1 } from "./mesa-posta-1";
import { DIVERTIDOS_UTENSILIO_1 } from "./utensilio-1";

export const DIVERTIDOS_VERIFIED: readonly VerifiedProductRecord[] = [
  ...DIVERTIDOS_DIVERTIDO_1,
  ...DIVERTIDOS_DIVERTIDO_2,
  ...DIVERTIDOS_DIVERTIDO_3,
  ...DIVERTIDOS_ELETRONICO_1,
  ...DIVERTIDOS_ELETROPORTATIL_1,
  ...DIVERTIDOS_MESA_POSTA_1,
  ...DIVERTIDOS_UTENSILIO_1,
];
