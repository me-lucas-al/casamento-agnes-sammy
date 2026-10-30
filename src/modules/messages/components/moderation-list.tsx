import { formatDateTimeInSaoPaulo } from "@/shared/lib/dates";
import type { Message, ModerationStatus } from "../types";
import { ModerationActions } from "./moderation-actions";

const statusLabels: Record<ModerationStatus, string> = {
  pending: "Pendente",
  approved: "Aprovado",
  rejected: "Rejeitado",
};

export function ModerationList({ messages }: { messages: Message[] }) {
  return (
    <ul className="flex flex-col gap-3">
      {messages.map((message) => (
        <li key={message.id} className="flex flex-col gap-3 rounded-xl bg-paper-dark/40 p-4 text-wine">
          <div className="flex items-center justify-between gap-2 text-xs text-wine/70">
            <span>
              {message.authorName} · {formatDateTimeInSaoPaulo(message.createdAt)}
            </span>
            <span className="rounded-full bg-blush px-3 py-1">{statusLabels[message.status]}</span>
          </div>
          <p className="whitespace-pre-line break-words">{message.body}</p>
          <ModerationActions message={message} />
        </li>
      ))}
    </ul>
  );
}
