const db = require('../db');

function getAll(filters = {}) {
    let sql = `
        SELECT
            transactions.*,
            categories.name AS category_name,
            categories.type AS type
        FROM transactions
        JOIN categories
            ON transactions.category_id = categories.id
    `;

    const conditions = [];
    const params = [];

    if (filters.category_id) {
        conditions.push('transactions.category_id = ?');
        params.push(filters.category_id);
    }

    if (filters.type) {
        conditions.push('categories.type = ?');
        params.push(filters.type);
    }

    if (filters.from) {
        conditions.push('transactions.date >= ?');
        params.push(filters.from);
    }

    if (filters.to) {
        conditions.push('transactions.date <= ?');
        params.push(filters.to);
    }

    if (conditions.length > 0) {
        sql += ' WHERE ' + conditions.join(' AND ');
    }

    sql += ' ORDER BY transactions.date DESC';

    return db.prepare(sql).all(...params);
}

function getById(id) {
    return db.prepare(`
        SELECT
            transactions.*,
            categories.name AS category_name,
            categories.type AS type
        FROM transactions
        JOIN categories
            ON transactions.category_id = categories.id
        WHERE transactions.id = ?
    `).get(id);
}

function create(amount, category_id, date, comment) {
    const result = db.prepare(`
        INSERT INTO transactions
            (amount, category_id, date, comment)
        VALUES (?, ?, ?, ?)
    `).run(amount, category_id, date, comment);

    return getById(result.lastInsertRowid);
}

function update(id, amount, category_id, date, comment) {
    const result = db.prepare(`
        UPDATE transactions
        SET
            amount = ?,
            category_id = ?,
            date = ?,
            comment = ?
        WHERE id = ?
    `).run(amount, category_id, date, comment, id);

    if (result.changes === 0) {
        return null;
    }

    return getById(id);
}

function remove(id) {
    const result = db.prepare(`
        DELETE FROM transactions
        WHERE id = ?
    `).run(id);

    return result.changes > 0;
}

module.exports = {
    getAll,
    getById,
    create,
    update,
    remove
};s