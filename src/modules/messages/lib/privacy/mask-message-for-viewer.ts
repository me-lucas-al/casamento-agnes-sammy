import { maskPersonName } from "@/shared/lib/privacy/mask-person-name";
import type { Message, PublicMessage } from "../../types";

export function maskMessageForViewer(message: Message): Message {
  return { ...message, authorName: maskPersonName(message.authorName) };
}

export function maskPublicMessageForViewer(message: PublicMessage): PublicMessage {
  return { ...message, authorName: maskPersonName(message.authorName) };
}
