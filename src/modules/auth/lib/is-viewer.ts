import type { SessionUser } from "../types";

export function isViewer(actor: SessionUser | null | undefined): boolean {
  return actor?.role === "viewer";
}
