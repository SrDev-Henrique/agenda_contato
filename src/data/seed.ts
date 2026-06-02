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
const charlieId = "contact-charlie";
const andreanneId = "contact-andreanne";

function daysFromNow(days: number, hours = 10, minutes = 0): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  date.setHours(hours, minutes, 0, 0);
  return date.toISOString();
}

function todayAt(hours: number, minutes = 0): string {
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date.toISOString();
}

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
        id: andreanneId,
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
        id: charlieId,
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
      // Hoje (5)
      {
        id: "event-today-yoga-andreanne",
        contactId: andreanneId,
        title: "Aula de yoga com Andreanne",
        startsAt: todayAt(7),
        type: "other",
        attendeeContactIds: [andreanneId],
      },
      {
        id: "event-today-sync-charlie",
        contactId: charlieId,
        title: "Sync rápido com Charlie",
        description: "15 minutos para alinhar prioridades do dia.",
        startsAt: todayAt(11),
        type: "call",
        attendeeContactIds: [charlieId],
      },
      {
        id: "event-today-lunch-bobby",
        contactId: bobbyId,
        title: "Almoço de negócios com Bobby",
        description:
          "Discutir metas do trimestre no restaurante perto do escritório.",
        startsAt: todayAt(12, 30),
        type: "meeting",
        attendeeContactIds: [bobbyId],
      },
      {
        id: "event-today-anna-dentist",
        contactId: annaId,
        title: "Consulta no dentista com a Anna",
        startsAt: todayAt(15),
        type: "other",
      },
      {
        id: "event-today-family-call",
        title: "Ligação em família",
        description: "Todo mundo na chamada — testar áudio antes.",
        startsAt: todayAt(20),
        type: "call",
        attendeeContactIds: [momId, dadId, bobbyId, annaId],
      },
      // Próximos dias (5)
      {
        id: "event-anna-coffee",
        contactId: annaId,
        title: "Café com a Anna",
        description: "Colocar o papo em dia na padaria da esquina.",
        startsAt: daysFromNow(1, 9, 30),
        type: "meeting",
      },
      {
        id: "event-budget",
        contactId: bobbyId,
        title: "Planejamento de orçamento",
        description: "Revisão trimestral com a equipe de vendas.",
        startsAt: daysFromNow(2, 15),
        type: "meeting",
      },
      {
        id: "event-andreanne-dinner",
        contactId: andreanneId,
        title: "Jantar com Andreanne",
        description: "Restaurante italiano no centro — confirmar reserva.",
        startsAt: daysFromNow(3, 20),
        type: "other",
        attendeeContactIds: [andreanneId],
      },
      {
        id: "event-baseball",
        title: "Jogo de beisebol com amigos",
        startsAt: daysFromNow(5, 16),
        type: "other",
        attendeeContactIds: [bobbyId, charlieId],
      },
      {
        id: "event-charlie-birthday",
        contactId: charlieId,
        title: "Aniversário do Charlie Kim",
        description: "Levar bolo e presente para o escritório.",
        startsAt: daysFromNow(10, 12),
        type: "birthday",
        attendeeContactIds: [charlieId, bobbyId, andreanneId],
      },
    ],
    reminders: [
      // Hoje (5)
      {
        id: "reminder-today-water-plants",
        contactId: momId,
        text: "Regar as plantas da varanda antes de sair",
        scheduledAt: todayAt(8),
        type: "reminder",
        createdAt: now,
      },
      {
        id: "reminder-today-pay-bill",
        contactId: dadId,
        text: "Pagar conta de luz vencendo hoje",
        scheduledAt: todayAt(10),
        type: "reminder",
        createdAt: now,
      },
      {
        id: "reminder-today-bobby-msg",
        contactId: bobbyId,
        text: "Mandar mensagem para Bobby confirmando o almoço",
        scheduledAt: todayAt(14),
        type: "other",
        createdAt: now,
      },
      {
        id: "reminder-today-mom-dinner-plan",
        contactId: momId,
        text: "Confirmar com a mãe o plano do jantar de domingo",
        scheduledAt: todayAt(16),
        type: "party",
        createdAt: now,
      },
      {
        id: "reminder-today-charlie-slack",
        contactId: charlieId,
        text: "Responder thread no Slack sobre o deploy",
        scheduledAt: todayAt(18, 30),
        type: "other",
        createdAt: now,
      },
      // Próximos dias (5)
      {
        id: "reminder-charlie-docs",
        contactId: charlieId,
        text: "Revisar documentação da API antes do standup",
        scheduledAt: daysFromNow(1, 8),
        type: "meeting",
        createdAt: now,
      },
      {
        id: "reminder-bobby-gift",
        contactId: bobbyId,
        text: "Ligar para Bobby Crown para combinar presente da mãe",
        scheduledAt: daysFromNow(1, 11),
        type: "call",
        createdAt: now,
      },
      {
        id: "reminder-andreanne-rsvp",
        contactId: andreanneId,
        text: "Confirmar presença no jantar de quarta-feira",
        scheduledAt: daysFromNow(2, 12),
        type: "party",
        createdAt: now,
      },
      {
        id: "reminder-mom",
        contactId: momId,
        text: "Sua mãe sente sua falta! Ligue para ela",
        scheduledAt: daysFromNow(3, 18),
        type: "birthday",
        createdAt: now,
      },
      {
        id: "reminder-dad-card",
        contactId: dadId,
        text: "Comprar cartão de aniversário para o pai",
        scheduledAt: daysFromNow(9, 10),
        type: "birthday",
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

export function createEmptyState(): AppState {
  return {
    contacts: [],
    tags: [],
    events: [],
    reminders: [],
    notes: [],
  };
}
