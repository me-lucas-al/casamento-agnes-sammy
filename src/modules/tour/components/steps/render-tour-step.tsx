import type { ReactNode } from "react";
import type { TourStepId } from "@/modules/tour/lib/build-tour-steps";
import { EventStep } from "./setup/event-step";
import { FinalStep } from "./bookends/final-step";
import { GiftsStep } from "./setup/gifts-step";
import { GuestEntryStep } from "./guests/guest-entry-step";
import { GuestViewStep } from "./guests/guest-view-step";
import { InviteStep } from "./setup/invite-step";
import { ModerationStep } from "./setup/moderation-step";
import { PaymentsStep } from "./guests/payments-step";
import { RsvpStep } from "./guests/rsvp-step";
import { UsersStep } from "./setup/users-step";
import { WelcomeStep } from "./bookends/welcome-step";

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
