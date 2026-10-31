import { getDatabase } from "@/shared/db/client";
import type { Database } from "@/shared/db/types";
import { nextCachedReader, passThroughCachedReader, type CachedReader } from "@/shared/lib/cache/cached-read";
import { createDrizzleMessageRepository } from "./repositories/drizzle/drizzle-message-repository";
import { makeDeleteMessage } from "./use-cases/delete-message";
import { makeListApprovedMessagesPage } from "./use-cases/list-approved-messages-page";
import { makeListMessagesPage } from "./use-cases/list-messages-page";
import { makeModerateMessage } from "./use-cases/moderate-message";
import { makeSendMessage } from "./use-cases/send-message";
import { makeUpdateMessage } from "./use-cases/update-message";

type MessageModuleOptions = { cachedReader?: CachedReader };

export function createMessageModule(
  database: Database,
  { cachedReader = passThroughCachedReader }: MessageModuleOptions = {},
) {
  const messageRepository = createDrizzleMessageRepository(database);
  return {
    messageRepository,
    sendMessage: makeSendMessage({ messageRepository }),
    moderateMessage: makeModerateMessage({ messageRepository }),
    updateMessage: makeUpdateMessage({ messageRepository }),
    deleteMessage: makeDeleteMessage({ messageRepository }),
    listMessagesPage: makeListMessagesPage({ messageRepository }),
    listApprovedMessagesPage: makeListApprovedMessagesPage({ messageRepository, cachedReader }),
  };
}

export type MessageModule = ReturnType<typeof createMessageModule>;

export function getMessageModule(): MessageModule {
  return createMessageModule(getDatabase(), { cachedReader: nextCachedReader });
}
