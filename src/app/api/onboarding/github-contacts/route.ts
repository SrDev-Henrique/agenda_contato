import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { fetchGithubNetwork } from "@/lib/github/fetch-github-network";
import { mapGithubUsersToContacts } from "@/lib/github/map-github-user-to-contact";

export const runtime = "nodejs";

export async function GET() {
  const requestHeaders = await headers();

  const session = await auth.api.getSession({ headers: requestHeaders });
  if (!session) {
    return NextResponse.json({ contacts: [] });
  }

  let accessToken: string | undefined;

  try {
    const tokenResult = await auth.api.getAccessToken({
      body: { providerId: "github" },
      headers: requestHeaders,
    });
    accessToken = tokenResult?.accessToken;
  } catch (error) {
    console.error("[github-contacts] getAccessToken failed:", error);
    return NextResponse.json({ contacts: [] });
  }

  if (!accessToken) {
    return NextResponse.json({ contacts: [] });
  }

  try {
    const users = await fetchGithubNetwork(accessToken);
    const contacts = mapGithubUsersToContacts(users);
    return NextResponse.json({ contacts });
  } catch (error) {
    console.error("[github-contacts] GitHub API failed:", error);
    return NextResponse.json({ contacts: [] });
  }
}
