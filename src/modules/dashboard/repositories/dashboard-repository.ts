import type { DashboardTotals } from "../types";

export interface DashboardRepository {
  readTotals(now: Date): Promise<DashboardTotals>;
}
