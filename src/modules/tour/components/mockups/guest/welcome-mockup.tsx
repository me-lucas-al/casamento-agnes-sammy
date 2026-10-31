import { Camera, Gift, MessageCircleHeart, PartyPopper } from "lucide-react";
import Image from "next/image";
import { PhoneFrame } from "../parts/phone-frame";

const FEATURES = [
  { icon: Gift, title: "Lista de presentes", detail: "Pix direto, sem taxa" },
  { icon: PartyPopper, title: "Confirmar presença", detail: "Confirmação com acompanhantes" },
  { icon: MessageCircleHeart, title: "Recados", detail: "Mural de carinho" },
  { icon: Camera, title: "Galeria", detail: "Fotos de vocês" },
] as const;

export function WelcomeMockup() {
  return (
    <PhoneFrame label="Exemplo da página inicial que o convidado vê">
      <div className="flex flex-col items-center gap-1 text-center">
        <Image src="/brand/monogram.png" alt="" width={168} height={300} className="h-20 w-auto" />
        <p className="font-heading text-3xl italic leading-none">Agnes &amp; Sammy</p>
        <p className="font-display text-xl text-rose">
          07 <span className="text-sm">&#9829;</span> 11 <span className="text-sm">&#9829;</span> 26
        </p>
        <span className="rounded-full bg-blush px-4 py-1 text-base">Confirme sua presença</span>
      </div>
      <ul className="grid grid-cols-2 gap-2">
        {FEATURES.map(({ icon: Icon, title, detail }) => (
          <li key={title} className="flex flex-col gap-0.5 rounded-xl border border-gold/50 bg-card p-2">
            <Icon aria-hidden className="size-5 text-rose" />
            <span className="text-base font-semibold leading-tight">{title}</span>
            <span className="text-sm leading-tight text-muted-foreground">{detail}</span>
          </li>
        ))}
      </ul>
      <p className="mt-auto rounded-lg bg-crimson px-2 py-1.5 text-center text-sm text-paper">
        com carinho, Agnes e Sammy
      </p>
    </PhoneFrame>
  );
}
