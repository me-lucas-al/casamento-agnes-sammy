import type { PixKeyType } from "../types";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^\+55\d{10,11}$/;
const RANDOM_KEY_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const CPF_FIRST_WEIGHTS = [10, 9, 8, 7, 6, 5, 4, 3, 2];
const CPF_SECOND_WEIGHTS = [11, 10, 9, 8, 7, 6, 5, 4, 3, 2];
const CNPJ_FIRST_WEIGHTS = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
const CNPJ_SECOND_WEIGHTS = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

function onlyDigits(value: string): string {
  return value.replace(/\D/g, "");
}

function hasRepeatedDigits(digits: string): boolean {
  return new Set(digits).size === 1;
}

function checkDigit(digits: string, weights: readonly number[]): number {
  const sum = weights.reduce((total, weight, index) => total + weight * Number(digits[index]), 0);
  const remainder = sum % 11;
  return remainder < 2 ? 0 : 11 - remainder;
}

function hasValidCheckDigits(
  digits: string,
  firstWeights: readonly number[],
  secondWeights: readonly number[],
): boolean {
  const first = checkDigit(digits, firstWeights);
  const second = checkDigit(digits, secondWeights);
  return first === Number(digits[firstWeights.length]) && second === Number(digits[secondWeights.length]);
}

function isValidCpf(key: string): boolean {
  if (key.length !== 11 || hasRepeatedDigits(key)) return false;
  return hasValidCheckDigits(key, CPF_FIRST_WEIGHTS, CPF_SECOND_WEIGHTS);
}

function isValidCnpj(key: string): boolean {
  if (key.length !== 14 || hasRepeatedDigits(key)) return false;
  return hasValidCheckDigits(key, CNPJ_FIRST_WEIGHTS, CNPJ_SECOND_WEIGHTS);
}

const VALIDATORS: Record<PixKeyType, (normalizedKey: string) => boolean> = {
  cpf: isValidCpf,
  cnpj: isValidCnpj,
  email: (key) => EMAIL_PATTERN.test(key),
  phone: (key) => PHONE_PATTERN.test(key),
  random: (key) => RANDOM_KEY_PATTERN.test(key),
};

export function normalizePixKey(type: PixKeyType, key: string): string {
  const trimmed = key.trim();
  if (type === "cpf" || type === "cnpj") return onlyDigits(trimmed);
  if (type === "email" || type === "random") return trimmed.toLowerCase();
  return trimmed.replace(/[\s()-]/g, "");
}

export function isValidPixKey(type: PixKeyType, key: string): boolean {
  return VALIDATORS[type](normalizePixKey(type, key));
}
