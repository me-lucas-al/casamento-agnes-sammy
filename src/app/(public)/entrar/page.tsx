import { GuestCodeForm } from "@/modules/auth/components/guest-code-form";
import { firstValue, type SearchParams } from "@/shared/lib/url-params";

type GuestSignInPageProps = { searchParams: Promise<SearchParams> };

const MAX_CODE_LENGTH = 32;

export default async function GuestSignInPage({ searchParams }: GuestSignInPageProps) {
  const params = await searchParams;
  const initialCode = (firstValue(params.codigo) ?? "").trim().slice(0, MAX_CODE_LENGTH);
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-sm flex-col items-center justify-center gap-6 px-6 text-center">
      <h1 className="font-heading text-4xl italic">Agnes &amp; Sammy</h1>
      <p className="text-lg">Digite o código que você recebeu no convite.</p>
      <GuestCodeForm initialCode={initialCode} />
    </main>
  );
}
