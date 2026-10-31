import { CopyTextButton } from "./copy-text-button";

type AccessCodeCardProps = { code: string; invitationLink: string };

export function AccessCodeCard({ code, invitationLink }: AccessCodeCardProps) {
  return (
    <section className="mx-auto flex w-full max-w-md flex-col gap-3 rounded-2xl border border-gold/40 bg-blush px-4 py-5 text-center">
      <h2 className="font-heading text-xl italic">Seu código de acesso</h2>
      <p className="font-display text-3xl tracking-widest text-crimson">{code}</p>
      <p className="break-all text-base">{invitationLink}</p>
      <div className="flex flex-wrap justify-center gap-2">
        <CopyTextButton text={code} label="Copiar código" />
        <CopyTextButton text={invitationLink} label="Copiar link" />
      </div>
    </section>
  );
}
