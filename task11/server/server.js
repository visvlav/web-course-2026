const express = require('express');
const cors = require('cors');
require('./db'); // создаёт базу и таблицы при первом запуске
const routes = require('./routes');

const PORT = 3001;
const app = express();

app.use(cors());
app.use(express.json());

app.use(routes);

// Неизвестный маршрут
app.use((req, res) => {
  res.status(404).json({ error: 'Маршрут не найден' });
});

// Ошибки middleware (например, битый JSON в теле запроса)
app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'Некорректный JSON в теле запроса' });
  }
  console.error(err);
  res.status(500).json({ error: 'Внутренняя ошибка сервера' });
});

app.listen(PORT, () => {
  console.log(`Zen-Money сервер запущен: http://localhost:${PORT}`);
});
