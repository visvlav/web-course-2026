const categoryModel = require('./categoryModel');

function seedCategories() {
    if (categoryModel.count() === 0) {
        categoryModel.create('Еда', 'expense');
        categoryModel.create('Транспорт', 'expense');
        categoryModel.create('Зарплата', 'income');
    }
}

module.exports = { seedCategories };
