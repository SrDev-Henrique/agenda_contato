export type Contact = {
  id: string;
  name: string;
  avatarUrl?: string;
  favorite: boolean;
  pinned: boolean;
  tagIds: string[];
  phone?: string;
  email?: string;
  location?: string;
  address?: string;
  birthday?: string;
  relationship?: string;
  relationshipStatus?: string;
  company?: string;
  jobTitle?: string;
  createdAt: string;
  updatedAt: string;
};
