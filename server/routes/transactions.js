const express = require('express');
const transactionController = require('../controllers/transactionController');

const router = new express.Router();

router.get('/front', transactionController.front);

module.exports = router;