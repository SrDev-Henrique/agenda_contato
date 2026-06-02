import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.100.106", "192.168.15.7"],
  serverExternalPackages: [
    "better-auth",
    "@better-auth/drizzle-adapter",
    "@better-auth/kysely-adapter",
    "drizzle-orm",
    "kysely",
    "pg",
  ],
};

export default nextConfig;
