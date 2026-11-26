const TransactionModel = require('../models/transactionModel');
const CategoryModel = require('../models/categoryModel');
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function getAll(req, res) {
  try {
    const { category_id, type, from, to } = req.query;
    const filters = {};

    if (category_id) {
      const id = Number(category_id);
      if (!Number.isInteger(id)) {
        return res.status(400).json({ error: 'category_id должен быть целым числом' });
      }
      filters.category_id = id;
    }
    if (type) {
      if (type !== 'income' && type !== 'expense') {
        return res.status(400).json({ error: 'type должен быть "income" или "expense"' });
      }
      filters.type = type;
    }
    if (from) {
      if (!DATE_RE.test(from)) {
        return res.status(400).json({ error: 'from должен быть в формате ГГГГ-ММ-ДД' });
      }
      filters.from = from;
    }
    if (to) {
      if (!DATE_RE.test(to)) {
        return res.status(400).json({ error: 'to должен быть в формате ГГГГ-ММ-ДД' });
      }
      filters.to = to;
    }

    res.json(TransactionModel.getAll(filters));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Не удалось получить операции' });
  }
}

module.exports = { getAll };