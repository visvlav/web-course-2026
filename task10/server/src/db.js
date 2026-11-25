const path = require('path');
const Database = require('better-sqlite3');

const db = new Database(path.join(__dirname, '..', 'database.sqlite'));
db.pragma('foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK(type IN ('income', 'expense'))
  );

  CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    amount REAL NOT NULL,
    category_id INTEGER NOT NULL,
    date TEXT NOT NULL,
    comment TEXT,
    FOREIGN KEY (category_id) REFERENCES categories(id)
  );
`);

const { count } = db.prepare('SELECT COUNT(*) AS count FROM categories').get();

if (count === 0) {
  const insert = db.prepare('INSERT INTO categories (name, type) VALUES (?, ?)');
  insert.run('Еда', 'expense');
  insert.run('Транспорт', 'expense');
  insert.run('Зарплата', 'income');
}

module.exports = db;