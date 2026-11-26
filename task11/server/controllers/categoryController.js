const categoryModel = require('../models/categoryModel');

function getAll(req, res) {
    try {
        const categories = categoryModel.getAll();

        res.json(categories);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: 'Не удалось получить категории'
        });
    }
}

function create(req, res) {
    try {
        const { name, type } = req.body;

        if (!name || typeof name !== 'string' || !name.trim()) {
            return res.status(400).json({
                error: 'Название категории обязательно'
            });
        }

        if (!['income', 'expense'].includes(type)) {
            return res.status(400).json({
                error: 'Тип категории должен быть income или expense'
            });
        }

        const category = categoryModel.create(
            name.trim(),
            type
        );

        res.status(201).json(category);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: 'Не удалось создать категорию'
        });
    }
}

module.exports = {
    getAll,
    create
};