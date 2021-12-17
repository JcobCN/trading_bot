const express = require('express');
const transactionController = require('../controllers/transactionController');

const router = new express.Router();

router.get('/listTransactions', transactionController.listTransactions);
router.get('/clearHistory', transactionController.clearHistory);

module.exports = router;