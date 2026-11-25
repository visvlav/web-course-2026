const model = require('../models/categoryModel');

function getAll(req, res) {
  try {
    res.json(model.getAll());
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Не удалось получить категории' });
  }
}

function create(req, res) {
  try {
    const { name, type } = req.body || {};

    if (typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ error: 'name обязателен' });
    }

    if (type !== 'income' && type !== 'expense') {
      return res.status(400).json({
        error: "type должен быть 'income' или 'expense'"
      });
    }

    res.status(201).json(model.create(name.trim(), type));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Не удалось создать категорию' });
  }
}

module.exports = { getAll, create };