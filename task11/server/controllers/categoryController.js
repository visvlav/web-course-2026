const CategoryModel = require('../models/categoryModel');

function getAll(req, res) {
  try {
    res.json(CategoryModel.getAll());
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Не удалось получить категории' });
  }
}

function create(req, res) {
  try {
    const body = req.body || {};
    const name = typeof body.name === 'string' ? body.name.trim() : '';
    const type = body.type;

    if (!name) {
      return res.status(400).json({ error: 'Название категории обязательно' });
    }
    if (type !== 'income' && type !== 'expense') {
      return res.status(400).json({ error: 'type должен быть "income" или "expense"' });
    }

    res.status(201).json(CategoryModel.create(name, type));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Не удалось создать категорию' });
  }
}

module.exports = { getAll, create };
