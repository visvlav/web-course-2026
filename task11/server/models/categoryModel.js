// MODEL: работа с таблицей categories (только SQL, никакого HTTP)
const db = require('../db');

const TYPES = ['income', 'expense'];

function findAll() {
  return db.prepare('SELECT * FROM categories ORDER BY id').all();
}

function findById(id) {
  return db.prepare('SELECT * FROM categories WHERE id = ?').get(id);
}

function create(name, type) {
  const info = db
    .prepare('INSERT INTO categories (name, type) VALUES (?, ?)')
    .run(name, type);
  return findById(info.lastInsertRowid);
}

module.exports = { TYPES, findAll, findById, create };
