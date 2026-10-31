import type { GiftSuggestion } from "../types";
import { BATHROOM_SUGGESTIONS } from "./bathroom-suggestions";
import { BEDROOM_SUGGESTIONS } from "./bedroom-suggestions";
import { FUN_SUGGESTIONS } from "./fun-suggestions";
import { HONEYMOON_SUGGESTIONS } from "./honeymoon-suggestions";
import { KITCHEN_APPLIANCES } from "./kitchen-appliances";
import { KITCHEN_UTENSILS } from "./kitchen-utensils";
import { LIVING_ROOM_DECOR } from "./living-room-decor";
import { LIVING_ROOM_FURNITURE_TECH } from "./living-room-furniture-tech";
import { NEW_HOME_FUNDS } from "./new-home-funds";
import { NEW_HOME_TOOLS } from "./new-home-tools";

export const GIFT_SUGGESTION_CATALOG: readonly GiftSuggestion[] = [
  ...KITCHEN_APPLIANCES,
  ...KITCHEN_UTENSILS,
  ...LIVING_ROOM_DECOR,
  ...LIVING_ROOM_FURNITURE_TECH,
  ...BEDROOM_SUGGESTIONS,
  ...BATHROOM_SUGGESTIONS,
  ...HONEYMOON_SUGGESTIONS,
  ...NEW_HOME_FUNDS,
  ...NEW_HOME_TOOLS,
  ...FUN_SUGGESTIONS,
];
