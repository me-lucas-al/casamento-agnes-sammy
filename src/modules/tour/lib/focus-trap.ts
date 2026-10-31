const FOCUSABLE_SELECTOR = 'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function findWrapTarget(container: HTMLElement, isShiftPressed: boolean): HTMLElement | null {
  const focusable = [...container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)].filter(
    (element) => element.getClientRects().length > 0,
  );
  if (focusable.length === 0) return null;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  const active = document.activeElement;
  if (isShiftPressed && (active === first || !container.contains(active))) return last;
  if (!isShiftPressed && active === last) return first;
  return null;
}
