import { signInWithGoogleAction } from "@/modules/auth/controllers/sign-in.actions";
import { CenteredStage } from "@/shared/ui/components/centered-stage";

export default function AdminSignInPage() {
  return (
    <CenteredStage>
      <h1 className="font-script text-5xl leading-tight text-wine">Área dos noivos</h1>
      <p className="text-lg">Entre com a conta Google autorizada para cuidar de tudo por aqui.</p>
      <form action={signInWithGoogleAction} className="w-full">
        <button
          type="submit"
          className="w-full rounded-full bg-rose px-6 py-3 text-lg text-white transition-colors hover:bg-crimson"
        >
          Entrar com Google
        </button>
      </form>
    </CenteredStage>
  );
}
