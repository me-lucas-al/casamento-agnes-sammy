import { describe, expect, it } from "vitest";
import { buildPaginationLinks } from "./pagination-links";

describe("buildPaginationLinks", () => {
  it("links both directions in the middle of the list and keeps filters", () => {
    const links = buildPaginationLinks("/presentes", { search: "mesa" }, { page: 2, hasPreviousPage: true, hasNextPage: true });
    expect(links.previous.href).toBe("/presentes?search=mesa&page=1");
    expect(links.next.href).toBe("/presentes?search=mesa&page=3");
  });

  it("has no previous link on the first page", () => {
    const links = buildPaginationLinks("/presentes", {}, { page: 1, hasPreviousPage: false, hasNextPage: true });
    expect(links.previous.href).toBeNull();
    expect(links.next.href).toBe("/presentes?page=2");
  });

  it("has no next link on the last page instead of pointing past the end", () => {
    const links = buildPaginationLinks("/presentes", {}, { page: 2, hasPreviousPage: true, hasNextPage: false });
    expect(links.next.href).toBeNull();
    expect(links.previous.href).toBe("/presentes?page=1");
  });
});
