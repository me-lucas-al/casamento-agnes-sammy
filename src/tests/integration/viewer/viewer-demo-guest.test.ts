import { describe, expect, it } from "vitest";
import { ViewerReadOnlyError } from "@/modules/auth/errors";
import { VIEWER_USER_ID } from "@/modules/auth/types";
import { seedContribution } from "@/tests/helpers/database/seeds/seed-contribution";
import { useTestDatabase } from "@/tests/helpers/database/use-test-database";
import { buildViewerContext, viewer } from "./viewer-test-context";

describe("viewer sees a demo guest and a demo staff profile", () => {
  const testDatabase = useTestDatabase();
  const context = () => buildViewerContext(testDatabase.db);

  it("returns the demo guest profile without touching real guests", async () => {
    await seedContribution(testDatabase.db);

    const profile = await context().profileModule.getGuestProfile(viewer, "");

    expect(profile).toMatchObject({
      guestId: VIEWER_USER_ID,
      name: "Convidado(a) de exemplo",
      profileCompleted: true,
    });
  });

  it("returns the demo RSVP and an empty list of gifts", async () => {
    await seedContribution(testDatabase.db);
    const { rsvpModule, contributionModule } = context();

    await expect(rsvpModule.getGuestRsvp(viewer, VIEWER_USER_ID)).resolves.toMatchObject({
      guestName: "Convidado(a) de exemplo",
      status: "pending",
    });
    await expect(contributionModule.listMyContributions(viewer)).resolves.toEqual([]);
  });

  it("returns the viewer staff profile", async () => {
    const profile = await context().profileModule.getStaffProfile(viewer);

    expect(profile).toMatchObject({ name: "Visitante", role: "viewer" });
  });

  it("keeps the tour status out of reach so the page skips the auto-open", async () => {
    await expect(context().tourModule.getTourStatus(viewer)).rejects.toBeInstanceOf(ViewerReadOnlyError);
  });
});
