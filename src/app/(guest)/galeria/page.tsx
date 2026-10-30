import { PendingPhotosNotice } from "@/modules/gallery/components/pending-photos-notice";
import { PhotoGrid } from "@/modules/gallery/components/photo-grid";
import { PhotoUploadForm } from "@/modules/gallery/components/photo-upload-form";
import {
  countOwnPendingPhotosQuery,
  listApprovedPhotosQuery,
} from "@/modules/gallery/controllers/gallery.queries";
import type { SearchParams } from "@/shared/lib/url-params";
import { EmptyState } from "@/shared/ui/empty-state";
import { PaginationControls } from "@/shared/ui/pagination-controls";

type GaleriaPageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function GaleriaPage({ searchParams }: GaleriaPageProps) {
  const params = await searchParams;
  const [pageResult, ownPendingTotal] = await Promise.all([
    listApprovedPhotosQuery(params),
    countOwnPendingPhotosQuery(),
  ]);

  return (
    <div className="mx-auto grid max-w-5xl gap-6">
      <h1 className="font-heading text-3xl text-wine">Galeria</h1>
      <PhotoUploadForm />
      <PendingPhotosNotice total={ownPendingTotal} />
      {pageResult.items.length === 0 ? (
        <EmptyState title="Ainda não há fotos" description="Seja o primeiro a compartilhar um momento." />
      ) : (
        <PhotoGrid photos={pageResult.items} />
      )}
      <PaginationControls basePath="/galeria" searchParams={params} pageResult={pageResult} />
    </div>
  );
}
