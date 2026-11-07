import { maskPersonName } from "@/shared/lib/privacy/mask-person-name";
import type { Message } from "../../types";

export function maskMessageForViewer(message: Message): Message {
  return { ...message, authorName: maskPersonName(message.authorName) };
}
