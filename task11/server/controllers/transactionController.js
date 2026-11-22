// CONTROLLER: операции
const transactionModel = require('../models/transactionModel');
const { parseId, validateTransaction, validateFilters } = require('./validators');

function getAll(req, res) {
  try {
    const { error, data } = validateFilters(req.query);
    if (error) return res.status(400).json({ error });

    res.json(transactionModel.findAll(data));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Не удалось получить операции' });
  }
}

function create(req, res) {
  try {
    const { error, data } = validateTransaction(req.body);
    if (error) return res.status(400).json({ error });

    res.status(201).json(transactionModel.create(data));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Не удалось создать операцию' });
  }
}

function update(req, res) {
  try {
    const id = parseId(req.params.id);
    if (!id) return res.status(400).json({ error: 'Некорректный id' });
    if (!transactionModel.findById(id)) {
      return res.status(404).json({ error: 'Операция не найдена' });
    }

    const { error, data } = validateTransaction(req.body);
    if (error) return res.status(400).json({ error });

    res.json(transactionModel.update(id, data));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Не удалось обновить операцию' });
  }
}

function remove(req, res) {
  try {
    const id = parseId(req.params.id);
    if (!id) return res.status(400).json({ error: 'Некорректный id' });

    if (!transactionModel.remove(id)) {
      return res.status(404).json({ error: 'Операция не найдена' });
    }
    res.json({ message: 'Операция удалена' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Не удалось удалить операцию' });
  }
}

module.exports = { getAll, create, update, remove };
