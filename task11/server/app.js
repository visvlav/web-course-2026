const express = require('express');
const cors = require('cors');

const categoryRoutes = require('./routes/categoryRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const app = express();

app.use(cors());
app.use(express.json());

app.use('/categories', categoryRoutes);
app.use('/transactions', transactionRoutes);

app.use((req, res) => {
  res.status(404).json({ error: 'Маршрут не найден' });
});

// общий обработчик ошибок (например, сломанный JSON в теле запроса)
app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'Некорректный JSON в теле запроса' });
  }
  console.error(err);
  res.status(500).json({ error: 'Внутренняя ошибка сервера' });
});

module.exports = app;
