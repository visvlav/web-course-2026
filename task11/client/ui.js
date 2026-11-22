// VIEW: только отрисовка и чтение полей. Состояния и запросов здесь нет.
const $ = (id) => document.getElementById(id);

const money = new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB' });
let messageTimer;

export const elements = {
  transactionForm: $('transaction-form'),
  categoryForm: $('category-form'),
  filtersForm: $('filters-form'),
  list: $('list'),
  typeSelect: $('type'),
  filterType: $('f-type'),
  filterCategory: $('f-category'),
  filterFrom: $('f-from'),
  filterTo: $('f-to'),
  resetFilters: $('reset-filters'),
  cancelBtn: $('cancel-btn'),
  themeToggle: $('theme-toggle'),
};

export function showMessage(text, kind = 'error') {
  const box = $('message');
  box.textContent = text;
  box.className = `message ${kind}`;
  clearTimeout(messageTimer);
  messageTimer = setTimeout(() => box.classList.add('hidden'), 4000);
}

export function applyTheme(theme) {
  document.body.classList.toggle('dark', theme === 'dark');
}

export function today() {
  return new Date().toLocaleDateString('sv-SE'); // ГГГГ-ММ-ДД в локальной зоне
}

function fillSelect(select, items, firstOption) {
  select.replaceChildren();
  if (firstOption) select.append(new Option(firstOption, ''));
  for (const item of items) select.append(new Option(item.name, item.id));
}

// Категории формы зависят от выбранного типа
export function renderFormCategories(categories, selectedId) {
  const type = $('type').value;
  fillSelect($('category'), categories.filter((c) => c.type === type));
  if (selectedId) $('category').value = selectedId;
}

export function renderFilterCategories(categories, selectedId) {
  fillSelect($('f-category'), categories, 'Все');
  $('f-category').value = selectedId || '';
}

export function setFilters(filters) {
  $('f-category').value = filters.category_id;
  $('f-type').value = filters.type;
  $('f-from').value = filters.from;
  $('f-to').value = filters.to;
}

export function readFilters() {
  return {
    category_id: $('f-category').value,
    type: $('f-type').value,
    from: $('f-from').value,
    to: $('f-to').value,
  };
}

export function readTransactionForm() {
  return {
    amount: $('amount').value,
    category_id: $('category').value,
    date: $('date').value,
    comment: $('comment').value,
  };
}

export function readCategoryForm() {
  return { name: $('cat-name').value, type: $('cat-type').value };
}

export function clearCategoryForm() {
  $('cat-name').value = '';
}

export function resetTransactionForm(categories) {
  $('transaction-form').reset();
  $('date').value = today();
  renderFormCategories(categories);
  setEditMode(false);
}

export function fillTransactionForm(t, categories) {
  $('amount').value = t.amount;
  $('type').value = t.type;
  renderFormCategories(categories, t.category_id);
  $('date').value = t.date;
  $('comment').value = t.comment || '';
  setEditMode(true);
  $('amount').focus();
}

function setEditMode(editing) {
  $('form-title').textContent = editing ? 'Редактирование операции' : 'Новая операция';
  $('submit-btn').textContent = editing ? 'Сохранить' : 'Добавить';
  $('cancel-btn').classList.toggle('hidden', !editing);
}

export function renderSummary({ income, expense, balance }) {
  $('sum-income').textContent = money.format(income);
  $('sum-expense').textContent = money.format(expense);
  const el = $('sum-balance');
  el.textContent = money.format(balance);
  el.className = balance >= 0 ? 'income' : 'expense';
}

function createButton(text, action, id, extraClass = '') {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = `btn btn-sm ${extraClass}`;
  btn.textContent = text;
  btn.dataset.action = action;
  btn.dataset.id = id;
  return btn;
}

export function renderTransactions(transactions) {
  $('empty').classList.toggle('hidden', transactions.length > 0);
  $('table').classList.toggle('hidden', transactions.length === 0);

  const rows = transactions.map((t) => {
    const tr = document.createElement('tr');
    tr.className = t.type;

    const cells = [t.date, t.category_name, t.comment || '—'];
    for (const text of cells) {
      const td = document.createElement('td');
      td.textContent = text; // textContent защищает от XSS
      tr.append(td);
    }

    const amount = document.createElement('td');
    amount.className = 'amount';
    amount.textContent = (t.type === 'income' ? '+' : '−') + money.format(t.amount);
    tr.append(amount);

    const actions = document.createElement('td');
    actions.className = 'row-actions';
    actions.append(
      createButton('Изменить', 'edit', t.id, 'btn-ghost'),
      createButton('Удалить', 'delete', t.id, 'btn-danger')
    );
    tr.append(actions);
    return tr;
  });

  $('list').replaceChildren(...rows);
}
