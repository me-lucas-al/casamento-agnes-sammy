export function PageSkeleton() {
  return (
    <div role="status" aria-busy="true" aria-label="Carregando" className="mx-auto flex max-w-3xl animate-pulse flex-col gap-4">
      <div className="mx-auto h-10 w-2/3 rounded-xl bg-blush" />
      <div className="h-32 rounded-2xl bg-blush" />
      <div className="grid gap-3 md:grid-cols-2">
        <div className="h-20 rounded-2xl bg-blush" />
        <div className="h-20 rounded-2xl bg-blush" />
      </div>
      <span className="sr-only">Carregando...</span>
    </div>
  );
}
