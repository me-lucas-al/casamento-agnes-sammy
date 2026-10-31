import type { GiftSuggestion } from "../types";
import { FUN_SUGGESTIONS } from "./fun-suggestions";
import { HONEYMOON_SUGGESTIONS } from "./honeymoon-suggestions";
import { NEW_HOME_FUNDS } from "./new-home-funds";
import { NEW_HOME_TOOLS } from "./new-home-tools";
import { VERIFIED_SUGGESTIONS } from "./verified/verified-suggestions";

export const GIFT_SUGGESTION_CATALOG: readonly GiftSuggestion[] = [
  ...HONEYMOON_SUGGESTIONS,
  ...NEW_HOME_FUNDS,
  ...NEW_HOME_TOOLS,
  ...FUN_SUGGESTIONS,
  ...VERIFIED_SUGGESTIONS,
];
