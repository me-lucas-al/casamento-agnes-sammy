import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { z } from "zod";
import { getServerEnv } from "@/shared/config/env";
import { InvalidGuestCodeError, TooManyLoginAttemptsError } from "../errors";
import { getAuthModule } from "../factory";
import { authConfig } from "./auth.config";
import { hashIpAddress, readClientIp } from "./client-ip";

const guestCodeSchema = z.object({ code: z.string().min(1).max(32) });

export const { handlers, auth, signIn, signOut } = NextAuth(() => {
  const env = getServerEnv();
  return {
    ...authConfig,
    secret: env.AUTH_SECRET,
    providers: [
      Google({ clientId: env.AUTH_GOOGLE_ID, clientSecret: env.AUTH_GOOGLE_SECRET }),
      Credentials({
        id: "guest-code",
        credentials: { code: {} },
        async authorize(credentials, request) {
          const parsed = guestCodeSchema.safeParse(credentials);
          if (!parsed.success) return null;
          const ipHash = hashIpAddress(readClientIp(request.headers), env.AUTH_SECRET);
          try {
            const guest = await getAuthModule().authenticateGuestCode({ code: parsed.data.code, ipHash });
            return { id: guest.id, guestId: guest.guestId, role: guest.role, name: guest.name };
          } catch (error) {
            if (error instanceof InvalidGuestCodeError) return null;
            if (error instanceof TooManyLoginAttemptsError) return null;
            throw error;
          }
        },
      }),
    ],
    callbacks: {
      ...authConfig.callbacks,
      async signIn({ user, account, profile }) {
        if (account?.provider !== "google") return true;
        if (profile?.email_verified === false) return false;
        const allowedUser = await getAuthModule().authorizeGoogleSignIn(user.email);
        if (!allowedUser) return false;
        user.id = allowedUser.id;
        user.role = allowedUser.role;
        return true;
      },
    },
  };
});
