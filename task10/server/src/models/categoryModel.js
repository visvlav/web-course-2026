const db = require('../db');

function getAll() {
  return db.prepare('SELECT id, name, type FROM categories ORDER BY id').all();
}

function getById(id) {
  return db.prepare('SELECT id, name, type FROM categories WHERE id = ?').get(id);
}

function create(name, type) {
  const info = db
    .prepare('INSERT INTO categories (name, type) VALUES (?, ?)')
    .run(name, type);

  return getById(info.lastInsertRowid);
}

module.exports = { getAll, getById, create };