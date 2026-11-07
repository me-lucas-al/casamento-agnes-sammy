import { createAuthModule } from "@/modules/auth/factory";
import { VIEWER_USER_ID } from "@/modules/auth/types";
import { createContributionModule } from "@/modules/contributions/factory";
import { createDashboardModule } from "@/modules/dashboard/factory";
import { createEventModule } from "@/modules/event/factory";
import { createGiftSuggestionModule } from "@/modules/gift-suggestions/factory";
import { createGuestModule } from "@/modules/guests/factory";
import { createMessageModule } from "@/modules/messages/factory";
import { createProfileModule } from "@/modules/profile/factory";
import { createRsvpModule } from "@/modules/rsvp/factory";
import { createTourModule } from "@/modules/tour/factory";
import { createUserModule } from "@/modules/users/factory";
import type { Database } from "@/shared/db/types";
import { passThroughCachedReader } from "@/shared/lib/cache/cached-read";
import { asUser } from "@/tests/helpers/fakes/fake-session";
import { buildGalleryContext } from "../gallery/gallery-test-context";
import { createTestGiftModule } from "../gifts/gift-test-module";

export const viewer = asUser("viewer", { id: VIEWER_USER_ID });

export const FIRST_PAGE = { page: 1, perPage: 12, offset: 0 };

export function buildViewerContext(database: Database) {
  const { giftModule } = createTestGiftModule(database);
  return {
    authModule: createAuthModule(database),
    contributionModule: createContributionModule(database),
    dashboardModule: createDashboardModule({ database, cachedReader: passThroughCachedReader }),
    eventModule: createEventModule(database),
    galleryModule: buildGalleryContext(database).galleryModule,
    giftModule,
    guestModule: createGuestModule(database),
    messageModule: createMessageModule(database),
    profileModule: createProfileModule(database),
    rsvpModule: createRsvpModule(database),
    suggestionModule: createGiftSuggestionModule(giftModule),
    tourModule: createTourModule({ database }),
    userModule: createUserModule(database),
  };
}
