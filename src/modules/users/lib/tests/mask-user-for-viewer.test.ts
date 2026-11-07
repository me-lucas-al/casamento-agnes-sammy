import { describe, expect, it } from "vitest";
import type { User } from "../../types";
import { maskUserForViewer } from "../privacy/mask-user-for-viewer";

describe("maskUserForViewer", () => {
  it("masks name and email and drops the photo", () => {
    const user: User = {
      id: "user-1",
      name: "Lucas Souza",
      email: "lucas@gmail.com",
      image: "https://example.com/photo.png",
      role: "admin",
      isActive: true,
      tourCompletedAt: null,
      createdAt: new Date("2026-01-01T00:00:00Z"),
    };
    expect(maskUserForViewer(user)).toEqual({ ...user, name: "Lucas S.", email: "l••••@gmail.com", image: null });
  });
});
