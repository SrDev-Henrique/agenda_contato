import type { AppState } from "@/types/app-state";

const now = new Date().toISOString();

const tagJob = { id: "tag-job", name: "Trabalho", slug: "trabalho" };
const tagFamily = { id: "tag-family", name: "Família", slug: "familia" };
const tagFriends = { id: "tag-friends", name: "Amigos", slug: "amigos" };
const tagDevelopers = {
  id: "tag-developers",
  name: "Desenvolvedores",
  slug: "desenvolvedores",
};
const tagDesigners = {
  id: "tag-designers",
  name: "Designers",
  slug: "designers",
};

const bobbyId = "contact-bobby";
const annaId = "contact-anna";
const dadId = "contact-dad";
const momId = "contact-mom";

export function createSeedState(): AppState {
  return {
    tags: [tagJob, tagFamily, tagFriends, tagDevelopers, tagDesigners],
    contacts: [
      {
        id: dadId,
        name: "Pai",
        favorite: true,
        pinned: true,
        tagIds: [tagFamily.id],
        phone: "+55 11 55501-0101",
        email: "pai@exemplo.com",
        createdAt: now,
        updatedAt: now,
      },
      {
        id: momId,
        name: "Mãe",
        favorite: true,
        pinned: true,
        tagIds: [tagFamily.id],
        phone: "+55 11 55501-0102",
        email: "mae@exemplo.com",
        createdAt: now,
        updatedAt: now,
      },
      {
        id: bobbyId,
        name: "Bobby Crown",
        favorite: true,
        pinned: false,
        tagIds: [tagJob.id, tagFamily.id],
        phone: "+55 11 55520-4521",
        email: "bobby.crown@exemplo.com",
        location: "São Francisco, CA, EUA",
        address: "7804 Rowe Roads",
        birthday: "1993-05-04",
        relationship: "Irmão",
        relationshipStatus: "Casado com Anna",
        company: "Google Inc",
        jobTitle: "Gerente de vendas",
        createdAt: now,
        updatedAt: now,
      },
      {
        id: annaId,
        name: "Anna",
        favorite: false,
        pinned: false,
        tagIds: [tagFamily.id],
        phone: "+55 11 55530-8890",
        email: "anna@exemplo.com",
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "contact-andreanne",
        name: "Andreanne",
        favorite: false,
        pinned: false,
        tagIds: [tagFriends.id],
        phone: "+55 11 55540-1122",
        email: "andreanne@exemplo.com",
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "contact-charlie",
        name: "Charlie Kim",
        favorite: false,
        pinned: false,
        tagIds: [tagDevelopers.id, tagJob.id],
        phone: "+55 11 55550-7788",
        email: "charlie@exemplo.com",
        company: "Acme Corp",
        jobTitle: "Engenheiro",
        createdAt: now,
        updatedAt: now,
      },
    ],
    events: [
      {
        id: "event-bobby-birthday",
        contactId: bobbyId,
        title: "Festa de aniversário do Bobby Crown",
        description: "Celebrar com família e amigos",
        startsAt: new Date(
          new Date().getFullYear(),
          2,
          14,
          18,
          0,
        ).toISOString(),
        type: "party",
        attendeeContactIds: [annaId, momId, dadId],
      },
      {
        id: "event-budget",
        contactId: bobbyId,
        title: "Planejamento de orçamento",
        description: "Revisão trimestral com a equipe de vendas.",
        startsAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        type: "meeting",
      },
      {
        id: "event-baseball",
        title: "Jogo de beisebol com amigos",
        startsAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        type: "other",
        attendeeContactIds: [bobbyId, "contact-charlie"],
      },
    ],
    reminders: [
      {
        id: "reminder-bobby-gift",
        contactId: bobbyId,
        text: "Ligar para Bobby Crown para combinar presente da mãe",
        scheduledAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        createdAt: now,
      },
      {
        id: "reminder-mom",
        contactId: momId,
        text: "Sua mãe sente sua falta! Ligue para ela",
        scheduledAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: now,
      },
    ],
    notes: [
      {
        id: "note-bobby-gifts",
        contactId: bobbyId,
        title: "Ideias de presente",
        content:
          "Ideias de presente para a mãe dele — livro, voucher de spa ou uma foto emoldurada.",
        createdAt: now,
        updatedAt: now,
      },
    ],
  };
}
