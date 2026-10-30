import { GuestCodeForm } from "@/modules/auth/components/guest-code-form";
import { firstValue, type SearchParams } from "@/shared/lib/url-params";
import { CenteredStage } from "@/shared/ui/components/centered-stage";

type GuestSignInPageProps = { searchParams: Promise<SearchParams> };

const MAX_CODE_LENGTH = 32;

export default async function GuestSignInPage({ searchParams }: GuestSignInPageProps) {
  const params = await searchParams;
  const initialCode = (firstValue(params.codigo) ?? "").trim().slice(0, MAX_CODE_LENGTH);
  return (
    <CenteredStage>
      <h1 className="font-script text-5xl leading-tight text-wine">Agnes &amp; Sammy</h1>
      <p className="text-lg">Que alegria ter você aqui! Digite o código que está no seu convite.</p>
      <GuestCodeForm initialCode={initialCode} />
    </CenteredStage>
  );
}
