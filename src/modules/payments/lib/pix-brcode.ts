import { InvalidPixAmountError, InvalidPixFieldError } from "../errors";
import { crc16Ccitt } from "./crc16";
import { toPixAscii } from "./pix-text";

export type PixBrCodeInput = {
  pixKey: string;
  receiverName: string;
  city: string;
  amountCents?: number;
  transactionId?: string;
};

const MAX_RECEIVER_NAME_LENGTH = 25;
const MAX_CITY_LENGTH = 15;
const MAX_TRANSACTION_ID_LENGTH = 25;
const MAX_PIX_KEY_LENGTH = 77;
const MAX_AMOUNT_CENTS = 9_999_999_999;
const DEFAULT_TRANSACTION_ID = "***";
const PIX_GUI = "br.gov.bcb.pix";
const CENTS_PER_REAL = 100;

function field(fieldId: string, value: string): string {
  return `${fieldId}${value.length.toString().padStart(2, "0")}${value}`;
}

function formatAmount(amountCents: number): string {
  const isValid = Number.isInteger(amountCents) && amountCents > 0 && amountCents <= MAX_AMOUNT_CENTS;
  if (!isValid) throw new InvalidPixAmountError();
  return (amountCents / CENTS_PER_REAL).toFixed(2);
}

function buildTransactionId(transactionId: string | undefined): string {
  if (!transactionId) return DEFAULT_TRANSACTION_ID;
  const sanitized = transactionId.replace(/[^A-Za-z0-9]/g, "").slice(0, MAX_TRANSACTION_ID_LENGTH);
  return sanitized || DEFAULT_TRANSACTION_ID;
}

function buildPixKeyField(pixKey: string): string {
  const key = pixKey.trim();
  if (!key || key.length > MAX_PIX_KEY_LENGTH) throw new InvalidPixFieldError("pixKey");
  return field("26", field("00", PIX_GUI) + field("01", key));
}

export function buildPixBrCode(input: PixBrCodeInput): string {
  const amountField = input.amountCents === undefined ? "" : field("54", formatAmount(input.amountCents));
  const payloadWithoutChecksum =
    field("00", "01") +
    field("01", "11") +
    buildPixKeyField(input.pixKey) +
    field("52", "0000") +
    field("53", "986") +
    amountField +
    field("58", "BR") +
    field("59", toPixAscii(input.receiverName, MAX_RECEIVER_NAME_LENGTH, "receiverName")) +
    field("60", toPixAscii(input.city, MAX_CITY_LENGTH, "city")) +
    field("62", field("05", buildTransactionId(input.transactionId))) +
    "6304";
  return payloadWithoutChecksum + crc16Ccitt(payloadWithoutChecksum);
}
