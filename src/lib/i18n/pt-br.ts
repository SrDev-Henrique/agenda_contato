import type { EventType } from "@/types/event";

/**
 * Textos exibidos na interface — sempre pt-BR.
 * Importe daqui ao criar componentes; não hardcode strings em inglês na UI.
 */
export const ui = {
  appName: "Agendly",
  appDescription: "Agenda de contatos",

  // Navegação / sidebar
  navAllPeople: "Todas as pessoas",
  navAllBusinesses: "Todos os negócios",
  navFavorites: "Favoritos",
  navEvents: "Eventos",
  navTags: "Tags",
  navSmartTags: "Tags inteligentes",
  navUntagged: "Sem tag",
  searchPlaceholder: "Buscar",
  addContact: "Adicionar contato",
  addContactShort: "Add Contato +",

  // Lista de contatos
  totalContacts: (n: number) => `${n} contatos no total`,
  filterBy: "Filtrar por",
  sortAz: "A–Z",
  sortZa: "Z–A",
  pinned: "Fixados",
  contacts: "Contatos",
  allContacts: "Todos",
  gridView: "Visualização em grade",
  listView: "Visualização em lista",
  selectContact: "Selecione um contato",
  noContacts: "Nenhum contato encontrado",
  noContactsHint: "Adicione um contato ou ajuste os filtros.",
  noPhone: "Sem telefone",
  noEmail: "Sem e-mail",

  // Ações
  favorite: "Favoritar",
  unfavorite: "Remover dos favoritos",
  pin: "Fixar",
  unpin: "Desafixar",
  edit: "Editar",
  delete: "Excluir",
  save: "Salvar",
  cancel: "Cancelar",
  close: "Fechar",
  confirm: "Confirmar",
  loading: "Carregando",
  callContact: "Ligar",
  videoCallContact: "Chamada de vídeo",
  emailContact: "Enviar e-mail",

  // Criar / excluir contato
  newContact: "Novo contato",
  newContactDescription:
    "Preencha os dados básicos. Você pode editar o restante no perfil depois.",
  contactName: "Nome",
  contactNameRequired: "Informe o nome do contato",
  invalidEmail: "Informe um e-mail válido",
  phoneRequired: "Informe o telefone",
  phoneInvalid: "Informe um telefone válido com DDD",
  contactTag: "Tag",
  contactTagNone: "Sem tag",
  favoriteStatus: "Favorito",
  favoriteYes: "Sim, marcar como favorito",
  favorites: "Adicionar aos favoritos?",
  createContact: "Criar contato",
  deleteContactTitle: "Excluir contato",
  deleteContactDescription:
    "Esta ação não pode ser desfeita. O contato e os dados vinculados serão removidos.",

  // Detalhe do contato
  addTag: "Adicionar tag",
  newTag: "Nova tag",
  tagNamePlaceholder: "Nome da tag",
  removeTag: "Remover tag",
  addReminder: "Adicionar lembrete",
  reminderPlaceholder: "Escreva um lembrete e use @ para marcar um contato",
  mentionContact: "Marcar contato",
  reminderDate: "Dia",
  reminderTime: "Horário",
  createReminder: "Criar lembrete",
  noMentionResults: "Nenhum contato encontrado",
  addEvent: "Adicionar evento",
  eventTitlePlaceholder: "Título do evento, use @ para mencionar um contato",
  eventParticipants: "Participantes",
  eventParticipantsPlaceholder: "Adicionar participantes",
  eventDate: "Dia do evento",
  eventTime: "Horário do evento",
  createEvent: "Criar evento",
  removeParticipant: "Remover participante",
  addNote: "Adicionar nota",
  noteTitlePlaceholder: "Título da anotação",
  noteContentPlaceholder: "Texto da anotação",
  createNote: "Criar nota",
  reminders: "Lembretes",
  upcomingEvents: "Próximos eventos",
  notes: "Notas",
  backToContacts: "Voltar para contatos",
  contactNotFound: "Contato não encontrado",
  contactNotFoundHint: "Este contato não existe ou foi removido.",

  // Eventos (página timeline)
  upcomingActivity: "Próximas atividades",
  thisWeek: "Esta semana",
  allWeeks: "Todas as semanas",
  allActivities: "Todas",
  showMoreEvents: (n: number) => `Mostrar mais ${n} eventos desta semana`,
  noEvents: "Nenhum evento agendado",
  noEventsHint: "Adicione um evento para vê-lo na timeline.",
  reminder: "Lembrete",

  // Formulários genéricos
  title: "Título",
  description: "Descrição",
  date: "Data",
  time: "Hora",
  phone: "Telefone",
  email: "E-mail",
  location: "Localização",
  address: "Endereço",
  birthday: "Aniversário",
  relationship: "Parentesco",
  company: "Empresa",
  jobTitle: "Cargo",
} as const;

export const eventTypeLabels: Record<EventType, string> = {
  meeting: "Reunião",
  call: "Ligação",
  birthday: "Aniversário",
  party: "Festa",
  reminder: "Lembrete",
  other: "Outro",
};
