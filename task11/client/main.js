// CONTROLLER: связывает модель, API и представление
import * as api from './api.js';
import { state, getSummary, findTransaction, loadSettings, saveSettings } from './model.js';
import * as ui from './ui.js';

async function safe(action) {
  try {
    await action();
  } catch (err) {
    ui.showMessage(err.message);
  }
}

async function loadCategories() {
  state.categories = await api.getCategories();
  ui.renderFormCategories(state.categories);
  ui.renderFilterCategories(state.categories, state.filters.category_id);
}

async function loadTransactions() {
  state.transactions = await api.getTransactions(state.filters);
  ui.renderTransactions(state.transactions);
  ui.renderSummary(getSummary());
}

// ---------- обработчики ----------

async function onTransactionSubmit(event) {
  event.preventDefault();
  const data = ui.readTransactionForm();

  // Клиентская валидация только для UX, сервер проверяет всё заново
  if (!(Number(data.amount) > 0)) return ui.showMessage('Введите сумму больше 0');
  if (!data.category_id) return ui.showMessage('Выберите категорию');
  if (!data.date) return ui.showMessage('Укажите дату');

  await safe(async () => {
    if (state.editingId) {
      await api.updateTransaction(state.editingId, data);
      ui.showMessage('Операция обновлена', 'success');
    } else {
      await api.createTransaction(data);
      ui.showMessage('Операция добавлена', 'success');
    }
    state.editingId = null;
    ui.resetTransactionForm(state.categories);
    await loadTransactions();
  });
}

async function onCategorySubmit(event) {
  event.preventDefault();
  const data = ui.readCategoryForm();
  if (!data.name.trim()) return ui.showMessage('Введите название категории');

  await safe(async () => {
    await api.createCategory(data);
    ui.clearCategoryForm();
    await loadCategories();
    ui.showMessage('Категория создана', 'success');
  });
}

async function onListClick(event) {
  const button = event.target.closest('button[data-action]');
  if (!button) return;
  const id = Number(button.dataset.id);

  if (button.dataset.action === 'edit') {
    const transaction = findTransaction(id);
    if (!transaction) return;
    state.editingId = id;
    ui.fillTransactionForm(transaction, state.categories);
    return;
  }

  if (button.dataset.action === 'delete') {
    if (!confirm('Удалить операцию?')) return;
    await safe(async () => {
      await api.deleteTransaction(id);
      if (state.editingId === id) {
        state.editingId = null;
        ui.resetTransactionForm(state.categories);
      }
      await loadTransactions();
      ui.showMessage('Операция удалена', 'success');
    });
  }
}

async function onFiltersChange() {
  state.filters = ui.readFilters();
  saveSettings();
  await safe(loadTransactions);
}

async function onFiltersReset() {
  state.filters = { category_id: '', type: '', from: '', to: '' };
  ui.setFilters(state.filters);
  saveSettings();
  await safe(loadTransactions);
}

function onCancelEdit() {
  state.editingId = null;
  ui.resetTransactionForm(state.categories);
}

function onThemeToggle() {
  state.theme = state.theme === 'dark' ? 'light' : 'dark';
  ui.applyTheme(state.theme);
  saveSettings();
}

// ---------- запуск ----------

async function init() {
  loadSettings();
  ui.applyTheme(state.theme);

  const { elements: el } = ui;
  el.transactionForm.addEventListener('submit', onTransactionSubmit);
  el.categoryForm.addEventListener('submit', onCategorySubmit);
  el.list.addEventListener('click', onListClick);
  el.filtersForm.addEventListener('change', onFiltersChange);
  el.resetFilters.addEventListener('click', onFiltersReset);
  el.cancelBtn.addEventListener('click', onCancelEdit);
  el.themeToggle.addEventListener('click', onThemeToggle);
  el.typeSelect.addEventListener('change', () => ui.renderFormCategories(state.categories));

  await safe(async () => {
    await loadCategories();
    ui.setFilters(state.filters);
    state.filters = ui.readFilters(); // если сохранённой категории уже нет, фильтр сбрасывается
    ui.resetTransactionForm(state.categories);
    await loadTransactions();
  });
}

init();
