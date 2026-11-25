const router = require('express').Router();
const controller = require('../controllers/transactionController');

router.get('/', controller.getAll);

module.exports = router;