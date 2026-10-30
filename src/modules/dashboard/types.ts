export type ReservationTotals = {
  reserved: number;
  confirmed: number;
};

export type PendingPaymentTotals = {
  count: number;
  amountCents: number;
};

export type AttendanceTotals = {
  going: number;
  declined: number;
  pending: number;
  attendingPeople: number;
};

export type DashboardTotals = {
  reservations: ReservationTotals;
  pendingPayments: PendingPaymentTotals;
  attendance: AttendanceTotals;
  pendingMessages: number;
  pendingPhotos: number;
};

export type OnboardingFacts = {
  hasPixData: boolean;
  hasStory: boolean;
  photoCount: number;
  giftCount: number;
};

export type OnboardingStepKey = "pix" | "story" | "photos" | "gifts";

export type OnboardingStep = {
  key: OnboardingStepKey;
  title: string;
  description: string;
  href: string;
  isDone: boolean;
};

export type OnboardingStatus = {
  steps: OnboardingStep[];
  doneCount: number;
  isComplete: boolean;
};
