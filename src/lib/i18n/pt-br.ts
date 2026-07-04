import type { EventType } from "@/types/event";

/**
 * Textos exibidos na interface — sempre pt-BR.
 * Importe daqui ao criar componentes; não hardcode strings em inglês na UI.
 */
export const ui = {
  appName: "Agendly",
  appDescription: "Agenda de contatos",

  // Autenticação
  signUpTitle: "Conecte sua conta",
  signUpDescription:
    "Para acessar sua agenda de contatos, eventos e lembretes, entre com sua conta do GitHub.",
  connectGithub: "Continuar com GitHub",
  signUpError: "Não foi possível conectar com o GitHub. Tente novamente.",
  supabaseDatabasePaused: "Banco de dado supabase atualmente pausado",
  signOut: "Sair",
  deleteAccount: "Excluir conta",
  deleteAccountTitle: "Excluir conta?",
  deleteAccountDescription:
    "Esta ação é irreversível. Sua conta será removida e você precisará conectar o GitHub novamente para recomeçar o onboarding.",
  deleteAccountConfirm: "Excluir permanentemente",
  deleteAccountError:
    "Não foi possível excluir a conta. Saia, entre novamente e tente outra vez.",

  // Onboarding
  onboardingTitle: "Como deseja começar?",
  onboardingDescription:
    "Sua agenda está vazia. Escolha como deseja popular seus contatos, eventos e lembretes.",
  onboardingImportContacts: "Importar contatos da sua lista",
  onboardingUseSampleData: "Usar dados de exemplo",
  onboardingComingSoon: "Em breve",
  onboardingImportUnsupported:
    "Seu navegador não suporta a seleção de contatos. Use o Chrome no Android ou escolha dados de exemplo.",
  onboardingImportError:
    "Não foi possível abrir a lista de contatos. Tente novamente.",
  onboardingLoadingDummy:
    "Carregando dados de exemplo e contatos do GitHub...",
  onboardingLoadingImport: "Importando seus contatos...",

  // Notificações
  notificationsTitle: "Notificações",
  notificationsOpen: "Abrir notificações",
  notificationsMarkAllRead: "Marcar todas como lidas",
  notificationsEmptyToday: "Nada agendado para hoje.",
  notificationsReminder: "Lembrete",

  // Navegação / sidebar
  navAllPeople: "Contatos",
  navFavorites: "Favoritos",
  navEvents: "Eventos",
  navTags: "Tags",
  navAllTags: "Todas as tags",
  deleteTag: "Excluir tag",
  navUntagged: "Sem tag",
  breadcrumbNav: "Navegação",
  more: "Mais",
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
  noLocation: "Sem localização",
  noAddress: "Sem endereço",
  noBirthday: "Sem aniversário",
  noRelationship: "Sem parentesco",
  noCompany: "Sem empresa",
  noJobTitle: "Sem cargo",
  clickToEdit: "Clique para editar",
  saveChanges: "Salvar",

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
  eventDescriptionPlaceholder: "Detalhes do evento (opcional)",
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
  activityCall: "Ligar",
  activityCongratulate: "Parabenizar",
  activityMeetingWith: "Reunião com",
  activityBirthdayOf: "Aniversário de",
  activityParty: "Festa",
  activityFullDay: "Dia inteiro",
  addReminderShort: "Lembrete",
  addEventShort: "Evento",
  options: "Opções",
  editEvent: "Editar evento",
  editEventDescription:
    "Altere o título, o tipo, os participantes, o contato e a data do evento.",
  editReminder: "Editar lembrete",
  eventType: "Tipo de evento",
  deleteEventTitle: "Excluir evento",
  deleteEventDescription:
    "Esta ação não pode ser desfeita. O evento será removido da timeline.",
  deleteReminderTitle: "Excluir lembrete",
  deleteReminderDescription:
    "Esta ação não pode ser desfeita. O lembrete será removido permanentemente.",
  deleteNoteTitle: "Excluir nota",
  deleteNoteDescription:
    "Esta ação não pode ser desfeita. A nota será removida permanentemente.",

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
