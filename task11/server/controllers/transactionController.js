const transactionModel = require('../models/transactionModel');
const categoryModel = require('../models/categoryModel');

function getAll(req, res) {
    try {
        const transactions = transactionModel.getAll(req.query);
        res.json(transactions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Не удалось получить операции' });
    }
}

function create(req, res) {
    try {
        const { amount, category_id, date, comment } = req.body;

        if (!Number.isFinite(Number(amount)) || Number(amount) <= 0) {
            return res.status(400).json({ error: 'Сумма должна быть положительным числом' });
        }

        if (!category_id || !categoryModel.getAll().some(category => category.id === Number(category_id))) {
            return res.status(400).json({ error: 'Указана неверная категория' });
        }

        if (!date) {
            return res.status(400).json({ error: 'Дата обязательна' });
        }

        const transaction = transactionModel.create(
            Number(amount),
            Number(category_id),
            date,
            comment || ''
        );

        res.status(201).json(transaction);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Не удалось создать операцию' });
    }
}

function update(req, res) {
    try {
        const { amount, category_id, date, comment } = req.body;
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({ error: 'Неверный ID операции' });
        }

        if (!Number.isFinite(Number(amount)) || Number(amount) <= 0) {
            return res.status(400).json({ error: 'Сумма должна быть положительным числом' });
        }

        if (!category_id || !categoryModel.getAll().some(category => category.id === Number(category_id))) {
            return res.status(400).json({ error: 'Указана неверная категория' });
        }

        if (!date) {
            return res.status(400).json({ error: 'Дата обязательна' });
        }

        const transaction = transactionModel.update(
            id,
            Number(amount),
            Number(category_id),
            date,
            comment || ''
        );

        if (!transaction) {
            return res.status(404).json({ error: 'Операция не найдена' });
        }

        res.json(transaction);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Не удалось обновить операцию' });
    }
}

function remove(req, res) {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({ error: 'Неверный ID операции' });
        }

        const deleted = transactionModel.remove(id);

        if (!deleted) {
            return res.status(404).json({ error: 'Операция не найдена' });
        }

        res.json({ message: 'Операция удалена' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Не удалось удалить операцию' });
    }
}

module.exports = {
    getAll,
    create,
    update,
    remove
};