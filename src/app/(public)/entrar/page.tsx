import { redirect } from "next/navigation";
import { firstValue, type SearchParams } from "@/shared/lib/url-params";

type GuestSignInPageProps = { searchParams: Promise<SearchParams> };

export default async function GuestSignInPage({ searchParams }: GuestSignInPageProps) {
  const code = firstValue((await searchParams).codigo);
  redirect(code ? `/?codigo=${encodeURIComponent(code)}` : "/");
}
