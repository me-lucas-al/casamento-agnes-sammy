const BRAZIL_COUNTRY_CODE = "55";
const NATIONAL_NUMBER_LENGTHS = [10, 11];

type InviteInput = {
  baseUrl: string;
  guestName: string;
  code: string;
  phone?: string | null;
};

export function buildGuestInviteUrl(baseUrl: string, code: string): string {
  const normalizedBaseUrl = baseUrl.replace(/\/+$/, "");
  return `${normalizedBaseUrl}/entrar?codigo=${encodeURIComponent(code)}`;
}

export function normalizeWhatsappNumber(phone: string | null | undefined): string {
  const digits = (phone ?? "").replace(/\D/g, "");
  if (NATIONAL_NUMBER_LENGTHS.includes(digits.length)) return `${BRAZIL_COUNTRY_CODE}${digits}`;
  return digits;
}

export function buildGuestInviteMessage({ baseUrl, guestName, code }: InviteInput): string {
  const inviteUrl = buildGuestInviteUrl(baseUrl, code);
  return `Olá, ${guestName}! Agnes e Sammy convidam você para o nosso casamento. Acesse o site com seu código ${code}: ${inviteUrl}`;
}

export function buildWhatsappShareLink(input: InviteInput): string {
  const text = encodeURIComponent(buildGuestInviteMessage(input));
  const number = normalizeWhatsappNumber(input.phone);
  return `https://wa.me/${number}?text=${text}`;
}
