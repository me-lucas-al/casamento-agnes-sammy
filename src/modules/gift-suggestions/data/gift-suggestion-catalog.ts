import type { GiftSuggestion } from "../types";
import { BEDROOM_BATH_SUGGESTIONS } from "./bedroom-bath-suggestions";
import { FUN_SUGGESTIONS } from "./fun-suggestions";
import { HONEYMOON_SUGGESTIONS } from "./honeymoon-suggestions";
import { KITCHEN_SUGGESTIONS } from "./kitchen-suggestions";
import { LIVING_ROOM_SUGGESTIONS } from "./living-room-suggestions";
import { NEW_HOME_SUGGESTIONS } from "./new-home-suggestions";

export const GIFT_SUGGESTION_CATALOG: readonly GiftSuggestion[] = [
  ...KITCHEN_SUGGESTIONS,
  ...LIVING_ROOM_SUGGESTIONS,
  ...BEDROOM_BATH_SUGGESTIONS,
  ...HONEYMOON_SUGGESTIONS,
  ...NEW_HOME_SUGGESTIONS,
  ...FUN_SUGGESTIONS,
];
