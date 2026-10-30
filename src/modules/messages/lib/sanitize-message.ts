import { InvalidMessageError } from "../errors";

export const MAX_BODY_LENGTH = 500;
export const MAX_AUTHOR_NAME_LENGTH = 80;

type RawMessage = { authorName: string; body: string };

const CONTROL_CHARACTERS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;

function sanitizeBody(body: string): string {
  return body
    .replace(/\r\n?/g, "\n")
    .replace(CONTROL_CHARACTERS, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function sanitizeAuthorName(authorName: string): string {
  return authorName.replace(CONTROL_CHARACTERS, "").replace(/\s+/g, " ").trim();
}

export function sanitizeMessage({ authorName, body }: RawMessage): RawMessage {
  const cleanBody = sanitizeBody(body);
  const cleanAuthorName = sanitizeAuthorName(authorName);
  if (cleanBody.length < 1 || cleanBody.length > MAX_BODY_LENGTH) throw new InvalidMessageError();
  if (cleanAuthorName.length < 1 || cleanAuthorName.length > MAX_AUTHOR_NAME_LENGTH) {
    throw new InvalidMessageError();
  }
  return { authorName: cleanAuthorName, body: cleanBody };
}
