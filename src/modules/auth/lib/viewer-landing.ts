export const VIEWER_AREAS = ["convidado", "noivos"] as const;

export type ViewerArea = (typeof VIEWER_AREAS)[number];

const DEFAULT_VIEWER_AREA: ViewerArea = "convidado";

const LANDING_ROUTES: Record<ViewerArea, string> = {
  convidado: "/inicio",
  noivos: "/painel",
};

function isViewerArea(value: unknown): value is ViewerArea {
  return VIEWER_AREAS.some((area) => area === value);
}

export function resolveViewerLanding(requestedArea: unknown): string {
  return LANDING_ROUTES[isViewerArea(requestedArea) ? requestedArea : DEFAULT_VIEWER_AREA];
}
