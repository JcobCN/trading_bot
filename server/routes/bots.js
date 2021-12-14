const express = require('express');
const BotController = require('../controllers/botController');

const router = new express.Router();

router.post('/startFront', BotController.startFront);
router.post('/stopFront', BotController.stopFront);
router.get('/getFrontStatus', BotController.getFrontStatus);

module.exports = router;