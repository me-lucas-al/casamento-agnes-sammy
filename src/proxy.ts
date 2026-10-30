import { NextResponse } from "next/server";
import NextAuth from "next-auth";
import { authConfig } from "@/modules/auth/config/auth.config";
import { resolveRouteAccess } from "@/modules/auth/lib/route-access";

const { auth } = NextAuth(authConfig);

export default auth((request) => {
  const decision = resolveRouteAccess(request.nextUrl.pathname, request.auth?.user?.role);
  if (decision.type === "allow") return NextResponse.next();
  return NextResponse.redirect(new URL(decision.to, request.nextUrl));
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|brand/).*)"],
};
