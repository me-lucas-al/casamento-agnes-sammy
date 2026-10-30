export type PixKeyType = "cpf" | "cnpj" | "email" | "phone" | "random";

export type PixSettings = {
  pixKey: string;
  pixKeyType: PixKeyType;
  pixReceiverName: string;
  pixCity: string;
};

export type PixPaymentDetails = {
  amountCents: number;
  pixKey: string;
  receiverName: string;
  brCode: string;
  qrDataUrl: string;
};
