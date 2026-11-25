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
function create({ amount, category_id, date, comment }) {
  const info = db
    .prepare('INSERT INTO transactions (amount, category_id, date, comment) VALUES (?, ?, ?, ?)')
    .run(amount, category_id, date, comment ?? null);
  return getById(info.lastInsertRowid);
}

function update(id, { amount, category_id, date, comment }) {
  const info = db
    .prepare('UPDATE transactions SET amount = ?, category_id = ?, date = ?, comment = ? WHERE id = ?')
    .run(amount, category_id, date, comment ?? null, id);
  return info.changes > 0 ? getById(id) : null;
}

function remove(id) {
  return db.prepare('DELETE FROM transactions WHERE id = ?').run(id).changes > 0;
}
module.exports = { getAll, getById, create, update, remove };