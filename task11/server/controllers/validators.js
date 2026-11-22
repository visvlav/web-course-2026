// Серверная валидация (серверу нельзя доверять клиенту)
const categoryModel = require('../models/categoryModel');

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function isValidDate(value) {
  if (typeof value !== 'string' || !DATE_RE.test(value)) return false;
  const d = new Date(value + 'T00:00:00Z');
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === value;
}

function parseId(value) {
  const n = Number(value);
  return Number.isInteger(n) && n > 0 ? n : null;
}

// Возвращает { error } или { data } с очищенными значениями
function validateTransaction(body = {}) {
  const amount = typeof body.amount === 'string' && body.amount.trim() !== ''
    ? Number(body.amount)
    : body.amount;

  if (typeof amount !== 'number' || !Number.isFinite(amount) || amount <= 0) {
    return { error: 'Сумма должна быть числом больше 0' };
  }

  const category_id = parseId(body.category_id);
  if (!category_id || !categoryModel.findById(category_id)) {
    return { error: 'Указанная категория не существует' };
  }

  if (!isValidDate(body.date)) {
    return { error: 'Дата должна быть в формате ГГГГ-ММ-ДД' };
  }

  if (body.comment != null && typeof body.comment !== 'string') {
    return { error: 'Комментарий должен быть строкой' };
  }
  const comment = (body.comment || '').trim();

  return { data: { amount, category_id, date: body.date, comment } };
}

function validateCategory(body = {}) {
  const name = typeof body.name === 'string' ? body.name.trim() : '';
  if (!name) return { error: 'Название категории не может быть пустым' };
  if (!categoryModel.TYPES.includes(body.type)) {
    return { error: "Тип категории должен быть 'income' или 'expense'" };
  }
  return { data: { name, type: body.type } };
}

// Проверка query-параметров фильтрации GET /transactions
function validateFilters(query = {}) {
  const filters = {};

  if (query.category_id) {
    const id = parseId(query.category_id);
    if (!id) return { error: 'category_id должен быть положительным числом' };
    filters.category_id = id;
  }
  if (query.type) {
    if (!categoryModel.TYPES.includes(query.type)) {
      return { error: "type должен быть 'income' или 'expense'" };
    }
    filters.type = query.type;
  }
  for (const key of ['from', 'to']) {
    if (query[key]) {
      if (!isValidDate(query[key])) {
        return { error: `${key} должен быть датой в формате ГГГГ-ММ-ДД` };
      }
      filters[key] = query[key];
    }
  }
  if (filters.from && filters.to && filters.from > filters.to) {
    return { error: 'Дата "from" не может быть позже "to"' };
  }
  return { data: filters };
}

module.exports = { parseId, validateTransaction, validateCategory, validateFilters };
