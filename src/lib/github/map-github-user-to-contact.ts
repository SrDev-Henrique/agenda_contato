import { createId } from "@/lib/id";
import type { Contact } from "@/types/contact";

import { dummyPhoneFromLogin } from "./dummy-phone";
import { tagGithub } from "./github-tag";
import type { GitHubUser } from "./types";

function nowIso() {
  return new Date().toISOString();
}

function resolveEmail(user: GitHubUser): string {
  const trimmed = user.email?.trim();
  if (trimmed) return trimmed;
  return `${user.login}@users.noreply.github.com`;
}

function resolveName(user: GitHubUser): string {
  const trimmed = user.name?.trim();
  return trimmed || user.login;
}

export function mapGithubUserToContact(user: GitHubUser): Contact {
  const now = nowIso();

  return {
    id: createId(),
    name: resolveName(user),
    avatarUrl: user.avatar_url,
    favorite: false,
    pinned: false,
    tagIds: [tagGithub.id],
    phone: dummyPhoneFromLogin(user.login),
    email: resolveEmail(user),
    createdAt: now,
    updatedAt: now,
  };
}

export function mapGithubUsersToContacts(users: GitHubUser[]): Contact[] {
  return users.map(mapGithubUserToContact);
}
