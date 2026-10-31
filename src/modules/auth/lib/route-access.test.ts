import { describe, expect, it } from "vitest";
import { resolveHomeRoute, resolveRedirectDestination, resolveRouteAccess } from "./route-access";

const allow = { type: "allow" };
const redirect = (to: string) => ({ type: "redirect", to });

describe("resolveRouteAccess", () => {
  it.each(["/", "/entrar", "/admin/entrar", "/painelzinho"])("keeps %s public", (pathname) => {
    expect(resolveRouteAccess(pathname, undefined)).toEqual(allow);
  });

  it("sends anonymous visitors of the guest area to the code login", () => {
    expect(resolveRouteAccess("/presentes", undefined)).toEqual(redirect("/"));
    expect(resolveRouteAccess("/presentes/123", undefined)).toEqual(redirect("/"));
  });

  it("lets every role into the guest area", () => {
    for (const role of ["guest", "couple", "admin"] as const) {
      expect(resolveRouteAccess("/meus-presentes", role)).toEqual(allow);
    }
  });

  it("sends anonymous visitors of the panel to the admin login", () => {
    expect(resolveRouteAccess("/painel/convidados", undefined)).toEqual(redirect("/?aba=noivos"));
  });

  it("keeps guests out of the panel", () => {
    expect(resolveRouteAccess("/painel", "guest")).toEqual(redirect("/inicio"));
  });

  it("lets couple into the panel except users", () => {
    expect(resolveRouteAccess("/painel/presentes", "couple")).toEqual(allow);
    expect(resolveRouteAccess("/painel/usuarios", "couple")).toEqual(redirect("/painel"));
  });

  it("lets admin into everything", () => {
    expect(resolveRouteAccess("/painel/usuarios", "admin")).toEqual(allow);
  });
});

describe("resolveHomeRoute", () => {
  it("sends each role to its own area", () => {
    expect(resolveHomeRoute("guest")).toBe("/inicio");
    expect(resolveHomeRoute("couple")).toBe("/painel");
    expect(resolveHomeRoute("admin")).toBe("/painel");
  });
});

describe("resolveRedirectDestination", () => {
  it("sends a guest leaving the panel to the same place as the home route", () => {
    expect(resolveRedirectDestination("/painel", "guest")).toBe(resolveHomeRoute("guest"));
    expect(resolveRedirectDestination("/painel", "guest")).toBe("/inicio");
  });

  it("sends anonymous visitors to the matching login", () => {
    expect(resolveRedirectDestination("/painel", undefined)).toBe("/?aba=noivos");
    expect(resolveRedirectDestination("/inicio", undefined)).toBe("/");
  });

  it("does not redirect allowed roles", () => {
    expect(resolveRedirectDestination("/painel", "couple")).toBeNull();
    expect(resolveRedirectDestination("/inicio", "admin")).toBeNull();
    expect(resolveRedirectDestination("/inicio", "guest")).toBeNull();
  });
});
