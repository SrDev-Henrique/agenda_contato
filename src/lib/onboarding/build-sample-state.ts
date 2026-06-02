import { createSeedState } from "@/data/seed";
import { tagGithub } from "@/lib/github/github-tag";
import type { AppState } from "@/types/app-state";
import type { Contact } from "@/types/contact";

export function buildSampleAppState(githubContacts: Contact[]): AppState {
  const base = createSeedState();

  if (githubContacts.length === 0) {
    return base;
  }

  const hasGithubTag = base.tags.some((tag) => tag.id === tagGithub.id);

  return {
    ...base,
    tags: hasGithubTag ? base.tags : [...base.tags, tagGithub],
    contacts: [...base.contacts, ...githubContacts],
  };
}
