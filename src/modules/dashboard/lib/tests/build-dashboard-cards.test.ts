import { describe, expect, it } from "vitest";
import type { DashboardTotals } from "@/modules/dashboard/types";
import { buildDashboardCards } from "../build-dashboard-cards";

const totals: DashboardTotals = {
  reservations: { reserved: 2, confirmed: 1 },
  pendingPayments: { count: 2, amountCents: 45000 },
  attendance: { going: 3, declined: 1, pending: 4, attendingPeople: 7 },
  pendingMessages: 5,
  pendingPhotos: 0,
};

describe("buildDashboardCards", () => {
  const cards = buildDashboardCards(totals);

  it("links each card to its panel section", () => {
    expect(cards.map((card) => card.href)).toEqual([
      "/painel/presentes",
      "/painel/pagamentos",
      "/painel/presencas",
      "/painel/recados",
      "/painel/fotos",
    ]);
  });

  it("summarizes reservations and pending payments in BRL", () => {
    expect(cards[0].details).toEqual(["2 reservadas", "1 confirmada"]);
    expect(cards[1].value.replace(/\s/g, " ")).toBe("R$ 450,00");
  });

  it("summarizes attendance with people total", () => {
    expect(cards[2].value).toBe("7 pessoas");
    expect(cards[2].details).toEqual(["3 indo", "1 recusaram", "4 pendentes"]);
  });

  it("shows moderation counts", () => {
    expect([cards[3].value, cards[4].value]).toEqual(["5", "0"]);
  });
});
