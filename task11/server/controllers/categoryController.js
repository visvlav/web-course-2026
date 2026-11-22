// CONTROLLER: принимает запрос, валидирует, вызывает модель, отвечает
const categoryModel = require('../models/categoryModel');
const { validateCategory } = require('./validators');

function getAll(req, res) {
  try {
    res.json(categoryModel.findAll());
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Не удалось получить категории' });
  }
}

function create(req, res) {
  try {
    const { error, data } = validateCategory(req.body);
    if (error) return res.status(400).json({ error });

    const category = categoryModel.create(data.name, data.type);
    res.status(201).json(category);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Не удалось создать категорию' });
  }
}

module.exports = { getAll, create };
