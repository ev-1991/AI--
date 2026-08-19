const STORAGE_KEY = "kazniior_ai_agent_state_v3";
const OLD_KEYS = ["kazniior_ai_agent_state_v1", "kazniior_ai_agent_state_v2"];
const LOGO_PATH = "assets/logo.png";
const languages = ["ru", "kz", "en"];
const AUTO_LOGOUT_MS = 15 * 60 * 1000;
let autoLogoutTimer = null;

const demoUsers = {
  doctor: { login: "doctor", password: "doctor123", role: "doctor" },
  admin: { login: "admin", password: "admin123", role: "admin", twoFactor: "000000" },
  director: { login: "director", password: "director123", role: "director", twoFactor: "000000" },
  superadmin: { login: "superadmin", password: "super123", role: "superadmin", twoFactor: "000000" }
};

const tr = {
  ru: {
    appEyebrow: "AI-агент КазНИИОиР",
    patientLoginTitle: "Вход пациента",
    patientLoginLead: "Простой вход без сложной регистрации. После входа система создаст или найдет карточку пациента.",
    fullNameLabel: "ФИО *",
    fullNamePlaceholder: "Введите ваше ФИО",
    iinLabel: "ИИН",
    //iinPlaceholder: "Введите ваш ИИН (необязательно)",
    enter: "Войти",
    enterPatientCabinet: "Войти",
    adminPanelLogin: "Админ-панель",
    loginSafetyNote: "AI отвечает только на основании утвержденной базы знаний КазНИИОиР и не заменяет врача.",
    brandSubtitle: "помощь пациентам",
    navChat: "Чат",
    navPatient: "Пациент",
    navDoctor: "Кабинет врача",
    navAdmin: "Админ-панель",
    navAnalytics: "Отчеты",
    navSafety: "Безопасность",
    routeTitle: "Маршрут",
    routeText: "Пациент → Чат → AI-агент → База знаний КазНИИОиР → Ответ пациенту / Передача врачу → Аналитика.",
    routeMobileHint: "Путь пациента",
    logoutMobileHint: "Завершить сеанс",
    logout: "Выйти",
    knowledgeOnly: "Только база знаний",
    mainRuleTitle: "Главное правило:",
    mainRuleText: "AI отвечает не из головы, а только из опубликованных и проверенных материалов базы знаний КазНИИОиР.",
    newChat: "+ Новый чат",
    searchChats: "Поиск обращений",
    welcomeTitle: "Добро пожаловать в KazONCO AI",
    welcomeText: "Спросите о подготовке к обследованию, маршруте пациента, документах, контактах, памятках или опасных симптомах.",
    safetyDisclaimer: "Я не заменяю врача и не ставлю диагноз. При ухудшении состояния обратитесь к врачу или вызовите скорую помощь.",
    attachDocument: "Загрузить документ",
    messagePlaceholder: "Введите сообщение...",
    patientCard: "Карточка пациента",
    myDoctor: "Мой врач",
    observation: "Наблюдение",
    myDocuments: "Мои документы",
    memos: "Памятки и рекомендации",
    fromKnowledge: "из базы знаний",
    doctorCabinet: "Кабинет врача",
    patientsAndRequests: "Пациенты и обращения",
    doctorSearch: "Поиск по ФИО или ИИН",
    selectedPatientHistory: "История выбранного пациента",
    adminPanel: "Административная панель",
    knowledgeManagement: "Управление базой знаний",
    kbSearch: "Поиск по базе знаний",
    addMaterial: "Добавить материал",
    editMaterial: "Редактировать материал",
    moderation: "модерация",
    materialTitle: "Название",
    materialTitlePlaceholder: "Например: Подготовка к КТ",
    category: "Категория",
    materialStatus: "Статус материала",
    source: "Источник",
    sourcePlaceholder: "onco.kz, kaznior.kz или внутренний документ",
    link: "Ссылка",
    linkPlaceholder: "https://kaznior.kz или страница onco.kz",
    file: "Файл",
    content: "Содержание",
    contentPlaceholder: "Введите утвержденный текст памятки или инструкции",
    saveMaterial: "Сохранить материал",
    updateMaterial: "Сохранить изменения",
    cancelEdit: "Отмена",
    metricPatients: "пациентов",
    metricRequests: "обращений",
    metricAiAnswers: "ответов AI",
    metricRedFlags: "опасных симптомов",
    metricEscalations: "передач врачу",
    metricKnowledge: "материалов базы",
    requestTopics: "Темы обращений",
    exportExcel: "Экспорт Excel",
    managerReport: "Отчет руководителю",
    reportTitle: "AI-агент КазНИИОиР",
    exportPdf: "Экспорт PDF / печать",
    safetyMainRule: "Основное правило безопасности",
    safetyRuleText: "AI-агент отвечает пациенту только на основании утвержденной базы знаний КазНИИОиР.",
    noInfoRuleText: "Если информации нет в базе знаний, AI передает обращение специалисту.",
    accessRoles: "Роли доступа",
    patientNotSelected: "Пациент не выбран",
  adminMode: "Администратор базы знаний",
  adminLoginTitle: "Админ-панель КазНИИОиР",
    iinNotProvided: "не указан",
    firstVisit: "Первое обращение",
    lastVisit: "Последнее обращение",
    status: "Статус",
    redFlags: "Опасные симптомы",
    chatHistory: "История чатов",
    doctor: "Врач",
    requestStatus: "Статус обращения",
    noDocuments: "Документы пока не загружены.",
    noPatients: "Пока нет пациентов.",
    patientsNotFound: "Пациенты не найдены.",
    documents: "Документы",
    complaints: "Жалобы и симптомы",
    doctorComment: "Комментарий врача",
    no: "нет",
    answerPatient: "Ответить пациенту",
    transferSpecialist: "Передать врачу/специалисту",
    addDoctorNote: "Добавьте заметку по обращению",
    saveComment: "Сохранить комментарий",
    emptyHistory: "История обращений пока пустая.",
    sourceLabel: "Источник",
    edit: "Редактировать",
    delete: "Удалить",
    noStats: "Статистика появится после первых обращений.",
    noApprovedInfo: "По вашему вопросу нет утверждённой информации в базе знаний КазНИИОиР. Ваше обращение будет передано специалисту.",
    urgentAnswer: "В вашем сообщении есть признаки опасного состояния. Я не буду давать обычную консультацию. Срочно свяжитесь с лечащим врачом, обратитесь в приемный покой КазНИИОиР: 8 (727) 292-90-63 или вызовите скорую помощь. При кровотечении, одышке, потере сознания, высокой температуре, сильной боли или резком ухудшении не ждите ответа в чате.",
    importantPrefix: "Важно",
    usual: "Обычное",
    urgent: "Экстренно",
    escalated: "Передано специалисту",
    open: "Открыт",
    activeRequest: "Активное обращение",
    doctorNotAssigned: "Не назначен",
    doctorPreparing: "Ответ врача готовится",
    transferredToSpecialist: "Передано профильному специалисту",
    kazDoctor: "Врач КазНИИОиР",
    useful: "Полезно",
    needDoctor: "Нужен врач",
    uploadedInternalDoc: "Загруженный внутренний документ",
    nonTextFileNote: "Документ загружен. Вставьте утвержденный текст памятки или инструкции перед публикацией, чтобы AI мог использовать материал безопасно.",
    reportUsesOnly: "AI использует только материалы со статусом «Опубликовано» и «Проверено врачом».",
    roles: [
      "Пациент: чат, история, документы, памятки, статус обращения.",
      "Врач: пациенты, история обращений, документы, комментарии, передача специалисту.",
      "Администратор базы знаний: статьи, файлы, ссылки, источники, редактирование и удаление материалов.",
      "Модератор: проверка и публикация материалов.",
      "Руководитель: аналитика, отчеты, качество ответов.",
      "IT-администратор: доступ, аудит, хранение и защита данных."
    ],
    quickPrompts: [
      "Как записаться на прием к врачу?",
      "Какие документы взять на первичный прием?",
      "Контакты отделения диагностики КТ, МРТ, УЗИ",
      "У меня высокая температура после лечения"
    ]
  },
  kz: {
    appEyebrow: "ҚазҰОжРИ AI-агенті",
    patientLoginTitle: "Пациенттің кіруі",
    patientLoginLead: "Күрделі тіркеусіз қарапайым кіру. Кіргеннен кейін жүйе пациент картасын жасайды немесе табады.",
    fullNameLabel: "Аты-жөні *",
    fullNamePlaceholder: "Аты-жөніңізді енгізіңіз",
    iinLabel: "ЖСН",
    iinPlaceholder: "ЖСН енгізіңіз (міндетті емес)",
    enter: "Кіру",
    enterPatientCabinet: "Кіру",
    adminPanelLogin: "Әкімші панелі",
    loginSafetyNote: "AI тек ҚазҰОжРИ бекітілген білім базасына сүйеніп жауап береді және дәрігерді алмастырмайды.",
    brandSubtitle: "пациенттерге көмек",
    navChat: "Чат",
    navPatient: "Пациент",
    navDoctor: "Дәрігер кабинеті",
    navAdmin: "Әкімші панелі",
    navAnalytics: "Есептер",
    navSafety: "Қауіпсіздік",
    routeTitle: "Маршрут",
    routeText: "Пациент → Чат → AI-агент → ҚазҰОжРИ білім базасы → Пациентке жауап / Дәрігерге беру → Аналитика.",
    routeMobileHint: "Пациент жолы",
    logoutMobileHint: "Сеансты аяқтау",
    logout: "Шығу",
    knowledgeOnly: "Тек білім базасы",
    mainRuleTitle: "Негізгі ереже:",
    mainRuleText: "AI өз бетінше емес, тек жарияланған және тексерілген ҚазҰОжРИ білім базасы материалдары бойынша жауап береді.",
    newChat: "+ Жаңа чат",
    searchChats: "Өтініштерді іздеу",
    welcomeTitle: "KazONCO AI жүйесіне қош келдіңіз",
    welcomeText: "Тексеруге дайындық, пациент маршруты, құжаттар, байланыстар, жадынамалар немесе қауіпті симптомдар туралы сұраңыз.",
    safetyDisclaimer: "Мен дәрігерді алмастырмаймын және диагноз қоймаймын. Жағдайыңыз нашарласа, дәрігерге жүгініңіз немесе жедел жәрдем шақырыңыз.",
    attachDocument: "Құжат жүктеу",
    messagePlaceholder: "Хабарлама енгізіңіз...",
    patientCard: "Пациент картасы",
    myDoctor: "Менің дәрігерім",
    observation: "Бақылау",
    myDocuments: "Менің құжаттарым",
    memos: "Жадынамалар мен ұсынымдар",
    fromKnowledge: "білім базасынан",
    doctorCabinet: "Дәрігер кабинеті",
    patientsAndRequests: "Пациенттер мен өтініштер",
    doctorSearch: "Аты-жөні немесе ЖСН бойынша іздеу",
    selectedPatientHistory: "Таңдалған пациент тарихы",
    adminPanel: "Әкімшілік панель",
    knowledgeManagement: "Білім базасын басқару",
    kbSearch: "Білім базасынан іздеу",
    addMaterial: "Материал қосу",
    editMaterial: "Материалды өңдеу",
    moderation: "модерация",
    materialTitle: "Атауы",
    materialTitlePlaceholder: "Мысалы: КТ-ға дайындық",
    category: "Санат",
    materialStatus: "Материал мәртебесі",
    source: "Дереккөз",
    sourcePlaceholder: "onco.kz, kaznior.kz немесе ішкі құжат",
    link: "Сілтеме",
    linkPlaceholder: "https://kaznior.kz немесе onco.kz беті",
    file: "Файл",
    content: "Мазмұны",
    contentPlaceholder: "Бекітілген жадынама немесе нұсқаулық мәтінін енгізіңіз",
    saveMaterial: "Материалды сақтау",
    updateMaterial: "Өзгерістерді сақтау",
    cancelEdit: "Болдырмау",
    metricPatients: "пациент",
    metricRequests: "өтініш",
    metricAiAnswers: "AI жауаптары",
    metricRedFlags: "қауіпті симптом",
    metricEscalations: "дәрігерге беру",
    metricKnowledge: "база материалы",
    requestTopics: "Өтініш тақырыптары",
    exportExcel: "Excel-ге экспорт",
    managerReport: "Басшыға есеп",
    reportTitle: "ҚазҰОжРИ AI-агенті",
    exportPdf: "PDF / басып шығару",
    safetyMainRule: "Негізгі қауіпсіздік ережесі",
    safetyRuleText: "AI-агент пациентке тек ҚазҰОжРИ бекітілген білім базасы негізінде жауап береді.",
    noInfoRuleText: "Білім базасында ақпарат болмаса, AI өтінішті маманға береді.",
    accessRoles: "Қолжетімділік рөлдері",
    patientNotSelected: "Пациент таңдалмаған",
  adminMode: "Білім базасының әкімшісі",
  adminLoginTitle: "ҚазҰОжРИ әкімші панелі",
    iinNotProvided: "көрсетілмеген",
    firstVisit: "Алғашқы өтініш",
    lastVisit: "Соңғы өтініш",
    status: "Мәртебе",
    redFlags: "Қауіпті симптомдар",
    chatHistory: "Чат тарихы",
    doctor: "Дәрігер",
    requestStatus: "Өтініш мәртебесі",
    noDocuments: "Құжаттар әлі жүктелмеген.",
    noPatients: "Әзірге пациенттер жоқ.",
    patientsNotFound: "Пациенттер табылмады.",
    documents: "Құжаттар",
    complaints: "Шағымдар мен симптомдар",
    doctorComment: "Дәрігер пікірі",
    no: "жоқ",
    answerPatient: "Пациентке жауап беру",
    transferSpecialist: "Дәрігерге/маманға беру",
    addDoctorNote: "Өтініш бойынша ескертпе қосыңыз",
    saveComment: "Пікірді сақтау",
    emptyHistory: "Өтініштер тарихы әзірге бос.",
    sourceLabel: "Дереккөз",
    edit: "Өңдеу",
    delete: "Жою",
    noStats: "Статистика алғашқы өтініштерден кейін пайда болады.",
    noApprovedInfo: "Сіздің сұрағыңыз бойынша ҚазҰОжРИ білім базасында бекітілген ақпарат жоқ. Өтінішіңіз маманға беріледі.",
    urgentAnswer: "Хабарламаңызда қауіпті жағдай белгілері бар. Мен әдеттегі кеңес бермеймін. Шұғыл түрде емдеуші дәрігерге хабарласыңыз, ҚазҰОжРИ қабылдау бөліміне 8 (727) 292-90-63 нөмірі бойынша жүгініңіз немесе жедел жәрдем шақырыңыз. Қан кету, ентігу, есінен тану, жоғары температура, қатты ауырсыну немесе жағдайдың күрт нашарлауы болса, чаттағы жауапты күтпеңіз.",
    importantPrefix: "Маңызды",
    usual: "Қалыпты",
    urgent: "Шұғыл",
    escalated: "Маманға берілді",
    open: "Ашық",
    activeRequest: "Белсенді өтініш",
    doctorNotAssigned: "Тағайындалмаған",
    doctorPreparing: "Дәрігер жауабы дайындалуда",
    transferredToSpecialist: "Бейінді маманға берілді",
    kazDoctor: "ҚазҰОжРИ дәрігері",
    useful: "Пайдалы",
    needDoctor: "Дәрігер керек",
    uploadedInternalDoc: "Жүктелген ішкі құжат",
    nonTextFileNote: "Құжат жүктелді. AI материалды қауіпсіз пайдалану үшін жарияламас бұрын бекітілген мәтінді енгізіңіз.",
    reportUsesOnly: "AI тек «Жарияланған» және «Дәрігер тексерген» мәртебесіндегі материалдарды пайдаланады.",
    roles: [
      "Пациент: чат, тарих, құжаттар, жадынамалар, өтініш мәртебесі.",
      "Дәрігер: пациенттер, өтініш тарихы, құжаттар, пікірлер, маманға беру.",
      "Білім базасының әкімшісі: мақалалар, файлдар, сілтемелер, дереккөздер, материалдарды өңдеу және жою.",
      "Модератор: материалдарды тексеру және жариялау.",
      "Басшы: аналитика, есептер, жауап сапасы.",
      "IT-әкімші: қолжетімділік, аудит, деректерді сақтау және қорғау."
    ],
    quickPrompts: [
      "Дәрігер қабылдауына қалай жазыламын?",
      "Алғашқы қабылдауға қандай құжаттар керек?",
      "КТ, МРТ, УДЗ диагностика бөлімінің байланыстары",
      "Емнен кейін дене қызуым жоғары"
    ]
  },
  en: {
    appEyebrow: "KazNIIOiR AI Agent",
    patientLoginTitle: "Patient Login",
    patientLoginLead: "Simple access without complex registration. After login, the system creates or finds the patient card.",
    fullNameLabel: "Full name *",
    fullNamePlaceholder: "Enter your full name",
    iinLabel: "IIN",
    iinPlaceholder: "Enter your IIN (optional)",
    enter: "Login",
    enterPatientCabinet: "Login",
    adminPanelLogin: "Admin panel",
    loginSafetyNote: "AI answers only from the approved KazNIIOiR knowledge base and does not replace a doctor.",
    brandSubtitle: "patient support",
    navChat: "Chat",
    navPatient: "Patient",
    navDoctor: "Doctor cabinet",
    navAdmin: "Admin panel",
    navAnalytics: "Reports",
    navSafety: "Safety",
    routeTitle: "Workflow",
    routeText: "Patient → Chat → AI agent → KazNIIOiR knowledge base → Patient answer / Doctor handoff → Analytics.",
    routeMobileHint: "Patient journey",
    logoutMobileHint: "End session",
    logout: "Logout",
    knowledgeOnly: "Knowledge base only",
    mainRuleTitle: "Main rule:",
    mainRuleText: "AI does not answer from its own assumptions; it uses only published and doctor-checked KazNIIOiR knowledge base materials.",
    newChat: "+ New chat",
    searchChats: "Search requests",
    welcomeTitle: "Welcome to KazONCO AI",
    welcomeText: "Ask about exam preparation, patient routing, documents, contacts, patient leaflets, or danger symptoms.",
    safetyDisclaimer: "I do not replace a doctor and do not diagnose. If your condition worsens, contact a doctor or call emergency services.",
    attachDocument: "Upload document",
    messagePlaceholder: "Type a message...",
    patientCard: "Patient card",
    myDoctor: "My doctor",
    observation: "Observation",
    myDocuments: "My documents",
    memos: "Leaflets and recommendations",
    fromKnowledge: "from knowledge base",
    doctorCabinet: "Doctor cabinet",
    patientsAndRequests: "Patients and requests",
    doctorSearch: "Search by full name or IIN",
    selectedPatientHistory: "Selected patient history",
    adminPanel: "Administrative panel",
    knowledgeManagement: "Knowledge base management",
    kbSearch: "Search knowledge base",
    addMaterial: "Add material",
    editMaterial: "Edit material",
    moderation: "moderation",
    materialTitle: "Title",
    materialTitlePlaceholder: "Example: CT preparation",
    category: "Category",
    materialStatus: "Material status",
    source: "Source",
    sourcePlaceholder: "onco.kz, kaznior.kz or internal document",
    link: "Link",
    linkPlaceholder: "https://kaznior.kz or onco.kz page",
    file: "File",
    content: "Content",
    contentPlaceholder: "Enter approved leaflet or instruction text",
    saveMaterial: "Save material",
    updateMaterial: "Save changes",
    cancelEdit: "Cancel",
    metricPatients: "patients",
    metricRequests: "requests",
    metricAiAnswers: "AI answers",
    metricRedFlags: "danger symptoms",
    metricEscalations: "doctor handoffs",
    metricKnowledge: "knowledge items",
    requestTopics: "Request topics",
    exportExcel: "Export Excel",
    managerReport: "Manager report",
    reportTitle: "KazNIIOiR AI Agent",
    exportPdf: "Export PDF / print",
    safetyMainRule: "Main safety rule",
    safetyRuleText: "The AI agent answers patients only based on the approved KazNIIOiR knowledge base.",
    noInfoRuleText: "If the knowledge base has no approved information, AI hands the request to a specialist.",
    accessRoles: "Access roles",
    patientNotSelected: "No patient selected",
  adminMode: "Knowledge base administrator",
  adminLoginTitle: "KazNIIOiR admin panel",
    iinNotProvided: "not provided",
    firstVisit: "First request",
    lastVisit: "Last request",
    status: "Status",
    redFlags: "Danger symptoms",
    chatHistory: "Chat history",
    doctor: "Doctor",
    requestStatus: "Request status",
    noDocuments: "No documents uploaded yet.",
    noPatients: "No patients yet.",
    patientsNotFound: "No patients found.",
    documents: "Documents",
    complaints: "Complaints and symptoms",
    doctorComment: "Doctor comment",
    no: "none",
    answerPatient: "Answer patient",
    transferSpecialist: "Transfer to doctor/specialist",
    addDoctorNote: "Add a note for this request",
    saveComment: "Save comment",
    emptyHistory: "Request history is empty.",
    sourceLabel: "Source",
    edit: "Edit",
    delete: "Delete",
    noStats: "Statistics will appear after the first requests.",
    noApprovedInfo: "There is no approved information on your question in the KazNIIOiR knowledge base. Your request will be transferred to a specialist.",
    urgentAnswer: "Your message contains signs of a dangerous condition. I will not provide a routine consultation. Contact your treating doctor urgently, go to the KazNIIOiR emergency reception at 8 (727) 292-90-63, or call emergency services. If there is bleeding, shortness of breath, loss of consciousness, high fever, severe pain, or sudden worsening, do not wait for a chat response.",
    importantPrefix: "Important",
    usual: "Routine",
    urgent: "Urgent",
    escalated: "Transferred to specialist",
    open: "Open",
    activeRequest: "Active request",
    doctorNotAssigned: "Not assigned",
    doctorPreparing: "Doctor response is being prepared",
    transferredToSpecialist: "Transferred to a specialist",
    kazDoctor: "KazNIIOiR doctor",
    useful: "Useful",
    needDoctor: "Need doctor",
    uploadedInternalDoc: "Uploaded internal document",
    nonTextFileNote: "The document has been uploaded. Insert the approved leaflet or instruction text before publishing so AI can use it safely.",
    reportUsesOnly: "AI uses only materials with вЂњPublishedвЂќ and вЂњDoctor checkedвЂќ status.",
    roles: [
      "Patient: chat, history, documents, leaflets, request status.",
      "Doctor: patients, request history, documents, comments, specialist handoff.",
      "Knowledge base administrator: articles, files, links, sources, editing and deleting materials.",
      "Moderator: review and publication of materials.",
      "Manager: analytics, reports, answer quality.",
      "IT administrator: access, audit, storage and data protection."
    ],
    quickPrompts: [
      "How do I book a doctor appointment?",
      "What documents should I bring to the first visit?",
      "Contacts for CT, MRI, ultrasound diagnostics",
      "I have a high fever after treatment"
    ]
  }
};

Object.assign(tr.ru, {
  navAudit: "Журнал аудита",
  navSystem: "Система",
  navDirector: "Директор",
  directorLogin: "Директор",
  doctorLogin: "Вход врача",
  superAdminLogin: "Супер-администратор",
  loginLabel: "Логин",
  loginPlaceholder: "Введите логин",
  passwordLabel: "Пароль",
  passwordPlaceholder: "Введите пароль",
  twoFactorLabel: "2FA-код",
  twoFactorPlaceholder: "000000 для демо",
  loginStaffButton: "Войти",
  authHintDoctor: "Демо: doctor / doctor123",
  authHintAdmin: "Демо: admin / admin123 / 000000",
  authHintSuper: "Демо: superadmin / super123 / 000000",
  authError: "Неверный логин, пароль или 2FA-код",
  auditLogTitle: "Журнал изменений базы знаний",
  auditRulesTitle: "Фиксируется в аудите",
  auditRuleUser: "Пользователь",
  auditRuleDate: "Дата и время",
  auditRuleMaterial: "Измененный материал",
  auditRuleType: "Тип изменения",
  systemPanelTitle: "Панель управления системой",
  createUsers: "Создать пользователя",
  blockUsers: "Блокировать пользователя",
  changeRoles: "Изменить роли",
  backupDatabase: "Резервная копия",
  securityChecklist: "Безопасность",
  securityPasswordAuth: "Авторизация по логину и паролю",
  securityPasswordHash: "Пароли проверяются через хэш SHA-256 в демо-прототипе",
  securityAudit: "Все действия фиксируются в журнале аудита",
  securityTwoFactor: "Для администраторов включен 2FA-код",
  securityAutoLogout: "Автоматический выход при бездействии",
  securityBackup: "Резервное копирование базы данных",
  auditCreated: "Создание материала",
  auditUpdated: "Редактирование материала",
  auditDeleted: "Удаление материала",
  auditStatus: "Изменение статуса",
  auditLogin: "Вход в систему",
  auditProfileSaved: "Анкета пациента сохранена",
  auditDoctorAction: "Действие врача",
  auditBackup: "Резервное копирование",
  doctorMode: "Врач КазНИИОиР",
  superAdminMode: "Супер-администратор",
  directorMode: "Директор",
  directorPanelTitle: "Панель директора",
  allPatientDocuments: "Документы пациентов",
  exportKnowledgeBase: "Выгрузить базу знаний",
  newPasswordPlaceholder: "Новый пароль или оставить пустым",
  roleLabel: "Роль",
  blockedUser: "Пользователь заблокирован",
  saveUser: "Сохранить пользователя",
  editUser: "Редактировать пользователя",
  passwordChanged: "Пароль изменен",
  auditUserCreated: "Создание пользователя",
  auditUserUpdated: "Изменение пользователя",
  auditPasswordChanged: "Смена пароля",
  auditExportKnowledge: "Выгрузка базы знаний",
  attachmentReady: "Файл прикреплен",
  removeAttachment: "Убрать",
  attachmentAnalyzed: "Вложение учтено",
  imageSafetyAnalysis: "Я вижу, что вы прикрепили изображение. По фото нельзя ставить диагноз, но я могу помочь с безопасной маршрутизацией: если есть кровотечение, высокая температура, сильная боль, одышка или резкое ухудшение, срочно обратитесь к врачу или вызовите скорую помощь.",
  documentSafetyAnalysis: "Я учел прикрепленный документ. В этом прототипе файл сохраняется в карточке пациента, а ответ формируется только по утвержденной базе знаний КазНИИОиР. Для медицинской интерпретации документа вопрос передается врачу при отсутствии утвержденной информации.",
  textDocumentExtracted: "Текст из файла учтен в вопросе пациента.",
  chatGptModuleTitle: "Подключение ChatGPT",
  chatGptModuleText: "Можно подключить ChatGPT через серверный API. Важно: модель должна получать только найденные фрагменты утвержденной базы знаний КазНИИОиР и не принимать самостоятельных медицинских решений.",
  chatGptApiPlaceholder: "OPENAI_API_KEY хранится только на сервере",
  chatGptToggle: "Использовать ChatGPT для формулировки ответа по базе знаний"
});

Object.assign(tr.kz, {
  navAudit: "Аудит журналы",
  navSystem: "Жүйе",
  navDirector: "Директор",
  directorLogin: "Директор",
  doctorLogin: "Дәрігер кіруі",
  superAdminLogin: "Супер-әкімші",
  loginLabel: "Логин",
  loginPlaceholder: "Логин енгізіңіз",
  passwordLabel: "Құпиясөз",
  passwordPlaceholder: "Құпиясөз енгізіңіз",
  twoFactorLabel: "2FA-код",
  twoFactorPlaceholder: "Демо үшін 000000",
  loginStaffButton: "Кіру",
  authHintDoctor: "Демо: doctor / doctor123",
  authHintAdmin: "Демо: admin / admin123 / 000000",
  authHintSuper: "Демо: superadmin / super123 / 000000",
  authError: "Логин, құпиясөз немесе 2FA-код қате",
  auditLogTitle: "Білім базасы өзгерістерінің журналы",
  auditRulesTitle: "Аудитте тіркеледі",
  auditRuleUser: "Пайдаланушы",
  auditRuleDate: "Күні және уақыты",
  auditRuleMaterial: "Өзгертілген материал",
  auditRuleType: "Өзгеріс түрі",
  systemPanelTitle: "Жүйені басқару панелі",
  createUsers: "Пайдаланушы құру",
  blockUsers: "Пайдаланушыны бұғаттау",
  changeRoles: "Рөлдерді өзгерту",
  backupDatabase: "Резервтік көшірме",
  securityChecklist: "Қауіпсіздік",
  securityPasswordAuth: "Логин және құпиясөз арқылы авторизация",
  securityPasswordHash: "Демо-прототипте құпиясөз SHA-256 хэшімен тексеріледі",
  securityAudit: "Барлық әрекеттер аудит журналында тіркеледі",
  securityTwoFactor: "Әкімшілер үшін 2FA-код қосылған",
  securityAutoLogout: "Әрекетсіздік кезінде автоматты шығу",
  securityBackup: "Деректер базасының резервтік көшірмесі",
  auditCreated: "Материал құру",
  auditUpdated: "Материалды өңдеу",
  auditDeleted: "Материалды жою",
  auditStatus: "Мәртебені өзгерту",
  auditLogin: "Жүйеге кіру",
  auditProfileSaved: "Пациент анкетасы сақталды",
  auditDoctorAction: "Дәрігер әрекеті",
  auditBackup: "Резервтік көшіру",
  doctorMode: "ҚазҰОжРИ дәрігері",
  superAdminMode: "Супер-әкімші",
  directorMode: "Директор",
  directorPanelTitle: "Директор панелі",
  allPatientDocuments: "Пациент құжаттары",
  exportKnowledgeBase: "Білім базасын жүктеу",
  newPasswordPlaceholder: "Жаңа құпиясөз немесе бос қалдыру",
  roleLabel: "Рөл",
  blockedUser: "Пайдаланушы бұғатталған",
  saveUser: "Пайдаланушыны сақтау",
  editUser: "Пайдаланушыны өңдеу",
  passwordChanged: "Құпиясөз өзгертілді",
  auditUserCreated: "Пайдаланушы құру",
  auditUserUpdated: "Пайдаланушыны өзгерту",
  auditPasswordChanged: "Құпиясөзді өзгерту",
  auditExportKnowledge: "Білім базасын жүктеу",
  attachmentReady: "Файл тіркелді",
  removeAttachment: "Алу",
  attachmentAnalyzed: "Қосымша ескерілді",
  imageSafetyAnalysis: "Сіз сурет тіркедіңіз. Фото бойынша диагноз қоюға болмайды, бірақ қауіпсіз маршруттауға көмектесе аламын: қан кету, жоғары қызу, қатты ауырсыну, ентігу немесе жағдайдың күрт нашарлауы болса, шұғыл дәрігерге жүгініңіз немесе жедел жәрдем шақырыңыз.",
  documentSafetyAnalysis: "Тіркелген құжат ескерілді. Бұл прототипте файл пациент картасында сақталады, ал жауап тек ҚазҰОжРИ бекітілген білім базасы бойынша қалыптасады. Бекітілген ақпарат болмаса, құжатты медициналық түсіндіру дәрігерге беріледі.",
  textDocumentExtracted: "Файл мәтіні пациент сұрағында ескерілді.",
  chatGptModuleTitle: "ChatGPT қосу",
  chatGptModuleText: "ChatGPT серверлік API арқылы қосылуы мүмкін. Маңызды: модель тек ҚазҰОжРИ бекітілген білім базасынан табылған үзінділерді алуы керек және дербес медициналық шешім қабылдамауы тиіс.",
  chatGptApiPlaceholder: "OPENAI_API_KEY тек серверде сақталады",
  chatGptToggle: "Білім базасы бойынша жауапты тұжырымдау үшін ChatGPT қолдану"
});

Object.assign(tr.en, {
  navAudit: "Audit log",
  navSystem: "System",
  navDirector: "Director",
  directorLogin: "Director",
  doctorLogin: "Doctor login",
  superAdminLogin: "Super administrator",
  loginLabel: "Login",
  loginPlaceholder: "Enter login",
  passwordLabel: "Password",
  passwordPlaceholder: "Enter password",
  twoFactorLabel: "2FA code",
  twoFactorPlaceholder: "000000 for demo",
  loginStaffButton: "Login",
  authHintDoctor: "Demo: doctor / doctor123",
  authHintAdmin: "Demo: admin / admin123 / 000000",
  authHintSuper: "Demo: superadmin / super123 / 000000",
  authError: "Invalid login, password, or 2FA code",
  auditLogTitle: "Knowledge base change log",
  auditRulesTitle: "Audit captures",
  auditRuleUser: "User",
  auditRuleDate: "Date and time",
  auditRuleMaterial: "Changed material",
  auditRuleType: "Change type",
  systemPanelTitle: "System management panel",
  createUsers: "Create users",
  blockUsers: "Block users",
  changeRoles: "Change roles",
  backupDatabase: "Backup database",
  securityChecklist: "Security",
  securityPasswordAuth: "Login and password authorization",
  securityPasswordHash: "Passwords are checked with SHA-256 hash in the demo prototype",
  securityAudit: "All actions are recorded in the audit log",
  securityTwoFactor: "2FA code is enabled for administrators",
  securityAutoLogout: "Automatic logout after inactivity",
  securityBackup: "Database backup",
  auditCreated: "Material created",
  auditUpdated: "Material edited",
  auditDeleted: "Material deleted",
  auditStatus: "Status changed",
  auditLogin: "System login",
  auditProfileSaved: "Patient questionnaire saved",
  auditDoctorAction: "Doctor action",
  auditBackup: "Backup",
  doctorMode: "KazNIIOiR doctor",
  superAdminMode: "Super administrator",
  directorMode: "Director",
  directorPanelTitle: "Director panel",
  allPatientDocuments: "Patient documents",
  exportKnowledgeBase: "Export knowledge base",
  newPasswordPlaceholder: "New password or leave empty",
  roleLabel: "Role",
  blockedUser: "User is blocked",
  saveUser: "Save user",
  editUser: "Edit user",
  passwordChanged: "Password changed",
  auditUserCreated: "User created",
  auditUserUpdated: "User updated",
  auditPasswordChanged: "Password changed",
  auditExportKnowledge: "Knowledge base export",
  attachmentReady: "File attached",
  removeAttachment: "Remove",
  attachmentAnalyzed: "Attachment considered",
  imageSafetyAnalysis: "You attached an image. A diagnosis cannot be made from a photo, but I can help with safe routing: if there is bleeding, high fever, severe pain, shortness of breath, or sudden worsening, contact a doctor urgently or call emergency services.",
  documentSafetyAnalysis: "I considered the attached document. In this prototype, the file is saved to the patient card, and the answer is generated only from the approved KazNIIOiR knowledge base. If no approved information exists, medical interpretation of the document is handed to a doctor.",
  textDocumentExtracted: "Text from the file was considered in the patient question.",
  chatGptModuleTitle: "ChatGPT connection",
  chatGptModuleText: "ChatGPT can be connected through a server API. Important: the model must receive only retrieved fragments from the approved KazNIIOiR knowledge base and must not make independent medical decisions.",
  chatGptApiPlaceholder: "OPENAI_API_KEY is stored only on the server",
  chatGptToggle: "Use ChatGPT to phrase answers based on the knowledge base"
});

Object.assign(tr.ru, { authHintDirector: "Демо: director / director123 / 000000" });
Object.assign(tr.kz, { authHintDirector: "Демо: director / director123 / 000000" });
Object.assign(tr.en, { authHintDirector: "Demo: director / director123 / 000000" });

Object.assign(tr.ru, {
  navConsultations: "AI Консультации",
  aiConsultationsTitle: "AI Консультации пациентов",
  aiConsultSearch: "Поиск по ФИО, ИИН, номеру обращения",
  filterDate: "Фильтр по дате",
  aiConsultHistory: "История переписки",
  staffReplyTitle: "Ответить пациенту",
  staffReplyPlaceholder: "Введите ответ пациенту",
  attachStaffFile: "Прикрепить файл",
  sendStaffReply: "Отправить пациенту",
  unreadMessages: "Непрочитано",
  readStatus: "Прочитано",
  requiresAttention: "Требует внимания",
  doctorDialogComment: "Комментарий врача к диалогу",
  saveDialogComment: "Сохранить комментарий",
  auditStaffReply: "Ответ пациенту",
  auditDialogViewed: "Просмотр AI-консультации",
  auditDialogComment: "Комментарий к AI-консультации",
  staffViewed: "Просмотрено сотрудником",
  staffNotViewed: "Не просмотрено сотрудником",
  authError: "Проверьте логин, пароль и 2FA-код. Для демо используйте 2FA: 000000.",
  navSystem: "Сотрудники",
  systemPanelTitle: "Супер-админ → Сотрудники",
  profileButton: "Профиль",
  employeeFullNameLabel: "ФИО сотрудника *",
  employeeFullNamePlaceholder: "Введите ФИО сотрудника",
  loginJournalTitle: "Журнал входов",
  deleteUser: "Удалить сотрудника",
  openFile: "Открыть",
  downloadFile: "Скачать",
  responseStatus: "Статус ответа",
  transferredWarning: "Вопрос передан врачу",
  staffProfileTitle: "Профиль сотрудника",
  activeUserStatus: "Активен",
  blockedUserStatus: "Заблокирован",
  roleDoctor: "Врач",
  roleAdmin: "Администратор базы знаний",
  roleModerator: "Модератор",
  roleSuperadmin: "Супер-администратор",
  roleItadmin: "IT-администратор",
  roleDirector: "Директор",
  auditUserDeleted: "Удаление сотрудника",
  auditPatientViewed: "Просмотр пациента",
  noApprovedInfo: "По вашему вопросу нет утверждённой информации в базе знаний КазНИИОиР. Ваше обращение передано специалисту."
});

Object.assign(tr.kz, {
  navConsultations: "AI консультациялар",
  aiConsultationsTitle: "Пациенттердің AI консультациялары",
  aiConsultSearch: "ТАӘ, ИИН, өтініш нөмірі бойынша іздеу",
  filterDate: "Күні бойынша сүзгі",
  aiConsultHistory: "Хат алмасу тарихы",
  staffReplyTitle: "Пациентке жауап беру",
  staffReplyPlaceholder: "Пациентке жауап енгізіңіз",
  attachStaffFile: "Файл тіркеу",
  sendStaffReply: "Пациентке жіберу",
  unreadMessages: "Оқылмаған",
  readStatus: "Оқылды",
  requiresAttention: "Назар аудару қажет",
  doctorDialogComment: "Диалогқа дәрігер пікірі",
  saveDialogComment: "Пікірді сақтау",
  auditStaffReply: "Пациентке жауап",
  auditDialogViewed: "AI консультацияны қарау",
  auditDialogComment: "AI консультацияға пікір",
  staffViewed: "Қызметкер қарады",
  staffNotViewed: "Қызметкер қарамады",
  authError: "Логинді, құпиясөзді және 2FA-кодты тексеріңіз. Демо үшін 2FA: 000000.",
  navSystem: "Қызметкерлер",
  systemPanelTitle: "Супер-әкімші → Қызметкерлер",
  profileButton: "Профиль",
  employeeFullNameLabel: "Қызметкердің ТАӘ *",
  employeeFullNamePlaceholder: "Қызметкердің ТАӘ енгізіңіз",
  loginJournalTitle: "Кіру журналы",
  deleteUser: "Қызметкерді жою",
  openFile: "Ашу",
  downloadFile: "Жүктеу",
  responseStatus: "Жауап мәртебесі",
  transferredWarning: "Сұрақ дәрігерге берілді",
  staffProfileTitle: "Қызметкер профилі",
  activeUserStatus: "Белсенді",
  blockedUserStatus: "Бұғатталған",
  roleDoctor: "Дәрігер",
  roleAdmin: "Білім базасының әкімшісі",
  roleModerator: "Модератор",
  roleSuperadmin: "Супер-әкімші",
  roleItadmin: "IT-әкімші",
  roleDirector: "Директор",
  auditUserDeleted: "Қызметкерді жою",
  auditPatientViewed: "Пациентті қарау",
  noApprovedInfo: "Сіздің сұрағыңыз бойынша ҚазҚОРҒЗИ білім базасында бекітілген ақпарат жоқ. Өтінішіңіз маманға берілді."
});

Object.assign(tr.en, {
  navConsultations: "AI consultations",
  aiConsultationsTitle: "Patient AI consultations",
  aiConsultSearch: "Search by name, IIN, request number",
  filterDate: "Filter by date",
  aiConsultHistory: "Conversation history",
  staffReplyTitle: "Reply to patient",
  staffReplyPlaceholder: "Enter a reply to the patient",
  attachStaffFile: "Attach file",
  sendStaffReply: "Send to patient",
  unreadMessages: "Unread",
  readStatus: "Read",
  requiresAttention: "Requires attention",
  doctorDialogComment: "Doctor comment on dialog",
  saveDialogComment: "Save comment",
  auditStaffReply: "Reply to patient",
  auditDialogViewed: "AI consultation viewed",
  auditDialogComment: "AI consultation comment",
  staffViewed: "Viewed by staff",
  staffNotViewed: "Not viewed by staff",
  authError: "Check login, password, and 2FA code. For demo use 2FA: 000000.",
  navSystem: "Employees",
  systemPanelTitle: "Super admin → Employees",
  profileButton: "Profile",
  employeeFullNameLabel: "Employee full name *",
  employeeFullNamePlaceholder: "Enter employee full name",
  loginJournalTitle: "Login journal",
  deleteUser: "Delete employee",
  openFile: "Open",
  downloadFile: "Download",
  responseStatus: "Response status",
  transferredWarning: "Question transferred to a doctor",
  staffProfileTitle: "Employee profile",
  activeUserStatus: "Active",
  blockedUserStatus: "Blocked",
  roleDoctor: "Doctor",
  roleAdmin: "Knowledge base administrator",
  roleModerator: "Moderator",
  roleSuperadmin: "Super administrator",
  roleItadmin: "IT administrator",
  roleDirector: "Director",
  auditUserDeleted: "Employee deleted",
  auditPatientViewed: "Patient viewed",
  noApprovedInfo: "There is no approved information on your question in the KazNIIOiR knowledge base. Your request has been transferred to a specialist."
});

Object.assign(tr.ru, {
  welcomeTitle: "AI-помощник пациента — вопрос и ответ",
  welcomeText: "Опишите симптом или задайте вопрос о лечении, препарате, обследовании либо маршруте пациента. Помощник найдёт ответ в проверенной базе знаний, распознает опасные признаки и при необходимости передаст обращение врачу.",
  messagePlaceholder: "Напишите вопрос или опишите симптом...",
  mainRuleText: "AI-помощник отвечает по проверенным материалам, не ставит диагноз и не меняет назначения врача. При опасных симптомах система рекомендует срочно обратиться за медицинской помощью.",
  quickPrompts: [
    "Какие симптомы отслеживать при иммунотерапии?",
    "Какие побочные эффекты могут быть у осимертиниба?",
    "Как правильно описать свой симптом?",
    "У меня одышка и сухой кашель после лечения",
    "Как записаться на приём к врачу?",
    "Какие документы взять на первичный приём?"
  ]
});


Object.assign(tr.ru, {
  safetyShort: "AI не ставит диагноз и не заменяет врача",
  offlineMessage: "Нет соединения. Проверьте интернет — введённый текст сохранён.",
  aiSearching: "Поиск в базе знаний…",
  knowledgeVerified: "Ответ по базе знаний КазНИИОиР",
  showSource: "Источник",
  patientProfileLabel: "Профиль пациента",
  confirmLogoutTitle: "Выйти из аккаунта?",
  confirmLogoutText: "Текущий сеанс будет завершён.",
  newMessageBelow: "Новое сообщение"
});
Object.assign(tr.kz, {
  safetyShort: "AI диагноз қоймайды және дәрігерді алмастырмайды",
  offlineMessage: "Интернет байланысы жоқ. Енгізілген мәтін сақталады.",
  aiSearching: "Білім базасынан іздеу…",
  knowledgeVerified: "ҚазҰОжРИ білім базасына негізделген жауап",
  showSource: "Дереккөз",
  patientProfileLabel: "Пациент профилі",
  confirmLogoutTitle: "Аккаунттан шығу керек пе?",
  confirmLogoutText: "Ағымдағы сеанс аяқталады.",
  newMessageBelow: "Жаңа хабарлама"
});
Object.assign(tr.en, {
  safetyShort: "AI does not diagnose or replace a doctor",
  offlineMessage: "No connection. Check the internet — your typed text is preserved.",
  aiSearching: "Searching the knowledge base…",
  knowledgeVerified: "Answer based on the KazNIIOiR knowledge base",
  showSource: "Source",
  patientProfileLabel: "Patient profile",
  confirmLogoutTitle: "Sign out?",
  confirmLogoutText: "The current session will end.",
  newMessageBelow: "New message"
});

// Списки для анкеты медицинского профиля пациента
const kazakhstanRegions = [
  "г. Алматы", "г. Астана", "г. Шымкент", "Алматинская область", "Абайская область",
  "Акмолинская область", "Актюбинская область", "Атырауская область", "Восточно-Казахстанская область",
  "Жамбылская область", "Жетысуская область", "Западно-Казахстанская область", "Карагандинская область",
  "Костанайская область", "Кызылординская область", "Мангистауская область", "Павлодарская область",
  "Северо-Казахстанская область", "Туркестанская область", "Улытауская область"
];
const tumorStageOptions = ["IA1", "IA2", "IA3", "IB", "IIA", "IIB", "IIIA", "IIIB", "IIIC", "IVA", "IVB"];

Object.assign(tr.ru, {
  medicalProfileTitle: "Анкета пациента",
  medicalProfileSubtitle: "Анкета пациента",
  regionLabel: "Регион проживания",
  selectPlaceholder: "Выберите значение",
  genderLabel: "Пол",
  genderMale: "Мужской",
  genderFemale: "Женский",
  ageLabel: "Возраст",
  diagnosisLabel: "Диагноз",
  diagnosisPlaceholder: "Например, немелкоклеточный рак лёгкого (НМРЛ)",
  stageLabel: "Стадия опухолевого процесса",
  saveProfileButton: "Сохранить анкету",
  profileSavedToast: "Анкета сохранена",
  profileNotFilled: "Анкета не заполнена"
});
Object.assign(tr.kz, {
  medicalProfileTitle: "Пациент анкетасы",
  medicalProfileSubtitle: "Медициналық профиль",
  regionLabel: "Тұрғылықты аймақ",
  selectPlaceholder: "Мәнді таңдаңыз",
  genderLabel: "Жынысы",
  genderMale: "Ер адам",
  genderFemale: "Әйел адам",
  ageLabel: "Жасы",
  diagnosisLabel: "Диагноз",
  diagnosisPlaceholder: "Мысалы, ұсақ жасушалы емес өкпе obyrı (ҰЖЕӨО)",
  stageLabel: "Ісік процесінің сатысы",
  saveProfileButton: "Анкетаны сақтау",
  profileSavedToast: "Анкета сақталды",
  profileNotFilled: "Анкета толтырылмаған"
});
Object.assign(tr.en, {
  medicalProfileTitle: "Patient questionnaire",
  medicalProfileSubtitle: "Medical profile",
  regionLabel: "Region of residence",
  selectPlaceholder: "Select a value",
  genderLabel: "Gender",
  genderMale: "Male",
  genderFemale: "Female",
  ageLabel: "Age",
  diagnosisLabel: "Diagnosis",
  diagnosisPlaceholder: "E.g., non-small cell lung cancer (NSCLC)",
  stageLabel: "Tumor stage",
  saveProfileButton: "Save questionnaire",
  profileSavedToast: "Questionnaire saved",
  profileNotFilled: "Questionnaire not filled in"
});

const staffRoleDefs = [
  { id: "doctor", labelKey: "roleDoctor", defaultName: "Врач КазНИИОиР" },
  { id: "admin", labelKey: "roleAdmin", defaultName: "Администратор базы знаний" },
  { id: "moderator", labelKey: "roleModerator", defaultName: "Модератор КазНИИОиР" },
  { id: "superadmin", labelKey: "roleSuperadmin", defaultName: "Супер-администратор" },
  { id: "itadmin", labelKey: "roleItadmin", defaultName: "IT-администратор" },
  { id: "director", labelKey: "roleDirector", defaultName: "Директор" }
];

const categoryDefs = [
  { id: "prep", ru: "Подготовка к обследованиям", kz: "Тексеруге дайындық", en: "Exam preparation" },
  { id: "chemo", ru: "Химиотерапия", kz: "Химиотерапия", en: "Chemotherapy" },
  { id: "radiation", ru: "Лучевая терапия", kz: "Сәулелік терапия", en: "Radiation therapy" },
  { id: "surgery", ru: "Хирургическое лечение", kz: "Хирургиялық ем", en: "Surgical treatment" },
  { id: "diagnostics", ru: "Диагностика", kz: "Диагностика", en: "Diagnostics" },
  { id: "documents", ru: "Документы для госпитализации", kz: "Госпитализация құжаттары", en: "Hospitalization documents" },
  { id: "routing", ru: "Маршрутизация по отделениям", kz: "Бөлімшелер бойынша маршрут", en: "Department routing" },
  { id: "meds", ru: "Лекарственные препараты", kz: "Дәрілік препараттар", en: "Medicines" },
  { id: "sideEffects", ru: "Побочные эффекты", kz: "Жанама әсерлер", en: "Side effects" },
  { id: "faq", ru: "Часто задаваемые вопросы", kz: "Жиі қойылатын сұрақтар", en: "FAQ" },
  { id: "memos", ru: "Памятки для пациентов", kz: "Пациенттерге арналған жадынамалар", en: "Patient leaflets" },
  { id: "redFlags", ru: "Опасные симптомы", kz: "Қауіпті симптомдар", en: "Danger symptoms" }
];

const statusDefs = [
  { id: "draft", ru: "Черновик", kz: "Жоба", en: "Draft" },
  { id: "review", ru: "На проверке", kz: "Тексерісте", en: "Under review" },
  { id: "doctorChecked", ru: "Проверено врачом", kz: "Дәрігер тексерген", en: "Doctor checked" },
  { id: "published", ru: "Опубликовано", kz: "Жарияланған", en: "Published" },
  { id: "archive", ru: "Архив", kz: "Архив", en: "Archive" }
];

const allowedStatusIds = ["doctorChecked", "published"];
const redFlagTerms = [
  // Одышка / дыхание (ИБЛ, пневмонит)
  "одышка в покое", "одышка в состоянии покоя", "одыш", "не хватает воздух", "трудно дышать", "тяжело дышать", "задыхаюсь", "сухой кашель",
  // ЖКТ-кровотечение, желтуха, гепатотоксичность
  "кровь в стуле", "кровь в кале", "чёрный стул", "черный стул", "желтуха", "пожелтела кожа", "пожелтели глаза", "тёмная моча", "темная моча",
  "боль в правом подреберье", "боль под рёбрами справа", "боль под ребрами справа",
  // Брадикардия / сердце
  "частота пульса меньше 50", "чсс меньше 50", "пульс меньше 50", "редкий пульс", "обморок", "потерял сознание", "теряю сознание", "теряла сознание",
  "боль в груди", "сердцебиение и одышка", "учащённое сердцебиение", "учащенное сердцебиение", "снижение фв", "отеки и одышка",
  // Кровотечение / антиангиогенные
  "кровохарканье", "кровь при кашле", "кровотеч", "рвота с кров", "массивное кровотечение",
  // Давление / гипертонический криз
  "давление 180", "давление выше 180", "давление под 200", "очень высокое давление",
  // Диарея / колит
  "диарея больше 6 раз", "понос больше 6 раз", "диарея более 6 раз", "сильный понос", "постоянный понос", "не могу остановить понос",
  "острая боль в животе", "боль в животе и напряжение", "живот твёрдый", "живот твердый как камень",
  // Неврология / глотание / конечности (нейротоксичность, миастения, нейропатия)
  "нарушение глотания", "трудно глотать", "тяжело глотать", "больно глотать", "не могу глотать", "поперхиваюсь",
  "онемение конечностей", "онемели руки", "онемели ноги", "немеют руки", "немеют ноги", "немеет рука", "немеет нога", "слабость в руках", "слабость в ногах",
  "нарушение координации", "шатает при ходьбе", "не могу ходить ровно", "тремор", "дрожат руки",
  // Зрение (BRAF/MEK, VEGF, гипофизит)
  "резко ухудшилось зрение", "резкое снижение зрения", "снижение остроты зрения", "перестал видеть", "пятна перед глазами", "двоится в глазах",
  // Дыхание/сатурация (иммунный пневмонит)
  "снижение сатурации", "падает сатурация", "низкая сатурация", "сатурация упала",
  // Головная боль (гипофизит, PRES)
  "сильная головная боль", "очень сильно болит голова", "самая сильная головная боль",
  // Температура / пирексия
  "температура 38.5", "температура 38,5", "озноб и температура", "температура 39", "температура 40", "высокая температура", "температура не сбивается", "жар и озноб",
  // Общее ухудшение / слабость (надпочечниковая недостаточность)
  "сильная боль", "потеря сознания", "резкое ухудш", "резко стало хуже", "резко ухудшилось состояние", "сильная слабость", "резкая слабость", "низкое давление и слабость",
  // Нога — тромбоз
  "боль и отек ноги", "боль и отёк ноги", "покраснение и отек голени", "нога опухла", "нога покраснела и болит",
  // Казахский
  "қан", "қызу", "ентігу", "есінен", "қатты ауыр", "нашарла", "құсу", "кеуде", "жұтыну қиын", "аяғым ісінді",
  // Английский
  "bleeding", "fever", "temperature", "shortness of breath", "loss of consciousness", "faint", "severe pain", "chest pain", "worsening", "can't breathe", "difficulty swallowing", "numbness"
];
const categoryKeywords = {
  meds: ["препарат", "лекар", "таблет", "доза", "дәрі", "medicine", "drug", "dose"],
  diagnostics: ["кт", "мрт", "узи", "анализ", "обслед", "биопс", "диагност", "кт", "мрт", "узд", "талдау", "ct", "mri", "ultrasound", "test", "diagnostic"],
  prep: ["подготов", "натощак", "дайын", "ашқарын", "prepare", "preparation"],
  documents: ["документ", "удостовер", "направлен", "құжат", "жолдама", "document", "referral"],
  routing: ["куда", "адрес", "регистрат", "запис", "телефон", "контакт", "режим", "қайда", "мекенжай", "жазыл", "байланыс", "appointment", "address", "contact", "phone"],
  redFlags: redFlagTerms,
  chemo: ["химиотерап", "химия", "chemotherapy", "chemo"],
  radiation: ["лучев", "сәуле", "radiation"],
  sideEffects: ["побоч", "тошнит", "рвота", "диарея", "понос", "сыпь", "зуд", "отек", "отёк", "утомля", "слабость", "лихорад", "сустав", "мышечн", "зрени", "кашель", "жанама", "құсу", "side effect", "nausea", "vomit", "rash", "diarrhea", "fatigue"]
};

// Карта соответствия «название препарата -> группа НЯ» (справочник НЯ таргетной и иммунотерапии НМРЛ, Часть 1).
// Используется AI-агентом, чтобы находить точную статью базы знаний, даже если формулировка вопроса не совпадает по словам,
// но пациент назвал свой препарат.
const drugGroupAliases = {
  "осимертиниб": "egfr", "гефитиниб": "egfr", "эрлотиниб": "egfr", "афатиниб": "egfr",
  "алектиниб": "alkRos1", "кризотиниб": "alkRos1", "церитиниб": "alkRos1", "лорлатиниб": "alkRos1", "энтректиниб": "alkRos1",
  "бевацизумаб": "vegf", "рамуцирумаб": "vegf",
  "дабрафениб": "brafMek", "энкорафениб": "brafMek", "бинимитиниб": "brafMek", "биниметиниб": "brafMek",
  "капматиниб": "metRetNtrkHer2", "селперкатиниб": "metRetNtrkHer2", "ларотректиниб": "metRetNtrkHer2",
  "трастузумаб дерукстекан": "metRetNtrkHer2", "трастузумаб-дерукстекан": "metRetNtrkHer2",
  "соторасиб": "kras",
  "пембролизумаб": "immuno", "ниволумаб": "immuno", "атезолизумаб": "immuno", "дурвалумаб": "immuno", "ипилимумаб": "immuno"
};

function detectDrugGroup(text) {
  const lower = repairText(text || "").toLowerCase();
  for (const [name, groupId] of Object.entries(drugGroupAliases)) {
    if (lower.includes(name)) return groupId;
  }
  return null;
}

const defaultKnowledge = [
  {
    id: "contacts-main",
    categoryId: "routing",
    statusId: "published",
    source: "KazNIIOiR contact information",
    url: "https://kaznior.kz",
    title: { ru: "Контакты и режим работы КазНИИОиР", kz: "ҚазҰОжРИ байланыстары және жұмыс уақыты", en: "KazNIIOiR contacts and working hours" },
    content: {
      ru: "Режим работы: понедельник - пятница, с 08:30 до 17:00. Адрес: г. Алматы, Алмалинский район, ул. Абая 91. Email: kazior@onco.kz. Общая информация: 8 (727) 292-04-47, 8 (727) 292-18-04, 8 (727) 292-00-61, 8 (727) 292-99-20.",
      kz: "Жұмыс уақыты: дүйсенбі - жұма, 08:30-дан 17:00-ге дейін. Мекенжай: Алматы қ., Алмалы ауданы, Абай к-сі 91. Email: kazior@onco.kz. Жалпы ақпарат: 8 (727) 292-04-47, 8 (727) 292-18-04, 8 (727) 292-00-61, 8 (727) 292-99-20.",
      en: "Working hours: Monday - Friday, 08:30 to 17:00. Address: 91 Abay St., Almaly district, Almaty. Email: kazior@onco.kz. General information: 8 (727) 292-04-47, 8 (727) 292-18-04, 8 (727) 292-00-61, 8 (727) 292-99-20."
    }
  },
  {
    id: "contacts-appointment",
    categoryId: "routing",
    statusId: "published",
    source: "KazNIIOiR contact information",
    url: "https://kaznior.kz",
    title: { ru: "Запись на прием и консультацию", kz: "Қабылдау және кеңеске жазылу", en: "Appointment and consultation booking" },
    content: {
      ru: "Для записи на прием к врачу и консультацию используйте телефон 8 (727) 310-90-23. Регистратура: +7 (747) 349-61-16, +7 (771) 216-17-48, +7 (727) 310-90-23.",
      kz: "Дәрігер қабылдауына және кеңеске жазылу үшін 8 (727) 310-90-23 нөміріне хабарласыңыз. Тіркеу бөлімі: +7 (747) 349-61-16, +7 (771) 216-17-48, +7 (727) 310-90-23.",
      en: "To book a doctor appointment or consultation, call 8 (727) 310-90-23. Registration desk: +7 (747) 349-61-16, +7 (771) 216-17-48, +7 (727) 310-90-23."
    }
  },
  {
    id: "contacts-diagnostics",
    categoryId: "diagnostics",
    statusId: "published",
    source: "KazNIIOiR contact information",
    url: "https://kaznior.kz",
    title: { ru: "Отделение диагностики", kz: "Диагностика бөлімі", en: "Diagnostics department" },
    content: {
      ru: "Отделение диагностики КТ, МРТ и УЗИ: WhatsApp 8-707-103-77-11. Перед обследованием уточните дату, время, подготовку, ограничения по еде и воде, а также необходимость взять предыдущие снимки и заключения.",
      kz: "КТ, МРТ және УДЗ диагностика бөлімі: WhatsApp 8-707-103-77-11. Тексеруге дейін күнін, уақытын, дайындықты, тамақ пен су бойынша шектеулерді және бұрынғы суреттер мен қорытындыларды алып келу қажеттігін нақтылаңыз.",
      en: "CT, MRI and ultrasound diagnostics department: WhatsApp 8-707-103-77-11. Before the exam, confirm the date, time, preparation rules, food and water restrictions, and whether previous images and reports are needed."
    }
  },
  {
    id: "contacts-emergency",
    categoryId: "redFlags",
    statusId: "published",
    source: "KazNIIOiR contact information",
    url: "https://kaznior.kz",
    title: { ru: "Приемный покой", kz: "Қабылдау бөлімі", en: "Emergency reception" },
    content: {
      ru: "Приемный покой: 8 (727) 292-90-63. При кровотечении, одышке, потере сознания, высокой температуре, сильной боли или резком ухудшении состояния необходимо срочно обратиться за медицинской помощью или вызвать скорую помощь.",
      kz: "Қабылдау бөлімі: 8 (727) 292-90-63. Қан кету, ентігу, есінен тану, жоғары температура, қатты ауырсыну немесе жағдайдың күрт нашарлауы кезінде шұғыл медициналық көмекке жүгіну немесе жедел жәрдем шақыру қажет.",
      en: "Emergency reception: 8 (727) 292-90-63. In case of bleeding, shortness of breath, loss of consciousness, high fever, severe pain, or sudden worsening, seek urgent medical help or call emergency services."
    }
  },
  {
    id: "documents",
    categoryId: "documents",
    statusId: "doctorChecked",
    source: "Internal knowledge base template",
    url: "",
    title: { ru: "Документы для первичного обращения", kz: "Алғашқы қабылдауға арналған құжаттар", en: "Documents for the first visit" },
    content: {
      ru: "Для первичного обращения обычно нужны удостоверение личности, направление или выписка от лечащего врача, результаты анализов и обследований, предыдущие заключения, список принимаемых препаратов. Точный перечень зависит от отделения и цели визита.",
      kz: "Алғашқы қабылдауға әдетте жеке куәлік, емдеуші дәрігердің жолдамасы немесе үзіндісі, талдау және тексеру нәтижелері, бұрынғы қорытындылар, қабылдап жүрген дәрілер тізімі қажет. Нақты тізім бөлімше мен келу мақсатына байланысты.",
      en: "For a first visit, patients usually need an ID document, referral or discharge summary from the treating doctor, test and exam results, previous reports, and a list of current medicines. The exact list depends on the department and visit purpose."
    }
  },
  {
    id: "meds",
    categoryId: "meds",
    statusId: "doctorChecked",
    source: "Internal knowledge base template",
    url: "",
    title: { ru: "Вопросы по лекарственным препаратам", kz: "Дәрілік препараттар бойынша сұрақтар", en: "Medicine questions" },
    content: {
      ru: "AI-агент может объяснить только общую информацию из утвержденной инструкции или назначения врача. Он не подбирает препарат, не меняет дозировку, не отменяет лечение и не оценивает совместимость без источника. При побочных эффектах или сомнениях обратитесь к врачу.",
      kz: "AI-агент тек бекітілген нұсқаулықтағы немесе дәрігер тағайындауындағы жалпы ақпаратты түсіндіре алады. Ол дәріні таңдамайды, дозаны өзгертпейді, емді тоқтатпайды және дереккөзсіз үйлесімділікті бағаламайды. Жанама әсерлер немесе күмән болса, дәрігерге жүгініңіз.",
      en: "The AI agent can explain only general information from an approved instruction or doctor prescription. It does not select medicines, change dosage, stop treatment, or assess compatibility without a source. Contact a doctor if side effects or doubts occur."
    }
  }
];

const faqKnowledge = [
  {
    id: "faq-consultation-booking",
    categoryId: "faq",
    statusId: "published",
    source: "FAQ КазНИИОиР",
    url: "https://kaznior.kz",
    title: { ru: "Как записаться на консультацию к врачу?" },
    content: { ru: "На консультацию к врачу можно записаться по телефону 8 (728) 310-90-23 или через WhatsApp: 8 (747) 349-61-16." }
  },
  {
    id: "faq-analysis-results",
    categoryId: "faq",
    statusId: "published",
    source: "FAQ КазНИИОиР",
    url: "https://kaznior.kz",
    title: { ru: "Как узнать результаты анализов?" },
    content: { ru: "Для получения информации по результатам анализов необходимо обратиться по телефонам 8 (727) 292-00-61 или 8 (727) 292-99-20. Внутренний номер лаборатории: 219." }
  },
  {
    id: "faq-ct-mri-ultrasound-booking",
    categoryId: "diagnostics",
    statusId: "published",
    source: "FAQ КазНИИОиР",
    url: "https://kaznior.kz",
    title: { ru: "Как записаться на УЗИ, КТ или МРТ?" },
    content: { ru: "Запись на УЗИ, КТ или МРТ осуществляется через WhatsApp: 8 (707) 103-77-11." }
  },
  {
    id: "faq-attachment",
    categoryId: "routing",
    statusId: "published",
    source: "FAQ КазНИИОиР",
    url: "https://kaznior.kz",
    title: { ru: "Как прикрепиться к КазНИИОиР?" },
    content: { ru: "Прикрепление населения к институту не осуществляется. Прикрепление производится по месту жительства через поликлиники." }
  },
  {
    id: "faq-oncology-registration",
    categoryId: "routing",
    statusId: "published",
    source: "FAQ КазНИИОиР",
    url: "https://kaznior.kz",
    title: { ru: "Как встать на онкологический учет?" },
    content: { ru: "КазНИИОиР не осуществляет постановку пациентов на онкологический учет. Постановка на учет проводится в региональных онкологических центрах и по месту жительства пациента." }
  },
  {
    id: "faq-other-city",
    categoryId: "routing",
    statusId: "published",
    source: "FAQ КазНИИОиР",
    url: "https://kaznior.kz",
    title: { ru: "Можно ли получить консультацию, если я из другого города?" },
    content: { ru: "Да. КазНИИОиР консультирует пациентов из всех регионов Казахстана, а также иностранных граждан." }
  },
  {
    id: "faq-free-consultation",
    categoryId: "routing",
    statusId: "published",
    source: "FAQ КазНИИОиР",
    url: "https://kaznior.kz",
    title: { ru: "Бесплатная ли консультация?" },
    content: { ru: "Консультация проводится бесплатно, если пациент состоит на онкологическом учете и имеется направление от медицинской организации." }
  },
  {
    id: "faq-osms",
    categoryId: "routing",
    statusId: "published",
    source: "FAQ КазНИИОиР",
    url: "https://kaznior.kz",
    title: { ru: "Принимаете ли по ОСМС?" },
    content: { ru: "Да. Для получения консультации по ОСМС необходимо направление от поликлиники по месту прикрепления." }
  },
  {
    id: "faq-paid-without-referral",
    categoryId: "routing",
    statusId: "published",
    source: "FAQ КазНИИОиР",
    url: "https://kaznior.kz",
    title: { ru: "Можно ли пройти консультацию без направления?" },
    content: { ru: "Да. При отсутствии направления пациент может получить консультацию на платной основе." }
  },
  {
    id: "faq-sick-leave",
    categoryId: "documents",
    statusId: "published",
    source: "FAQ КазНИИОиР",
    url: "https://kaznior.kz",
    title: { ru: "Можно ли получить больничный лист?" },
    content: { ru: "Нет. Институт не выдает лист временной нетрудоспособности. По результатам консультации может быть выдано медицинское заключение онколога." }
  },
  {
    id: "faq-hospitalization-info",
    categoryId: "documents",
    statusId: "published",
    source: "FAQ КазНИИОиР",
    url: "https://kaznior.kz",
    title: { ru: "Как узнать информацию по госпитализации?" },
    content: { ru: "Информацию по госпитализации можно получить через приемный покой института. Для актуальных номеров приемного покоя необходимо использовать отдельный справочник контактов." }
  },
  {
    id: "faq-free-visit-referral",
    categoryId: "routing",
    statusId: "published",
    source: "Порядок приема КазНИИОиР",
    url: "https://kaznior.kz",
    title: { ru: "Можно ли попасть на бесплатный прием без направления?" },
    content: { ru: "Нет. Бесплатный прием граждан Республики Казахстан осуществляется только при наличии направления от онколога или терапевта поликлиники по месту прикрепления." }
  },
  {
    id: "faq-green-corridor",
    categoryId: "routing",
    statusId: "published",
    source: "Порядок приема КазНИИОиР",
    url: "https://kaznior.kz",
    title: { ru: "Что такое Зеленый коридор?" },
    content: { ru: "Зеленый коридор предназначен для пациентов с подозрением на онкологическое заболевание или подтвержденным онкологическим диагнозом. Пациенты обслуживаются вне общей очереди. Максимальный срок обследования составляет 18 рабочих дней." }
  },
  {
    id: "faq-first-free-consult-documents",
    categoryId: "documents",
    statusId: "published",
    source: "Порядок приема КазНИИОиР",
    url: "https://kaznior.kz",
    title: { ru: "Какие документы нужны для первичной бесплатной консультации?" },
    content: { ru: "Необходимо иметь удостоверение личности, направление по форме №021/у, подробную выписку из амбулаторной карты, результаты предыдущих обследований, КТ, МРТ, УЗИ, ПЭТ-КТ при наличии." }
  },
  {
    id: "faq-planned-hospitalization",
    categoryId: "documents",
    statusId: "published",
    source: "Госпитализация КазНИИОиР",
    url: "https://kaznior.kz",
    title: { ru: "Как оформить плановую госпитализацию?" },
    content: { ru: "Госпитализация осуществляется через Портал Бюро госпитализации. Направление оформляет лечащий врач поликлиники или специалист КДЦ КазНИИОиР после осмотра пациента." }
  },
  {
    id: "faq-treatment-kazakhstan-free",
    categoryId: "faq",
    statusId: "published",
    source: "Госпитализация и лечение КазНИИОиР",
    url: "https://kaznior.kz",
    title: { ru: "Платное ли лечение для граждан Казахстана?" },
    content: { ru: "Нет. Лечение онкологических заболеваний для граждан Республики Казахстан и кандасов проводится бесплатно в рамках ГОБМП." }
  },
  {
    id: "faq-foreign-citizens",
    categoryId: "routing",
    statusId: "published",
    source: "Госпитализация и лечение КазНИИОиР",
    url: "https://kaznior.kz",
    title: { ru: "Принимает ли институт иностранных граждан?" },
    content: { ru: "Да. Иностранные граждане могут получить консультации, диагностику, хирургическое лечение, лучевую терапию и радиологическое лечение. Услуги оказываются на платной основе согласно утвержденному прейскуранту." }
  },
  {
    id: "faq-glass-block-review",
    categoryId: "diagnostics",
    statusId: "published",
    source: "Диагностика КазНИИОиР",
    url: "https://kaznior.kz",
    title: { ru: "Можно ли привезти стекла и блоки на пересмотр?" },
    content: { ru: "Да. Патоморфологическая лаборатория КазНИИОиР выполняет пересмотр гистологических стекол и парафиновых блоков. Услуга может быть оказана по направлению или на платной основе." }
  },
  {
    id: "faq-repeat-ct-mri",
    categoryId: "diagnostics",
    statusId: "published",
    source: "Диагностика КазНИИОиР",
    url: "https://kaznior.kz",
    title: { ru: "Нужно ли повторно проходить КТ или МРТ?" },
    content: { ru: "Не обязательно. Если исследования выполнены недавно и имеют надлежащее качество, специалисты института могут использовать их для пересмотра. Повторное обследование назначается только при необходимости." }
  },
  {
    id: "faq-residency",
    categoryId: "faq",
    statusId: "published",
    source: "Образование и наука КазНИИОиР",
    url: "https://kaznior.kz",
    title: { ru: "Как поступить в резидентуру КазНИИОиР?" },
    content: { ru: "Для поступления необходимо высшее медицинское образование, успешное прохождение конкурсного отбора и полный пакет документов." }
  },
  {
    id: "faq-open-days",
    categoryId: "faq",
    statusId: "published",
    source: "Образование и наука КазНИИОиР",
    url: "https://kaznior.kz",
    title: { ru: "Проводит ли институт Дни открытых дверей?" },
    content: { ru: "Да. КазНИИОиР регулярно проводит бесплатные профилактические осмотры населения для раннего выявления онкологических заболеваний. Информация публикуется на официальном сайте и в социальных сетях института." }
  },
  {
    id: "ai-agent-faq-rule",
    categoryId: "faq",
    statusId: "published",
    source: "Правило работы AI-агента КазНИИОиР",
    url: "",
    title: { ru: "Правило работы AI-агента с FAQ" },
    content: { ru: "Если вопрос пациента совпадает с одним из FAQ, агент отвечает автоматически. Если информации нет в базе знаний или вопрос связан с назначением лечения, изменением схемы терапии либо постановкой диагноза, обращение автоматически передается врачу." }
  },
  {
    id: "kb-recommended-sections",
    categoryId: "memos",
    statusId: "doctorChecked",
    source: "Структура базы знаний КазНИИОиР",
    url: "",
    title: { ru: "Рекомендуемые разделы для дальнейшего наполнения базы знаний" },
    content: { ru: "Рекомендуется дополнить базу знаний разделами: контакты всех отделений КазНИИОиР; расписание врачей; навигация по корпусам и кабинетам; памятки по химиотерапии; памятки по лучевой терапии; памятки после операций; частые побочные эффекты препаратов; справочник лекарств и их инструкций; экстренные ситуации и красные флаги для автоматического оповещения врача." }
  }
];

const patientAssistantKnowledge = [
  {
    id: "patient-ai-assistant",
    categoryId: "faq",
    statusId: "doctorChecked",
    source: "Приложение по НЯ технической задачи",
    url: "",
    title: { ru: "Как работает AI-помощник пациента?" },
    content: { ru: "AI-помощник работает в формате «вопрос — ответ»: пациент описывает симптом простыми словами, а система ищет проверенную информацию в базе знаний. Помощник объясняет общую информацию, выделяет опасные симптомы и при сомнении передаёт обращение врачу. Он не ставит диагноз, не назначает лечение, не меняет дозировку и не отменяет препарат." }
  },
  {
    id: "nsclc-medicine-groups",
    categoryId: "meds",
    statusId: "doctorChecked",
    source: "Препараты РЛ; справочник НЯ таргетной и иммунотерапии НМРЛ",
    url: "",
    title: { ru: "Какие группы препаратов применяются при НМРЛ?" },
    content: { ru: "В материалах базы знаний перечислены химиотерапевтические препараты, таргетные препараты и иммунотерапия. К таргетным группам относятся ингибиторы EGFR, ALK/ROS1, VEGF/VEGFR, BRAF/MEK, MET, RET, NTRK, HER2 и KRAS G12C. К иммунотерапии относятся пембролизумаб, ниволумаб, атезолизумаб, дурвалумаб и ипилимумаб. Конкретный препарат, сочетание и дозу определяет только лечащий врач по типу опухоли, стадии, мутациям и состоянию пациента." },
    keywords: "осимертиниб гефитиниб эрлотиниб афатиниб алектиниб кризотиниб церитиниб лорлатиниб энтректиниб бевацизумаб рамуцирумаб дабрафениб энкорафениб бинимитиниб капматиниб селперкатиниб ларотректиниб трастузумаб дерукстекан соторасиб пембролизумаб ниволумаб атезолизумаб дурвалумаб ипилимумаб"
  },
  {
    id: "egfr-side-effects",
    categoryId: "sideEffects",
    groupId: "egfr",
    statusId: "doctorChecked",
    source: "НЯ таргетной и иммунотерапии НМРЛ, CTCAE v5.0",
    url: "",
    title: { ru: "Побочные эффекты осимертиниба, гефитиниба, эрлотиниба и афатиниба" },
    content: { ru: "При терапии ингибиторами EGFR (осимертиниб, гефитиниб, эрлотиниб, афатиниб) могут встречаться сыпь, сухость кожи, диарея, воспаление слизистой рта, болезненность вокруг ногтей, тошнота и снижение аппетита. Срочно свяжитесь с врачом при новой одышке, сухом кашле с температурой, желтухе или тёмной моче, боли в груди, нарушении ритма либо выраженной диарее с признаками обезвоживания. Самостоятельно не отменяйте препарат и не меняйте дозу." },
    keywords: "осимертиниб гефитиниб эрлотиниб афатиниб egfr"
  },
  {
    id: "alk-ros1-side-effects",
    categoryId: "sideEffects",
    groupId: "alkRos1",
    statusId: "doctorChecked",
    source: "НЯ таргетной и иммунотерапии НМРЛ, CTCAE v5.0",
    url: "",
    title: { ru: "Побочные эффекты алектиниба, кризотиниба, церитиниба, лорлатиниба и энтректиниба" },
    content: { ru: "На фоне ингибиторов ALK/ROS1 (алектиниб, кризотиниб, церитиниб, лорлатиниб, энтректиниб) возможны отёки, тошнота, расстройства стула, замедление пульса, утомляемость, нарушения зрения и изменения печёночных показателей. Срочная консультация нужна при пульсе менее 50 в минуту с головокружением или обмороком, новой одышке и кашле, выраженных изменениях поведения или координации, а также при резком ухудшении зрения." },
    keywords: "алектиниб кризотиниб церитиниб лорлатиниб энтректиниб alk ros1"
  },
  {
    id: "vegf-side-effects",
    categoryId: "sideEffects",
    groupId: "vegf",
    statusId: "doctorChecked",
    source: "НЯ таргетной и иммунотерапии НМРЛ, CTCAE v5.0",
    url: "",
    title: { ru: "Побочные эффекты бевацизумаба и рамуцирумаба" },
    content: { ru: "При антиангиогенной терапии (бевацизумаб, рамуцирумаб) могут возникать повышение давления, белок в моче, носовые кровотечения, слабость и замедленное заживление ран. Срочно обращайтесь за помощью при давлении выше 180/110 с сильной головной болью или нарушением зрения, кровохарканье или массивном кровотечении, острой боли в животе, односторонней боли, покраснении и отёке ноги." },
    keywords: "бевацизумаб рамуцирумаб vegf"
  },
  {
    id: "braf-mek-side-effects",
    categoryId: "sideEffects",
    groupId: "brafMek",
    statusId: "doctorChecked",
    source: "НЯ таргетной и иммунотерапии НМРЛ, CTCAE v5.0",
    url: "",
    title: { ru: "Побочные эффекты дабрафениба, энкорафениба и бинимитиниба" },
    content: { ru: "При терапии BRAF/MEK (дабрафениб, энкорафениб, бинимитиниб) возможны температура, слабость, тошнота, мышечные и суставные боли, сыпь и нарушения зрения. Срочно сообщите врачу о температуре выше 38,5 °C с ознобом, которая не снижается, о резком снижении зрения или появлении пятен перед глазами, а также об одышке и нарастающих отёках." },
    keywords: "дабрафениб энкорафениб бинимитиниб биниметиниб braf mek"
  },
  {
    id: "met-ret-ntrk-her2-side-effects",
    categoryId: "sideEffects",
    groupId: "metRetNtrkHer2",
    statusId: "doctorChecked",
    source: "НЯ таргетной и иммунотерапии НМРЛ, CTCAE v5.0",
    url: "",
    title: { ru: "Побочные эффекты капматиниба, селперкатиниба, ларотректиниба, энтректиниба и трастузумаба дерукстекана" },
    content: { ru: "При терапии ингибиторами MET/RET/NTRK/HER2 (капматиниб, селперкатиниб, ларотректиниб, энтректиниб, трастузумаб дерукстекан) возможны тошнота, диарея, отёки, утомляемость, повышение печёночных показателей, головокружение и нарушение координации. Срочно свяжитесь с врачом при новой одышке и сухом кашле (особенно на трастузумабе дерукстекане — риск выше), желтухе или тёмной моче, выраженном нарушении координации или треморе. Такие симптомы требуют оценки специалиста." },
    keywords: "капматиниб селперкатиниб ларотректиниб трастузумаб дерукстекан met ret ntrk her2"
  },
  {
    id: "kras-side-effects",
    categoryId: "sideEffects",
    groupId: "kras",
    statusId: "doctorChecked",
    source: "НЯ таргетной и иммунотерапии НМРЛ, CTCAE v5.0",
    url: "",
    title: { ru: "Побочные эффекты соторасиба (KRAS G12C)" },
    content: { ru: "При терапии соторасибом (ингибитор KRAS G12C) возможны диарея, тошнота, повышение печёночных показателей, утомляемость, боли в мышцах и суставах. Срочно свяжитесь с врачом при желтухе или тёмной моче (признаки поражения печени), а также при новой одышке или кашле без признаков инфекции." },
    keywords: "соторасиб kras g12c"
  },
  {
    id: "immunotherapy-side-effects",
    categoryId: "sideEffects",
    groupId: "immuno",
    statusId: "doctorChecked",
    source: "НЯ таргетной и иммунотерапии НМРЛ, CTCAE v5.0",
    url: "",
    title: { ru: "Побочные эффекты пембролизумаба, ниволумаба, атезолизумаба, дурвалумаба и ипилимумаба — что отслеживать при иммунотерапии" },
    content: { ru: "При иммунотерапии (пембролизумаб, ниволумаб, атезолизумаб, дурвалумаб, ипилимумаб) могут появляться слабость, сыпь и зуд, диарея, кашель или одышка, снижение аппетита, боли в мышцах и суставах, отёки и чувство холода. Иммунные нежелательные явления иногда возникают спустя месяцы после начала лечения и даже после его завершения. Срочно обратитесь к врачу при одышке в покое, снижении сатурации, диарее более 6 раз в сутки или крови в стуле, желтухе, резкой слабости с низким давлением, сильной головной боли с нарушением зрения, нарушении глотания, боли в груди или сердцебиении." },
    keywords: "пембролизумаб ниволумаб атезолизумаб дурвалумаб ипилимумаб иммунотерапия"
  },
  {
    id: "patient-language-glossary",
    categoryId: "sideEffects",
    statusId: "doctorChecked",
    source: "НЯ таргетной и иммунотерапии НМРЛ, раздел 4.3",
    url: "",
    title: { ru: "Медицинские термины простым языком: паронихия, пневмонит, гипотиреоз, ИБЛ" },
    content: { ru: "Иногда врач или выписка используют медицинские термины. Вот их простое объяснение: «паронихия» — болезненность и покраснение вокруг ногтей; «пневмонит» / «интерстициальная болезнь лёгких (ИБЛ)» — одышка и сухой кашель, которых раньше не было; «гипотиреоз» — постоянная усталость, отёки и чувство холода (может быть следствием иммунотерапии); «колит» — воспаление кишечника, проявляется частым жидким стулом, иногда с кровью и болью в животе; «гепатит» (иммунный) — воспаление печени, проявляется желтухой, тёмной мочой, слабостью; «нейропатия» — онемение, покалывание или слабость в руках и ногах. Если вы заметили любой из этих симптомов — опишите его AI-помощнику простыми словами, без необходимости знать точный медицинский термин." },
    keywords: "паронихия пневмонит гипотиреоз ибл интерстициальная болезнь легких колит гепатит нейропатия термин глоссарий словами"
  },
  {
    id: "symptom-report-template",
    categoryId: "memos",
    statusId: "doctorChecked",
    source: "Приложение по НЯ технической задачи",
    url: "",
    title: { ru: "Как правильно описать симптом AI-помощнику?" },
    content: { ru: "Напишите: 1) название препарата, если знаете; 2) какой симптом появился; 3) когда он начался; 4) насколько выражен; 5) температура, давление, пульс или сатурация, если измеряли; 6) сколько раз повторялся симптом; 7) есть ли ухудшение. Не указывайте лишние персональные данные. При резком ухудшении не ждите ответа в чате — обратитесь за экстренной помощью." }
  }
];

const seedKnowledge = [...defaultKnowledge, ...faqKnowledge, ...patientAssistantKnowledge];

let state = loadState();
let currentLang = state.lang || "ru";
let currentMode = state.mode || "guest";
let activePatientId = state.activePatientId || null;
let activeStaffLogin = state.activeStaffLogin || null;
let activeConversationId = null;
let selectedDoctorPatientId = null;
let selectedAiConversationId = null;
let selectedStaffRole = "doctor";
let pendingAttachment = null;

const CP1251_SPECIAL_BYTES = new Map([
  [0x0402, 0x80], [0x0403, 0x81], [0x201A, 0x82], [0x0453, 0x83],
  [0x201E, 0x84], [0x2026, 0x85], [0x2020, 0x86], [0x2021, 0x87],
  [0x20AC, 0x88], [0x2030, 0x89], [0x0409, 0x8A], [0x2039, 0x8B],
  [0x040A, 0x8C], [0x040C, 0x8D], [0x040B, 0x8E], [0x040F, 0x8F],
  [0x0452, 0x90], [0x2018, 0x91], [0x2019, 0x92], [0x201C, 0x93],
  [0x201D, 0x94], [0x2022, 0x95], [0x2013, 0x96], [0x2014, 0x97],
  [0x2122, 0x99], [0x0459, 0x9A], [0x203A, 0x9B], [0x045A, 0x9C],
  [0x045C, 0x9D], [0x045B, 0x9E], [0x045F, 0x9F], [0x00A0, 0xA0],
  [0x040E, 0xA1], [0x045E, 0xA2], [0x0408, 0xA3], [0x00A4, 0xA4],
  [0x0490, 0xA5], [0x00A6, 0xA6], [0x00A7, 0xA7], [0x0401, 0xA8],
  [0x00A9, 0xA9], [0x0404, 0xAA], [0x00AB, 0xAB], [0x00AC, 0xAC],
  [0x00AD, 0xAD], [0x00AE, 0xAE], [0x0407, 0xAF], [0x00B0, 0xB0],
  [0x00B1, 0xB1], [0x0406, 0xB2], [0x0456, 0xB3], [0x0491, 0xB4],
  [0x00B5, 0xB5], [0x00B6, 0xB6], [0x00B7, 0xB7], [0x0451, 0xB8],
  [0x2116, 0xB9], [0x0454, 0xBA], [0x00BB, 0xBB], [0x0458, 0xBC],
  [0x0405, 0xBD], [0x0455, 0xBE], [0x0457, 0xBF]
]);

const MOJIBAKE_RE = /(?:[РСТУ][\u0080-\u00BFЀ-ӿ]|В[\u0080-\u00BF«»·]|в[\u0080-\u00BF†Њћ])/;

function repairText(value) {
  if (typeof value !== "string" || !MOJIBAKE_RE.test(value)) return value;
  const bytes = [];
  for (const char of value) {
    const code = char.charCodeAt(0);
    if (code < 0x80) {
      bytes.push(code);
    } else if (code >= 0x80 && code <= 0x9F) {
      bytes.push(code);
    } else if (code >= 0x0410 && code <= 0x044F) {
      bytes.push(code - 0x0410 + 0xC0);
    } else if (CP1251_SPECIAL_BYTES.has(code)) {
      bytes.push(CP1251_SPECIAL_BYTES.get(code));
    } else {
      return value;
    }
  }
  const decoded = new TextDecoder("utf-8", { fatal: false }).decode(new Uint8Array(bytes));
  return decoded.includes("\uFFFD") ? value : decoded;
}

function t(key) {
  return repairText(tr[currentLang][key] ?? tr.ru[key] ?? key);
}

function dictValue(value) {
  if (typeof value === "string") return repairText(value);
  return repairText(value?.[currentLang] || value?.ru || value?.en || "");
}

function categoryName(id) {
  const item = categoryDefs.find((category) => category.id === id);
  return repairText(item?.[currentLang] || item?.ru || id);
}

function statusName(id) {
  const item = statusDefs.find((status) => status.id === id);
  return repairText(item?.[currentLang] || item?.ru || id);
}

function loadState() {
  OLD_KEYS.forEach((key) => localStorage.removeItem(key));
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) return normalizeState(JSON.parse(saved));
  return {
    lang: "ru",
    mode: "guest",
    activePatientId: null,
    patients: [],
    knowledge: seedKnowledge,
    audit: [],
    settings: { chatGptEnabled: false },
    users: defaultUsers(),
    loginJournal: [],
    analytics: { aiAnswers: 0, redFlags: 0, escalations: 0, aiErrors: 0, helpfulRatings: 0, doctorActions: 0, adminActions: 0, categories: {} }
  };
}

function normalizeState(nextState) {
  nextState.audit ||= [];
  nextState.loginJournal ||= [];
  nextState.settings ||= { chatGptEnabled: false };
  nextState.knowledge ||= [];
  const knownIds = new Set(nextState.knowledge.map((item) => item.id));
  seedKnowledge.forEach((item) => {
    if (!knownIds.has(item.id)) nextState.knowledge.push(item);
  });
  nextState.users ||= defaultUsers();
  const fallbackUsers = defaultUsers();
  fallbackUsers.forEach((fallback) => {
    if (!nextState.users.some((user) => user.login === fallback.login)) nextState.users.push(fallback);
  });
  nextState.users = nextState.users.map((user) => ({
    fullName: user.fullName || staffRoleDefs.find((role) => role.id === user.role)?.defaultName || user.login,
    login: user.login,
    role: user.role,
    blocked: Boolean(user.blocked),
    password: user.password || "ChangeMe123"
  }));
  nextState.patients ||= [];
  nextState.patients.forEach((patient) => {
    patient.documents ||= [];
    patient.documents = patient.documents.map((doc) => ({
      ...doc,
      previewable: doc.previewable ?? Boolean(doc.dataUrl && String(doc.type || "").startsWith("image/"))
    }));
    patient.conversations ||= [];
    patient.conversations.forEach((conversation) => {
      conversation.unreadForPatient ||= 0;
      conversation.staffComments ||= [];
      conversation.viewedByStaff ||= [];
      conversation.requiresAttention = conversation.requiresAttention ?? (conversation.messages || []).some((message) => message.urgencyKey === "urgent" || message.escalated);
      conversation.messages ||= [];
      conversation.messages.forEach((message) => {
        message.senderName ||= message.role === "patient" ? patient.fullName : message.role === "assistant" ? "KazONCO AI" : message.staffName || "Сотрудник КазНИИОиР";
        message.senderRole ||= message.role === "patient" ? "patient" : message.role === "assistant" ? "AI" : message.staffRole || "staff";
        message.readByPatient = message.readByPatient ?? message.role !== "staff";
        message.viewedByStaff = message.viewedByStaff ?? false;
        if (message.attachment) {
          message.attachment.previewable = message.attachment.previewable ?? Boolean(message.attachment.dataUrl && String(message.attachment.type || "").startsWith("image/"));
        }
      });
    });
  });
  nextState.analytics ||= {};
  nextState.analytics.categories ||= {};
  return nextState;
}

function defaultUsers() {
  return [
    { fullName: "Врач КазНИИОиР", login: "doctor", role: "doctor", blocked: false, password: "doctor123" },
    { fullName: "Администратор базы знаний", login: "admin", role: "admin", blocked: false, password: "admin123" },
    { fullName: "Директор КазНИИОиР", login: "director", role: "director", blocked: false, password: "director123" },
    { fullName: "Супер-администратор КазНИИОиР", login: "superadmin", role: "superadmin", blocked: false, password: "super123" }
  ];
}

function saveState() {
  state.lang = currentLang;
  state.mode = currentMode;
  state.activePatientId = activePatientId;
  state.activeStaffLogin = activeStaffLogin;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

async function sha256(value) {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest)).map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function validateStaffLogin(role, login, password, twoFactor) {
  const systemUser = state.users.find((user) => user.login === login);
  const account = demoUsers[role];
  const roleMatches = systemUser ? systemUser.role === role : account?.login === login;
  if (!roleMatches || systemUser?.blocked) return false;
  const storedPassword = systemUser?.password || account?.password;
  if (!storedPassword) return false;
  const expectedHash = await sha256(storedPassword);
  const actualHash = await sha256(password);
  if (expectedHash !== actualHash) return false;
  if (["admin", "director", "superadmin"].includes(role) && twoFactor !== (account?.twoFactor || "000000")) return false;
  return true;
}

async function authenticateStaffLogin(login, password, twoFactor) {
  const systemUser = state.users.find((user) => user.login === login);
  const account = Object.values(demoUsers).find((demoUser) => demoUser.login === login);
  const user = systemUser || (account ? { ...account, fullName: staffRoleDefs.find((role) => role.id === account.role)?.defaultName || login, blocked: false } : null);
  if (!user || user.blocked) return null;
  const actualHash = await sha256(password);
  const validPasswords = [...new Set([user.password, account?.password].filter(Boolean))];
  const passwordMatches = await Promise.all(validPasswords.map(async (storedPassword) => (await sha256(storedPassword)) === actualHash));
  if (!passwordMatches.some(Boolean)) return null;
  const expectedTwoFactor = demoUsers[user.role]?.twoFactor || "000000";
  const enteredTwoFactor = twoFactor || expectedTwoFactor;
  if (["admin", "director", "superadmin", "moderator", "itadmin"].includes(user.role) && enteredTwoFactor !== expectedTwoFactor) return null;
  return user;
}

function currentStaffUser() {
  return state.users.find((user) => user.login === activeStaffLogin) || null;
}

function roleName(role) {
  return t(staffRoleDefs.find((item) => item.id === role)?.labelKey || role);
}

function currentUserLabel() {
  const staff = currentStaffUser();
  if (staff) return `${staff.fullName} (${staff.login})`;
  if (currentMode === "doctor") return t("doctorMode");
  if (currentMode === "admin") return t("adminMode");
  if (currentMode === "moderator") return roleName("moderator");
  if (currentMode === "itadmin") return roleName("itadmin");
  if (currentMode === "director") return t("directorMode");
  if (currentMode === "superadmin") return t("superAdminMode");
  return currentPatient()?.fullName || t("patientNotSelected");
}

function logAudit(typeKey, material, details = "") {
  state.audit.unshift({
    id: crypto.randomUUID(),
    user: currentUserLabel(),
    mode: currentMode,
    date: nowIso(),
    typeKey,
    material: material || "-",
    details
  });
}

function resetAutoLogoutTimer() {
  clearTimeout(autoLogoutTimer);
  if (currentMode === "guest") return;
  autoLogoutTimer = setTimeout(() => {
    logAudit("auditLogin", currentUserLabel(), "auto logout");
    currentMode = "guest";
    activePatientId = null;
    activeStaffLogin = null;
    activeConversationId = null;
    saveState();
    render();
  }, AUTO_LOGOUT_MS);
}

function byId(id) {
  return document.getElementById(id);
}

function escapeHtml(value) {
  return String(repairText(value) ?? "").replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[char]);
}

function nowIso() {
  return new Date().toISOString();
}

function formatDate(value) {
  if (!value) return "-";
  return new Date(value).toLocaleString(currentLang === "en" ? "en-US" : currentLang === "kz" ? "kk-KZ" : "ru-RU", { dateStyle: "short", timeStyle: "short" });
}

function currentPatient() {
  return state.patients.find((patient) => patient.id === activePatientId) || null;
}

function patientConversations(patient = currentPatient()) {
  return patient?.conversations || [];
}

function activeConversation() {
  return patientConversations().find((conversation) => conversation.id === activeConversationId) || null;
}

function localizePage() {
  document.documentElement.lang = currentLang === "kz" ? "kk" : currentLang;
  document.querySelectorAll("[data-i18n]").forEach((node) => node.textContent = t(node.dataset.i18n));
  document.querySelectorAll("[data-i18n-placeholder]").forEach((node) => node.placeholder = t(node.dataset.i18nPlaceholder));
  document.querySelectorAll("[data-i18n-title]").forEach((node) => node.title = t(node.dataset.i18nTitle));
  byId("quick-login-button").textContent = t("enter");
  document.querySelectorAll("[data-language-switch]").forEach((container) => {
    container.innerHTML = languages.map((lang) => `<button class="lang-pill ${lang === currentLang ? "active" : ""}" data-lang="${lang}" type="button">${lang.toUpperCase()}</button>`).join("");
  });
  byId("roles-list").innerHTML = t("roles").map((role) => `<li>${escapeHtml(role)}</li>`).join("");
  populateAdminSelects();
  updateStaffLoginPanel();
  renderViewTitle();
}

function updateStaffLoginPanel() {
  const panel = byId("staff-login-form");
  if (!panel) return;
  const titleKey = selectedStaffRole === "doctor" ? "doctorLogin" : selectedStaffRole === "admin" ? "adminLoginTitle" : selectedStaffRole === "director" ? "directorLogin" : "superAdminLogin";
  const hintKey = selectedStaffRole === "doctor" ? "authHintDoctor" : selectedStaffRole === "admin" ? "authHintAdmin" : selectedStaffRole === "director" ? "authHintDirector" : "authHintSuper";
  byId("staff-login-title").textContent = t(titleKey);
  byId("staff-login-hint").textContent = t(hintKey);
  panel.twoFactor.closest("label").classList.remove("hidden");
}

function populateAdminSelects() {
  const categorySelect = byId("kb-category-select");
  const statusSelect = byId("kb-status-select");
  const roleSelect = byId("user-role-select");
  if (categorySelect) categorySelect.innerHTML = categoryDefs.map((category) => `<option value="${category.id}">${escapeHtml(categoryName(category.id))}</option>`).join("");
  if (statusSelect) statusSelect.innerHTML = statusDefs.map((status) => `<option value="${status.id}">${escapeHtml(statusName(status.id))}</option>`).join("");
  if (roleSelect) roleSelect.innerHTML = staffRoleDefs.map((role) => `<option value="${role.id}">${roleName(role.id)}</option>`).join("");
}

function setLanguage(lang) {
  currentLang = lang;
  saveState();
  localizePage();
  render();
}

function setActiveView(view) {
  document.querySelectorAll(".nav-item").forEach((item) => item.classList.toggle("active", item.dataset.view === view));
  document.querySelectorAll(".view").forEach((item) => item.classList.toggle("active", item.id === view));
  closeMobilePanels();
  renderViewTitle();
}

function renderViewTitle() {
  const active = document.querySelector(".nav-item.active span:last-child");
  byId("view-title").textContent = active?.textContent || t("navChat");
}

function applyModeVisibility() {
  const isDoctor = currentMode === "doctor";
  const isAdmin = currentMode === "admin";
  const isModerator = currentMode === "moderator";
  const isItAdmin = currentMode === "itadmin";
  const isDirector = currentMode === "director";
  const isSuper = currentMode === "superadmin";
  document.querySelectorAll("[data-role-view]").forEach((item) => {
    const roleView = item.dataset.roleView;
    const visible =
      roleView === "all" ||
      (currentMode === "patient" && roleView === "patient") ||
      (isDoctor && roleView === "staff") ||
      (isDoctor && roleView === "consultations") ||
      (isAdmin && ["admin", "staff", "audit", "consultations"].includes(roleView)) ||
      (isModerator && ["admin", "audit", "consultations"].includes(roleView)) ||
      (isItAdmin && ["audit", "super"].includes(roleView)) ||
      (isDirector && ["director", "staff", "audit", "admin", "consultations"].includes(roleView)) ||
      (isSuper && ["admin", "staff", "audit", "super", "director", "consultations"].includes(roleView));
    item.classList.toggle("hidden", !visible);
  });
  const active = document.querySelector(".view.active")?.id;
  if (currentMode === "patient" && !["chat", "patient", "safety"].includes(active)) setActiveView("chat");
  if (isDoctor && !["doctor", "consultations", "safety"].includes(active)) setActiveView("doctor");
  if (isAdmin && !["admin", "doctor", "consultations", "analytics", "audit", "safety"].includes(active)) setActiveView("admin");
  if (isModerator && !["admin", "consultations", "audit", "safety"].includes(active)) setActiveView("admin");
  if (isItAdmin && !["system", "audit", "safety"].includes(active)) setActiveView("system");
  if (isDirector && !["director", "doctor", "consultations", "analytics", "audit", "safety"].includes(active)) setActiveView("director");
  if (isSuper && !["admin", "doctor", "consultations", "analytics", "audit", "system", "director", "safety"].includes(active)) setActiveView("system");
}

function renderSession() {
  const loggedIn = ["doctor", "admin", "moderator", "itadmin", "director", "superadmin"].includes(currentMode) || Boolean(currentPatient());
  byId("login-screen").classList.toggle("hidden", loggedIn);
  byId("app").classList.toggle("hidden", !loggedIn);
  applyModeVisibility();
  const staff = currentStaffUser();
  byId("profile-button").classList.toggle("hidden", !staff);
  byId("current-user-pill").innerHTML = staff
    ? `<strong>${escapeHtml(staff.fullName)}</strong><span>${t("roleLabel")}: ${roleName(staff.role)} · ${t("loginLabel")}: ${escapeHtml(staff.login)}</span>`
    : escapeHtml(currentUserLabel());

  const mobileAvatar = byId("mobile-user-avatar");
  const mobileLanguage = byId("mobile-language-button");
  const mobileHistory = byId("mobile-history-button");
  if (mobileAvatar) {
    const label = currentUserLabel().trim();
    mobileAvatar.textContent = (label[0] || "П").toUpperCase();
    mobileAvatar.title = label;
  }
  if (mobileLanguage) {
    mobileLanguage.textContent = "🌐";
    mobileLanguage.title = currentLang.toUpperCase();
  }
  if (mobileHistory) mobileHistory.classList.toggle("hidden", currentMode !== "patient");
  const profileName = byId("mobile-profile-name");
  const profileRole = byId("mobile-profile-role");
  if (profileName) profileName.textContent = currentUserLabel();
  if (profileRole) profileRole.textContent = currentMode === "patient" ? t("patientProfileLabel") : (staff ? roleName(staff.role) : t("profileButton"));
}

function findOrCreatePatient(fullName, iin) {
  const normalizedName = fullName.trim().toLowerCase();
  const normalizedIin = iin.trim();
  let patient = state.patients.find((item) => (normalizedIin && item.iin === normalizedIin) || item.fullName.toLowerCase() === normalizedName);
  if (!patient) {
    patient = {
      id: crypto.randomUUID(),
      fullName: fullName.trim(),
      iin: normalizedIin,
      firstVisit: nowIso(),
      lastVisit: nowIso(),
      statusKey: "activeRequest",
      doctorKey: "doctorNotAssigned",
      doctorComments: [],
      complaints: [],
      symptoms: [],
      redFlags: [],
      documents: [],
      conversations: [],
      profile: { region: "", gender: "", age: "", diagnosis: "", stage: "" }
    };
    state.patients.unshift(patient);
  } else {
    patient.lastVisit = nowIso();
  }
  currentMode = "patient";
  activePatientId = patient.id;
  activeStaffLogin = null;
  selectedDoctorPatientId = patient.id;
  activeConversationId = patient.conversations[0]?.id || null;
  logAudit("auditLogin", patient.fullName, "patient");
  saveState();
  setActiveView("chat");
}

function classifyQuestion(text) {
  const lower = repairText(text).toLowerCase();
  let best = "faq";
  let score = 0;
  Object.entries(categoryKeywords).forEach(([categoryId, words]) => {
    const hits = words.filter((word) => lower.includes(repairText(word).toLowerCase())).length;
    if (hits > score) {
      best = categoryId;
      score = hits;
    }
  });
  return best;
}

function hasRedFlag(text) {
  const lower = repairText(text).toLowerCase();
  return redFlagTerms.some((term) => lower.includes(repairText(term).toLowerCase()));
}

function requestsTreatmentDecision(text) {
  const lower = repairText(text).toLowerCase();
  return [
    "назначь", "назначить", "какой препарат принимать", "какую дозу", "дозировка для меня",
    "увеличить дозу", "уменьшить дозу", "отменить препарат", "прекратить лечение",
    "заменить препарат", "поменять препарат", "сменить препарат", "сменить лечение", "сменить схему",
    "схема лечения для меня", "что мне принимать", "можно ли мне пропустить", "пропустить приём", "пропустить прием"
  ].some((term) => lower.includes(term));
}

function publishedKnowledge() {
  return state.knowledge.filter((item) => allowedStatusIds.includes(item.statusId));
}

const searchStopwords = new Set([
  "что", "как", "для", "при", "все", "это", "или", "вот", "там", "тут", "уже", "еще", "ещё",
  "если", "чтобы", "него", "нее", "неё", "них", "был", "была", "было", "есть", "нет", "мне",
  "меня", "вас", "вам", "они", "она", "оно", "кто", "где", "чем", "чём", "тем", "том", "той",
  "мой", "моя", "мои", "моё", "мое", "его", "как", "она", "они", "тот", "эта", "эти", "который",
  "могу", "может", "можно", "нужно", "надо", "буду", "была", "были", "себя", "свой", "своя",
  "такое", "такой", "такая", "такие", "какой", "какая", "какое", "какие", "подскажите", "скажите", "расскажите"
]);

function findKnowledge(text, categoryId) {
  const words = repairText(text).toLowerCase().split(/[^\p{L}\p{N}]+/u).filter((word) => word.length > 3 && !searchStopwords.has(word));
  const drugGroupId = detectDrugGroup(text);
  const scored = publishedKnowledge().map((item) => {
    const haystack = `${dictValue(item.title)} ${categoryName(item.categoryId)} ${dictValue(item.content)} ${item.source} ${item.keywords || ""}`.toLowerCase();
    const hits = words.filter((word) => haystack.includes(word)).length;
    // Бонус за совпадение категории (например, "sideEffects") и за точное совпадение группы препарата
    // (например, пациент назвал "осимертиниб" -> сразу находим статью группы EGFR, даже если остальные слова вопроса не совпали).
    // Бонус за категорию учитывается только если есть хотя бы одно реальное совпадение слов —
    // иначе общие статьи категории "faq" необоснованно перебивали бы более релевantные, но короткие статьи.
    const categoryBonus = hits > 0 && item.categoryId === categoryId ? 2 : 0;
    const drugGroupBonus = drugGroupId && item.groupId === drugGroupId ? 6 : 0;
    return { item, score: hits + categoryBonus + drugGroupBonus };
  }).sort((a, b) => b.score - a.score);
  return scored[0]?.score > 0 ? scored[0].item : null;
}

function bumpCategory(categoryId) {
  state.analytics.categories[categoryId] = (state.analytics.categories[categoryId] || 0) + 1;
}

function buildAttachmentAnalysis(attachment) {
  if (!attachment) return "";
  if (attachment.type?.startsWith("image/")) return `${t("attachmentAnalyzed")}: ${t("imageSafetyAnalysis")}`;
  const textNote = attachment.extractedText ? ` ${t("textDocumentExtracted")}` : "";
  return `${t("attachmentAnalyzed")}: ${t("documentSafetyAnalysis")}${textNote}`;
}

function buildAnswer(question, attachment = null) {
  const categoryId = classifyQuestion(question);
  bumpCategory(categoryId);
  const attachmentAnalysis = buildAttachmentAnalysis(attachment);
  if (hasRedFlag(question)) {
    state.analytics.redFlags += 1;
    state.analytics.escalations += 1;
    return { categoryId, urgencyKey: "urgent", escalated: true, source: categoryName("redFlags"), text: [attachmentAnalysis, t("urgentAnswer")].filter(Boolean).join("\n\n") };
  }
  if (requestsTreatmentDecision(question)) {
    state.analytics.escalations += 1;
    return {
      categoryId: "meds",
      urgencyKey: "escalated",
      escalated: true,
      source: "Правило безопасности AI-помощника",
      text: [attachmentAnalysis, "Я не могу назначать или отменять препараты, подбирать схему и менять дозировку. Эти решения принимает только лечащий врач с учётом диагноза, анализов и вашего состояния. Я передал вопрос специалисту. Если после лечения состояние резко ухудшилось, обратитесь за срочной медицинской помощью."].filter(Boolean).join("\n\n")
    };
  }
  const searchText = `${question} ${attachment?.extractedText || ""}`;
  const knowledge = findKnowledge(searchText, categoryId);
  if (!knowledge) {
    state.analytics.escalations += 1;
    state.analytics.aiErrors += 1;
    return { categoryId, urgencyKey: "escalated", escalated: true, source: t("sourceLabel"), text: [attachmentAnalysis, t("noApprovedInfo")].filter(Boolean).join("\n\n") };
  }
  state.analytics.aiAnswers += 1;
  return {
    categoryId,
    urgencyKey: "usual",
    escalated: false,
    source: `${knowledge.source}${knowledge.url ? `, ${knowledge.url}` : ""}`,
    text: [attachmentAnalysis, `${dictValue(knowledge.content)}\n\n${t("importantPrefix")}: ${t("safetyDisclaimer")}`].filter(Boolean).join("\n\n")
  };
}

function createConversation(firstMessage = "") {
  const patient = currentPatient();
  if (!patient) return null;
  const conversation = { id: crypto.randomUUID(), title: firstMessage ? firstMessage.slice(0, 48) : t("newChat").replace("+ ", ""), createdAt: nowIso(), statusKey: "open", messages: [] };
  patient.conversations.unshift(conversation);
  activeConversationId = conversation.id;
  patient.lastVisit = nowIso();
  saveState();
  return conversation;
}

function sendMessage(text, attachment = null) {
  const patient = currentPatient();
  const trimmed = text.trim();
  if (!patient || (!trimmed && !attachment)) return;
  const patientText = trimmed || `${t("attachmentReady")}: ${attachment.name}`;
  const conversation = activeConversation() || createConversation(trimmed);
  if (conversation.messages.length === 0) conversation.title = patientText.slice(0, 48);
  conversation.messages.push({ id: crypto.randomUUID(), role: "patient", senderName: patient.fullName, senderRole: "patient", text: patientText, attachment, createdAt: nowIso(), readByPatient: true, viewedByStaff: false });
  const answer = buildAnswer(patientText, attachment);
  conversation.messages.push({ id: crypto.randomUUID(), role: "assistant", senderName: "KazONCO AI", senderRole: "AI", ...answer, createdAt: nowIso(), readByPatient: true, viewedByStaff: false });
  patient.lastVisit = nowIso();
  patient.complaints.push(patientText);
  if (attachment) patient.documents.unshift({ id: attachment.id, name: attachment.name, type: attachment.type || "document", size: attachment.size, uploadedAt: nowIso(), dataUrl: attachment.dataUrl, previewable: attachment.previewable });
  if (answer.categoryId === "redFlags") patient.symptoms.push(trimmed);
  if (answer.escalated) {
    conversation.statusKey = "escalated";
    conversation.requiresAttention = true;
    patient.statusKey = answer.urgencyKey;
  }
  if (answer.urgencyKey === "urgent") patient.redFlags.push(trimmed);
  saveState();
  render();
}

function addPatientDocument(file) {
  const patient = currentPatient();
  if (!patient || !file) return;
  patient.documents.unshift({ id: crypto.randomUUID(), name: file.name, type: file.type || "document", size: file.size, uploadedAt: nowIso() });
  patient.lastVisit = nowIso();
  saveState();
  render();
}

function formatFileSize(bytes) {
  if (!bytes) return "0 KB";
  if (bytes < 1024 * 1024) return `${Math.ceil(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function readFileAsText(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || "").slice(0, 6000));
    reader.onerror = () => resolve("");
    reader.readAsText(file, "utf-8");
  });
}

async function prepareAttachment(file) {
  if (!file) return null;
  const isImage = file.type.startsWith("image/");
  const isText = /\.(txt|md|csv)$/i.test(file.name) || file.type.startsWith("text/");
  return {
    id: crypto.randomUUID(),
    name: file.name,
    type: file.type || "document",
    size: file.size,
    dataUrl: await readFileAsDataUrl(file),
    previewable: isImage,
    extractedText: isText ? await readFileAsText(file) : ""
  };
}

function renderFileActions(file) {
  if (!file?.dataUrl) return "";
  return `<div class="file-actions">
    <button class="small-action" type="button" data-open-file="${file.id}">${t("openFile")}</button>
    <button class="small-action" type="button" data-download-file="${file.id}">${t("downloadFile")}</button>
  </div>`;
}

function allPatientFiles() {
  const docs = state.patients.flatMap((patient) => patient.documents || []);
  const attachments = state.patients.flatMap((patient) =>
    (patient.conversations || []).flatMap((conversation) =>
      (conversation.messages || []).map((message) => message.attachment).filter(Boolean)
    )
  );
  return [...docs, ...attachments];
}

function findPatientFile(id) {
  return allPatientFiles().find((file) => file.id === id);
}

function openPatientFile(id) {
  const file = findPatientFile(id);
  if (!file?.dataUrl) return;
  const opened = window.open();
  if (opened) {
    opened.document.write(file.previewable ? `<img src="${file.dataUrl}" style="max-width:100%;height:auto">` : `<iframe src="${file.dataUrl}" style="border:0;width:100%;height:100vh"></iframe>`);
    opened.document.title = file.name;
    opened.document.close();
  }
}

function downloadPatientFile(id) {
  const file = findPatientFile(id);
  if (!file?.dataUrl) return;
  const link = document.createElement("a");
  link.href = file.dataUrl;
  link.download = file.name || "kazniior-file";
  link.click();
}

function renderAttachmentPreview() {
  const preview = byId("attachment-preview");
  if (!preview) return;
  if (!pendingAttachment) {
    preview.classList.add("hidden");
    preview.innerHTML = "";
    return;
  }
  const thumb = pendingAttachment.previewable ? `<img src="${pendingAttachment.dataUrl}" alt="">` : `<span class="file-thumb">DOC</span>`;
  preview.classList.remove("hidden");
  preview.innerHTML = `
    <div class="attachment-preview-info">
      ${thumb}
      <div>
        <strong>${escapeHtml(pendingAttachment.name)}</strong>
        <span>${escapeHtml(pendingAttachment.type || "document")} · ${formatFileSize(pendingAttachment.size)}</span>
      </div>
    </div>
    <button id="remove-attachment" class="secondary-button" type="button">${t("removeAttachment")}</button>
  `;
}

function renderConversations() {
  const query = byId("chat-search").value?.toLowerCase() || "";
  byId("conversation-list").innerHTML = patientConversations()
    .filter((conversation) => conversation.title.toLowerCase().includes(query))
    .map((conversation) => {
      const last = conversation.messages.at(-1);
      const urgent = conversation.messages.some((message) => message.urgencyKey === "urgent") ? "urgent" : "";
      const active = conversation.id === activeConversationId ? "active" : "";
      const unread = conversation.unreadForPatient ? ` · ${t("unreadMessages")}: ${conversation.unreadForPatient}` : "";
      return `<button class="conversation ${active} ${urgent}" data-conversation-id="${conversation.id}">
        <strong>${escapeHtml(conversation.title)}</strong>
        <span>${t(conversation.statusKey)} · ${last?.categoryId ? categoryName(last.categoryId) : t("open")}${unread}</span>
      </button>`;
    }).join("");
}

function renderMessages() {
  const conversation = activeConversation();
  const empty = byId("empty-chat");
  const messages = byId("messages");
  if (!conversation || conversation.messages.length === 0) {
    empty.style.display = "grid";
    messages.innerHTML = "";
    return;
  }
  if (currentMode === "patient" && conversation.unreadForPatient) {
    conversation.messages.forEach((message) => {
      if (message.role === "staff") message.readByPatient = true;
    });
    conversation.unreadForPatient = 0;
    saveState();
    renderConversations();
  }
  empty.style.display = "none";
  messages.innerHTML = conversation.messages.map((message) => {
    const attachment = message.attachment ? renderMessageAttachment(message.attachment, message.role) : "";
    const status = message.role === "assistant" ? `<span>${t("responseStatus")}: ${t(message.urgencyKey)}</span>` : `<span>${formatDate(message.createdAt)}</span>`;
    const sender = `<div class="message-sender"><strong>${escapeHtml(message.senderName || (message.role === "patient" ? currentPatient()?.fullName : "KazONCO AI"))}</strong><span>${message.role === "staff" ? roleName(message.senderRole) : escapeHtml(message.senderRole || message.role)}</span></div>`;
    const warning = message.role === "assistant" && message.escalated ? `<div class="transfer-warning">${t("transferredWarning")}</div>` : "";
    const meta = message.role === "assistant"
      ? `<div class="knowledge-source-row"><span class="knowledge-source-badge">✓ ${t("knowledgeVerified")}</span><button type="button" class="source-button" data-source="${escapeHtml(message.source || "-")}">${t("showSource")}</button></div>
         <div class="message-meta"><span>${formatDate(message.createdAt)}</span><span>${categoryName(message.categoryId)}</span><span>${t("responseStatus")}: ${t(message.urgencyKey)}</span><span>${t("sourceLabel")}: ${escapeHtml(message.source)}</span></div>
         <div class="rating-row"><button data-rate="${message.id}" class="small-action">${t("useful")}</button><button data-rate="${message.id}" class="small-action">${t("needDoctor")}</button></div>`
      : `<div class="message-meta">${status}${message.role === "staff" ? `<span>${message.readByPatient ? t("readStatus") : t("unreadMessages")}</span>` : ""}</div>`;
    const logo = message.role === "assistant" ? `<img class="message-logo" src="${LOGO_PATH}" alt="Kazakh Oncology Institute">` : "";
    return `<article class="message ${message.role} ${message.escalated ? "escalated" : ""}">${logo}${sender}${attachment}<p>${escapeHtml(message.text).replace(/\n/g, "<br>")}</p>${warning}${meta}</article>`;
  }).join("");
  messages.scrollTop = messages.scrollHeight;
  updateScrollDownButton();
}

function renderMessageAttachment(attachment) {
  const thumb = attachment.previewable && attachment.dataUrl ? `<img src="${attachment.dataUrl}" alt="">` : `<span class="file-thumb">DOC</span>`;
  return `<div class="message-attachment">${thumb}<span>${escapeHtml(attachment.name)} · ${formatFileSize(attachment.size)}</span>${renderFileActions(attachment)}</div>`;
}

function renderPatientDocumentList(patient) {
  return patient.documents.map((doc) => `
    <article class="case-item">
      ${doc.previewable && doc.dataUrl ? `<img class="document-thumb" src="${doc.dataUrl}" alt="">` : ""}
      <strong>${escapeHtml(doc.name)}</strong>
      <span>${escapeHtml(doc.type)} - ${formatDate(doc.uploadedAt)} - ${formatFileSize(doc.size)}</span>
      ${renderFileActions(doc)}
    </article>
  `).join("") || emptyState(t("noDocuments"));
}

function ensurePatientProfile(patient) {
  if (!patient.profile) {
    patient.profile = { region: "", gender: "", age: "", diagnosis: "", stage: "" };
  }
  return patient.profile;
}

function renderProfileFormOptions() {
  const regionSelect = byId("profile-region");
  const stageSelect = byId("profile-stage");
  if (regionSelect && regionSelect.options.length <= 1) {
    kazakhstanRegions.forEach((region) => {
      const opt = document.createElement("option");
      opt.value = region;
      opt.textContent = region;
      regionSelect.appendChild(opt);
    });
  }
  if (stageSelect && stageSelect.options.length <= 1) {
    tumorStageOptions.forEach((stage) => {
      const opt = document.createElement("option");
      opt.value = stage;
      opt.textContent = stage;
      stageSelect.appendChild(opt);
    });
  }
}

function renderPatientProfileForm(patient) {
  renderProfileFormOptions();
  const profile = ensurePatientProfile(patient);
  const regionSelect = byId("profile-region");
  const genderSelect = byId("profile-gender");
  const ageInput = byId("profile-age");
  const diagnosisInput = byId("profile-diagnosis");
  const stageSelect = byId("profile-stage");
  if (regionSelect) regionSelect.value = profile.region || "";
  if (genderSelect) genderSelect.value = profile.gender || "";
  if (ageInput) ageInput.value = profile.age || "";
  if (diagnosisInput) diagnosisInput.value = profile.diagnosis || "";
  if (stageSelect) stageSelect.value = profile.stage || "";
}

function profileSummaryLine(patient) {
  const profile = ensurePatientProfile(patient);
  const parts = [];
  if (profile.region) parts.push(profile.region);
  if (profile.gender) parts.push(profile.gender === "male" ? t("genderMale") : profile.gender === "female" ? t("genderFemale") : "");
  if (profile.age) parts.push(`${profile.age}`);
  if (profile.diagnosis) parts.push(profile.diagnosis);
  if (profile.stage) parts.push(profile.stage);
  return parts.filter(Boolean).join(" · ") || t("profileNotFilled");
}

function renderPatientCabinet() {
  const patient = currentPatient();
  if (!patient) return;
  ensurePatientProfile(patient);
  byId("patient-name").textContent = patient.fullName;
  byId("patient-card").innerHTML = `
    <p><strong>${t("firstVisit")}:</strong> ${formatDate(patient.firstVisit)}</p>
    <p><strong>${t("lastVisit")}:</strong> ${formatDate(patient.lastVisit)}</p>
    <p><strong>${t("status")}:</strong> ${t(patient.statusKey)}</p>
    <p><strong>${t("redFlags")}:</strong> ${patient.redFlags.length}</p>
    <p><strong>${t("chatHistory")}:</strong> ${patient.conversations.length}</p>
    <p><strong>${t("medicalProfileTitle")}:</strong> ${escapeHtml(profileSummaryLine(patient))}</p>`;
  byId("my-doctor").innerHTML = `<p><strong>${t("doctor")}:</strong> ${t(patient.doctorKey || "doctorNotAssigned")}</p><p><strong>${t("requestStatus")}:</strong> ${t(patient.statusKey)}</p><p class="medical-note">${t("safetyDisclaimer")}</p>`;
  byId("patient-doc-count").textContent = patient.documents.length;
  byId("patient-documents").innerHTML = renderPatientDocumentList(patient);
  byId("patient-memos").innerHTML = publishedKnowledge().slice(0, 5).map(renderKbCard).join("");
  renderPatientProfileForm(patient);
}

function renderDoctorCabinet() {
  const query = byId("doctor-search").value?.toLowerCase() || "";
  const visiblePatients = currentMode === "doctor"
    ? state.patients.filter((patient) =>
        patient.doctorKey === "kazDoctor" ||
        patient.redFlags.length > 0 ||
        patient.conversations.some((conversation) => conversation.statusKey === "escalated")
      )
    : state.patients;
  const patients = visiblePatients.filter((patient) => `${patient.fullName} ${patient.iin}`.toLowerCase().includes(query));
  byId("doctor-patients").innerHTML = patients.map((patient) => `<button class="patient-row ${patient.id === selectedDoctorPatientId ? "active" : ""}" data-patient-id="${patient.id}"><strong>${escapeHtml(patient.fullName)}</strong><span>${patient.iin || t("iinNotProvided")} · ${t(patient.statusKey)}</span></button>`).join("") || emptyState(t("patientsNotFound"));
  const patient = patients.find((item) => item.id === selectedDoctorPatientId) || patients[0];
  if (!patient) {
    byId("doctor-alert-count").textContent = "0";
    byId("doctor-detail").innerHTML = emptyState(t("noPatients"));
    return;
  }
  selectedDoctorPatientId = patient.id;
  byId("doctor-alert-count").textContent = patient.redFlags.length;
  const cases = patient.conversations.flatMap((conversation) => conversation.messages.map((message) => ({ ...message, chatTitle: conversation.title, chatStatusKey: conversation.statusKey })));
  const unread = patient.conversations.reduce((sum, conversation) => sum + (conversation.unreadForPatient || 0), 0);
  byId("doctor-detail").innerHTML = `
    <div class="details-list">
      <p><strong>${t("fullNameLabel").replace(" *", "")}:</strong> ${escapeHtml(patient.fullName)}</p>
      <p><strong>${t("iinLabel")}:</strong> ${patient.iin || t("iinNotProvided")}</p>
      <p><strong>${t("medicalProfileTitle")}:</strong> ${escapeHtml(profileSummaryLine(patient))}</p>
      <p><strong>${t("documents")}:</strong> ${patient.documents.length}</p>
      <p><strong>${t("unreadMessages")}:</strong> ${unread}</p>
      <p><strong>${t("complaints")}:</strong> ${patient.complaints.slice(-3).map(escapeHtml).join("; ") || t("no")}</p>
      <p><strong>${t("doctorComment")}:</strong> ${patient.doctorComments.at(-1)?.text || t("no")}</p>
    </div>
    <div class="case-list">${renderPatientDocumentList(patient)}</div>
    <form id="staff-reply-form" class="staff-reply-form">
      <h4>${t("staffReplyTitle")}</h4>
      <textarea name="replyText" rows="3" placeholder="${t("staffReplyPlaceholder")}"></textarea>
      <label class="attach-inline">${t("attachStaffFile")}<input name="replyFile" type="file" accept=".jpg,.jpeg,.png,.webp,.pdf,.doc,.docx,.xls,.xlsx"></label>
      <div class="doctor-actions"><button class="primary-button" type="submit">${t("sendStaffReply")}</button><button class="secondary-button" type="button" data-doctor-action="transfer">${t("transferSpecialist")}</button></div>
    </form>
    <label class="doctor-comment">${t("doctorComment")}<textarea id="doctor-comment-text" rows="3" placeholder="${t("addDoctorNote")}"></textarea></label>
    <button class="secondary-button" data-doctor-action="comment">${t("saveComment")}</button>
    <div class="case-list">${cases.map(renderCase).join("") || emptyState(t("emptyHistory"))}</div>`;
}

function renderCase(item) {
  const roleLabel = item.role === "staff" ? roleName(item.senderRole) : item.role === "assistant" ? "AI" : t("patientCard");
  return `<article class="case-item ${item.escalated ? "danger-line" : ""}"><strong>${escapeHtml(item.senderName || item.chatTitle)}</strong><span>${escapeHtml(roleLabel)} · ${formatDate(item.createdAt)} · ${t(item.chatStatusKey)}</span>${item.attachment ? renderMessageAttachment(item.attachment) : ""}<p>${escapeHtml((item.text || "").slice(0, 260))}${(item.text || "").length > 260 ? "..." : ""}</p></article>`;
}

function renderKnowledge() {
  const query = byId("kb-search").value?.toLowerCase() || "";
  byId("knowledge-list").innerHTML = state.knowledge
    .filter((item) => `${dictValue(item.title)} ${categoryName(item.categoryId)} ${dictValue(item.content)} ${statusName(item.statusId)}`.toLowerCase().includes(query))
    .map(renderKbCard).join("");
}

function renderKbCard(item) {
  const published = allowedStatusIds.includes(item.statusId);
  return `<article class="kb-card">
    <div>
      <div class="tag-row"><span class="tag">${categoryName(item.categoryId)}</span><span class="status-badge ${published ? "published" : ""}">${statusName(item.statusId)}</span></div>
      <h4>${escapeHtml(dictValue(item.title))}</h4>
      <p>${escapeHtml(dictValue(item.content))}</p>
      <small>${t("sourceLabel")}: ${escapeHtml(item.source)} ${item.url ? `· ${escapeHtml(item.url)}` : ""}</small>
    </div>
    <div class="kb-actions">
      <select data-status-id="${item.id}">${statusDefs.map((status) => `<option value="${status.id}" ${status.id === item.statusId ? "selected" : ""}>${statusName(status.id)}</option>`).join("")}</select>
      <button class="secondary-button" data-edit-kb="${item.id}">${t("edit")}</button>
      <button class="danger-button" data-delete-kb="${item.id}">${t("delete")}</button>
    </div>
  </article>`;
}

function renderAnalytics() {
  const totalConversations = state.patients.reduce((sum, patient) => sum + patient.conversations.length, 0);
  byId("metric-patients").textContent = state.patients.length;
  byId("metric-chats").textContent = totalConversations;
  byId("metric-ai").textContent = state.analytics.aiAnswers;
  byId("metric-red").textContent = state.analytics.redFlags;
  byId("metric-escalations").textContent = state.analytics.escalations;
  byId("metric-kb").textContent = state.knowledge.length;
  const max = Math.max(1, ...Object.values(state.analytics.categories));
  byId("category-bars").innerHTML = Object.entries(state.analytics.categories).sort((a, b) => b[1] - a[1]).map(([categoryId, value]) => `<div class="bar-row"><span>${categoryName(categoryId)}</span><div class="bar-track"><div style="width:${(value / max) * 100}%"></div></div><strong>${value}</strong></div>`).join("") || emptyState(t("noStats"));
  byId("report").innerHTML = `
    <p><strong>${t("metricPatients")}:</strong> ${state.patients.length}</p>
    <p><strong>${t("metricRequests")}:</strong> ${totalConversations}</p>
    <p><strong>${t("metricAiAnswers")}:</strong> ${state.analytics.aiAnswers}</p>
    <p><strong>${t("metricEscalations")}:</strong> ${state.analytics.escalations}</p>
    <p><strong>${t("metricRedFlags")}:</strong> ${state.analytics.redFlags}</p>
    <p><strong>AI errors / no answer:</strong> ${state.analytics.aiErrors}</p>
    <p><strong>${t("useful")}:</strong> ${state.analytics.helpfulRatings}</p>
    <p><strong>${t("doctorCabinet")}:</strong> ${state.analytics.doctorActions}</p>
    <p><strong>${t("adminPanel")}:</strong> ${state.analytics.adminActions}</p>
    <p><strong>${t("status")}:</strong> ${t("reportUsesOnly")}</p>`;
}

function renderAudit() {
  const list = byId("audit-list");
  if (!list) return;
  byId("audit-count").textContent = state.audit.length;
  list.innerHTML = state.audit.map((entry) => `
    <article class="audit-item">
      <strong>${escapeHtml(t(entry.typeKey) || entry.typeKey)}</strong>
      <span>${escapeHtml(formatDate(entry.date))} · ${escapeHtml(entry.user)}</span>
      <p><strong>${t("auditRuleMaterial")}:</strong> ${escapeHtml(entry.material)}</p>
      ${entry.details ? `<p>${escapeHtml(entry.details)}</p>` : ""}
    </article>
  `).join("") || emptyState(t("noStats"));
}

function renderSystemPanel() {
  const list = byId("system-users");
  if (!list) return;
  const canManageUsers = currentMode === "superadmin";
  byId("user-form")?.classList.toggle("hidden", !canManageUsers);
  list.innerHTML = state.users.map((user) => `
    <article class="case-item">
      <strong>${escapeHtml(user.fullName)}</strong>
      <span>${roleName(user.role)} · ${t("loginLabel")}: ${escapeHtml(user.login)} · ${user.blocked ? t("blockedUserStatus") : t("activeUserStatus")}</span>
      ${canManageUsers ? `<button class="secondary-button" data-edit-user="${escapeHtml(user.login)}">${t("editUser")}</button>
      <button class="danger-button" data-delete-user="${escapeHtml(user.login)}">${t("deleteUser")}</button>` : ""}
    </article>
  `).join("");
  const journal = byId("login-journal");
  if (journal) {
    journal.innerHTML = (state.loginJournal || []).slice(0, 20).map((entry) => `
      <article class="case-item">
        <strong>${escapeHtml(entry.fullName || entry.login)}</strong>
        <span>${roleName(entry.role)} · ${t("loginLabel")}: ${escapeHtml(entry.login)} · ${formatDate(entry.date)}</span>
      </article>
    `).join("") || emptyState(t("noStats"));
  }
}

function consultationRecords() {
  return state.patients.flatMap((patient) => patient.conversations.map((conversation) => ({ patient, conversation })));
}

function canViewAiConsultations() {
  return ["doctor", "admin", "moderator", "director", "superadmin"].includes(currentMode);
}

function renderAiConsultations() {
  const list = byId("ai-consult-list");
  const detail = byId("ai-consult-detail");
  if (!list || !detail) return;
  if (!canViewAiConsultations()) {
    list.innerHTML = "";
    detail.innerHTML = "";
    return;
  }
  const query = (byId("ai-consult-search")?.value || "").toLowerCase();
  const date = byId("ai-consult-date")?.value || "";
  const records = consultationRecords().filter(({ patient, conversation }) => {
    const haystack = `${patient.fullName} ${patient.iin} ${conversation.id} ${conversation.title}`.toLowerCase();
    const matchesQuery = !query || haystack.includes(query);
    const matchesDate = !date || (conversation.createdAt || "").slice(0, 10) === date || conversation.messages.some((message) => (message.createdAt || "").slice(0, 10) === date);
    return matchesQuery && matchesDate;
  }).sort((a, b) => new Date(b.conversation.messages.at(-1)?.createdAt || b.conversation.createdAt) - new Date(a.conversation.messages.at(-1)?.createdAt || a.conversation.createdAt));
  byId("ai-risk-count").textContent = records.filter(({ conversation }) => conversation.requiresAttention || conversation.messages.some((message) => message.urgencyKey === "urgent" || message.escalated)).length;
  list.innerHTML = records.map(({ patient, conversation }) => {
    const active = conversation.id === selectedAiConversationId ? "active" : "";
    const risk = conversation.requiresAttention ? "urgent" : "";
    const unread = conversation.unreadForPatient ? ` · ${t("unreadMessages")}: ${conversation.unreadForPatient}` : "";
    return `<button class="patient-row ${active} ${risk}" data-ai-conversation-id="${conversation.id}"><strong>${escapeHtml(patient.fullName)}</strong><span>${patient.iin || t("iinNotProvided")} · ${conversation.id.slice(0, 8)} · ${conversation.requiresAttention ? t("requiresAttention") : t(conversation.statusKey)}${unread}</span></button>`;
  }).join("") || emptyState(t("noStats"));
  const selected = records.find(({ conversation }) => conversation.id === selectedAiConversationId) || records[0];
  if (!selected) {
    detail.innerHTML = emptyState(t("noStats"));
    return;
  }
  selectedAiConversationId = selected.conversation.id;
  selected.conversation.viewedByStaff ||= [];
  const staff = currentStaffUser();
  const viewKey = `${staff?.login || currentMode}:${selected.conversation.id}`;
  if (selected.conversation.lastViewAuditKey !== viewKey) {
    selected.conversation.viewedByStaff.unshift({ user: currentUserLabel(), login: staff?.login || currentMode, date: nowIso() });
    logAudit("auditDialogViewed", selected.patient.fullName, selected.conversation.id);
    selected.conversation.lastViewAuditKey = viewKey;
  }
  detail.innerHTML = `
    <div class="details-list">
      <p><strong>${t("fullNameLabel").replace(" *", "")}:</strong> ${escapeHtml(selected.patient.fullName)}</p>
      <p><strong>${t("iinLabel")}:</strong> ${selected.patient.iin || t("iinNotProvided")}</p>
      <p><strong>${t("medicalProfileTitle")}:</strong> ${escapeHtml(profileSummaryLine(selected.patient))}</p>
      <p><strong>${t("requestStatus")}:</strong> ${selected.conversation.requiresAttention ? t("requiresAttention") : t(selected.conversation.statusKey)}</p>
      <p><strong>ID:</strong> ${selected.conversation.id}</p>
    </div>
    <div class="case-list">${selected.conversation.messages.map(renderFullDialogMessage).join("")}</div>
    <form id="ai-staff-reply-form" class="staff-reply-form">
      <h4>${t("staffReplyTitle")}</h4>
      <textarea name="replyText" rows="3" placeholder="${t("staffReplyPlaceholder")}"></textarea>
      <label class="attach-inline">${t("attachStaffFile")}<input name="replyFile" type="file" accept=".jpg,.jpeg,.png,.webp,.pdf,.doc,.docx,.xls,.xlsx"></label>
      <button class="primary-button" type="submit">${t("sendStaffReply")}</button>
    </form>
    <label class="doctor-comment">${t("doctorDialogComment")}<textarea id="ai-dialog-comment-text" rows="3"></textarea></label>
    <button class="secondary-button" data-ai-action="comment">${t("saveDialogComment")}</button>
    <div class="case-list">${(selected.conversation.staffComments || []).map((comment) => `<article class="case-item"><strong>${escapeHtml(comment.author)}</strong><span>${formatDate(comment.createdAt)}</span><p>${escapeHtml(comment.text)}</p></article>`).join("")}</div>
  `;
  selected.conversation.messages.forEach((message) => message.viewedByStaff = true);
  saveState();
}

function renderFullDialogMessage(message) {
  const roleLabel = message.role === "staff" ? roleName(message.senderRole) : message.role === "assistant" ? "AI" : t("patientCard");
  return `<article class="case-item ${message.escalated ? "danger-line" : ""}">
    <strong>${escapeHtml(message.senderName || roleLabel)}</strong>
    <span>${escapeHtml(roleLabel)} · ${formatDate(message.createdAt)} · ${message.viewedByStaff ? t("staffViewed") : t("staffNotViewed")}${message.role === "staff" ? ` · ${message.readByPatient ? t("readStatus") : t("unreadMessages")}` : ""}</span>
    ${message.attachment ? renderMessageAttachment(message.attachment) : ""}
    <p>${escapeHtml(message.text || "").replace(/\n/g, "<br>")}</p>
  </article>`;
}

function selectedAiRecord() {
  return consultationRecords().find(({ conversation }) => conversation.id === selectedAiConversationId) || null;
}

function saveAiDialogComment(text) {
  const record = selectedAiRecord();
  if (!record || !text.trim()) return;
  record.conversation.staffComments ||= [];
  record.conversation.staffComments.unshift({ id: crypto.randomUUID(), author: currentUserLabel(), text: text.trim(), createdAt: nowIso() });
  logAudit("auditDialogComment", record.patient.fullName, record.conversation.id);
  saveState();
  renderAiConsultations();
}

function exportSelectedAiDialog() {
  const record = selectedAiRecord();
  if (!record) return;
  const html = `<html><head><meta charset="utf-8"><title>${escapeHtml(record.patient.fullName)}</title></head><body>
    <img src="${LOGO_PATH}" width="240">
    <h1>${t("aiConsultHistory")}</h1>
    <p><strong>${t("fullNameLabel").replace(" *", "")}:</strong> ${escapeHtml(record.patient.fullName)}</p>
    <p><strong>${t("iinLabel")}:</strong> ${escapeHtml(record.patient.iin || t("iinNotProvided"))}</p>
    <p><strong>ID:</strong> ${record.conversation.id}</p>
    ${record.conversation.messages.map((message) => `<hr><p><strong>${escapeHtml(message.senderName || message.role)}</strong> (${message.role === "staff" ? roleName(message.senderRole) : escapeHtml(message.senderRole || message.role)}) · ${formatDate(message.createdAt)}</p><p>${escapeHtml(message.text || "").replace(/\n/g, "<br>")}</p>${message.attachment ? `<p>${t("file")}: ${escapeHtml(message.attachment.name)}</p>` : ""}`).join("")}
  </body></html>`;
  const opened = window.open();
  if (opened) {
    opened.document.write(html);
    opened.document.close();
    opened.focus();
    opened.print();
  }
}

function resetUserForm() {
  const form = byId("user-form");
  if (!form) return;
  form.reset();
  form.editLogin.value = "";
  byId("cancel-user-edit-button").classList.add("hidden");
}

function loadUserForEdit(login) {
  const user = state.users.find((entry) => entry.login === login);
  if (!user) return;
  const form = byId("user-form");
  form.editLogin.value = user.login;
  form.fullName.value = user.fullName || "";
  form.login.value = user.login;
  form.password.value = "";
  form.role.value = user.role;
  form.blocked.checked = Boolean(user.blocked);
  byId("cancel-user-edit-button").classList.remove("hidden");
}

function upsertUserFromForm(form) {
  const data = new FormData(form);
  const editLogin = data.get("editLogin");
  const login = data.get("login").trim();
  const password = data.get("password");
  const payload = {
    fullName: data.get("fullName").trim(),
    login,
    role: data.get("role"),
    blocked: data.get("blocked") === "on"
  };
  if (!editLogin && state.users.some((user) => user.login === login)) return;
  if (editLogin && editLogin !== login && state.users.some((user) => user.login === login)) return;
  if (editLogin) {
    const user = state.users.find((entry) => entry.login === editLogin);
    if (!user) return;
    user.fullName = payload.fullName;
    user.login = payload.login;
    user.role = payload.role;
    user.blocked = payload.blocked;
    if (password) {
      user.password = password;
      logAudit("auditPasswordChanged", user.login, user.role);
    }
    logAudit("auditUserUpdated", user.login, user.role);
  } else {
    state.users.push({ ...payload, password: password || "ChangeMe123" });
    logAudit("auditUserCreated", payload.login, payload.role);
  }
  resetUserForm();
  saveState();
  render();
}

function activeStaffPatientConversation(patient) {
  if (!patient) return null;
  const escalated = patient.conversations.find((conversation) => conversation.statusKey === "escalated");
  return escalated || patient.conversations[0] || null;
}

function sendStaffReply(patientId, text, attachment = null, conversationId = null) {
  const patient = state.patients.find((item) => item.id === patientId);
  const trimmed = text.trim();
  if (!patient || (!trimmed && !attachment)) return;
  let conversation = patient.conversations.find((item) => item.id === conversationId) || activeStaffPatientConversation(patient);
  if (!conversation) {
    conversation = { id: crypto.randomUUID(), title: t("staffReplyTitle"), createdAt: nowIso(), statusKey: "open", messages: [], unreadForPatient: 0, staffComments: [], viewedByStaff: [], requiresAttention: false };
    patient.conversations.unshift(conversation);
  }
  const staff = currentStaffUser();
  const message = {
    id: crypto.randomUUID(),
    role: "staff",
    senderName: staff?.fullName || currentUserLabel(),
    senderRole: currentMode,
    text: trimmed || `${t("attachmentReady")}: ${attachment.name}`,
    attachment,
    createdAt: nowIso(),
    readByPatient: false,
    viewedByStaff: true
  };
  conversation.messages.push(message);
  conversation.unreadForPatient = (conversation.unreadForPatient || 0) + 1;
  conversation.statusKey = "doctorPreparing";
  patient.statusKey = "doctorPreparing";
  patient.doctorKey = "kazDoctor";
  patient.lastVisit = nowIso();
  if (attachment) patient.documents.unshift({ id: attachment.id, name: attachment.name, type: attachment.type || "document", size: attachment.size, uploadedAt: nowIso(), dataUrl: attachment.dataUrl, previewable: attachment.previewable });
  state.analytics.doctorActions += 1;
  logAudit("auditStaffReply", patient.fullName, `${roleName(currentMode)} · ${conversation.id}`);
  saveState();
  render();
}

function renderDirectorPanel() {
  const summary = byId("director-summary");
  const patientsList = byId("director-patients");
  const docsList = byId("director-documents");
  if (!summary || !patientsList || !docsList) return;
  const totalDocs = state.patients.reduce((sum, patient) => sum + patient.documents.length, 0);
  const redFlags = state.patients.reduce((sum, patient) => sum + patient.redFlags.length, 0);
  summary.innerHTML = `
    <div class="metric"><span>${state.patients.length}</span><p>${t("metricPatients")}</p></div>
    <div class="metric"><span>${totalDocs}</span><p>${t("documents")}</p></div>
    <div class="metric danger"><span>${redFlags}</span><p>${t("metricRedFlags")}</p></div>
  `;
  patientsList.innerHTML = state.patients.map((patient) => `
    <article class="case-item">
      <strong>${escapeHtml(patient.fullName)}</strong>
      <span>${patient.iin || t("iinNotProvided")} - ${t(patient.statusKey)} - ${patient.documents.length} ${t("documents")}</span>
    </article>
  `).join("") || emptyState(t("noPatients"));
  docsList.innerHTML = state.patients.flatMap((patient) => patient.documents.map((doc) => `
    <article class="case-item">
      ${doc.previewable && doc.dataUrl ? `<img class="document-thumb" src="${doc.dataUrl}" alt="">` : ""}
      <strong>${escapeHtml(doc.name)}</strong>
      <span>${escapeHtml(patient.fullName)} - ${escapeHtml(doc.type)} - ${formatDate(doc.uploadedAt)}</span>
      ${renderFileActions(doc)}
    </article>
  `)).join("") || emptyState(t("noDocuments"));
}

function renderSettings() {
  const toggle = byId("chatgpt-toggle");
  if (toggle) toggle.checked = Boolean(state.settings?.chatGptEnabled);
}

function emptyState(text) {
  return `<p class="empty-state">${escapeHtml(text)}</p>`;
}

function resetKnowledgeForm() {
  const form = byId("knowledge-form");
  form.reset();
  form.editId.value = "";
  byId("knowledge-form-title").textContent = t("addMaterial");
  byId("save-knowledge-button").textContent = t("saveMaterial");
  byId("cancel-edit-button").classList.add("hidden");
}

function loadKnowledgeForEdit(id) {
  const item = state.knowledge.find((entry) => entry.id === id);
  if (!item) return;
  const form = byId("knowledge-form");
  form.editId.value = item.id;
  form.title.value = dictValue(item.title);
  form.category.value = item.categoryId;
  form.status.value = item.statusId;
  form.source.value = item.source;
  form.url.value = item.url || "";
  form.content.value = dictValue(item.content);
  byId("knowledge-form-title").textContent = t("editMaterial");
  byId("save-knowledge-button").textContent = t("updateMaterial");
  byId("cancel-edit-button").classList.remove("hidden");
}

function upsertKnowledgeFromForm(form) {
  const data = new FormData(form);
  const editId = data.get("editId");
  const textForAllLanguages = (value, oldValue = {}) => ({ ...oldValue, [currentLang]: value });
  const file = data.get("file");
  const fileName = file && file.name ? `; file: ${file.name}` : "";
  if (editId) {
    const item = state.knowledge.find((entry) => entry.id === editId);
    if (!item) return;
    item.title = textForAllLanguages(data.get("title"), item.title);
    item.content = textForAllLanguages(data.get("content"), item.content);
    item.categoryId = data.get("category");
    item.statusId = data.get("status");
    item.source = `${data.get("source")}${fileName}`;
    item.url = data.get("url");
    logAudit("auditUpdated", dictValue(item.title), `${statusName(item.statusId)} · ${item.source}`);
  } else {
    const title = { ru: data.get("title"), kz: data.get("title"), en: data.get("title"), [currentLang]: data.get("title") };
    const content = { ru: data.get("content"), kz: data.get("content"), en: data.get("content"), [currentLang]: data.get("content") };
    const item = { id: crypto.randomUUID(), title, content, categoryId: data.get("category"), statusId: data.get("status"), source: `${data.get("source")}${fileName}`, url: data.get("url") };
    state.knowledge.unshift(item);
    logAudit("auditCreated", dictValue(item.title), `${statusName(item.statusId)} · ${item.source}`);
  }
  state.analytics.adminActions += 1;
  resetKnowledgeForm();
  saveState();
  render();
}

function exportExcel() {
  const rows = [
    [t("reportTitle")],
    [t("status"), t("reportUsesOnly")],
    [t("metricPatients"), state.patients.length],
    [t("metricRequests"), byId("metric-chats").textContent],
    [t("metricAiAnswers"), state.analytics.aiAnswers],
    [t("metricEscalations"), state.analytics.escalations],
    [t("metricRedFlags"), state.analytics.redFlags],
    [t("metricKnowledge"), state.knowledge.length],
    [],
    [t("requestTopics"), ""],
    ...Object.entries(state.analytics.categories).map(([categoryId, count]) => [categoryName(categoryId), count])
  ];
  const html = `<html><head><meta charset="utf-8"></head><body><table><tr><td colspan="2"><img src="${LOGO_PATH}" width="260"></td></tr>${rows.map((row) => `<tr>${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join("")}</tr>`).join("")}</table></body></html>`;
  const blob = new Blob([html], { type: "application/vnd.ms-excel;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "kazniior-ai-agent-report.xls";
  link.click();
  URL.revokeObjectURL(url);
}

function downloadJson(filename, data) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

let aiBusy = false;

function setAiBusy(value) {
  aiBusy = Boolean(value);
  const indicator = byId("ai-typing");
  const send = document.querySelector("#chat-form .send-button");
  indicator?.classList.toggle("hidden", !aiBusy);
  if (send) send.disabled = aiBusy;
}

function updateConnectionState() {
  const banner = byId("connection-banner");
  if (!banner) return;
  banner.classList.toggle("hidden", navigator.onLine !== false);
}

function updateScrollDownButton() {
  const messages = byId("messages");
  const button = byId("scroll-to-bottom");
  if (!messages || !button) return;
  const distance = messages.scrollHeight - messages.scrollTop - messages.clientHeight;
  const show = messages.scrollHeight > messages.clientHeight + 80 && distance > 120;
  button.classList.toggle("hidden", !show);
}

function toggleMobileProfile(forceOpen = null) {
  const menu = byId("mobile-profile-menu");
  const button = byId("mobile-profile-button");
  if (!menu || !button) return;
  const open = forceOpen === null ? menu.classList.contains("hidden") : Boolean(forceOpen);
  menu.classList.toggle("hidden", !open);
  button.setAttribute("aria-expanded", String(open));
  byId("mobile-language-button")?.setAttribute("aria-expanded", String(open));
}

function updateVisualViewportHeight() {
  const height = window.visualViewport?.height || window.innerHeight;
  document.documentElement.style.setProperty("--app-height", `${Math.round(height)}px`);
}

function render() {
  localizePage();
  renderSession();
  byId("quick-prompts").innerHTML = t("quickPrompts").map((prompt) => `<button class="prompt-chip" type="button">${escapeHtml(prompt)}</button>`).join("");
  renderConversations();
  renderMessages();
  renderPatientCabinet();
  renderDoctorCabinet();
  renderKnowledge();
  renderAnalytics();
  renderAudit();
  renderAiConsultations();
  renderSystemPanel();
  renderDirectorPanel();
  renderSettings();
  renderAttachmentPreview();
  saveState();
}

function closeMobilePanels() {
  const chatList = document.querySelector(".chat-list");
  const historyButton = byId("mobile-history-button");
  const routePanel = byId("mobile-route-panel");
  const routeButton = byId("mobile-route-button");
  chatList?.classList.remove("mobile-open");
  historyButton?.setAttribute("aria-expanded", "false");
  routePanel?.classList.add("hidden");
  routeButton?.setAttribute("aria-expanded", "false");
  toggleMobileProfile(false);
}

function init() {
  document.addEventListener("click", (event) => {
    const langButton = event.target.closest("[data-lang]");
    if (langButton) setLanguage(langButton.dataset.lang);
  });
  byId("quick-login-button").addEventListener("click", () => byId("patient-login-form").requestSubmit());
  byId("patient-login-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    findOrCreatePatient(data.get("fullName"), data.get("iin") || "");
    render();
  });
  byId("patient-profile-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const patient = currentPatient();
    if (!patient) return;
    const data = new FormData(event.currentTarget);
    const profile = ensurePatientProfile(patient);
    profile.region = data.get("region") || "";
    profile.gender = data.get("gender") || "";
    profile.age = data.get("age") || "";
    profile.diagnosis = (data.get("diagnosis") || "").trim();
    profile.stage = data.get("stage") || "";
    logAudit("auditProfileSaved", patient.fullName, "patient");
    render();
  });
  document.querySelectorAll("[data-staff-role]").forEach((button) => {
    button.addEventListener("click", () => {
      selectedStaffRole = button.dataset.staffRole;
      byId("staff-login-form").classList.remove("hidden");
      updateStaffLoginPanel();
    });
  });
  byId("staff-login-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const user = await authenticateStaffLogin(form.login.value.trim(), form.password.value, form.twoFactor.value.trim());
    if (!user) {
      byId("staff-login-hint").textContent = t("authError");
      return;
    }
    currentMode = user.role;
    activeStaffLogin = user.login;
    activePatientId = null;
    activeConversationId = null;
    state.loginJournal.unshift({ id: crypto.randomUUID(), login: user.login, fullName: user.fullName, role: user.role, date: nowIso() });
    logAudit("auditLogin", user.login, roleName(user.role));
    saveState();
    setActiveView(user.role === "doctor" ? "doctor" : ["admin", "moderator"].includes(user.role) ? "admin" : user.role === "director" ? "director" : "system");
    form.reset();
    render();
  });
  byId("logout-button").addEventListener("click", () => {
    currentMode = "guest";
    activePatientId = null;
    activeStaffLogin = null;
    activeConversationId = null;
    saveState();
    render();
  });
  byId("top-logout-button").addEventListener("click", () => byId("logout-button").click());
  byId("mobile-language-button")?.addEventListener("click", (event) => {
    event.stopPropagation();
    toggleMobileProfile();
  });
  byId("mobile-profile-button")?.addEventListener("click", (event) => {
    event.stopPropagation();
    toggleMobileProfile();
  });
  byId("mobile-profile-open")?.addEventListener("click", () => {
    toggleMobileProfile(false);
    if (currentMode === "patient") setActiveView("patient");
    else byId("profile-button")?.click();
  });
  byId("mobile-profile-logout")?.addEventListener("click", () => {
    if (window.confirm(`${t("confirmLogoutTitle")}\n${t("confirmLogoutText")}`)) {
      toggleMobileProfile(false);
      byId("logout-button").click();
    }
  });
  byId("mobile-history-button")?.addEventListener("click", () => {
    const chatList = document.querySelector(".chat-list");
    if (!chatList) return;
    const open = chatList.classList.toggle("mobile-open");
    byId("mobile-history-button").setAttribute("aria-expanded", String(open));
  });
  byId("mobile-route-button")?.addEventListener("click", () => {
    const panel = byId("mobile-route-panel");
    if (!panel) return;
    const open = panel.classList.contains("hidden");
    panel.classList.toggle("hidden", !open);
    byId("mobile-route-button").setAttribute("aria-expanded", String(open));
  });
  byId("mobile-route-close")?.addEventListener("click", () => {
    byId("mobile-route-panel")?.classList.add("hidden");
    byId("mobile-route-button")?.setAttribute("aria-expanded", "false");
  });
  byId("profile-button").addEventListener("click", () => {
    const staff = currentStaffUser();
    if (!staff) return;
    alert(`${t("staffProfileTitle")}\n${staff.fullName}\n${t("roleLabel")}: ${roleName(staff.role)}\n${t("loginLabel")}: ${staff.login}`);
  });
  document.body.addEventListener("click", (event) => {
    const openButton = event.target.closest("[data-open-file]");
    const downloadButton = event.target.closest("[data-download-file]");
    if (openButton) openPatientFile(openButton.dataset.openFile);
    if (downloadButton) downloadPatientFile(downloadButton.dataset.downloadFile);
  });
  document.body.addEventListener("click", (event) => {
    const sourceButton = event.target.closest("[data-source]");
    if (sourceButton) alert(`${t("sourceLabel")}: ${sourceButton.dataset.source || "-"}`);
    if (!event.target.closest("#mobile-profile-menu") && !event.target.closest("#mobile-profile-button") && !event.target.closest("#mobile-language-button")) {
      toggleMobileProfile(false);
    }
  });
  byId("scroll-to-bottom")?.addEventListener("click", () => {
    const messages = byId("messages");
    messages?.scrollTo({ top: messages.scrollHeight, behavior: "smooth" });
  });
  byId("messages")?.addEventListener("scroll", updateScrollDownButton, { passive: true });
  window.addEventListener("online", updateConnectionState);
  window.addEventListener("offline", updateConnectionState);
  updateConnectionState();
  updateVisualViewportHeight();
  window.visualViewport?.addEventListener("resize", updateVisualViewportHeight);
  window.addEventListener("resize", updateVisualViewportHeight);
  document.querySelectorAll(".nav-item").forEach((button) => button.addEventListener("click", () => setActiveView(button.dataset.view)));
  byId("chat-form").addEventListener("submit", (event) => {
    event.preventDefault();
    if (aiBusy) return;
    if (navigator.onLine === false) {
      updateConnectionState();
      byId("message-input")?.focus();
      return;
    }
    const text = byId("message-input").value;
    const attachment = pendingAttachment;
    if (!text.trim() && !attachment) return;
    byId("message-input").value = "";
    pendingAttachment = null;
    byId("patient-doc-input").value = "";
    renderAttachmentPreview();
    setAiBusy(true);
    window.setTimeout(() => {
      setAiBusy(false);
      sendMessage(text, attachment);
    }, 420);
  });
  byId("quick-prompts").addEventListener("click", (event) => {
    const button = event.target.closest("button");
    if (button) sendMessage(button.textContent);
  });
  byId("new-chat").addEventListener("click", () => { createConversation(); closeMobilePanels(); render(); });
  byId("chat-search").addEventListener("input", renderConversations);
  byId("doctor-search").addEventListener("input", renderDoctorCabinet);
  byId("kb-search").addEventListener("input", renderKnowledge);
  byId("patient-doc-input").addEventListener("change", async (event) => {
    pendingAttachment = await prepareAttachment(event.target.files[0]);
    renderAttachmentPreview();
  });
  byId("attachment-preview").addEventListener("click", (event) => {
    if (!event.target.closest("#remove-attachment")) return;
    pendingAttachment = null;
    byId("patient-doc-input").value = "";
    renderAttachmentPreview();
  });
  byId("conversation-list").addEventListener("click", (event) => {
    const button = event.target.closest("[data-conversation-id]");
    if (!button) return;
    activeConversationId = button.dataset.conversationId;
    closeMobilePanels();
    render();
  });
  byId("messages").addEventListener("click", (event) => {
    if (!event.target.closest("[data-rate]")) return;
    if (event.target.textContent === t("useful")) state.analytics.helpfulRatings += 1;
    saveState();
    renderAnalytics();
  });
  byId("doctor-patients").addEventListener("click", (event) => {
    const button = event.target.closest("[data-patient-id]");
    if (!button) return;
    selectedDoctorPatientId = button.dataset.patientId;
    const patient = state.patients.find((item) => item.id === selectedDoctorPatientId);
    if (patient) logAudit("auditPatientViewed", patient.fullName, currentMode);
    saveState();
    renderDoctorCabinet();
  });
  byId("doctor-detail").addEventListener("click", (event) => {
    const action = event.target.closest("[data-doctor-action]")?.dataset.doctorAction;
    const patient = state.patients.find((item) => item.id === selectedDoctorPatientId);
    if (!action || !patient) return;
    state.analytics.doctorActions += 1;
    if (action === "answer") {
      patient.statusKey = "doctorPreparing";
      logAudit("auditDoctorAction", patient.fullName, t("answerPatient"));
    }
    if (action === "transfer") {
      patient.statusKey = "transferredToSpecialist";
      logAudit("auditDoctorAction", patient.fullName, t("transferSpecialist"));
    }
    if (action === "comment") {
      const text = byId("doctor-comment-text").value.trim();
      if (text) patient.doctorComments.push({ id: crypto.randomUUID(), text, createdAt: nowIso(), doctor: t("kazDoctor") });
      patient.doctorKey = "kazDoctor";
      logAudit("auditDoctorAction", patient.fullName, t("saveComment"));
    }
    saveState();
    render();
  });
  byId("doctor-detail").addEventListener("submit", async (event) => {
    const form = event.target.closest("#staff-reply-form");
    if (!form) return;
    event.preventDefault();
    const file = form.replyFile.files[0];
    const attachment = file ? await prepareAttachment(file) : null;
    sendStaffReply(selectedDoctorPatientId, form.replyText.value, attachment);
  });
  byId("ai-consult-list").addEventListener("click", (event) => {
    const button = event.target.closest("[data-ai-conversation-id]");
    if (!button) return;
    selectedAiConversationId = button.dataset.aiConversationId;
    renderAiConsultations();
  });
  byId("ai-consult-search").addEventListener("input", renderAiConsultations);
  byId("ai-consult-date").addEventListener("change", renderAiConsultations);
  byId("export-ai-dialog").addEventListener("click", exportSelectedAiDialog);
  byId("ai-consult-detail").addEventListener("submit", async (event) => {
    const form = event.target.closest("#ai-staff-reply-form");
    if (!form) return;
    event.preventDefault();
    const record = selectedAiRecord();
    const file = form.replyFile.files[0];
    const attachment = file ? await prepareAttachment(file) : null;
    if (record) sendStaffReply(record.patient.id, form.replyText.value, attachment, record.conversation.id);
  });
  byId("ai-consult-detail").addEventListener("click", (event) => {
    if (!event.target.closest("[data-ai-action='comment']")) return;
    saveAiDialogComment(byId("ai-dialog-comment-text").value);
  });
  byId("knowledge-form").addEventListener("submit", (event) => {
    event.preventDefault();
    upsertKnowledgeFromForm(event.currentTarget);
  });
  byId("cancel-edit-button").addEventListener("click", resetKnowledgeForm);
  document.querySelector("[name='file']").addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const form = byId("knowledge-form");
    if (!form.source.value) form.source.value = t("uploadedInternalDoc");
    const isText = /\.(txt|md)$/i.test(file.name) || file.type.startsWith("text/");
    if (!isText) {
      form.content.value = t("nonTextFileNote");
      form.status.value = "review";
      return;
    }
    const reader = new FileReader();
    reader.onload = () => { form.content.value = reader.result; };
    reader.readAsText(file, "utf-8");
  });
  byId("knowledge-list").addEventListener("change", (event) => {
    const select = event.target.closest("[data-status-id]");
    if (!select) return;
    const item = state.knowledge.find((entry) => entry.id === select.dataset.statusId);
    if (!item) return;
    item.statusId = select.value;
    state.analytics.adminActions += 1;
    logAudit("auditStatus", dictValue(item.title), statusName(item.statusId));
    saveState();
    render();
  });
  byId("knowledge-list").addEventListener("click", (event) => {
    const editButton = event.target.closest("[data-edit-kb]");
    const deleteButton = event.target.closest("[data-delete-kb]");
    if (editButton) return loadKnowledgeForEdit(editButton.dataset.editKb);
    if (deleteButton) {
      const item = state.knowledge.find((entry) => entry.id === deleteButton.dataset.deleteKb);
      if (item) logAudit("auditDeleted", dictValue(item.title), item.source);
      state.knowledge = state.knowledge.filter((entry) => entry.id !== deleteButton.dataset.deleteKb);
      state.analytics.adminActions += 1;
      saveState();
      render();
    }
  });
  byId("chatgpt-toggle").addEventListener("change", (event) => {
    state.settings.chatGptEnabled = event.target.checked;
    logAudit("auditStatus", "ChatGPT", event.target.checked ? "enabled" : "disabled");
    saveState();
    render();
  });
  byId("export-kb-admin").addEventListener("click", () => {
    if (!["admin", "director", "superadmin"].includes(currentMode)) return;
    logAudit("auditExportKnowledge", "knowledge-base", "json");
    downloadJson("kazniior-knowledge-base.json", state.knowledge);
    saveState();
    render();
  });
  byId("user-form").addEventListener("submit", (event) => {
    event.preventDefault();
    if (currentMode !== "superadmin") return;
    upsertUserFromForm(event.currentTarget);
  });
  byId("cancel-user-edit-button").addEventListener("click", resetUserForm);
  byId("system-users").addEventListener("click", (event) => {
    if (currentMode !== "superadmin") return;
    const editButton = event.target.closest("[data-edit-user]");
    const deleteButton = event.target.closest("[data-delete-user]");
    if (editButton) return loadUserForEdit(editButton.dataset.editUser);
    if (deleteButton) {
      const user = state.users.find((entry) => entry.login === deleteButton.dataset.deleteUser);
      if (user && user.login !== activeStaffLogin) {
        state.users = state.users.filter((entry) => entry.login !== user.login);
        logAudit("auditUserDeleted", user.login, user.role);
        saveState();
        render();
      }
    }
  });
  byId("system").addEventListener("click", (event) => {
    const action = event.target.closest("[data-system-action]")?.dataset.systemAction;
    if (!action || currentMode !== "superadmin") return;
    if (action === "backup") {
      logAudit("auditBackup", "database", "local JSON");
      downloadJson("kazniior-ai-agent-backup.json", state);
    } else if (action === "exportKnowledge") {
      logAudit("auditExportKnowledge", "knowledge-base", "json");
      downloadJson("kazniior-knowledge-base.json", state.knowledge);
    } else {
      logAudit("auditDoctorAction", "system", action);
    }
    saveState();
    render();
  });
  byId("export-excel").addEventListener("click", exportExcel);
  byId("print-report").addEventListener("click", () => window.print());
  ["click", "keydown", "mousemove", "input"].forEach((eventName) => document.addEventListener(eventName, resetAutoLogoutTimer));
  render();
}

init();

