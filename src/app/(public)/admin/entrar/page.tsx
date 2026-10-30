import { signInWithGoogleAction } from "@/modules/auth/controllers/sign-in.actions";

export default function AdminSignInPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-sm flex-col items-center justify-center gap-6 px-6 text-center">
      <h1 className="font-heading text-4xl italic">Área dos noivos</h1>
      <p className="text-lg">Entre com a conta Google autorizada.</p>
      <form action={signInWithGoogleAction} className="w-full">
        <button
          type="submit"
          className="w-full rounded-full bg-rose px-6 py-3 text-lg text-white transition-colors hover:bg-crimson"
        >
          Entrar com Google
        </button>
      </form>
    </main>
  );
}
