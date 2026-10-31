import { formatDateInSaoPaulo } from "@/shared/lib/dates";
import type { PublicMessage } from "../types";

export function ApprovedMessagesList({ messages }: { messages: PublicMessage[] }) {
  return (
    <ul className="flex flex-col gap-3">
      {messages.map(({ id, authorName, body, createdAt }) => (
        <li key={id} className="rounded-xl bg-blush/70 p-4 text-wine">
          <p className="whitespace-pre-line break-words">{body}</p>
          <p className="mt-2 text-sm text-wine/80">
            {authorName} · {formatDateInSaoPaulo(new Date(createdAt))}
          </p>
        </li>
      ))}
    </ul>
  );
}
