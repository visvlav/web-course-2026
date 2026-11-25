const express = require('express');
const cors = require('cors');

require('./src/db');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.use('/categories', require('./src/routes/categories'));
app.use('/transactions', require('./src/routes/transactions'));

app.use((req, res) => {
  res.status(404).json({ error: 'Маршрут не найден' });
});

app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({
      error: 'Некорректный JSON в теле запроса'
    });
  }

  console.error(err);
  res.status(500).json({ error: 'Внутренняя ошибка сервера' });
});

app.listen(PORT, () => {
  console.log(`Сервер запущен: http://localhost:${PORT}`);
});