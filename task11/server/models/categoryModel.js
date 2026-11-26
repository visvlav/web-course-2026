const db = require('../db');

function getAll() {
    return db.prepare('SELECT * FROM categories').all();
}

function create(name, type) {
    const result = db.prepare(`
        INSERT INTO categories (name, type)
        VALUES (?, ?)
    `).run(name, type);

    return db.prepare(`
        SELECT * FROM categories WHERE id = ?
    `).get(result.lastInsertRowid);
}

function count() {
    return db.prepare('SELECT COUNT(*) AS total FROM categories').get().total;
}

module.exports = {
    getAll,
    create,
    count
};