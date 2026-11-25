const model = require('../models/transactionModel');

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

module.exports = { getAll };