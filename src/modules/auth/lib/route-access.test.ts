import { describe, expect, it } from "vitest";
import { resolveRouteAccess } from "./route-access";

const allow = { type: "allow" };
const redirect = (to: string) => ({ type: "redirect", to });

describe("resolveRouteAccess", () => {
  it.each(["/", "/entrar", "/admin/entrar", "/painelzinho"])("keeps %s public", (pathname) => {
    expect(resolveRouteAccess(pathname, undefined)).toEqual(allow);
  });

  it("sends anonymous visitors of the guest area to the code login", () => {
    expect(resolveRouteAccess("/presentes", undefined)).toEqual(redirect("/entrar"));
    expect(resolveRouteAccess("/presentes/123", undefined)).toEqual(redirect("/entrar"));
  });

  it("lets every role into the guest area", () => {
    for (const role of ["guest", "couple", "admin"] as const) {
      expect(resolveRouteAccess("/meus-presentes", role)).toEqual(allow);
    }
  });

  it("sends anonymous visitors of the panel to the admin login", () => {
    expect(resolveRouteAccess("/painel/convidados", undefined)).toEqual(redirect("/admin/entrar"));
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
