import type { ReactNode } from "react";
import type { TourStepId } from "../../lib/build-tour-steps";
import { EventStep } from "./event-step";
import { FinalStep } from "./final-step";
import { GiftsStep } from "./gifts-step";
import { GuestEntryStep } from "./guest-entry-step";
import { GuestViewStep } from "./guest-view-step";
import { InviteStep } from "./invite-step";
import { ModerationStep } from "./moderation-step";
import { PaymentsStep } from "./payments-step";
import { RsvpStep } from "./rsvp-step";
import { UsersStep } from "./users-step";
import { WelcomeStep } from "./welcome-step";

const STEP_RENDERERS: Record<TourStepId, () => ReactNode> = {
  welcome: () => <WelcomeStep />,
  event: () => <EventStep />,
  gifts: () => <GiftsStep />,
  invite: () => <InviteStep />,
  "guest-entry": () => <GuestEntryStep />,
  "guest-view": () => <GuestViewStep />,
  payments: () => <PaymentsStep />,
  rsvp: () => <RsvpStep />,
  moderation: () => <ModerationStep />,
  users: () => <UsersStep />,
  final: () => <FinalStep />,
};

export function renderTourStep(stepId: TourStepId): ReactNode {
  return STEP_RENDERERS[stepId]();
}
