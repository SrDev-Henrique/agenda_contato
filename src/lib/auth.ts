import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { db } from "@/db";
import * as schema from "@/db/schema";

const githubClientId = process.env.GITHUB_CLIENT_ID;
const githubClientSecret = process.env.GITHUB_CLIENT_SECRET;
const isProduction = process.env.NODE_ENV === "production";

const trustedOriginsFromEnv =
  process.env.BETTER_AUTH_TRUSTED_ORIGINS?.split(",")
    .map((origin) => origin.trim())
    .filter(Boolean) ?? [];

const trustedOrigins = [
  ...trustedOriginsFromEnv,
  ...(process.env.BETTER_AUTH_URL ? [process.env.BETTER_AUTH_URL] : []),
  "https://agenda-contato-blond.vercel.app",
  "https://*.vercel.app",
];

if (!githubClientId || !githubClientSecret) {
  console.warn(
    "GITHUB_CLIENT_ID ou GITHUB_CLIENT_SECRET não definidos — OAuth GitHub indisponível.",
  );
}

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,
  trustedOrigins,
  advanced: {
    useSecureCookies: isProduction,
  },
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  socialProviders: {
    ...(githubClientId && githubClientSecret
      ? {
          github: {
            clientId: githubClientId,
            clientSecret: githubClientSecret,
            // read:user — following/followers; user:email — e-mail público no perfil
            scope: ["read:user", "user:email"],
          },
        }
      : {}),
  },
  account: {
    encryptOAuthTokens: true,
  },
  user: {
    deleteUser: {
      enabled: true,
    },
  },
  plugins: [nextCookies()],
});

export type Session = typeof auth.$Infer.Session;
