const model = require('../models/transactionModel');
const categoryModel = require('../models/categoryModel');
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function getAll(req, res) {
  try {
    const { category_id, type, from, to } = req.query;

    if (type && type !== 'income' && type !== 'expense') {
      return res.status(400).json({ error: "type должен быть 'income' или 'expense'" });
    }
    if (category_id && !Number.isInteger(Number(category_id))) {
      return res.status(400).json({ error: 'category_id должен быть целым числом' });
    }
    if ((from && !DATE_RE.test(from)) || (to && !DATE_RE.test(to))) {
      return res.status(400).json({ error: 'from и to должны быть в формате ГГГГ-ММ-ДД' });
    }
    if (from && to && from > to) {
      return res.status(400).json({ error: 'from не может быть позже to' });
    }

    res.json(model.getAll({ category_id: category_id && Number(category_id), type, from, to }));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Не удалось получить операции' });
  }
}
function validate(body) {
  const { amount, category_id, date, comment } = body || {};

  if (typeof amount !== 'number' || !Number.isFinite(amount) || amount <= 0) {
    return 'amount должен быть числом больше 0';
  }
  if (!Number.isInteger(category_id) || !categoryModel.getById(category_id)) {
    return 'Категория с таким category_id не существует';
  }
  if (typeof date !== 'string' || !DATE_RE.test(date) || Number.isNaN(Date.parse(date))) {
    return 'date должна быть в формате ГГГГ-ММ-ДД';
  }
  if (comment !== undefined && comment !== null && typeof comment !== 'string') {
    return 'comment должен быть строкой';
  }
  return null;
}

function parseId(req) {
  const id = Number(req.params.id);
  return Number.isInteger(id) && id > 0 ? id : null;
}

function create(req, res) {
  try {
    const error = validate(req.body);
    if (error) return res.status(400).json({ error });

    res.status(201).json(model.create(req.body));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Не удалось создать операцию' });
  }
}

function update(req, res) {
  try {
    const id = parseId(req);
    if (!id) return res.status(400).json({ error: 'Некорректный id' });

    const error = validate(req.body);
    if (error) return res.status(400).json({ error });

    const updated = model.update(id, req.body);
    if (!updated) return res.status(404).json({ error: 'Операция не найдена' });

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Не удалось обновить операцию' });
  }
}

function remove(req, res) {
  try {
    const id = parseId(req);
    if (!id) return res.status(400).json({ error: 'Некорректный id' });

    if (!model.remove(id)) return res.status(404).json({ error: 'Операция не найдена' });

    res.status(204).end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Не удалось удалить операцию' });
  }
}
module.exports = { getAll, create, update, remove  };