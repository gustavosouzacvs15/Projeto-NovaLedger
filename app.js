const transactions = [
  { id: 1, description: 'Assinatura SaaS', category: 'Despesa', amount: -420, date: '2026-05-18', notes: 'Plano premium' },
  { id: 2, description: 'Recebimento Cliente A', category: 'Receita', amount: 12850, date: '2026-05-19', notes: 'Faturamento mensal' },
  { id: 3, description: 'Aplicação de reserva', category: 'Investimento', amount: -3200, date: '2026-05-20', notes: 'Tesouro direto' },
  { id: 4, description: 'Consultoria', category: 'Receita', amount: 6500, date: '2026-05-21', notes: 'Projeto de automação' },
];

let currentFilter = 'all';
let editingId = null;
let autoRefreshTimer = null;

const txBody = document.getElementById('transactionsTableBody');
const searchInput = document.getElementById('searchInput');
const chips = document.querySelectorAll('.chip');
const modal = document.getElementById('transactionModal');
const backdrop = document.getElementById('modalBackdrop');
const sidebar = document.getElementById('sidebar');
const collapseBtn = document.getElementById('collapseSidebar');
const menuBtn = document.getElementById('menuBtn');
const settingsBtn = document.getElementById('settingsBtn');
const notificationsBtn = document.getElementById('notificationsBtn');
const notificationsPanel = document.getElementById('notificationsPanel');
const closeNotificationsBtn = document.getElementById('closeNotificationsBtn');
const profileBtn = document.getElementById('profileBtn');
const profileMenu = document.getElementById('profileMenu');
const closeProfileBtn = document.getElementById('closeProfileBtn');
const logoutBtn = document.getElementById('logoutBtn');
const dashboardApp = document.getElementById('dashboardApp');
const authScreen = document.getElementById('authScreen');
const registerForm = document.getElementById('registerForm');
const loginForm = document.getElementById('loginForm');
const profileNameLabel = document.getElementById('profileNameLabel');
const profileEmailLabel = document.getElementById('profileEmailLabel');
const profilePlanLabel = document.getElementById('profilePlanLabel');
const profileStatusLabel = document.getElementById('profileStatusLabel');
const profileLastLabel = document.getElementById('profileLastLabel');
const sidebarUserName = document.getElementById('sidebarUserName');
const sidebarUsageLabel = document.getElementById('sidebarUsageLabel');
const notificationsList = document.getElementById('notificationsList');
const sidebarUserRole = document.getElementById('sidebarUserRole');
const sidebarAvatar = document.getElementById('sidebarAvatar');
const showRegisterBtn = document.getElementById('showRegisterBtn');
const backToLoginBtn = document.getElementById('backToLoginBtn');
const settingsPanel = document.getElementById('settingsPanel');
const settingsNav = document.getElementById('settingsNav');
const closeSettingsBtn = document.getElementById('closeSettingsBtn');
const applySettingsBtn = document.getElementById('applySettingsBtn');
const topBar = document.getElementById('topBar');

const translations = {
  pt: {
    alertsActive: 'Alertas ativos',
    alertsPaused: 'Alertas pausados',
    autoRefresh: 'Auto refresh',
    manualRefresh: 'Atualização manual',
    monthlyFlow: 'Fluxo mensal',
    quickSummary: 'Resumo rápido',
    coverageTitle: 'Cobertura',
    transactionsLabel: 'Transações',
    transactionsTitle: 'Fluxo detalhado',
    goalsLabel: 'Metas financeiras',
    goalsTitle: 'Progresso atual',
    reportsLabel: 'Indicadores',
    reportsTitle: 'Performance',
    settingsLabel: 'Configurações',
    settingsTitle: 'Painel financeiro',
    panelLabel: 'Painel Financeiro',
    dashboardTitle: 'Dashboard premium',
    authBadge: 'Acesso obrigatório',
    authTitle: 'Crie sua conta e entre para abrir o painel financeiro',
    authDescription: 'Antes de ver os gráficos, metas e transações, defina sua conta e faça login para continuar.',
    authPoint1: '• Cadastro rápido com nome, e-mail e senha.',
    authPoint2: '• Login seguro para acessar o dashboard.',
    authPoint3: '• Menu de perfil com sair e dados da conta.',
    loginTitle: 'Entrar',
    loginBtn: 'Entrar',
    createAccountBtn: 'Criar conta',
    registerTitle: 'Criar conta',
    registerSubmitBtn: 'Criar conta',
    backToLoginBtn: 'Voltar para entrar',
    applySettingsBtn: 'Aplicar configurações',
    currencyLabel: 'Moeda',
    timezoneLabel: 'Fuso horário',
    backupLabel: 'Backup automático',
    emailReminderLabel: 'Lembretes por e-mail',
    dateFormatLabel: 'Formato de data',
    showGoalsLabel: 'Exibir metas financeiras',
    autoRefreshLabel: 'Atualização automática do painel',
    alertsLabel: 'Alertas de fluxo de caixa',
    csvLabel: 'Exportação automática em CSV',
    dailySummaryLabel: 'Resumo diário do fluxo',
    languageLabel: 'Idioma',
    currencyNames: {
      BRL: 'BRL - Real brasileiro',
      USD: 'USD - Dólar americano',
      EUR: 'EUR - Euro'
    },
    timezoneBrasilia: 'Brasília',
    timezoneNewYork: 'New York',
    timezoneLisbon: 'Lisboa',
    allLabel: 'Todos',
    incomeLabel: 'Receitas',
    expenseLabel: 'Despesas',
    investmentLabel: 'Investimentos',
    netRevenueTitle: 'Receita líquida',
    expensesTitle: 'Despesas',
    cashFlowTitle: 'Fluxo de caixa',
    annualGoalTitle: 'Meta anual',
    goalLabel: 'Meta',
    revenueEntrySingle: '1 receita registrada.',
    revenueEntryMultiple: '{count} receitas registradas.',
    expenseEntrySingle: '1 despesa registrada.',
    expenseEntryMultiple: '{count} despesas registradas.',
    coverageLabel: 'Cobertura {coverage}x · {count} investimento{plural}',
    annualGoalRemaining: 'Faltam {amount} para atingir',
    annualGoalReached: 'Meta anual alcançada!',
    dailySummaryPositive: 'Resumo diário: fluxo positivo · cobertura {coverage}x · {revenues} receitas / {expenses} despesas.',
    dailySummaryAdjusting: 'Resumo diário: fluxo em ajuste · cobertura {coverage}x · {revenues} receitas / {expenses} despesas.',
    notificationsCashFlowAbove: 'Fluxo de caixa está {percent}% acima da meta mensal.',
    notificationsRevenueEntries: 'Receitas acumuladas: {amount} · {count} entradas registradas.',
    notificationsExpenseEntries: 'Despesas atuais: {amount} · {count} itens em análise.',
    addTransactionBtn: '+ Nova transação',
    importCsvBtn: 'Importar CSV',
    exportCsvBtn: 'Exportar CSV',
    printBtn: 'PDF / Imprimir',
    editButton: 'Editar',
    deleteButton: 'Excluir',
    notesNone: 'Sem observações',
    transactionModalTitleNew: 'Nova transação',
    transactionModalTitleEdit: 'Editar transação',
    descriptionLabel: 'Descrição',
    categoryLabel: 'Categoria',
    valueLabel: 'Valor',
    dateLabel: 'Data',
    notesLabel: 'Observações',
    cancelLabel: 'Cancelar',
    saveLabel: 'Salvar',
    notificationsTitle: 'Avisos',
    profileTitle: 'Perfil',
    userLabel: 'Usuário',
    accountStatusActive: 'Conta ativa',
    todayLabel: 'Hoje',
    sidebarUsageLabel: '{name}: uso do mês {percent}% do limite disponível',
    accountCreated: 'Conta criada com sucesso! Faça login para acessar o painel.',
    emailRegistered: 'Este e-mail já está cadastrado. Faça login.',
    emergencyGoal: 'Reserva de emergência',
    investmentsGoal: 'Investimentos',
    expansionGoal: 'Expansão'
  },
  en: {
    alertsActive: 'Alerts active',
    alertsPaused: 'Alerts paused',
    autoRefresh: 'Auto refresh',
    manualRefresh: 'Manual refresh',
    monthlyFlow: 'Monthly flow',
    quickSummary: 'Quick summary',
    coverageTitle: 'Coverage',
    transactionsLabel: 'Transactions',
    transactionsTitle: 'Detailed flow',
    goalsLabel: 'Financial goals',
    goalsTitle: 'Current progress',
    reportsLabel: 'Indicators',
    reportsTitle: 'Performance',
    settingsLabel: 'Settings',
    settingsTitle: 'Finance panel',
    panelLabel: 'Finance Panel',
    dashboardTitle: 'Premium dashboard',
    authBadge: 'Access required',
    authTitle: 'Create your account and sign in to open the financial dashboard',
    authDescription: 'Before you see the charts, goals, and transactions, set up your account and log in to continue.',
    authPoint1: '• Fast registration with name, email, and password.',
    authPoint2: '• Secure login to access the dashboard.',
    authPoint3: '• Profile menu with sign out and account details.',
    loginTitle: 'Sign in',
    loginBtn: 'Sign in',
    createAccountBtn: 'Create account',
    registerTitle: 'Create account',
    registerSubmitBtn: 'Create account',
    backToLoginBtn: 'Back to sign in',
    applySettingsBtn: 'Apply settings',
    currencyLabel: 'Currency',
    timezoneLabel: 'Time zone',
    backupLabel: 'Automatic backup',
    emailReminderLabel: 'Email reminders',
    dateFormatLabel: 'Date format',
    showGoalsLabel: 'Show financial goals',
    autoRefreshLabel: 'Automatic dashboard refresh',
    alertsLabel: 'Cash flow alerts',
    csvLabel: 'Automatic CSV export',
    dailySummaryLabel: 'Daily flow summary',
    languageLabel: 'Language',
    currencyNames: {
      BRL: 'BRL - Brazilian Real',
      USD: 'USD - US Dollar',
      EUR: 'EUR - Euro'
    },
    timezoneBrasilia: 'Brasília',
    timezoneNewYork: 'New York',
    timezoneLisbon: 'Lisbon',
    allLabel: 'All',
    incomeLabel: 'Income',
    expenseLabel: 'Expense',
    investmentLabel: 'Investment',
    netRevenueTitle: 'Net revenue',
    expensesTitle: 'Expenses',
    cashFlowTitle: 'Cash flow',
    annualGoalTitle: 'Annual goal',
    goalLabel: 'Goal',
    revenueEntrySingle: '1 revenue entry registered.',
    revenueEntryMultiple: '{count} revenue entries registered.',
    expenseEntrySingle: '1 expense entry registered.',
    expenseEntryMultiple: '{count} expenses registered.',
    coverageLabel: 'Coverage {coverage}x · {count} investment{plural}',
    annualGoalRemaining: 'Missing {amount} to reach goal',
    annualGoalReached: 'Annual goal achieved!',
    dailySummaryPositive: 'Daily summary: positive cash flow · coverage {coverage}x · {revenues} revenues / {expenses} expenses.',
    dailySummaryAdjusting: 'Daily summary: adjusting cash flow · coverage {coverage}x · {revenues} revenues / {expenses} expenses.',
    notificationsCashFlowAbove: 'Cash flow is {percent}% above the monthly target.',
    notificationsRevenueEntries: 'Accumulated revenue: {amount} · {count} entries registered.',
    notificationsExpenseEntries: 'Current expenses: {amount} · {count} items under review.',
    addTransactionBtn: '+ New transaction',
    importCsvBtn: 'Import CSV',
    exportCsvBtn: 'Export CSV',
    printBtn: 'PDF / Print',
    editButton: 'Edit',
    deleteButton: 'Delete',
    notesNone: 'No notes',
    transactionModalTitleNew: 'New transaction',
    transactionModalTitleEdit: 'Edit transaction',
    descriptionLabel: 'Description',
    categoryLabel: 'Category',
    valueLabel: 'Value',
    dateLabel: 'Date',
    notesLabel: 'Notes',
    cancelLabel: 'Cancel',
    saveLabel: 'Save',
    notificationsTitle: 'Alerts',
    profileTitle: 'Profile',
    userLabel: 'User',
    accountStatusActive: 'Account active',
    todayLabel: 'Today',
    sidebarUsageLabel: '{name}: monthly usage {percent}% of available limit',
    accountCreated: 'Account created successfully! Please sign in to access the dashboard.',
    emailRegistered: 'This email is already registered. Please log in.',
    emergencyGoal: 'Emergency fund',
    investmentsGoal: 'Investments',
    expansionGoal: 'Expansion'
  }
};

function getSettings() {
  return JSON.parse(localStorage.getItem('novaledger-settings') || '{}');
}

function getAnnualGoal() {
  const settings = getSettings();
  return Number(settings.annualGoal) || 150000;
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const settings = getSettings();
  const format = settings.dateFormat || 'DD/MM/AAAA';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  const [year, month, day] = parts;
  if (format === 'MM/DD/AAAA') {
    return `${month}/${day}/${year}`;
  } else if (format === 'AAAA-MM-DD') {
    return `${year}-${month}-${day}`;
  } else {
    return `${day}/${month}/${year}`;
  }
}

function getCurrentLanguage() {
  const settings = getSettings();
  return settings.language || 'pt';
}

function getLocale() {
  return getCurrentLanguage() === 'en' ? 'en-US' : 'pt-BR';
}

function getCurrencyCode() {
  const settings = getSettings();
  return settings.currency || 'BRL';
}

function t(key, replacements = {}) {
  let text = translations[getCurrentLanguage()]?.[key] || translations.pt[key] || key;
  Object.entries(replacements).forEach(([placeholder, value]) => {
    text = text.replace(`{${placeholder}}`, value);
  });
  return text;
}

function formatCurrency(value) {
  const locale = getLocale();
  const currency = getCurrencyCode();
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
}

function translateCurrencyOptions() {
  const language = getCurrentLanguage();
  const currencySelect = document.getElementById('currencySelect');
  if (!currencySelect) return;
  const currentValue = currencySelect.value || getCurrencyCode();
  const currencyNames = translations[language]?.currencyNames || translations.pt.currencyNames;
  currencySelect.innerHTML = ['BRL', 'USD', 'EUR']
    .map((value) => `<option value="${value}">${currencyNames[value] || value}</option>`)
    .join('');
  currencySelect.value = currentValue;
}

function translateTimezoneOptions() {
  const timezoneSelect = document.getElementById('timezoneSelect');
  if (!timezoneSelect) return;
  const currentValue = timezoneSelect.value || getSettings().timezone || 'Brasília';
  timezoneSelect.innerHTML = [
    { value: 'Brasília', label: t('timezoneBrasilia') },
    { value: 'New York', label: t('timezoneNewYork') },
    { value: 'Lisboa', label: t('timezoneLisbon') }
  ]
    .map((option) => `<option value="${option.value}">${option.label}</option>`)
    .join('');
  timezoneSelect.value = currentValue;
}

function translateCategoryOptions() {
  const categorySelect = document.getElementById('txCategory');
  if (!categorySelect) return;
  const options = [
    { value: 'Receita', label: t('incomeLabel') },
    { value: 'Despesa', label: t('expenseLabel') },
    { value: 'Investimento', label: t('investmentLabel') }
  ];
  const selectedValue = categorySelect.value || 'Receita';
  categorySelect.innerHTML = options
    .map((option) => `<option value="${option.value}">${option.label}</option>`)
    .join('');
  categorySelect.value = selectedValue;
}

function translateFilterLabels() {
  const filterMap = {
    all: t('allLabel'),
    Receita: t('incomeLabel'),
    Despesa: t('expenseLabel'),
    Investimento: t('investmentLabel')
  };
  document.querySelectorAll('.chip').forEach((chip) => {
    const filter = chip.dataset.filter;
    if (filterMap[filter]) chip.textContent = filterMap[filter];
  });
}

function translateDashboardStaticText() {
  const buttons = [
    { id: 'addTransactionBtn', key: 'addTransactionBtn' },
    { id: 'importCsvBtn', key: 'importCsvBtn' },
    { id: 'exportCsvBtn', key: 'exportCsvBtn' },
    { id: 'printBtn', key: 'printBtn' }
  ];
  buttons.forEach(({ id, key }) => {
    const element = document.getElementById(id);
    if (element) element.textContent = t(key);
  });

  const statTitles = [
    { selector: '.stat-card:nth-child(1) .title', key: 'netRevenueTitle' },
    { selector: '.stat-card:nth-child(2) .title', key: 'expensesTitle' },
    { selector: '.stat-card:nth-child(3) .title', key: 'cashFlowTitle' },
    { selector: '.stat-card:nth-child(4) .title', key: 'annualGoalTitle' }
  ];
  statTitles.forEach(({ selector, key }) => {
    const element = document.querySelector(selector);
    if (element) element.textContent = t(key);
  });

  const goalLabels = [
    { index: 0, key: 'emergencyGoal' },
    { index: 1, key: 'investmentsGoal' },
    { index: 2, key: 'expansionGoal' }
  ];
  goalLabels.forEach(({ index, key }) => {
    const goalCard = document.querySelectorAll('.goal-card .goal-label span')[index];
    if (goalCard) goalCard.textContent = t(key);
  });

  const modalMapping = [
    { selector: '#modalTitle', key: 'transactionModalTitleNew' },
    { selector: '#cancelModalBtn', key: 'cancelLabel' },
    { selector: '#transactionForm button[type="submit"]', key: 'saveLabel' }
  ];
  modalMapping.forEach(({ selector, key }) => {
    const element = document.querySelector(selector);
    if (element) element.textContent = t(key);
  });
}

function applyLanguage(language = getCurrentLanguage()) {
  document.documentElement.lang = language;
  document.querySelectorAll('[data-i18n]').forEach((element) => {
    const text = translations[language]?.[element.dataset.i18n];
    if (text) element.textContent = text;
  });

  translateCurrencyOptions();
  translateTimezoneOptions();
  translateCategoryOptions();
  translateFilterLabels();
  translateDashboardStaticText();

  const languageSelect = document.getElementById('languageSelect');
  if (languageSelect) languageSelect.value = language;
}

function getMonthlySeries() {
  const now = new Date();
  const series = Array.from({ length: 6 }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - (5 - index), 1);
    const monthLabel = date.toLocaleString(getLocale(), { month: 'short' });
    const monthTotal = transactions
      .filter((item) => item.category === 'Receita' && item.date.startsWith(`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`))
      .reduce((sum, item) => sum + item.amount, 0);

    return { label: monthLabel.charAt(0).toUpperCase() + monthLabel.slice(1), value: monthTotal };
  });

  return series;
}

function getTransactionTotals() {
  const revenue = transactions
    .filter((item) => item.category === 'Receita')
    .reduce((sum, item) => sum + item.amount, 0);
  const expenses = Math.abs(transactions
    .filter((item) => item.category === 'Despesa')
    .reduce((sum, item) => sum + item.amount, 0));
  const investments = Math.abs(transactions
    .filter((item) => item.category === 'Investimento')
    .reduce((sum, item) => sum + item.amount, 0));

  return {
    revenue,
    expenses,
    investments,
    netFlow: revenue - expenses - investments,
    revenueCount: transactions.filter((item) => item.category === 'Receita').length,
    expenseCount: transactions.filter((item) => item.category === 'Despesa').length,
    investmentCount: transactions.filter((item) => item.category === 'Investimento').length
  };
}

function updateQuickSummary(totals) {
  const miniCards = document.querySelectorAll('.mini-card');
  const revenueShare = totals.revenue + totals.expenses + totals.investments > 0
    ? Math.round((totals.revenue / (totals.revenue + totals.expenses + totals.investments)) * 100)
    : 0;
  const expenseShare = totals.revenue + totals.expenses + totals.investments > 0
    ? Math.round((totals.expenses / (totals.revenue + totals.expenses + totals.investments)) * 100)
    : 0;
  const roi = totals.expenses > 0 ? (totals.revenue / totals.expenses).toFixed(1) : '0.0';
  const annualGoal = getAnnualGoal();
  const goalProgress = Math.min(100, Math.round((totals.revenue / Math.max(1, annualGoal)) * 100));

  if (miniCards[0]) {
    miniCards[0].querySelector('strong').textContent = `${revenueShare}%`;
    miniCards[0].querySelector('span').textContent = t('incomeLabel');
  }
  if (miniCards[1]) {
    miniCards[1].querySelector('strong').textContent = `${expenseShare}%`;
    miniCards[1].querySelector('span').textContent = t('expenseLabel');
  }
  if (miniCards[2]) {
    miniCards[2].querySelector('strong').textContent = `${roi}x`;
    miniCards[2].querySelector('span').textContent = 'ROI';
  }
  if (miniCards[3]) {
    miniCards[3].querySelector('strong').textContent = `${goalProgress}%`;
    miniCards[3].querySelector('span').textContent = t('goalLabel');
  }
}

function updateGoalsProgress(totals) {
  const emergencyGoal = Math.min(100, Math.round((Math.max(0, totals.netFlow) / 20000) * 100));
  const investmentGoal = Math.min(100, Math.round((totals.investments / 5000) * 100));
  const expansionGoal = Math.min(100, Math.round((totals.revenue / 50000) * 100));

  const goals = document.querySelectorAll('.goal-card');
  if (goals[0]) {
    goals[0].querySelector('strong').textContent = `${emergencyGoal}%`;
    goals[0].querySelector('.progress span').style.width = `${emergencyGoal}%`;
  }
  if (goals[1]) {
    goals[1].querySelector('strong').textContent = `${investmentGoal}%`;
    goals[1].querySelector('.progress span').style.width = `${investmentGoal}%`;
  }
  if (goals[2]) {
    goals[2].querySelector('strong').textContent = `${expansionGoal}%`;
    goals[2].querySelector('.progress span').style.width = `${expansionGoal}%`;
  }
}

function updateChartData() {
  const monthlySeries = getMonthlySeries();
  if (revenueChartInstance) {
    revenueChartInstance.data.labels = monthlySeries.map((item) => item.label);
    revenueChartInstance.data.datasets[0].data = monthlySeries.map((item) => item.value);
    revenueChartInstance.update();
  }

  const totals = getTransactionTotals();
  if (donutChartInstance) {
    donutChartInstance.data.datasets[0].data = [totals.revenue, totals.expenses, totals.investments];
    donutChartInstance.data.labels = [t('incomeLabel'), t('expenseLabel'), t('investmentLabel')];
    donutChartInstance.update();
  }
}

function startAutoRefresh(enabled = true) {
  if (autoRefreshTimer) {
    clearInterval(autoRefreshTimer);
    autoRefreshTimer = null;
  }

  if (!enabled) return;

  autoRefreshTimer = setInterval(() => {
    updateDashboardSummary();
  }, 30000);
}

function applySettingsState() {
  const settings = JSON.parse(localStorage.getItem('novaledger-settings') || '{}');
  applyLanguage(settings.language || 'pt');

  const currencySelect = document.getElementById('currencySelect');
  if (currencySelect) currencySelect.value = settings.currency || 'BRL';
  const timezoneSelect = document.getElementById('timezoneSelect');
  if (timezoneSelect) timezoneSelect.value = settings.timezone || 'Brasília';
  const dateFormatSelect = document.getElementById('dateFormatSelect');
  if (dateFormatSelect) dateFormatSelect.value = settings.dateFormat || 'DD/MM/AAAA';
  const showGoalsToggle = document.getElementById('showGoalsToggle');
  if (showGoalsToggle) showGoalsToggle.checked = settings.showGoals !== false;
  const autoRefreshToggle = document.getElementById('autoRefreshToggle');
  if (autoRefreshToggle) autoRefreshToggle.checked = settings.autoRefresh !== false;
  const alertsToggle = document.getElementById('alertsToggle');
  if (alertsToggle) alertsToggle.checked = settings.alerts !== false;
  const dailySummaryToggle = document.getElementById('dailySummaryToggle');
  if (dailySummaryToggle) dailySummaryToggle.checked = settings.dailySummary !== false;
  const annualGoalInput = document.getElementById('annualGoalInput');
  if (annualGoalInput) annualGoalInput.value = getAnnualGoal();

  // Sincroniza campos que antes não eram carregados na inicialização
  const csvToggle = document.getElementById('csvToggle');
  if (csvToggle) csvToggle.checked = settings.csvExport !== false;
  const backupToggle = document.getElementById('backupToggle');
  if (backupToggle) backupToggle.checked = settings.backup !== false;
  const emailReminderToggle = document.getElementById('emailReminderToggle');
  if (emailReminderToggle) emailReminderToggle.checked = settings.emailReminder !== false;

  const badgePositive = document.querySelector('.badge-positive');
  if (badgePositive) {
    badgePositive.textContent = `${settings.alerts === false ? t('alertsPaused') : t('alertsActive')} · ${settings.autoRefresh === false ? t('manualRefresh') : t('autoRefresh')}`;
    badgePositive.setAttribute('data-config', `${settings.currency || 'BRL'} · ${settings.timezone || 'Brasília'}`);
  }

  // Aplica visibilidade do painel de metas
  const goalsSection = document.getElementById('goals');
  if (goalsSection) {
    if (settings.showGoals === false) {
      goalsSection.classList.add('hidden');
    } else {
      goalsSection.classList.remove('hidden');
    }
  }

  // Aplica visibilidade do resumo diário
  const dailySummaryHint = document.getElementById('dailySummaryHint');
  if (dailySummaryHint) {
    if (settings.dailySummary === false) {
      dailySummaryHint.classList.add('hidden');
    } else {
      dailySummaryHint.classList.remove('hidden');
    }
  }

  // Atualiza o texto resumo de prévia de configurações
  const settingsSummary = document.getElementById('settingsSummary');
  if (settingsSummary) {
    const isEnglish = (settings.language || 'pt') === 'en';
    const currency = settings.currency || 'BRL';
    const timezone = settings.timezone || 'Brasília';
    const dateFormat = settings.dateFormat || 'DD/MM/AAAA';
    const backup = settings.backup !== false;
    const emailReminder = settings.emailReminder !== false;
    const csvExport = settings.csvExport !== false;
    settingsSummary.textContent = isEnglish
      ? `Currency: ${currency} | Time zone: ${timezone} | Date: ${dateFormat} | Backup: ${backup ? 'yes' : 'no'} | Email reminders: ${emailReminder ? 'yes' : 'no'} | CSV export: ${csvExport ? 'yes' : 'no'}`
      : `Moeda: ${currency} | Fuso: ${timezone} | Data: ${dateFormat} | Backup: ${backup ? 'sim' : 'não'} | E-mail: ${emailReminder ? 'sim' : 'não'} | CSV: ${csvExport ? 'sim' : 'não'}`;
  }

  updateNotificationsPanel(settings.alerts !== false);
  startAutoRefresh(settings.autoRefresh !== false);
  renderTransactions();
  updateDashboardSummary();
}

function updateDashboardSummary() {
  const totals = getTransactionTotals();
  const statCards = Array.from(document.querySelectorAll('.stat-card'));

  if (statCards[0]) {
    statCards[0].querySelector('.value').textContent = formatCurrency(totals.revenue);
    statCards[0].querySelector('.delta').textContent = totals.revenueCount === 1
      ? t('revenueEntrySingle')
      : t('revenueEntryMultiple', { count: totals.revenueCount });
  }

  if (statCards[1]) {
    statCards[1].querySelector('.value').textContent = formatCurrency(totals.expenses);
    statCards[1].querySelector('.delta').textContent = totals.expenseCount === 1
      ? t('expenseEntrySingle')
      : t('expenseEntryMultiple', { count: totals.expenseCount });
  }

  if (statCards[2]) {
    statCards[2].querySelector('.value').textContent = formatCurrency(totals.netFlow);
    const coverage = totals.expenses > 0 ? (totals.revenue / totals.expenses).toFixed(1) : '0.0';
    statCards[2].querySelector('.delta').textContent = t('coverageLabel', {
      coverage,
      count: totals.investmentCount,
      plural: totals.investmentCount === 1 ? '' : 's'
    });
  }

  const topFlowValue = document.querySelector('#dashboardApp article h2');
  if (topFlowValue) {
    topFlowValue.textContent = formatCurrency(totals.netFlow);
  }

  updateQuickSummary(totals);
  updateGoalsProgress(totals);
  updateChartData();

  const annualGoal = getAnnualGoal();
  const annualGoalValue = document.getElementById('annualGoalValue');
  const annualGoalDelta = document.getElementById('annualGoalDelta');
  if (annualGoalValue) annualGoalValue.textContent = `${Math.min(100, Math.round((totals.revenue / Math.max(1, annualGoal)) * 100))}%`;
  if (annualGoalDelta) {
    const remaining = Math.max(0, annualGoal - totals.revenue);
    annualGoalDelta.textContent = remaining > 0
      ? t('annualGoalRemaining', { amount: formatCurrency(remaining) })
      : t('annualGoalReached');
  }

  const settings = getSettings();
  const dailySummaryHint = document.getElementById('dailySummaryHint');
  if (dailySummaryHint) {
    const coverage = totals.expenses > 0 ? (totals.revenue / totals.expenses).toFixed(1) : '0.0';
    dailySummaryHint.textContent = totals.netFlow >= 0
      ? t('dailySummaryPositive', { coverage, revenues: totals.revenueCount, expenses: totals.expenseCount })
      : t('dailySummaryAdjusting', { coverage, revenues: totals.revenueCount, expenses: totals.expenseCount });
  }

  updateNotificationsPanel(settings.alerts !== false);
}

function getCategoryClass(category) {
  return category === 'Receita' ? 'badge-income' : category === 'Despesa' ? 'badge-expense' : 'badge-investment';
}

function localizeCategory(category) {
  const map = {
    Receita: t('incomeLabel'),
    Despesa: t('expenseLabel'),
    Investimento: t('investmentLabel')
  };
  return map[category] || category;
}

function renderTransactions() {
  const query = searchInput.value.toLowerCase();
  const filtered = transactions.filter((item) => {
    const matchesFilter = currentFilter === 'all' || item.category === currentFilter;
    const matchesSearch = [item.description, item.category, item.notes].join(' ').toLowerCase().includes(query);
    return matchesFilter && matchesSearch;
  });

  txBody.innerHTML = filtered.map((item) => `
    <tr class="transaction-row border-b border-white/8 hover:bg-white/5 transition">
      <td class="px-4 py-3"><div class="font-medium">${item.description}</div><div class="text-xs text-slate-400">${item.notes || t('notesNone')}</div></td>
      <td class="px-4 py-3"><span class="${getCategoryClass(item.category)}">${localizeCategory(item.category)}</span></td>
      <td class="px-4 py-3 text-slate-300">${formatDate(item.date)}</td>
      <td class="px-4 py-3 text-right font-semibold ${item.amount >= 0 ? 'text-emerald-300' : 'text-rose-200'}">${item.amount >= 0 ? '+' : ''}${formatCurrency(item.amount)}</td>
      <td class="px-4 py-3 text-right">
        <button class="edit-btn secondary-btn mr-2" data-id="${item.id}">${t('editButton')}</button>
        <button class="delete-btn secondary-btn" data-id="${item.id}">${t('deleteButton')}</button>
      </td>
    </tr>
  `).join('');

  document.querySelectorAll('.edit-btn').forEach((btn) => btn.addEventListener('click', () => openModal(Number(btn.dataset.id))));
  document.querySelectorAll('.delete-btn').forEach((btn) => btn.addEventListener('click', () => deleteTransaction(Number(btn.dataset.id))));
}

function openModal(id = null) {
  editingId = id;
  const item = transactions.find((entry) => entry.id === id);
  document.getElementById('modalTitle').textContent = item ? t('transactionModalTitleEdit') : t('transactionModalTitleNew');
  document.getElementById('txId').value = item?.id || '';
  document.getElementById('txDescription').value = item?.description || '';
  document.getElementById('txCategory').value = item?.category || 'Receita';
  document.getElementById('txAmount').value = item ? Math.abs(item.amount) : '';
  document.getElementById('txDate').value = item?.date || new Date().toISOString().slice(0, 10);
  document.getElementById('txNotes').value = item?.notes || '';
  modal.classList.remove('hidden');
  backdrop.classList.remove('hidden');
}

function closeModal() {
  modal.classList.add('hidden');
  backdrop.classList.add('hidden');
  editingId = null;
  document.getElementById('transactionForm').reset();
}

function openPanel(panel) {
  [notificationsPanel, profileMenu].forEach((item) => {
    if (item && item !== panel) {
      item.classList.add('hidden');
      item.setAttribute('aria-hidden', 'true');
    }
  });
  panel?.classList.remove('hidden');
  panel?.setAttribute('aria-hidden', 'false');
  backdrop?.classList.remove('hidden');
}

function closePanels() {
  [notificationsPanel, profileMenu].forEach((item) => {
    item?.classList.add('hidden');
    item?.setAttribute('aria-hidden', 'true');
  });
  backdrop?.classList.add('hidden');
}

function updateSidebarUsage(totals) {
  const usagePercent = totals.expenses > 0
    ? Math.min(99, Math.round((totals.expenses / (totals.revenue + totals.expenses + totals.investments)) * 100))
    : 0;
  const user = JSON.parse(localStorage.getItem('novaledger-user') || 'null');
  const name = user?.name || t('userLabel');
  if (sidebarUsageLabel) {
    sidebarUsageLabel.textContent = t('sidebarUsageLabel', { name, percent: usagePercent });
  }
}

function updateNotificationsPanel(alertsEnabled = true) {
  if (!notificationsList) return;
  const totals = getTransactionTotals();
  const statusText = alertsEnabled ? t('alertsActive') : t('alertsPaused');
  const percent = Math.max(0, Math.round((totals.netFlow / Math.max(1, totals.revenue)) * 100));

  notificationsList.innerHTML = [
    `<article class="rounded-2xl border border-cyan-400/15 bg-cyan-400/6 p-3">${statusText}. ${t('notificationsCashFlowAbove', { percent })}</article>`,
    `<article class="rounded-2xl border border-emerald-400/15 bg-emerald-400/6 p-3">${t('notificationsRevenueEntries', { amount: formatCurrency(totals.revenue), count: totals.revenueCount })}</article>`,
    `<article class="rounded-2xl border border-rose-400/15 bg-rose-400/6 p-3">${t('notificationsExpenseEntries', { amount: formatCurrency(totals.expenses), count: totals.expenseCount })}</article>`
  ].join('');
}

function renderProfile() {
  const user = JSON.parse(localStorage.getItem('novaledger-user') || 'null');
  const totals = getTransactionTotals();
  const locale = getLocale();
  if (!user) {
    profileNameLabel.textContent = t('userLabel');
    profileEmailLabel.textContent = '—';
    profilePlanLabel.textContent = 'Growth';
    profileStatusLabel.textContent = t('accountStatusActive');
    profileLastLabel.textContent = t('todayLabel');
    sidebarUserName.textContent = 'Ana Lima';
    sidebarUserRole.textContent = 'Plano Growth';
    sidebarAvatar.textContent = 'AL';
    updateSidebarUsage(totals);
    return;
  }
  const initials = user.name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase();
  profileNameLabel.textContent = user.name;
  profileEmailLabel.textContent = user.email;
  profilePlanLabel.textContent = user.plan === 'Trial' ? 'Teste Grátis' : `Plano ${user.plan}`;
  profileStatusLabel.textContent = t('accountStatusActive');
  profileLastLabel.textContent = new Date().toLocaleDateString(locale);
  sidebarUserName.textContent = user.name;
  sidebarUserRole.textContent = user.plan === 'Trial' ? 'Teste Grátis' : `Plano ${user.plan}`;
  sidebarAvatar.textContent = initials || 'U';
  updateSidebarUsage(totals);
}

function checkTrialAndBlock() {
  const user = JSON.parse(localStorage.getItem('novaledger-user') || 'null');
  if (!user) {
    document.getElementById('trialExpiredOverlay')?.classList.add('hidden');
    return false;
  }

  const isTrial = user.plan === 'Trial';
  const sidebarTrialBadge = document.getElementById('sidebarTrialBadge');
  const sidebarUpgradeBtn = document.getElementById('sidebarUpgradeBtn');
  const profileUpgradeBtn = document.getElementById('profileUpgradeBtn');

  if (isTrial) {
    const elapsed = Date.now() - (user.createdAt || Date.now());
    const remainingMs = (3 * 24 * 60 * 60 * 1000) - elapsed;
    const daysLeft = Math.ceil(remainingMs / (24 * 60 * 60 * 1000));
    
    if (remainingMs <= 0) {
      document.getElementById('trialExpiredOverlay')?.classList.remove('hidden');
      if (sidebarTrialBadge) {
        sidebarTrialBadge.textContent = 'Teste expirado!';
        sidebarTrialBadge.classList.remove('hidden');
        sidebarTrialBadge.classList.add('border-rose-500/20', 'bg-rose-500/5', 'text-rose-200');
        sidebarTrialBadge.classList.remove('border-amber-400/20', 'bg-amber-400/6', 'text-amber-200');
      }
      sidebarUpgradeBtn?.classList.remove('hidden');
      profileUpgradeBtn?.classList.remove('hidden');
      return true; // blocked
    } else {
      document.getElementById('trialExpiredOverlay')?.classList.add('hidden');
      if (sidebarTrialBadge) {
        sidebarTrialBadge.textContent = `Teste grátis: ${daysLeft} dia${daysLeft > 1 ? 's' : ''} restante${daysLeft > 1 ? 's' : ''}`;
        sidebarTrialBadge.classList.remove('hidden');
        sidebarTrialBadge.classList.remove('border-rose-500/20', 'bg-rose-500/5', 'text-rose-200');
        sidebarTrialBadge.classList.add('border-amber-400/20', 'bg-amber-400/6', 'text-amber-200');
      }
      sidebarUpgradeBtn?.classList.remove('hidden');
      profileUpgradeBtn?.classList.remove('hidden');
      return false;
    }
  } else {
    document.getElementById('trialExpiredOverlay')?.classList.add('hidden');
    sidebarTrialBadge?.classList.add('hidden');
    sidebarUpgradeBtn?.classList.add('hidden');
    profileUpgradeBtn?.classList.add('hidden');
    return false;
  }
}

function showDashboard() {
  const user = JSON.parse(localStorage.getItem('novaledger-user') || 'null');
  const isAuthView = !user;

  authScreen?.classList.toggle('hidden', !isAuthView);
  dashboardApp?.classList.toggle('hidden', isAuthView);
  topBar?.classList.toggle('hidden', isAuthView);

  if (isAuthView) {
    sidebar?.classList.add('hidden');
    sidebar?.classList.remove('lg:flex');
  } else {
    sidebar?.classList.remove('hidden');
    sidebar?.classList.add('lg:flex');
  }

  if (!user) {
    renderProfile();
    return;
  }

  renderProfile();
  checkTrialAndBlock();
}

function saveUser(user) {
  localStorage.setItem('novaledger-user', JSON.stringify(user));
  renderProfile();
  showDashboard();
}

function showAuthView(mode) {
  const isRegister = mode === 'register';
  loginForm?.classList.toggle('hidden', isRegister);
  registerForm?.classList.toggle('hidden', !isRegister);
}

function saveTransaction(event) {
  event.preventDefault();
  const id = Number(document.getElementById('txId').value || Date.now());
  const description = document.getElementById('txDescription').value.trim();
  const category = document.getElementById('txCategory').value;
  const amount = Number(document.getElementById('txAmount').value);
  const date = document.getElementById('txDate').value;
  const notes = document.getElementById('txNotes').value.trim();
  const signedAmount = category === 'Despesa' ? -Math.abs(amount) : Math.abs(amount);

  if (!description || !amount || !date) return;

  if (editingId) {
    const index = transactions.findIndex((item) => item.id === editingId);
    if (index >= 0) transactions[index] = { id, description, category, amount: signedAmount, date, notes };
  } else {
    transactions.unshift({ id, description, category, amount: signedAmount, date, notes });
  }

  renderTransactions();
  updateDashboardSummary();
  closeModal();
}

function deleteTransaction(id) {
  const idx = transactions.findIndex((item) => item.id === id);
  if (idx >= 0) transactions.splice(idx, 1);
  renderTransactions();
  updateDashboardSummary();
}

searchInput.addEventListener('input', renderTransactions);
chips.forEach((chip) => chip.addEventListener('click', () => {
  chips.forEach((item) => item.classList.remove('active'));
  chip.classList.add('active');
  currentFilter = chip.dataset.filter;
  renderTransactions();
}));

document.getElementById('addTransactionBtn').addEventListener('click', () => openModal());
document.getElementById('closeModalBtn').addEventListener('click', closeModal);
document.getElementById('cancelModalBtn').addEventListener('click', closeModal);
backdrop.addEventListener('click', closeModal);

document.getElementById('transactionForm').addEventListener('submit', saveTransaction);

registerForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const name = document.getElementById('registerName').value.trim();
  const email = document.getElementById('registerEmail').value.trim().toLowerCase();
  const password = document.getElementById('registerPassword').value;
  if (!name || !email || !password) return;

  const accounts = JSON.parse(localStorage.getItem('novaledger-accounts') || '[]');
  if (accounts.some((entry) => entry.email === email)) {
    alert('Este e-mail já está cadastrado. Faça login.');
    return;
  }

  const createdAt = Date.now();
  const plan = 'Trial';

  accounts.push({ name, email, password, createdAt, plan });
  localStorage.setItem('novaledger-accounts', JSON.stringify(accounts));
  registerForm.reset();
  showAuthView('login');
  alert('Conta criada com sucesso! Faça login para acessar o painel.');
});

loginForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const email = document.getElementById('loginEmail').value.trim().toLowerCase();
  const password = document.getElementById('loginPassword').value;
  const accounts = JSON.parse(localStorage.getItem('novaledger-accounts') || '[]');
  const user = accounts.find((entry) => entry.email === email && entry.password === password);
  if (!user) {
    alert('E-mail ou senha inválidos.');
    return;
  }
  saveUser({
    name: user.name,
    email: user.email,
    createdAt: user.createdAt || Date.now(),
    plan: user.plan || 'Trial'
  });
  loginForm.reset();
});

document.getElementById('exportCsvBtn').addEventListener('click', () => {
  const rows = [['Descrição', 'Categoria', 'Valor', 'Data', 'Observações'], ...transactions.map((item) => [item.description, item.category, item.amount, item.date, item.notes])];
  const csv = rows.map((row) => row.join(';')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'transacoes_novaledger.csv';
  a.click();
  URL.revokeObjectURL(url);
});

// CSV Import functionality
document.getElementById('importCsvBtn').addEventListener('click', () => {
  document.getElementById('csvFileInput').click();
});

document.getElementById('csvFileInput').addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const csv = e.target.result;
      const lines = csv.trim().split('\n');
      
      // Skip header row
      if (lines.length < 2) {
        alert('Arquivo CSV vazio ou inválido.');
        return;
      }

      let importedCount = 0;
      const errors = [];

      // Start from line 1 (skip header at line 0)
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue; // Skip empty lines

        const parts = line.split(';');
        if (parts.length < 4) {
          errors.push(`Linha ${i + 1}: Formato inválido (esperado: Descrição;Categoria;Valor;Data;Observações)`);
          continue;
        }

        const description = parts[0]?.trim();
        const category = parts[1]?.trim();
        const amountStr = parts[2]?.trim();
        const date = parts[3]?.trim();
        const notes = parts[4]?.trim() || '';

        // Validation
        if (!description) {
          errors.push(`Linha ${i + 1}: Descrição vazia`);
          continue;
        }

        if (!['Receita', 'Despesa', 'Investimento'].includes(category)) {
          errors.push(`Linha ${i + 1}: Categoria inválida. Use: Receita, Despesa ou Investimento`);
          continue;
        }

        const amount = parseFloat(amountStr.replace(',', '.'));
        if (isNaN(amount)) {
          errors.push(`Linha ${i + 1}: Valor inválido: "${amountStr}"`);
          continue;
        }

        // Validate date format (YYYY-MM-DD or DD/MM/YYYY)
        const dateRegex = /^\d{4}-\d{2}-\d{2}$|^\d{2}\/\d{2}\/\d{4}$/;
        if (!dateRegex.test(date)) {
          errors.push(`Linha ${i + 1}: Data inválida. Use: YYYY-MM-DD ou DD/MM/YYYY`);
          continue;
        }

        // Convert DD/MM/YYYY to YYYY-MM-DD if needed
        let normalizedDate = date;
        if (date.includes('/')) {
          const [day, month, year] = date.split('/');
          normalizedDate = `${year}-${month}-${day}`;
        }

        // Create new transaction
        const newId = Math.max(...transactions.map(t => t.id), 0) + 1;
        transactions.push({
          id: newId,
          description,
          category,
          amount,
          date: normalizedDate,
          notes
        });
        importedCount++;
      }

      // Show results
      let message = `✅ ${importedCount} transação(ões) importada(s) com sucesso!`;
      if (errors.length > 0) {
        message += `\n\n⚠️ ${errors.length} erro(s) encontrado(s):\n${errors.slice(0, 5).join('\n')}`;
        if (errors.length > 5) {
          message += `\n... e mais ${errors.length - 5} erro(s)`;
        }
      }
      
      alert(message);
      
      // Refresh the table display
      applyFilter(currentFilter);
      updateCharts();
      
    } catch (error) {
      alert(`Erro ao processar arquivo CSV: ${error.message}`);
    }

    // Reset the file input
    event.target.value = '';
  };

  reader.onerror = () => {
    alert('Erro ao ler o arquivo.');
    event.target.value = '';
  };

  reader.readAsText(file, 'UTF-8');
});

document.getElementById('printBtn').addEventListener('click', () => window.print());


collapseBtn?.addEventListener('click', () => sidebar.classList.toggle('collapsed'));
menuBtn?.addEventListener('click', () => sidebar.classList.toggle('open'));

function openSettingsPanel() {
  settingsPanel?.classList.remove('hidden');
  settingsPanel?.setAttribute('aria-hidden', 'false');
}

function closeSettingsPanel() {
  settingsPanel?.classList.add('hidden');
  settingsPanel?.setAttribute('aria-hidden', 'true');
}

showRegisterBtn?.addEventListener('click', () => showAuthView('register'));
backToLoginBtn?.addEventListener('click', () => showAuthView('login'));
settingsBtn?.addEventListener('click', openSettingsPanel);
notificationsBtn?.addEventListener('click', () => openPanel(notificationsPanel));
closeNotificationsBtn?.addEventListener('click', closePanels);
profileBtn?.addEventListener('click', () => {
  renderProfile();
  openPanel(profileMenu);
});
closeProfileBtn?.addEventListener('click', closePanels);
logoutBtn?.addEventListener('click', () => {
  localStorage.removeItem('novaledger-user');
  closePanels();
  showDashboard();
});
settingsNav?.addEventListener('click', (event) => {
  event.preventDefault();
  sidebar?.classList.remove('open');
  openSettingsPanel();
});
closeSettingsBtn?.addEventListener('click', closeSettingsPanel);
backdrop?.addEventListener('click', () => {
  closeSettingsPanel();
  closePanels();
  closeModal();
});
applySettingsBtn?.addEventListener('click', () => {
  const currency = document.getElementById('currencySelect')?.value || 'BRL';
  const timezone = document.getElementById('timezoneSelect')?.value || 'Brasília';
  const dateFormat = document.getElementById('dateFormatSelect')?.value || 'DD/MM/AAAA';
  const showGoals = document.getElementById('showGoalsToggle')?.checked;
  const autoRefresh = document.getElementById('autoRefreshToggle')?.checked;
  const alerts = document.getElementById('alertsToggle')?.checked;
  const csvExport = document.getElementById('csvToggle')?.checked;
  const dailySummary = document.getElementById('dailySummaryToggle')?.checked;
  const backup = document.getElementById('backupToggle')?.checked;
  const emailReminder = document.getElementById('emailReminderToggle')?.checked;
  const annualGoal = Number(document.getElementById('annualGoalInput')?.value) || 150000;
  const language = document.getElementById('languageSelect')?.value || 'pt';

  localStorage.setItem('novaledger-settings', JSON.stringify({
    currency, timezone, dateFormat, showGoals, autoRefresh, alerts,
    csvExport, dailySummary, backup, emailReminder, language, annualGoal
  }));

  applySettingsState();
  closeSettingsPanel();
});

document.querySelectorAll('.nav-link').forEach((link) => {
  link.addEventListener('click', () => sidebar.classList.remove('open'));
});

const backBtn = document.getElementById('backBtn');
backBtn?.addEventListener('click', () => {
  window.location.href = 'index.html';
});

const revenueChartInstance = new Chart(document.getElementById('revenueChart'), {
  type: 'line',
  data: {
    labels: getMonthlySeries().map((item) => item.label),
    datasets: [{
      label: t('incomeLabel'),
      data: getMonthlySeries().map((item) => item.value),
      borderColor: '#22d3ee',
      backgroundColor: 'rgba(34,211,238,0.18)',
      fill: true,
      tension: 0.35,
      pointRadius: 0,
      borderWidth: 3
    }]
  },
  options: {
    plugins: { legend: { display: false } },
    scales: { x: { grid: { display: false }, ticks: { color: '#cbd5e1' } }, y: { grid: { color: 'rgba(148,163,184,0.1)' }, ticks: { color: '#cbd5e1' } } }
  }
});

const donutChartInstance = new Chart(document.getElementById('donutChart'), {
  type: 'doughnut',
  data: {
    labels: [t('incomeLabel'), t('expenseLabel'), t('investmentLabel')],
    datasets: [{
      data: [getTransactionTotals().revenue, getTransactionTotals().expenses, getTransactionTotals().investments],
      backgroundColor: ['#22d3ee', '#84cc16', '#f472b6'],
      borderWidth: 0
    }]
  },
  options: { cutout: '68%', plugins: { legend: { position: 'bottom', labels: { color: '#e5eefc' } } } }
});

// variables for plan selection
let expiredSelectedPlan = 'Premium';
let modalSelectedPlan = 'Premium';

// Pix Key Copier
window.copyPixKey = function(inputId) {
  const input = document.getElementById(inputId);
  if (input) {
    input.select();
    navigator.clipboard.writeText(input.value)
      .then(() => alert('Chave Pix copiada para a área de transferência!'))
      .catch(() => {
        document.execCommand('copy');
        alert('Chave Pix copiada para a área de transferência!');
      });
  }
};

document.getElementById('btnCopyPixExpired')?.addEventListener('click', () => window.copyPixKey('expiredPixKey'));
document.getElementById('btnCopyPixModal')?.addEventListener('click', () => window.copyPixKey('modalPixKey'));

// Select Plan Cards (Expired Overlay)
document.querySelectorAll('#trialExpiredOverlay .plan-card').forEach((card) => {
  card.addEventListener('click', () => {
    document.querySelectorAll('#trialExpiredOverlay .plan-card').forEach((c) => {
      c.classList.remove('active', 'border-2', 'border-cyan-400');
      c.classList.add('border', 'border-white/10');
    });
    card.classList.add('active', 'border-2', 'border-cyan-400');
    card.classList.remove('border', 'border-white/10');
    expiredSelectedPlan = card.dataset.plan;
  });
});

// Select Plan Cards (Upgrade Modal)
document.querySelectorAll('#upgradeModal .plan-card').forEach((card) => {
  card.addEventListener('click', () => {
    document.querySelectorAll('#upgradeModal .plan-card').forEach((c) => {
      c.classList.remove('active', 'border-2', 'border-cyan-400');
      c.classList.add('border', 'border-white/10');
    });
    card.classList.add('active', 'border-2', 'border-cyan-400');
    card.classList.remove('border', 'border-white/10');
    modalSelectedPlan = card.dataset.plan;
  });
});

// Payment Method Tabs (Expired Overlay)
document.querySelectorAll('.pay-tab').forEach((tab) => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.pay-tab').forEach((t) => t.classList.remove('active'));
    tab.classList.add('active');

    const method = tab.dataset.method;
    document.getElementById('pixPaymentForm')?.classList.toggle('hidden', method !== 'pix');
    document.getElementById('creditPaymentForm')?.classList.toggle('hidden', method !== 'credit');
    document.getElementById('debitPaymentForm')?.classList.toggle('hidden', method !== 'debit');
  });
});

// Payment Method Tabs (Upgrade Modal)
document.querySelectorAll('.modal-pay-tab').forEach((tab) => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.modal-pay-tab').forEach((t) => t.classList.remove('active'));
    tab.classList.add('active');

    const method = tab.dataset.method;
    document.getElementById('modalPixPaymentForm')?.classList.toggle('hidden', method !== 'pix');
    document.getElementById('modalCreditPaymentForm')?.classList.toggle('hidden', method !== 'credit');
    document.getElementById('modalDebitPaymentForm')?.classList.toggle('hidden', method !== 'debit');
  });
});

// Process Upgrade (writes plan to accounts and session)
function processPaidUpgrade(newPlan, isExpiredFlow) {
  const containerId = isExpiredFlow ? 'paymentFormsContainer' : 'modalPaymentFormsContainer';
  const loadingId = isExpiredFlow ? 'paymentLoadingState' : 'modalPaymentLoadingState';
  const successId = isExpiredFlow ? 'paymentSuccessState' : 'modalPaymentSuccessState';
  const successPlanLabelId = isExpiredFlow ? 'successPlanName' : 'modalSuccessPlanName';

  // Hide forms
  document.getElementById(isExpiredFlow ? 'pixPaymentForm' : 'modalPixPaymentForm')?.classList.add('hidden');
  document.getElementById(isExpiredFlow ? 'creditPaymentForm' : 'modalCreditPaymentForm')?.classList.add('hidden');
  document.getElementById(isExpiredFlow ? 'debitPaymentForm' : 'modalDebitPaymentForm')?.classList.add('hidden');
  
  // Show spinner
  const loadingDiv = document.getElementById(loadingId);
  if (loadingDiv) loadingDiv.classList.remove('hidden');

  setTimeout(() => {
    // Hide spinner
    if (loadingDiv) loadingDiv.classList.add('hidden');

    // Update localStorage user and accounts database
    const user = JSON.parse(localStorage.getItem('novaledger-user') || '{}');
    user.plan = newPlan;
    localStorage.setItem('novaledger-user', JSON.stringify(user));

    const accounts = JSON.parse(localStorage.getItem('novaledger-accounts') || '[]');
    const idx = accounts.findIndex((acc) => acc.email === user.email);
    if (idx >= 0) {
      accounts[idx].plan = newPlan;
      localStorage.setItem('novaledger-accounts', JSON.stringify(accounts));
    }

    // Show success state
    const successPlanLabel = document.getElementById(successPlanLabelId);
    if (successPlanLabel) successPlanLabel.textContent = newPlan;
    const successDiv = document.getElementById(successId);
    if (successDiv) successDiv.classList.remove('hidden');

    setTimeout(() => {
      // Clean success display
      if (successDiv) successDiv.classList.add('hidden');
      
      // Close overlay/modal
      if (isExpiredFlow) {
        document.getElementById('trialExpiredOverlay')?.classList.add('hidden');
      } else {
        document.getElementById('upgradeModal')?.classList.add('hidden');
      }

      // Re-trigger layout rendering
      showDashboard();
    }, 1500);

  }, 1500);
}

// Payment trigger submit listeners (Expired flow)
document.querySelectorAll('.expired-pay-submit-btn').forEach((btn) => {
  btn.addEventListener('click', () => processPaidUpgrade(expiredSelectedPlan, true));
});
document.querySelectorAll('.expired-card-form').forEach((form) => {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    processPaidUpgrade(expiredSelectedPlan, true);
  });
});

// Payment trigger submit listeners (Upgrade modal flow)
document.querySelectorAll('.upgrade-pay-submit-btn').forEach((btn) => {
  btn.addEventListener('click', () => processPaidUpgrade(modalSelectedPlan, false));
});
document.querySelectorAll('.upgrade-card-form').forEach((form) => {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    processPaidUpgrade(modalSelectedPlan, false);
  });
});

// Upgrade triggers inside panel
function resetCheckoutForms(isModal) {
  const pixForm = document.getElementById(isModal ? 'modalPixPaymentForm' : 'pixPaymentForm');
  const creditForm = document.getElementById(isModal ? 'modalCreditPaymentForm' : 'creditPaymentForm');
  const debitForm = document.getElementById(isModal ? 'modalDebitPaymentForm' : 'debitPaymentForm');
  const loading = document.getElementById(isModal ? 'modalPaymentLoadingState' : 'paymentLoadingState');
  const success = document.getElementById(isModal ? 'modalPaymentSuccessState' : 'paymentSuccessState');

  pixForm?.classList.remove('hidden');
  creditForm?.classList.add('hidden');
  debitForm?.classList.add('hidden');
  loading?.classList.add('hidden');
  success?.classList.add('hidden');

  // reset tabs active
  const tabs = document.querySelectorAll(isModal ? '.modal-pay-tab' : '.pay-tab');
  tabs.forEach((t) => t.classList.remove('active'));
  if (tabs[0]) tabs[0].classList.add('active');

  // reset credit/debit forms
  document.querySelectorAll(isModal ? '.upgrade-card-form' : '.expired-card-form').forEach((f) => f.reset());
}

document.getElementById('sidebarUpgradeBtn')?.addEventListener('click', () => {
  resetCheckoutForms(true);
  modalSelectedPlan = 'Premium';
  document.querySelectorAll('#upgradeModal .plan-card').forEach((c) => {
    if (c.dataset.plan === 'Premium') {
      c.classList.add('active', 'border-2', 'border-cyan-400');
      c.classList.remove('border', 'border-white/10');
    } else {
      c.classList.remove('active', 'border-2', 'border-cyan-400');
      c.classList.add('border', 'border-white/10');
    }
  });
  document.getElementById('upgradeModal')?.classList.remove('hidden');
});

document.getElementById('profileUpgradeBtn')?.addEventListener('click', () => {
  closePanels();
  resetCheckoutForms(true);
  modalSelectedPlan = 'Premium';
  document.querySelectorAll('#upgradeModal .plan-card').forEach((c) => {
    if (c.dataset.plan === 'Premium') {
      c.classList.add('active', 'border-2', 'border-cyan-400');
      c.classList.remove('border', 'border-white/10');
    } else {
      c.classList.remove('active', 'border-2', 'border-cyan-400');
      c.classList.add('border', 'border-white/10');
    }
  });
  document.getElementById('upgradeModal')?.classList.remove('hidden');
});

document.getElementById('closeUpgradeModalBtn')?.addEventListener('click', () => {
  document.getElementById('upgradeModal')?.classList.add('hidden');
});

// Expired logout click
document.getElementById('expiredLogoutBtn')?.addEventListener('click', () => {
  localStorage.removeItem('novaledger-user');
  document.getElementById('trialExpiredOverlay')?.classList.add('hidden');
  showDashboard();
});

// Sim Dev Tool (Simulator Button)
document.getElementById('simTrialExpireBtn')?.addEventListener('click', () => {
  const user = JSON.parse(localStorage.getItem('novaledger-user') || 'null');
  if (!user) {
    alert('Nenhum usuário logado para simular a expiração.');
    return;
  }
  
  // Set createdAt to 3 days and 1 hour ago
  const expiredTime = Date.now() - (3 * 24 * 60 * 60 * 1000 + 3600000);
  user.createdAt = expiredTime;
  user.plan = 'Trial'; // reset plan to Trial to trigger expiration
  localStorage.setItem('novaledger-user', JSON.stringify(user));

  const accounts = JSON.parse(localStorage.getItem('novaledger-accounts') || '[]');
  const idx = accounts.findIndex((acc) => acc.email === user.email);
  if (idx >= 0) {
    accounts[idx].createdAt = expiredTime;
    accounts[idx].plan = 'Trial';
    localStorage.setItem('novaledger-accounts', JSON.stringify(accounts));
  }

  alert('Simulação ativada! A data de criação da sua conta foi alterada para 3 dias atrás.');
  closeSettingsPanel();
  showDashboard();
});

showAuthView('login');
showDashboard();
applySettingsState();

