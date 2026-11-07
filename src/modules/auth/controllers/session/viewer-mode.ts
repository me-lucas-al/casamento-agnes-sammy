import { getAuthEnv } from "@/shared/config/env";

export function isViewerModeEnabled(): boolean {
  return getAuthEnv().VIEWER_MODE_ENABLED;
}
