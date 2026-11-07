import { requireRole } from "@/modules/auth/authorization";
import { isViewer } from "@/modules/auth/lib/is-viewer";
import type { SessionUser } from "@/modules/auth/types";
import { buildPageResult, type PageParams, type PageResult } from "@/shared/lib/pagination/pagination";
import { maskUserForViewer } from "../lib/privacy/mask-user-for-viewer";
import type { UserRepository } from "../repositories/contracts/user-repository";
import type { User, UserStatus } from "../types";

type Dependencies = { userRepository: UserRepository };

type Input = PageParams & { search: string; status?: UserStatus };

export function makeListUsersPage({ userRepository }: Dependencies) {
  return async function listUsersPage(
    actor: SessionUser | null,
    { page, perPage, offset, search, status }: Input,
  ): Promise<PageResult<User>> {
    const user = requireRole(actor, ["admin", "viewer"]);
    const isReadOnlyVisitor = isViewer(user);
    const effectiveSearch = isReadOnlyVisitor ? "" : search;
    const { items, total } = await userRepository.listPage({ limit: perPage, offset, search: effectiveSearch, status });
    const visibleItems = isReadOnlyVisitor ? items.map(maskUserForViewer) : items;
    return buildPageResult({ items: visibleItems, total, page, perPage });
  };
}
