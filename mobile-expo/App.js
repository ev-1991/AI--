import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Linking,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";

const roles = {
  doctor: "Врач",
  admin: "Администратор базы знаний",
  director: "Директор",
  superadmin: "Супер-администратор"
};

const staffUsers = [
  { login: "doctor", password: "doctor123", fullName: "Врач КазНИИОиР", role: "doctor", blocked: false },
  { login: "admin", password: "admin123", fullName: "Администратор базы знаний", role: "admin", blocked: false },
  { login: "director", password: "director123", fullName: "Директор КазНИИОиР", role: "director", blocked: false },
  { login: "superadmin", password: "super123", fullName: "Супер-администратор", role: "superadmin", blocked: false }
];

const baseFaq = [
  {
    id: "appointment",
    title: "Запись на прием",
    category: "FAQ",
    answer: "На консультацию к врачу можно записаться по телефону 8 (728) 310-90-23 или через WhatsApp: 8 (747) 349-61-16."
  },
  {
    id: "results",
    title: "Результаты анализов",
    category: "FAQ",
    answer: "Для получения информации по результатам анализов обратитесь по телефонам 8 (727) 292-00-61 или 8 (727) 292-99-20. Внутренний номер лаборатории: 219."
  },
  {
    id: "diagnostics",
    title: "Запись на УЗИ, КТ или МРТ",
    category: "Диагностика",
    answer: "Запись на УЗИ, КТ или МРТ осуществляется через WhatsApp: 8 (707) 103-77-11."
  },
  {
    id: "osms",
    title: "Консультация по ОСМС",
    category: "Маршрут",
    answer: "Для получения консультации по ОСМС необходимо направление от поликлиники по месту прикрепления."
  },
  {
    id: "hospitalization",
    title: "Госпитализация",
    category: "Документы",
    answer: "Плановая госпитализация осуществляется через Портал Бюро госпитализации. Направление оформляет лечащий врач поликлиники или специалист КДЦ КазНИИОиР после осмотра."
  },
  {
    id: "documents",
    title: "Документы",
    category: "Документы",
    answer: "Для первичной бесплатной консультации нужны удостоверение личности, направление по форме №021/у, выписка из амбулаторной карты, результаты обследований, КТ, МРТ, УЗИ или ПЭТ-КТ при наличии."
  },
  {
    id: "paid",
    title: "Платные услуги",
    category: "Маршрут",
    answer: "При отсутствии направления пациент может получить консультацию на платной основе. Иностранные граждане обслуживаются на платной основе согласно утвержденному прейскуранту."
  },
  {
    id: "green",
    title: "Зеленый коридор",
    category: "Маршрут",
    answer: "Зеленый коридор предназначен для пациентов с подозрением на онкологическое заболевание или подтвержденным диагнозом. Максимальный срок обследования составляет 18 рабочих дней."
  },
  {
    id: "red-flags",
    title: "Экстренные ситуации",
    category: "Красные флаги",
    answer: "При кровотечении, высокой температуре, сильной боли, одышке, потере сознания или резком ухудшении состояния срочно обратитесь к врачу, в приемный покой или вызовите скорую помощь."
  },
  {
    id: "ai-helper",
    title: "Как работает AI-помощник пациента",
    category: "Вопрос — ответ",
    answer: "Опишите симптом простыми словами: когда он начался, насколько выражен, какой препарат вы получаете и какие показатели измерили. AI найдёт проверенную информацию, отметит опасные признаки и при сомнении передаст вопрос врачу. AI не ставит диагноз, не назначает лечение и не меняет дозировку."
  },
  {
    id: "immunotherapy-effects",
    title: "Симптомы при иммунотерапии: пембролизумаб, ниволумаб, атезолизумаб, дурвалумаб, ипилимумаб",
    category: "Побочные эффекты",
    answer: "Отслеживайте новую слабость, сыпь и зуд, диарею, кашель или одышку, снижение аппетита, отёки, чувство холода, боли в мышцах и суставах. Срочно свяжитесь с врачом при одышке в покое, диарее более 6 раз в сутки или крови в стуле, желтухе, резкой слабости с низким давлением, нарушении глотания, боли в груди или сердцебиении. Иммунные нежелательные явления могут возникнуть с задержкой."
  },
  {
    id: "egfr-effects",
    title: "Побочные эффекты осимертиниба, гефитиниба, эрлотиниба и афатиниба",
    category: "Побочные эффекты",
    answer: "Возможны сыпь, сухость кожи, диарея, воспаление во рту, болезненность вокруг ногтей, тошнота и снижение аппетита. Срочно сообщите врачу о новой одышке, сухом кашле с температурой, желтухе или тёмной моче, боли в груди, нарушении ритма или выраженной диарее с обезвоживанием. Самостоятельно не отменяйте препарат."
  },
  {
    id: "alk-effects",
    title: "Побочные эффекты алектиниба, кризотиниба, церитиниба, лорлатиниба и энтректиниба",
    category: "Побочные эффекты",
    answer: "Возможны отёки, тошнота, расстройства стула, замедление пульса, утомляемость и нарушения зрения. Срочная консультация нужна при пульсе менее 50 в минуту с головокружением или обмороком, новой одышке и кашле, выраженном нарушении координации или резком ухудшении зрения."
  },
  {
    id: "medicine-groups",
    title: "Группы препаратов при НМРЛ",
    category: "Препараты",
    answer: "В лечении НМРЛ применяются химиотерапия, таргетная терапия и иммунотерапия. Выбор препарата, сочетания и дозировки зависит от типа опухоли, стадии, молекулярных мутаций и состояния пациента. Конкретную схему назначает только лечащий врач."
  }
];

const navigationItems = [
  { title: "Регистратура", place: "Главный корпус, 1 этаж", route: "Вход с Абая 91 → холл → стойка регистрации" },
  { title: "КДЦ / консультации", place: "Консультативно-диагностический центр", route: "Регистратура → кабинет по направлению → ожидание вызова" },
  { title: "КТ, МРТ, УЗИ", place: "Отделение диагностики", route: "Регистратура → диагностика → иметь предыдущие снимки и заключения" },
  { title: "Приемный покой", place: "Приемное отделение", route: "При экстренных симптомах обращаться напрямую. Телефон: 8 (727) 292-90-63" }
];

const quickPatientQuestions = [
  "Какие симптомы отслеживать при иммунотерапии?",
  "Побочные эффекты осимертиниба",
  "Как правильно описать симптом?",
  "Как записаться на приём?"
];

const initialPatients = [
  {
    id: "p-demo",
    fullName: "Пациент Демонстрационный",
    iin: "",
    status: "Открыто",
    unread: 1,
    files: [],
    messages: [
      { id: "m1", role: "patient", senderName: "Пациент Демонстрационный", senderRole: "Пациент", text: "Как записаться на КТ?", createdAt: new Date().toISOString(), read: true },
      { id: "m2", role: "ai", senderName: "KazONCO AI", senderRole: "AI-агент", text: baseFaq[2].answer, createdAt: new Date().toISOString(), read: true },
      { id: "m3", role: "staff", senderName: "Врач КазНИИОиР", senderRole: "Врач", text: "Пожалуйста, возьмите предыдущие снимки и заключения, если они есть.", createdAt: new Date().toISOString(), read: false }
    ]
  }
];

function now() {
  return new Date().toISOString();
}

function formatDate(value) {
  return new Date(value).toLocaleString("ru-RU", { dateStyle: "short", timeStyle: "short" });
}

function isImage(file) {
  const type = file?.mimeType || file?.type || "";
  const name = file?.name || file?.fileName || "";
  return type.startsWith("image/") || /\.(jpg|jpeg|png|webp)$/i.test(name);
}

function fileName(file) {
  return file?.name || file?.fileName || "Вложение";
}

function findAnswer(question) {
  const lower = question.toLowerCase();
  const urgent = ["кров", "температур", "сильная боль", "одыш", "потер", "ухудш", "желтух", "тёмная моч", "темная моч", "обморок", "пульс меньше 50", "нарушение глотания"].some((word) => lower.includes(word));
  if (urgent) return { text: baseFaq.find((item) => item.id === "red-flags").answer, status: "Требует внимания" };
  const treatmentDecision = ["назначить", "какую дозу", "дозировка для меня", "отменить препарат", "заменить препарат", "что мне принимать"].some((phrase) => lower.includes(phrase));
  if (treatmentDecision) {
    return {
      text: "Я не могу назначать или отменять препараты, подбирать схему и менять дозировку. Эти решения принимает только лечащий врач. Вопрос передан специалисту.",
      status: "Передано специалисту"
    };
  }
  const stopWords = new Set(["какие", "какой", "какая", "можно", "нужно", "после", "меня", "сейчас", "пожалуйста", "расскажите"]);
  const words = lower.split(/[^\p{L}\p{N}]+/u).filter((word) => word.length > 2 && !stopWords.has(word));
  const found = baseFaq.map((item) => {
    const haystack = `${item.title} ${item.answer}`.toLowerCase();
    const score = words.reduce((sum, word) => sum + (haystack.includes(word) ? 1 : 0), 0);
    return { item, score };
  }).sort((a, b) => b.score - a.score)[0];
  if (!found || found.score === 0) {
    return {
      text: "По вашему вопросу нет утверждённой информации в базе знаний КазНИИОиР. Ваше обращение передано специалисту.",
      status: "Передано специалисту"
    };
  }
  return { text: `${found.item.answer}\n\nИсточник: база знаний КазНИИОиР. AI не заменяет врача и не ставит диагноз.`, status: "Ответ AI" };
}

function StatCard({ value, label, danger }) {
  return (
    <View style={[styles.statCard, danger && styles.statDanger]}>
      <Text style={[styles.statValue, danger && styles.dangerText]}>{value}</Text>
      <Text style={styles.muted}>{label}</Text>
    </View>
  );
}

function Pill({ children, danger }) {
  return <Text style={[styles.pill, danger && styles.pillDanger]}>{children}</Text>;
}

function FilePreview({ file, onOpen }) {
  if (!file) return null;
  return (
    <TouchableOpacity style={styles.fileBox} onPress={() => onOpen(file)}>
      {isImage(file) && file.uri ? <Image source={{ uri: file.uri }} style={styles.fileImage} /> : <Text style={styles.fileIcon}>DOC</Text>}
      <View style={{ flex: 1 }}>
        <Text style={styles.fileName}>{fileName(file)}</Text>
        <Text style={styles.muted}>Нажмите, чтобы открыть. Скачивание доступно через системное меню.</Text>
      </View>
    </TouchableOpacity>
  );
}

function MessageBubble({ message, onOpenFile }) {
  const isPatient = message.role === "patient";
  const isStaff = message.role === "staff";
  return (
    <View style={[styles.message, isPatient ? styles.patientMessage : isStaff ? styles.staffMessage : styles.aiMessage]}>
      <Text style={[styles.sender, isPatient && styles.patientText]}>{message.senderName}</Text>
      <Text style={[styles.senderRole, isPatient && styles.patientSubtext]}>{message.senderRole} · {formatDate(message.createdAt)}</Text>
      {message.file ? <FilePreview file={message.file} onOpen={onOpenFile} /> : null}
      <Text style={isPatient ? styles.patientText : styles.text}>{message.text}</Text>
      {message.role === "ai" ? (
        <View style={styles.knowledgeRow}>
          <Text style={styles.knowledgeBadge}>✓ По базе знаний КазНИИОиР</Text>
          <TouchableOpacity onPress={() => Alert.alert("Источник", "Проверенная база знаний КазНИИОиР")}><Text style={styles.sourceLink}>Источник</Text></TouchableOpacity>
        </View>
      ) : null}
      {isStaff ? <Text style={styles.readStatus}>{message.read ? "Прочитано" : "Непрочитано"}</Text> : null}
    </View>
  );
}

export default function App() {
  const [mode, setMode] = useState("patient-login");
  const [activeTab, setActiveTab] = useState("chat");
  const [patientName, setPatientName] = useState("");
  const [iin, setIin] = useState("");
  const [staffLogin, setStaffLogin] = useState("");
  const [staffPassword, setStaffPassword] = useState("");
  const [staff, setStaff] = useState(null);
  const [patients, setPatients] = useState(initialPatients);
  const [activePatientId, setActivePatientId] = useState("p-demo");
  const [messageText, setMessageText] = useState("");
  const [staffReply, setStaffReply] = useState("");
  const [pendingFile, setPendingFile] = useState(null);
  const [viewerFile, setViewerFile] = useState(null);
  const [knowledge, setKnowledge] = useState(baseFaq);
  const [newFaqTitle, setNewFaqTitle] = useState("");
  const [newFaqAnswer, setNewFaqAnswer] = useState("");
  const [newEmployeeName, setNewEmployeeName] = useState("");
  const [newEmployeeLogin, setNewEmployeeLogin] = useState("");
  const [newEmployeePassword, setNewEmployeePassword] = useState("");
  const [audit, setAudit] = useState([]);
  const [employees, setEmployees] = useState(staffUsers);
  const [profileOpen, setProfileOpen] = useState(false);
  const [routeOpen, setRouteOpen] = useState(false);
  const [safetyExpanded, setSafetyExpanded] = useState(false);
  const [aiThinking, setAiThinking] = useState(false);
  const [showScrollDown, setShowScrollDown] = useState(false);
  const chatScrollRef = useRef(null);

  const activePatient = useMemo(() => patients.find((item) => item.id === activePatientId) || patients[0], [patients, activePatientId]);
  const isStaff = mode === "staff";
  const isPatient = mode === "patient";

  useEffect(() => {
    if (!isPatient || activeTab !== "chat") return;
    const patient = patients.find((item) => item.id === activePatientId);
    if (!patient?.unread) return;
    setPatients((items) =>
      items.map((item) =>
        item.id === activePatientId
          ? { ...item, unread: 0, messages: item.messages.map((message) => (message.role === "staff" ? { ...message, read: true } : message)) }
          : item
      )
    );
  }, [activePatientId, activeTab, isPatient, patients]);

  const log = (text) => setAudit((items) => [{ id: String(Date.now()), text, date: now(), user: staff?.fullName || patientName || "system" }, ...items]);

  const loginPatient = () => {
    if (!patientName.trim()) return Alert.alert("Введите ФИО пациента");
    const existing = patients.find((item) => item.fullName.toLowerCase() === patientName.trim().toLowerCase() || (iin && item.iin === iin));
    if (existing) {
      setActivePatientId(existing.id);
    } else {
      const patient = { id: `p-${Date.now()}`, fullName: patientName.trim(), iin, status: "Открыто", unread: 0, files: [], messages: [] };
      setPatients((items) => [patient, ...items]);
      setActivePatientId(patient.id);
    }
    setMode("patient");
    setActiveTab("chat");
  };

  const loginStaff = () => {
    const user = employees.find((item) => item.login === staffLogin.trim() && item.password === staffPassword && !item.blocked);
    if (!user) return Alert.alert("Ошибка входа", "Проверьте логин и пароль");
    setStaff(user);
    setMode("staff");
    setActiveTab("requests");
    log(`Вход сотрудника: ${user.login}`);
  };

  const logout = () => {
    setMode("patient-login");
    setStaff(null);
    setStaffLogin("");
    setStaffPassword("");
    setPendingFile(null);
    setProfileOpen(false);
    setRouteOpen(false);
  };

  const confirmLogout = () => {
    Alert.alert("Выйти из аккаунта?", "Текущий сеанс будет завершён.", [
      { text: "Отмена", style: "cancel" },
      { text: "Выйти", style: "destructive", onPress: logout }
    ]);
  };

  const pickDocument = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      copyToCacheDirectory: true,
      type: [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "image/*"
      ]
    });
    if (!result.canceled) setPendingFile(result.assets[0]);
  };

  const pickPhoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.85
    });
    if (!result.canceled) setPendingFile({ ...result.assets[0], name: result.assets[0].fileName || "photo.jpg", mimeType: result.assets[0].mimeType || "image/jpeg" });
  };

  const openFile = async (file) => {
    if (!file?.uri) return;
    if (isImage(file)) return setViewerFile(file);
    const canOpen = await Linking.canOpenURL(file.uri);
    if (canOpen) return Linking.openURL(file.uri);
    return Share.share({ title: fileName(file), url: file.uri, message: fileName(file) });
  };

  const addMessageToPatient = (patientId, message, options = {}) => {
    setPatients((items) =>
      items.map((patient) => {
        if (patient.id !== patientId) return patient;
        const nextFiles = message.file ? [message.file, ...patient.files] : patient.files;
        return {
          ...patient,
          status: options.status || patient.status,
          unread: options.unreadDelta ? patient.unread + options.unreadDelta : patient.unread,
          files: nextFiles,
          messages: [...patient.messages, message]
        };
      })
    );
  };

  const sendPatientQuestion = () => {
    if (aiThinking || (!messageText.trim() && !pendingFile)) return;
    const text = messageText.trim() || `Вложение: ${fileName(pendingFile)}`;
    const file = pendingFile;
    const patientId = activePatient.id;
    const patientFullName = activePatient.fullName;
    const patientMessage = {
      id: `m-${Date.now()}`,
      role: "patient",
      senderName: patientFullName,
      senderRole: "Пациент",
      text,
      file,
      createdAt: now(),
      read: true
    };
    addMessageToPatient(patientId, patientMessage);
    setMessageText("");
    setPendingFile(null);
    setAiThinking(true);
    setTimeout(() => {
      const answer = findAnswer(text);
      const aiMessage = {
        id: `m-ai-${Date.now()}`,
        role: "ai",
        senderName: "KazONCO AI",
        senderRole: "AI-агент",
        text: file ? `${answer.text}\n\nВложение принято. Медицинскую интерпретацию фото или документа должен подтвердить врач.` : answer.text,
        createdAt: now(),
        read: true
      };
      addMessageToPatient(patientId, aiMessage, { status: answer.status });
      if (answer.status === "Требует внимания" || answer.status === "Передано специалисту") {
        log(`AI пометил обращение пациента ${patientFullName}: ${answer.status}`);
      }
      setAiThinking(false);
      setTimeout(() => chatScrollRef.current?.scrollToEnd({ animated: true }), 40);
    }, 420);
  };

  const sendStaffReply = () => {
    if (!staff || (!staffReply.trim() && !pendingFile)) return;
    const message = {
      id: `m-staff-${Date.now()}`,
      role: "staff",
      senderName: staff.fullName,
      senderRole: roles[staff.role],
      text: staffReply.trim() || `Вложение: ${fileName(pendingFile)}`,
      file: pendingFile,
      createdAt: now(),
      read: false
    };
    addMessageToPatient(activePatient.id, message, { status: "Ответ сотрудника", unreadDelta: 1 });
    setStaffReply("");
    setPendingFile(null);
    log(`${staff.fullName} ответил пациенту ${activePatient.fullName}`);
  };

  const addFaq = () => {
    if (!newFaqTitle.trim() || !newFaqAnswer.trim()) return;
    setKnowledge((items) => [
      { id: `kb-${Date.now()}`, title: newFaqTitle.trim(), answer: newFaqAnswer.trim(), category: "Проверено врачом" },
      ...items
    ]);
    log(`Добавлен материал базы знаний: ${newFaqTitle}`);
    setNewFaqTitle("");
    setNewFaqAnswer("");
  };

  const addEmployee = () => {
    if (!newEmployeeName.trim() || !newEmployeeLogin.trim() || !newEmployeePassword.trim()) return;
    setEmployees((items) => [
      { login: newEmployeeLogin.trim(), password: newEmployeePassword, fullName: newEmployeeName.trim(), role: "doctor", blocked: false },
      ...items
    ]);
    log(`Создан сотрудник: ${newEmployeeLogin}`);
    setNewEmployeeName("");
    setNewEmployeeLogin("");
    setNewEmployeePassword("");
  };

  const toggleEmployee = (login) => {
    setEmployees((items) => items.map((item) => (item.login === login ? { ...item, blocked: !item.blocked } : item)));
    log(`Изменен статус сотрудника: ${login}`);
  };

  const renderLogin = () => (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.loginWrap}>
        <View style={styles.card}>
          <Text style={styles.logo}>KazONCO AI</Text>
          <Text style={styles.title}>Вход пациента</Text>
          <Text style={styles.muted}>AI отвечает только на основании утвержденной базы знаний КазНИИОиР.</Text>
          <TextInput style={styles.input} placeholder="Введите ФИО пациента" value={patientName} onChangeText={setPatientName} />
          <TextInput style={styles.input} placeholder="Введите ИИН (необязательно)" value={iin} onChangeText={setIin} keyboardType="numeric" />
          <TouchableOpacity style={styles.primaryButton} onPress={loginPatient}><Text style={styles.primaryText}>Войти</Text></TouchableOpacity>
        </View>
        <View style={styles.card}>
          <Text style={styles.titleSmall}>Вход сотрудника</Text>
          <TextInput style={styles.input} placeholder="Логин" value={staffLogin} onChangeText={setStaffLogin} autoCapitalize="none" />
          <TextInput style={styles.input} placeholder="Пароль" value={staffPassword} onChangeText={setStaffPassword} secureTextEntry />
          <TouchableOpacity style={styles.secondaryButton} onPress={loginStaff}><Text style={styles.secondaryText}>Панель сотрудника</Text></TouchableOpacity>
          <Text style={styles.hint}>Демо: doctor / doctor123, admin / admin123, director / director123, superadmin / super123</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );

  const renderChat = () => {
    return (
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === "ios" ? "padding" : undefined} keyboardVerticalOffset={6}>
        <View style={styles.flex}>
          <ScrollView
            ref={chatScrollRef}
            style={styles.chat}
            contentContainerStyle={styles.chatContent}
            keyboardShouldPersistTaps="handled"
            onContentSizeChange={() => chatScrollRef.current?.scrollToEnd({ animated: false })}
            onScroll={(event) => {
              const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
              setShowScrollDown(contentSize.height - contentOffset.y - layoutMeasurement.height > 150);
            }}
            scrollEventThrottle={80}
          >
            {activePatient.messages.map((message) => <MessageBubble key={message.id} message={message} onOpenFile={openFile} />)}
          </ScrollView>
          {showScrollDown ? (
            <TouchableOpacity style={styles.scrollDownButton} onPress={() => chatScrollRef.current?.scrollToEnd({ animated: true })}><Text style={styles.scrollDownText}>↓</Text></TouchableOpacity>
          ) : null}
          <TouchableOpacity style={styles.routeFab} onPress={() => setRouteOpen(true)}>
            <Text style={styles.routeFabIcon}>⌘</Text><Text style={styles.routeFabText}>Маршрут</Text>
          </TouchableOpacity>
          {aiThinking ? <View style={styles.aiThinking}><Text style={styles.aiThinkingDot}>●</Text><Text style={styles.aiThinkingText}>Поиск в базе знаний…</Text></View> : null}
          {pendingFile ? <FilePreview file={pendingFile} onOpen={openFile} /> : null}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.quickQuestions} keyboardShouldPersistTaps="handled">
            {quickPatientQuestions.map((question) => (
              <TouchableOpacity key={question} style={styles.quickQuestion} onPress={() => setMessageText(question)}>
                <Text style={styles.quickQuestionText}>{question}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <View style={styles.composer}>
            <TouchableOpacity style={styles.attachCircle} onPress={pickDocument}><Text style={styles.attachCircleText}>＋</Text></TouchableOpacity>
            <TextInput style={styles.messageInput} placeholder="Напишите сообщение..." value={messageText} onChangeText={setMessageText} returnKeyType="send" onSubmitEditing={sendPatientQuestion} />
            <TouchableOpacity style={[styles.sendButton, aiThinking && styles.sendButtonDisabled]} disabled={aiThinking} onPress={sendPatientQuestion}><Text style={styles.sendText}>➤</Text></TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.patientSafetyBar} onPress={() => setSafetyExpanded((value) => !value)} activeOpacity={0.8}>
            <Text style={styles.patientSafetyTitle}>ⓘ AI не ставит диагноз и не заменяет врача</Text>
            <Text style={styles.patientSafetyChevron}>{safetyExpanded ? "⌃" : "⌄"}</Text>
          </TouchableOpacity>
          {safetyExpanded ? <Text style={styles.patientSafetyDetails}>AI-помощник отвечает по проверенным материалам и не меняет назначения врача. При опасных симптомах срочно обратитесь за медицинской помощью.</Text> : null}
        </View>
      </KeyboardAvoidingView>
    );
  };

  const renderFaq = () => (
    <ScrollView contentContainerStyle={styles.content}>
      {knowledge.map((item) => (
        <View key={item.id} style={styles.card}>
          <View style={styles.rowBetween}>
            <Text style={styles.titleSmall}>{item.title}</Text>
            <Pill>{item.category}</Pill>
          </View>
          <Text style={styles.text}>{item.answer}</Text>
        </View>
      ))}
    </ScrollView>
  );

  const renderNavigation = () => (
    <ScrollView contentContainerStyle={styles.content}>
      {navigationItems.map((item) => (
        <View key={item.title} style={styles.card}>
          <Text style={styles.titleSmall}>{item.title}</Text>
          <Text style={styles.muted}>{item.place}</Text>
          <Text style={styles.text}>{item.route}</Text>
        </View>
      ))}
    </ScrollView>
  );

  const renderAppeals = () => (
    <ScrollView contentContainerStyle={styles.content}>
      <View style={styles.card}>
        <Text style={styles.titleSmall}>{activePatient.fullName}</Text>
        <Text style={styles.muted}>Статус: {activePatient.status}</Text>
        <Text style={styles.muted}>Сообщений: {activePatient.messages.length}</Text>
        <Text style={styles.muted}>Файлов: {activePatient.files.length}</Text>
      </View>
      {activePatient.files.map((file, index) => <FilePreview key={`${fileName(file)}-${index}`} file={file} onOpen={openFile} />)}
    </ScrollView>
  );

  const renderRequests = () => (
    <View style={styles.flex}>
      <ScrollView horizontal style={styles.patientStrip} contentContainerStyle={styles.patientStripContent}>
        {patients.map((patient) => (
          <TouchableOpacity key={patient.id} style={[styles.patientTab, patient.id === activePatient.id && styles.patientTabActive]} onPress={() => setActivePatientId(patient.id)}>
            <Text style={styles.patientTabTitle}>{patient.fullName}</Text>
            <Text style={styles.patientTabMeta}>{patient.status}{patient.unread ? ` · ${patient.unread} непроч.` : ""}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <ScrollView style={styles.chat} contentContainerStyle={styles.chatContent}>
        {activePatient.messages.map((message) => <MessageBubble key={message.id} message={message} onOpenFile={openFile} />)}
      </ScrollView>
      {pendingFile ? <FilePreview file={pendingFile} onOpen={openFile} /> : null}
      <View style={styles.staffComposer}>
        <TextInput style={styles.staffReply} placeholder="Ответ пациенту" value={staffReply} onChangeText={setStaffReply} multiline />
        <View style={styles.row}>
          <TouchableOpacity style={styles.iconButton} onPress={pickPhoto}><Text style={styles.iconText}>Фото</Text></TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={pickDocument}><Text style={styles.iconText}>Файл</Text></TouchableOpacity>
          <TouchableOpacity style={styles.primaryButtonSmall} onPress={sendStaffReply}><Text style={styles.primaryText}>Отправить</Text></TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderKnowledgeAdmin = () => (
    <ScrollView contentContainerStyle={styles.content}>
      <View style={styles.card}>
        <Text style={styles.titleSmall}>Добавить материал базы знаний</Text>
        <TextInput style={styles.input} placeholder="Вопрос / заголовок" value={newFaqTitle} onChangeText={setNewFaqTitle} />
        <TextInput style={[styles.input, styles.textArea]} placeholder="Проверенный ответ" value={newFaqAnswer} onChangeText={setNewFaqAnswer} multiline />
        <TouchableOpacity style={styles.primaryButton} onPress={addFaq}><Text style={styles.primaryText}>Опубликовать</Text></TouchableOpacity>
      </View>
      {knowledge.map((item) => (
        <View key={item.id} style={styles.card}>
          <Text style={styles.titleSmall}>{item.title}</Text>
          <Text style={styles.text}>{item.answer}</Text>
        </View>
      ))}
    </ScrollView>
  );

  const renderSuperAdmin = () => (
    <ScrollView contentContainerStyle={styles.content}>
      <View style={styles.card}>
        <Text style={styles.titleSmall}>Добавить сотрудника</Text>
        <TextInput style={styles.input} placeholder="ФИО сотрудника" value={newEmployeeName} onChangeText={setNewEmployeeName} />
        <TextInput style={styles.input} placeholder="Логин" value={newEmployeeLogin} onChangeText={setNewEmployeeLogin} autoCapitalize="none" />
        <TextInput style={styles.input} placeholder="Пароль" value={newEmployeePassword} onChangeText={setNewEmployeePassword} />
        <TouchableOpacity style={styles.primaryButton} onPress={addEmployee}><Text style={styles.primaryText}>Создать</Text></TouchableOpacity>
      </View>
      {employees.map((employee) => (
        <View key={employee.login} style={styles.card}>
          <Text style={styles.titleSmall}>{employee.fullName}</Text>
          <Text style={styles.muted}>{roles[employee.role]} · {employee.login}</Text>
          <TouchableOpacity style={styles.secondaryButton} onPress={() => toggleEmployee(employee.login)}>
            <Text style={styles.secondaryText}>{employee.blocked ? "Разблокировать" : "Заблокировать"}</Text>
          </TouchableOpacity>
        </View>
      ))}
      <Text style={styles.sectionTitle}>Журнал действий</Text>
      {audit.map((item) => (
        <View key={item.id} style={styles.card}>
          <Text style={styles.text}>{item.text}</Text>
          <Text style={styles.muted}>{item.user} · {formatDate(item.date)}</Text>
        </View>
      ))}
    </ScrollView>
  );

  const renderAnalytics = () => {
    const messages = patients.reduce((sum, patient) => sum + patient.messages.length, 0);
    const aiAnswers = patients.reduce((sum, patient) => sum + patient.messages.filter((message) => message.role === "ai").length, 0);
    const staffAnswers = patients.reduce((sum, patient) => sum + patient.messages.filter((message) => message.role === "staff").length, 0);
    const critical = patients.filter((patient) => patient.status === "Требует внимания").length;
    return (
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.statsGrid}>
          <StatCard value={patients.length} label="Пациентов" />
          <StatCard value={messages} label="Обращений" />
          <StatCard value={aiAnswers} label="Ответов AI" />
          <StatCard value={staffAnswers} label="Ответов врача" />
          <StatCard value={critical} label="Критические" danger />
          <StatCard value="4.8" label="Рейтинг" />
        </View>
      </ScrollView>
    );
  };

  const renderSafety = () => (
    <ScrollView contentContainerStyle={styles.content}>
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Безопасность AI</Text>
        <Text style={styles.text}>AI использует проверенную базу знаний КазНИИОиР, не ставит диагноз, не назначает лечение и не меняет дозировки препаратов.</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.titleSmall}>Когда нужен врач срочно</Text>
        <Text style={styles.text}>Кровотечение, выраженная одышка, потеря сознания, сильная боль, высокая температура или резкое ухудшение состояния требуют срочного обращения за медицинской помощью.</Text>
      </View>
    </ScrollView>
  );

  const patientTabs = [
    ["chat", "Чат"],
    ["appeals", "Пациент"],
    ["safety", "Безопасность"]
  ];

  const staffTabs = [
    ["requests", "Обращения"],
    ["kb", "База знаний"],
    ["analytics", "Аналитика"]
  ];
  if (staff?.role === "superadmin") staffTabs.push(["super", "Супер-админ"]);

  if (mode === "patient-login") return renderLogin();

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        <View style={styles.mobileHeaderLeft}>
          <Text style={styles.mobileMenuIcon}>☰</Text>
          <View style={styles.headerBrandBlock}>
            <Text style={styles.logo}>KazONCO AI</Text>
            <Text numberOfLines={1} style={styles.headerStatus}>● {isStaff ? `${staff.fullName} · ${roles[staff.role]}` : "AI-помощник КазНИИОиР"}</Text>
          </View>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.languageBadge} onPress={() => setProfileOpen(true)}><Text style={styles.languageBadgeText}>🌐</Text></TouchableOpacity>
          <TouchableOpacity style={styles.avatarButton} onPress={() => setProfileOpen(true)}>
            <Text style={styles.avatarText}>{(isStaff ? staff.fullName : activePatient.fullName).trim().charAt(0).toUpperCase() || "П"}</Text>
            <View style={styles.avatarOnline} />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.tabs}>
        {(isStaff ? staffTabs : patientTabs).map(([key, label]) => (
          <TouchableOpacity key={key} style={[styles.tab, activeTab === key && styles.tabActive]} onPress={() => setActiveTab(key)}>
            <Text style={[styles.tabText, activeTab === key && styles.tabTextActive]}>{label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {isPatient && activeTab === "chat" ? renderChat() : null}
      {isPatient && activeTab === "appeals" ? renderAppeals() : null}
      {isPatient && activeTab === "safety" ? renderSafety() : null}
      {isStaff && activeTab === "requests" ? renderRequests() : null}
      {isStaff && activeTab === "kb" ? renderKnowledgeAdmin() : null}
      {isStaff && activeTab === "analytics" ? renderAnalytics() : null}
      {isStaff && activeTab === "super" ? renderSuperAdmin() : null}
      {!(isPatient && activeTab === "chat") ? <Text style={styles.footer}>© IT-System Solution • Тимченко Евгений Юрьевич</Text> : null}
      <Modal visible={profileOpen} transparent animationType="fade" onRequestClose={() => setProfileOpen(false)}>
        <TouchableOpacity style={styles.profileOverlay} activeOpacity={1} onPress={() => setProfileOpen(false)}>
          <View style={styles.profileMenu} onStartShouldSetResponder={() => true}>
            <Text style={styles.profileName}>{isStaff ? staff.fullName : activePatient.fullName}</Text>
            <Text style={styles.profileRole}>{isStaff ? roles[staff.role] : "Профиль пациента"}</Text>
            <TouchableOpacity style={styles.profileAction} onPress={() => { setProfileOpen(false); if (isPatient) setActiveTab("appeals"); }}><Text style={styles.profileActionText}>👤 Профиль</Text></TouchableOpacity>
            <View style={styles.profileLanguages}><Text style={styles.profileLanguageActive}>RU</Text><Text style={styles.profileLanguage}>KZ</Text><Text style={styles.profileLanguage}>EN</Text></View>
            <TouchableOpacity style={styles.profileActionDanger} onPress={confirmLogout}><Text style={styles.profileDangerText}>↪ Выйти</Text></TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
      <Modal visible={routeOpen} transparent animationType="slide" onRequestClose={() => setRouteOpen(false)}>
        <View style={styles.routeOverlay}>
          <TouchableOpacity style={styles.routeBackdrop} activeOpacity={1} onPress={() => setRouteOpen(false)} />
          <View style={styles.routeSheet}>
            <View style={styles.routeHandle} />
            <View style={styles.rowBetween}><View><Text style={styles.titleSmall}>Маршрут пациента</Text><Text style={styles.muted}>Не закрывает текущий чат</Text></View><TouchableOpacity style={styles.routeClose} onPress={() => setRouteOpen(false)}><Text style={styles.routeCloseText}>×</Text></TouchableOpacity></View>
            <ScrollView style={{ maxHeight: 360 }} contentContainerStyle={{ paddingTop: 10 }}>
              {navigationItems.map((item, index) => (
                <View key={item.title} style={styles.routeSheetItem}><Text style={styles.routeStep}>{index + 1}</Text><View style={{ flex: 1 }}><Text style={styles.titleSmall}>{item.title}</Text><Text style={styles.muted}>{item.place}</Text><Text style={styles.text}>{item.route}</Text></View></View>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
      <Modal visible={Boolean(viewerFile)} transparent animationType="fade">
        <View style={styles.modal}>
          <TouchableOpacity style={styles.modalClose} onPress={() => setViewerFile(null)}><Text style={styles.primaryText}>Закрыть</Text></TouchableOpacity>
          {viewerFile?.uri ? <Image source={{ uri: viewerFile.uri }} style={styles.modalImage} resizeMode="contain" /> : null}
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#f4f7f8" },
  flex: { flex: 1 },
  loginWrap: { padding: 18, gap: 14 },
  card: { marginBottom: 12, padding: 16, borderRadius: 8, backgroundColor: "white", borderWidth: 1, borderColor: "#d8e3e7", gap: 10 },
  assistantBanner: { margin: 12, marginBottom: 0, padding: 14, borderRadius: 8, backgroundColor: "#e8f4f8", borderWidth: 1, borderColor: "#b9dce8", gap: 6 },
  quickQuestions: { paddingHorizontal: 12, paddingVertical: 8, gap: 8 },
  quickQuestion: { maxWidth: 240, paddingHorizontal: 12, paddingVertical: 9, borderRadius: 18, backgroundColor: "white", borderWidth: 1, borderColor: "#b9dce8" },
  quickQuestionText: { color: "#0f6c8f", fontWeight: "700", fontSize: 12 },
  header: { minHeight: 54, paddingHorizontal: 10, paddingVertical: 5, borderBottomWidth: 1, borderBottomColor: "#d8e3e7", backgroundColor: "white", flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 8 },
  mobileHeaderLeft: { flexDirection: "row", alignItems: "center", gap: 9, flex: 1 },
  mobileMenuIcon: { color: "#073c5b", fontSize: 22, fontWeight: "800" },
  headerStatus: { color: "#64727d", fontSize: 11, marginTop: 2 },
  headerActions: { flexDirection: "row", alignItems: "center", gap: 3 },
  languageBadge: { width: 34, height: 34, borderRadius: 10, alignItems: "center", justifyContent: "center", backgroundColor: "white" },
  languageBadgeText: { color: "#073c5b", fontSize: 18, fontWeight: "900" },
  avatarButton: { position: "relative", width: 34, height: 34, borderRadius: 17, backgroundColor: "#0f6c8f", alignItems: "center", justifyContent: "center" },
  avatarText: { color: "white", fontSize: 15, fontWeight: "900" },
  avatarOnline: { position: "absolute", right: 0, bottom: 0, width: 10, height: 10, borderRadius: 5, backgroundColor: "#28b36b", borderWidth: 2, borderColor: "white" },
  logo: { color: "#073c5b", fontSize: 20, fontWeight: "900" },
  title: { fontSize: 24, color: "#1e2933", fontWeight: "800" },
  titleSmall: { fontSize: 17, color: "#1e2933", fontWeight: "800" },
  sectionTitle: { marginVertical: 8, color: "#073c5b", fontSize: 18, fontWeight: "900" },
  muted: { color: "#64727d", lineHeight: 20 },
  hint: { color: "#64727d", fontSize: 12, lineHeight: 18 },
  text: { color: "#1e2933", fontSize: 16, lineHeight: 23 },
  input: { minHeight: 44, borderWidth: 1, borderColor: "#d8e3e7", borderRadius: 8, paddingHorizontal: 12, backgroundColor: "#fbfdfe" },
  textArea: { minHeight: 110, paddingTop: 12, textAlignVertical: "top" },
  primaryButton: { minHeight: 46, borderRadius: 8, backgroundColor: "#0f6c8f", alignItems: "center", justifyContent: "center", paddingHorizontal: 16 },
  primaryButtonSmall: { minHeight: 40, borderRadius: 8, backgroundColor: "#0f6c8f", alignItems: "center", justifyContent: "center", paddingHorizontal: 14 },
  primaryText: { color: "white", fontWeight: "900" },
  secondaryButton: { minHeight: 42, borderRadius: 8, borderWidth: 1, borderColor: "#0f6c8f", alignItems: "center", justifyContent: "center", paddingHorizontal: 14 },
  secondaryText: { color: "#0f6c8f", fontWeight: "800" },
  logoutButton: { minHeight: 36, borderRadius: 8, borderWidth: 1, borderColor: "#d8e3e7", alignItems: "center", justifyContent: "center", paddingHorizontal: 12 },
  tabs: { flexDirection: "row", gap: 5, paddingHorizontal: 8, paddingVertical: 6, backgroundColor: "white", borderBottomWidth: 1, borderBottomColor: "#edf2f5" },
  tab: { flex: 1, minHeight: 40, paddingHorizontal: 8, borderRadius: 14, backgroundColor: "#fff", borderWidth: 1, borderColor: "#d8e3e7", alignItems: "center", justifyContent: "center" },
  tabActive: { backgroundColor: "#e8f6fd", borderColor: "#b7dff2" },
  tabText: { color: "#64727d", fontWeight: "800", fontSize: 13 },
  tabTextActive: { color: "#075fa9" },
  content: { padding: 14, paddingBottom: 90 },
  chat: { flex: 1 },
  chatContent: { padding: 12, gap: 10, paddingBottom: 70 },
  message: { padding: 12, borderRadius: 16, maxWidth: "90%", gap: 6 },
  patientMessage: { alignSelf: "flex-end", backgroundColor: "#eef7ff", borderWidth: 1, borderColor: "#7eb6ee" },
  aiMessage: { alignSelf: "flex-start", backgroundColor: "white", borderWidth: 1, borderColor: "#d8e3e7" },
  staffMessage: { alignSelf: "flex-start", backgroundColor: "#eef8fb", borderWidth: 1, borderColor: "#b7d9e6" },
  sender: { color: "#073c5b", fontWeight: "900" },
  senderRole: { color: "#64727d", fontSize: 12, fontWeight: "700" },
  patientText: { color: "#1e2933", fontSize: 16, lineHeight: 23 },
  patientSubtext: { color: "#64727d" },
  readStatus: { marginTop: 4, color: "#64727d", fontSize: 12 },
  composer: { flexDirection: "row", gap: 6, marginHorizontal: 9, marginVertical: 6, padding: 6, borderWidth: 1, borderColor: "#dce5eb", borderRadius: 17, backgroundColor: "white", alignItems: "center" },
  attachCircle: { width: 38, height: 38, borderRadius: 12, alignItems: "center", justifyContent: "center", backgroundColor: "#eef4f7" },
  attachCircleText: { color: "#073c5b", fontSize: 22, fontWeight: "700" },
  patientSafetyNote: { paddingHorizontal: 18, paddingVertical: 7, color: "#667788", fontSize: 10, lineHeight: 15, textAlign: "center", backgroundColor: "white" },
  patientBottomActions: { flexDirection: "row", gap: 8, paddingHorizontal: 10, paddingBottom: 10, backgroundColor: "white" },
  routeAction: { flex: 1, minHeight: 54, paddingHorizontal: 10, borderWidth: 1, borderColor: "#dce5eb", borderRadius: 14, flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: "white" },
  exitAction: { flex: 1, minHeight: 54, paddingHorizontal: 10, borderWidth: 1, borderColor: "#dce5eb", borderRadius: 14, flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: "white" },
  routeActionIcon: { color: "#075fa9", fontSize: 22, fontWeight: "900" },
  exitActionIcon: { color: "#d52222", fontSize: 22, fontWeight: "900" },
  routeActionTitle: { color: "#075fa9", fontSize: 13, fontWeight: "900" },
  exitActionTitle: { color: "#d52222", fontSize: 13, fontWeight: "900" },
  routeActionHint: { color: "#75828d", fontSize: 9, marginTop: 2 },
  staffComposer: { gap: 8, padding: 10, borderTopWidth: 1, borderTopColor: "#d8e3e7", backgroundColor: "white" },
  staffReply: { minHeight: 72, borderWidth: 1, borderColor: "#d8e3e7", borderRadius: 8, padding: 10, textAlignVertical: "top" },
  iconButton: { minHeight: 40, borderRadius: 8, backgroundColor: "#dceff5", justifyContent: "center", paddingHorizontal: 10 },
  iconText: { color: "#073c5b", fontWeight: "800", fontSize: 12 },
  messageInput: { flex: 1, minHeight: 44, borderWidth: 0, borderRadius: 10, paddingHorizontal: 8, backgroundColor: "white", fontSize: 16 },
  sendButton: { width: 44, height: 44, borderRadius: 12, alignItems: "center", justifyContent: "center", backgroundColor: "#0f6c8f" },
  sendText: { color: "white", fontWeight: "900", fontSize: 18 },
  fileBox: { marginHorizontal: 14, marginVertical: 6, padding: 10, borderRadius: 8, borderWidth: 1, borderColor: "#d8e3e7", backgroundColor: "white", flexDirection: "row", gap: 10, alignItems: "center" },
  fileImage: { width: 56, height: 56, borderRadius: 8, backgroundColor: "#dceff5" },
  fileIcon: { width: 56, height: 56, borderRadius: 8, backgroundColor: "#dceff5", color: "#073c5b", textAlign: "center", textAlignVertical: "center", fontWeight: "900" },
  fileName: { color: "#1e2933", fontWeight: "800" },
  row: { flexDirection: "row", gap: 8, alignItems: "center" },
  rowBetween: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 10 },
  pill: { paddingHorizontal: 9, paddingVertical: 5, borderRadius: 999, backgroundColor: "#dceff5", color: "#073c5b", fontSize: 12, fontWeight: "900" },
  pillDanger: { backgroundColor: "#f8e2df", color: "#ba3329" },
  patientStrip: { maxHeight: 88, borderBottomWidth: 1, borderBottomColor: "#d8e3e7", backgroundColor: "#fbfdfe" },
  patientStripContent: { padding: 10, gap: 8 },
  patientTab: { width: 220, padding: 10, borderRadius: 8, borderWidth: 1, borderColor: "#d8e3e7", backgroundColor: "white" },
  patientTabActive: { borderColor: "#0f6c8f", backgroundColor: "#dceff5" },
  patientTabTitle: { color: "#1e2933", fontWeight: "900" },
  patientTabMeta: { color: "#64727d", fontSize: 12, marginTop: 4 },
  statsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  statCard: { width: "47%", minHeight: 96, padding: 14, borderRadius: 8, backgroundColor: "white", borderWidth: 1, borderColor: "#d8e3e7", justifyContent: "center" },
  statDanger: { backgroundColor: "#fff8f7" },
  statValue: { color: "#073c5b", fontSize: 28, fontWeight: "900" },
  dangerText: { color: "#ba3329" },
  footer: { padding: 8, textAlign: "center", color: "#64727d", fontSize: 11, backgroundColor: "#eef4f6" },
  headerBrandBlock: { flex: 1, minWidth: 0 },
  knowledgeRow: { marginTop: 8, paddingTop: 8, borderTopWidth: 1, borderTopColor: "#edf2f5", flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 8 },
  knowledgeBadge: { flex: 1, color: "#1f7a58", fontSize: 10, fontWeight: "800" },
  sourceLink: { color: "#0f6c8f", fontSize: 11, fontWeight: "800", paddingVertical: 6, paddingHorizontal: 8 },
  aiThinking: { minHeight: 32, paddingHorizontal: 14, flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: "#fbfdff" },
  aiThinkingDot: { color: "#28a46a", fontSize: 12 },
  aiThinkingText: { color: "#64727d", fontSize: 12 },
  sendButtonDisabled: { opacity: 0.5 },
  patientSafetyBar: { minHeight: 38, paddingHorizontal: 12, borderTopWidth: 1, borderTopColor: "#edf2f5", backgroundColor: "white", flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 8 },
  patientSafetyTitle: { flex: 1, color: "#5a6b79", fontSize: 12, fontWeight: "700" },
  patientSafetyChevron: { color: "#64727d", fontSize: 14, fontWeight: "800" },
  patientSafetyDetails: { paddingHorizontal: 14, paddingBottom: 9, backgroundColor: "white", color: "#667788", fontSize: 12, lineHeight: 17 },
  routeFab: { position: "absolute", zIndex: 8, right: 12, bottom: 137, minHeight: 38, paddingHorizontal: 12, borderRadius: 19, borderWidth: 1, borderColor: "#b9dce8", backgroundColor: "white", flexDirection: "row", alignItems: "center", gap: 6, shadowColor: "#073c5b", shadowOpacity: 0.12, shadowRadius: 10, elevation: 4 },
  routeFabIcon: { color: "#075fa9", fontSize: 17, fontWeight: "900" },
  routeFabText: { color: "#075fa9", fontSize: 12, fontWeight: "900" },
  scrollDownButton: { position: "absolute", zIndex: 8, left: 12, bottom: 137, width: 38, height: 38, borderRadius: 19, borderWidth: 1, borderColor: "#d8e3e7", backgroundColor: "white", alignItems: "center", justifyContent: "center", elevation: 4 },
  scrollDownText: { color: "#0f6c8f", fontSize: 18, fontWeight: "900" },
  profileOverlay: { flex: 1, backgroundColor: "rgba(7,60,91,0.12)", alignItems: "flex-end", paddingTop: 58, paddingRight: 10 },
  profileMenu: { width: 278, padding: 10, borderRadius: 16, borderWidth: 1, borderColor: "#d8e3e7", backgroundColor: "white", gap: 7, elevation: 10 },
  profileName: { color: "#1e2933", fontSize: 16, fontWeight: "900", paddingHorizontal: 7, paddingTop: 4 },
  profileRole: { color: "#64727d", fontSize: 11, paddingHorizontal: 7, paddingBottom: 5 },
  profileAction: { minHeight: 44, paddingHorizontal: 10, borderRadius: 11, backgroundColor: "#f8fbfc", justifyContent: "center" },
  profileActionText: { color: "#1e2933", fontSize: 14, fontWeight: "800" },
  profileLanguages: { flexDirection: "row", gap: 6 },
  profileLanguage: { flex: 1, minHeight: 38, paddingVertical: 10, textAlign: "center", borderRadius: 10, borderWidth: 1, borderColor: "#d8e3e7", color: "#64727d", fontWeight: "800" },
  profileLanguageActive: { flex: 1, minHeight: 38, paddingVertical: 10, textAlign: "center", borderRadius: 10, backgroundColor: "#e8f6fd", color: "#075fa9", fontWeight: "900" },
  profileActionDanger: { minHeight: 44, paddingHorizontal: 10, borderRadius: 11, backgroundColor: "#fff7f7", justifyContent: "center" },
  profileDangerText: { color: "#c92626", fontSize: 14, fontWeight: "900" },
  routeOverlay: { flex: 1, justifyContent: "flex-end" },
  routeBackdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(7,60,91,0.18)" },
  routeSheet: { maxHeight: "68%", padding: 14, paddingBottom: 24, borderTopLeftRadius: 22, borderTopRightRadius: 22, backgroundColor: "white", elevation: 16 },
  routeHandle: { width: 42, height: 4, borderRadius: 2, backgroundColor: "#d5e0e5", alignSelf: "center", marginBottom: 12 },
  routeClose: { width: 36, height: 36, borderRadius: 10, borderWidth: 1, borderColor: "#d8e3e7", alignItems: "center", justifyContent: "center" },
  routeCloseText: { color: "#073c5b", fontSize: 22, fontWeight: "700" },
  routeSheetItem: { flexDirection: "row", gap: 10, paddingVertical: 11, borderBottomWidth: 1, borderBottomColor: "#edf2f5" },
  routeStep: { width: 28, height: 28, borderRadius: 14, backgroundColor: "#e8f6fd", color: "#075fa9", textAlign: "center", textAlignVertical: "center", fontSize: 12, fontWeight: "900" },
  modal: { flex: 1, backgroundColor: "rgba(0,0,0,0.9)", alignItems: "center", justifyContent: "center" },
  modalClose: { position: "absolute", top: 42, right: 16, zIndex: 2, paddingHorizontal: 14, minHeight: 40, borderRadius: 8, backgroundColor: "#0f6c8f", alignItems: "center", justifyContent: "center" },
  modalImage: { width: "96%", height: "78%" }
});
