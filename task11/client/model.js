// MODEL: состояние приложения, подсчёты и пользовательские настройки (localStorage)
const SETTINGS_KEY = 'zen-money-settings';

export const state = {
  categories: [],
  transactions: [],
  filters: { category_id: '', type: '', from: '', to: '' },
  editingId: null,
  theme: 'light',
};

export function getSummary(transactions = state.transactions) {
  let income = 0;
  let expense = 0;
  for (const t of transactions) {
    if (t.type === 'income') income += t.amount;
    else expense += t.amount;
  }
  return { income, expense, balance: income - expense };
}

export function findTransaction(id) {
  return state.transactions.find((t) => t.id === id);
}

// В localStorage — только настройки интерфейса, данные хранятся на сервере
export function loadSettings() {
  try {
    const saved = JSON.parse(localStorage.getItem(SETTINGS_KEY));
    if (saved?.filters) state.filters = { ...state.filters, ...saved.filters };
    if (saved?.theme) state.theme = saved.theme;
  } catch {
    // повреждённые настройки игнорируем
  }
}

export function saveSettings() {
  localStorage.setItem(
    SETTINGS_KEY,
    JSON.stringify({ filters: state.filters, theme: state.theme })
  );
}
