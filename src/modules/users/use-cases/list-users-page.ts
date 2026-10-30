import { requireRole } from "@/modules/auth/authorization";
import type { SessionUser } from "@/modules/auth/types";
import { buildPageResult, type PageParams, type PageResult } from "@/shared/lib/pagination";
import type { UserRepository } from "../repositories/user-repository";
import type { User } from "../types";

type Dependencies = { userRepository: UserRepository };

type Input = PageParams & { search: string };

export function makeListUsersPage({ userRepository }: Dependencies) {
  return async function listUsersPage(
    actor: SessionUser | null,
    { page, perPage, offset, search }: Input,
  ): Promise<PageResult<User>> {
    requireRole(actor, ["admin"]);
    const { items, total } = await userRepository.listPage({ limit: perPage, offset, search });
    return buildPageResult({ items, total, page, perPage });
  };
}
