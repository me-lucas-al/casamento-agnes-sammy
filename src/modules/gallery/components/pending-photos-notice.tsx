type PendingPhotosNoticeProps = { total: number };

export function PendingPhotosNotice({ total }: PendingPhotosNoticeProps) {
  if (total === 0) return null;
  const label = total === 1 ? "1 foto sua aguarda" : `${total} fotos suas aguardam`;
  return (
    <p role="status" className="rounded-full bg-blush px-4 py-2 text-center text-sm text-wine">
      {label} aprovação dos noivos.
    </p>
  );
}
