const express = require('express');
const cors = require('cors');

const db = require('./db');

const {seedCategories} = require('./models/seed');
const transactionRoutes = require('./routes/transactionRoutes');
const categoryRoutes = require('./routes/categoryRoutes');

const app = express();

const PORT = 3001;

app.use(cors());
app.use(express.json());
app.use('/transactions', transactionRoutes);
seedCategories();

app.use('/categories', categoryRoutes);

app.use((req, res) => {
    res.status(404).json({
        error: 'Маршрут не найден'
    });
});

app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});