const db = require('../db/database');

const SELECT_BASE = `
  SELECT t.id, t.amount, t.category_id, t.date, t.comment,
         c.name AS category_name, c.type AS type
  FROM transactions t
  JOIN categories c ON c.id = t.category_id
`;

const TransactionModel = {
  getAll({ category_id, type, from, to } = {}) {
    const where = [];
    const params = [];

    if (category_id) {
      where.push('t.category_id = ?');
      params.push(category_id);
    }
    if (type) {
      where.push('c.type = ?');
      params.push(type);
    }
    if (from) {
      where.push('t.date >= ?');
      params.push(from);
    }
    if (to) {
      where.push('t.date <= ?');
      params.push(to);
    }

    const sql =
      SELECT_BASE +
      (where.length ? ' WHERE ' + where.join(' AND ') : '') +
      ' ORDER BY t.date DESC, t.id DESC';

    return db.prepare(sql).all(...params);
  },

  getById(id) {
    return db.prepare(SELECT_BASE + ' WHERE t.id = ?').get(id);
  },
};

module.exports = TransactionModel;
