import type { GitHubUser } from "./types";

const GITHUB_API = "https://api.github.com";
const PER_PAGE = 100;
const MAX_PER_ENDPOINT = 50;
const MAX_TOTAL = 100;

const githubHeaders = (accessToken: string) => ({
  Authorization: `Bearer ${accessToken}`,
  Accept: "application/vnd.github+json",
  "X-GitHub-Api-Version": "2022-11-28",
  "User-Agent": "Agendly",
});

async function fetchPage(
  path: string,
  accessToken: string,
  page: number,
): Promise<GitHubUser[]> {
  const url = new URL(`${GITHUB_API}${path}`);
  url.searchParams.set("per_page", String(PER_PAGE));
  url.searchParams.set("page", String(page));

  const response = await fetch(url, { headers: githubHeaders(accessToken) });

  if (!response.ok) {
    throw new Error(`GitHub API ${response.status}: ${path}`);
  }

  const data = (await response.json()) as GitHubUser[];
  return Array.isArray(data) ? data : [];
}

async function fetchEndpointUsers(
  path: "/user/following" | "/user/followers",
  accessToken: string,
  maxItems: number,
): Promise<GitHubUser[]> {
  const users: GitHubUser[] = [];
  let page = 1;

  while (users.length < maxItems) {
    const pageUsers = await fetchPage(path, accessToken, page);
    if (pageUsers.length === 0) break;

    for (const user of pageUsers) {
      if (users.length >= maxItems) break;
      users.push(user);
    }

    if (pageUsers.length < PER_PAGE) break;
    page += 1;
  }

  return users;
}

function dedupeByLogin(users: GitHubUser[]): GitHubUser[] {
  const byLogin = new Map<string, GitHubUser>();

  for (const user of users) {
    if (!user.login) continue;
    if (!byLogin.has(user.login)) {
      byLogin.set(user.login, user);
    }
  }

  return [...byLogin.values()].slice(0, MAX_TOTAL);
}

export async function fetchGithubNetwork(
  accessToken: string,
): Promise<GitHubUser[]> {
  const [following, followers] = await Promise.all([
    fetchEndpointUsers("/user/following", accessToken, MAX_PER_ENDPOINT),
    fetchEndpointUsers("/user/followers", accessToken, MAX_PER_ENDPOINT),
  ]);

  return dedupeByLogin([...following, ...followers]);
}
