import type { Metadata } from "next";
import { redirectSignedInUser } from "@/modules/auth/controllers/redirect-signed-in-user";
import { LoginScreen } from "@/modules/auth/components/login/login-screen";
import { getEventSettingsQuery } from "@/modules/event/controllers/queries/event.queries";
import { enumParam, firstValue, type SearchParams } from "@/shared/lib/url-params";
import { normalizeAccessCode } from "@/modules/auth/lib/access-code";
import { describeLoginError, parseLoginError } from "@/modules/auth/lib/login-error";

export const metadata: Metadata = {
  title: "Entrar",
  description: "Entre com o código do seu convite para ver os presentes, confirmar presença e deixar um recado para Agnes e Sammy.",
};

type HomePageProps = { searchParams: Promise<SearchParams> };

export default async function HomePage({ searchParams }: HomePageProps) {
  const [params] = await Promise.all([searchParams, redirectSignedInUser()]);
  const settings = await getEventSettingsQuery();
  const initialCode = normalizeAccessCode(firstValue(params.codigo) ?? "");
  const requestedTab = enumParam(params, "aba", ["convidado", "noivos"]);
  const loginError = parseLoginError(params);
  const initialTab = initialCode ? "convidado" : loginError ? "noivos" : (requestedTab ?? "convidado");
  return (
    <LoginScreen
      settings={settings}
      initialCode={initialCode}
      initialTab={initialTab}
      errorMessage={describeLoginError(loginError)}
    />
  );
}
