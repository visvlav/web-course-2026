// ROUTES: связывают URL с контроллерами
const express = require('express');
const categories = require('./controllers/categoryController');
const transactions = require('./controllers/transactionController');

const router = express.Router();

router.get('/categories', categories.getAll);
router.post('/categories', categories.create);

router.get('/transactions', transactions.getAll);
router.post('/transactions', transactions.create);
router.put('/transactions/:id', transactions.update);
router.delete('/transactions/:id', transactions.remove);

module.exports = router;
