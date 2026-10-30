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
