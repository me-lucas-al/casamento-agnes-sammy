import type { NextAuthConfig } from "next-auth";
import { isRole } from "../types";

const SESSION_MAX_AGE_SECONDS = 7 * 24 * 60 * 60;

export const authConfig = {
  providers: [],
  session: { strategy: "jwt", maxAge: SESSION_MAX_AGE_SECONDS },
  pages: { signIn: "/entrar" },
  callbacks: {
    jwt({ token, user }) {
      if (!user) return token;
      token.id = user.id;
      token.role = user.role;
      token.guestId = user.guestId;
      return token;
    },
    session({ session, token }) {
      const { id, role, guestId } = token;
      if (typeof id !== "string" || !isRole(role)) return session;
      session.user.id = id;
      session.user.role = role;
      session.user.guestId = typeof guestId === "string" ? guestId : undefined;
      return session;
    },
  },
} satisfies NextAuthConfig;
