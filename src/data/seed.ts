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

function hoursFromNow(hours: number): string {
  return new Date(Date.now() + hours * 60 * 60 * 1000).toISOString();
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
        startsAt: daysFromNow(2, 15),
        type: "meeting",
      },
      {
        id: "event-baseball",
        title: "Jogo de beisebol com amigos",
        startsAt: daysFromNow(5, 16),
        type: "other",
        attendeeContactIds: [bobbyId, charlieId],
      },
      {
        id: "event-charlie-call",
        contactId: charlieId,
        title: "Call de revisão do sprint",
        description: "Alinhar entregas da sprint e bloqueios da API.",
        startsAt: hoursFromNow(4),
        type: "call",
        attendeeContactIds: [charlieId, bobbyId],
      },
      {
        id: "event-anna-coffee",
        contactId: annaId,
        title: "Café com a Anna",
        description: "Colocar o papo em dia na padaria da esquina.",
        startsAt: daysFromNow(1, 9, 30),
        type: "meeting",
      },
      {
        id: "event-mom-video",
        contactId: momId,
        title: "Videochamada com a mãe",
        startsAt: todayAt(19),
        type: "call",
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
        id: "event-charlie-birthday",
        contactId: charlieId,
        title: "Aniversário do Charlie Kim",
        description: "Levar bolo e presente para o escritório.",
        startsAt: daysFromNow(10, 12),
        type: "birthday",
        attendeeContactIds: [charlieId, bobbyId, andreanneId],
      },
      {
        id: "event-dad-checkup",
        contactId: dadId,
        title: "Consulta médica do pai",
        description: "Acompanhar no hospital — levar exames anteriores.",
        startsAt: daysFromNow(7, 8),
        type: "reminder",
      },
      {
        id: "event-team-standup",
        contactId: charlieId,
        title: "Daily standup da equipe",
        startsAt: daysFromNow(1, 9),
        type: "meeting",
        attendeeContactIds: [charlieId, bobbyId],
      },
      {
        id: "event-pai-birthday",
        contactId: dadId,
        title: "Aniversário do pai",
        startsAt: daysFromNow(12, 19),
        type: "birthday",
        attendeeContactIds: [dadId, momId, bobbyId, annaId],
      },
      {
        id: "event-design-review",
        contactId: andreanneId,
        title: "Revisão de layout do app",
        description: "Apresentar protótipos da tela de eventos.",
        startsAt: daysFromNow(4, 14),
        type: "meeting",
        attendeeContactIds: [andreanneId, charlieId],
      },
      {
        id: "event-weekend-churrasco",
        title: "Churrasco de domingo em família",
        description: "Levar salada e sobremesa.",
        startsAt: daysFromNow(6, 12),
        type: "party",
        attendeeContactIds: [momId, dadId, bobbyId, annaId, andreanneId],
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
        id: "event-today-sync-charlie",
        contactId: charlieId,
        title: "Sync rápido com Charlie",
        description: "15 minutos para alinhar prioridades do dia.",
        startsAt: todayAt(11),
        type: "call",
        attendeeContactIds: [charlieId],
      },
      {
        id: "event-today-yoga-andreanne",
        contactId: andreanneId,
        title: "Aula de yoga com Andreanne",
        startsAt: todayAt(7),
        type: "other",
        attendeeContactIds: [andreanneId],
      },
      {
        id: "event-today-pharmacy-dad",
        contactId: dadId,
        title: "Buscar remédios na farmácia para o pai",
        startsAt: todayAt(17, 30),
        type: "reminder",
      },
      {
        id: "event-today-family-call",
        title: "Ligação em família",
        description: "Todo mundo na chamada — testar áudio antes.",
        startsAt: todayAt(20),
        type: "call",
        attendeeContactIds: [momId, dadId, bobbyId, annaId],
      },
      {
        id: "event-today-anna-dentist",
        contactId: annaId,
        title: "Consulta no dentista com a Anna",
        startsAt: todayAt(15),
        type: "other",
      },
      {
        id: "event-presentation-demo",
        contactId: charlieId,
        title: "Demo do produto para stakeholders",
        description: "Apresentar roadmap e métricas de adoção.",
        startsAt: daysFromNow(8, 10),
        type: "meeting",
        attendeeContactIds: [charlieId, bobbyId],
      },
      {
        id: "event-workshop-design",
        contactId: andreanneId,
        title: "Workshop de UX com Andreanne",
        startsAt: daysFromNow(9, 14),
        type: "meeting",
        attendeeContactIds: [andreanneId, charlieId],
      },
      {
        id: "event-anna-baby-shower",
        contactId: annaId,
        title: "Chá de bebê da Anna",
        description: "Levar presente e confirmar horário de chegada.",
        startsAt: daysFromNow(11, 16),
        type: "party",
        attendeeContactIds: [annaId, momId, andreanneId],
      },
      {
        id: "event-charlie-1on1",
        contactId: charlieId,
        title: "1:1 de carreira com Charlie",
        startsAt: daysFromNow(3, 11),
        type: "meeting",
        attendeeContactIds: [charlieId],
      },
    ],
    reminders: [
      {
        id: "reminder-bobby-gift",
        contactId: bobbyId,
        text: "Ligar para Bobby Crown para combinar presente da mãe",
        scheduledAt: daysFromNow(1, 11),
        createdAt: now,
      },
      {
        id: "reminder-mom",
        contactId: momId,
        text: "Sua mãe sente sua falta! Ligue para ela",
        scheduledAt: daysFromNow(3, 18),
        createdAt: now,
      },
      {
        id: "reminder-charlie-pr",
        contactId: charlieId,
        text: "Enviar feedback do PR antes da call de revisão",
        scheduledAt: hoursFromNow(2),
        createdAt: now,
      },
      {
        id: "reminder-dad-card",
        contactId: dadId,
        text: "Comprar cartão de aniversário para o pai",
        scheduledAt: daysFromNow(9, 10),
        createdAt: now,
      },
      {
        id: "reminder-andreanne-rsvp",
        contactId: andreanneId,
        text: "Confirmar presença no jantar de quarta-feira",
        scheduledAt: daysFromNow(2, 12),
        createdAt: now,
      },
      {
        id: "reminder-anna-gift-list",
        contactId: annaId,
        text: "Perguntar à Anna sobre a lista de presentes do chá de bebê",
        scheduledAt: daysFromNow(4, 9),
        createdAt: now,
      },
      {
        id: "reminder-bobby-budget-followup",
        contactId: bobbyId,
        text: "Enviar resumo da reunião de orçamento para a equipe",
        scheduledAt: daysFromNow(2, 17),
        createdAt: now,
      },
      {
        id: "reminder-charlie-docs",
        contactId: charlieId,
        text: "Revisar documentação da API antes do standup",
        scheduledAt: daysFromNow(1, 8),
        createdAt: now,
      },
      {
        id: "reminder-dad-ride",
        contactId: dadId,
        text: "Combinar carona para a consulta médica na próxima semana",
        scheduledAt: daysFromNow(5, 19),
        createdAt: now,
      },
      {
        id: "reminder-andreanne-photos",
        contactId: andreanneId,
        text: "Enviar fotos do último encontro para Andreanne",
        scheduledAt: todayAt(21),
        createdAt: now,
      },
      {
        id: "reminder-mom-recipe",
        contactId: momId,
        text: "Pedir receita da torta que ela fez no último almoço",
        scheduledAt: daysFromNow(6, 11),
        createdAt: now,
      },
      {
        id: "reminder-today-water-plants",
        contactId: momId,
        text: "Regar as plantas da varanda antes de sair",
        scheduledAt: todayAt(8),
        createdAt: now,
      },
      {
        id: "reminder-today-pay-bill",
        contactId: dadId,
        text: "Pagar conta de luz vencendo hoje",
        scheduledAt: todayAt(10),
        createdAt: now,
      },
      {
        id: "reminder-today-bobby-msg",
        contactId: bobbyId,
        text: "Mandar mensagem para Bobby confirmando o almoço",
        scheduledAt: todayAt(14),
        createdAt: now,
      },
      {
        id: "reminder-today-mom-dinner-plan",
        contactId: momId,
        text: "Confirmar com a mãe o plano do jantar de domingo",
        scheduledAt: todayAt(16),
        createdAt: now,
      },
      {
        id: "reminder-today-charlie-slack",
        contactId: charlieId,
        text: "Responder thread no Slack sobre o deploy",
        scheduledAt: todayAt(18, 30),
        createdAt: now,
      },
      {
        id: "reminder-today-dad-pills",
        contactId: dadId,
        text: "Lembrar o pai de tomar os remédios da noite",
        scheduledAt: todayAt(21, 30),
        createdAt: now,
      },
      {
        id: "reminder-andreanne-book",
        contactId: andreanneId,
        text: "Devolver livro emprestado para Andreanne",
        scheduledAt: daysFromNow(7, 19),
        createdAt: now,
      },
      {
        id: "reminder-anna-thankyou",
        contactId: annaId,
        text: "Agradecer a Anna pelo presente do chá de bebê",
        scheduledAt: daysFromNow(2, 20),
        createdAt: now,
      },
      {
        id: "reminder-charlie-deploy",
        contactId: charlieId,
        text: "Acompanhar deploy em produção e validar logs",
        scheduledAt: daysFromNow(1, 16),
        createdAt: now,
      },
      {
        id: "reminder-bobby-contract",
        contactId: bobbyId,
        text: "Revisar minuta do contrato com Bobby antes de assinar",
        scheduledAt: daysFromNow(14, 9),
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
