import Image from "next/image";
import { formatCentsAsBrl } from "@/shared/lib/money";
import type { PixPaymentDetails } from "../types";
import { CopyButton } from "./copy-button";

type PixPaymentPanelProps = {
  payment: PixPaymentDetails;
};

const QR_SIZE = 224;

export function PixPaymentPanel({ payment }: PixPaymentPanelProps) {
  return (
    <section className="flex flex-col gap-5 rounded-2xl bg-blush p-5 text-wine">
      <div>
        <p className="text-sm uppercase tracking-widest">Valor do Pix</p>
        <p className="font-display text-4xl">{formatCentsAsBrl(payment.amountCents)}</p>
      </div>
      <Image
        src={payment.qrDataUrl}
        alt="QR Code do Pix"
        width={QR_SIZE}
        height={QR_SIZE}
        unoptimized
        className="mx-auto h-auto w-full max-w-56 rounded-lg bg-white p-2"
      />
      <div className="flex flex-col gap-2">
        <p className="text-sm">Chave Pix ({payment.receiverName})</p>
        <p className="break-all font-mono text-sm">{payment.pixKey}</p>
        <CopyButton text={payment.pixKey} label="Copiar chave" />
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-sm">Pix copia e cola</p>
        <p className="break-all font-mono text-xs">{payment.brCode}</p>
        <CopyButton text={payment.brCode} label="Copiar código Pix" />
      </div>
    </section>
  );
}
