const db = require('../db');

const BASE_SELECT = `
  SELECT t.id, t.amount, t.category_id, t.date, t.comment,
         c.name AS category_name, c.type
  FROM transactions t
  JOIN categories c ON c.id = t.category_id
`;

function getAll({ category_id, type, from, to } = {}) {
  const where = [];
  const params = [];

  if (category_id) { where.push('t.category_id = ?'); params.push(category_id); }
  if (type)        { where.push('c.type = ?');        params.push(type); }
  if (from)        { where.push('t.date >= ?');       params.push(from); }
  if (to)          { where.push('t.date <= ?');       params.push(to); }

  const sql =
    BASE_SELECT +
    (where.length ? ' WHERE ' + where.join(' AND ') : '') +
    ' ORDER BY t.date DESC, t.id DESC';

  return db.prepare(sql).all(...params);
}

function getById(id) {
  return db.prepare(BASE_SELECT + ' WHERE t.id = ?').get(id);
}

module.exports = { getAll, getById };