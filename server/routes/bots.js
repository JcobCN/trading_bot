const express = require('express');
const BotController = require('../controllers/botCo');

const router = new express.Router();

router.post('/startBot', BotController.startBot);
router.get('/stopBot', BotController.stopBot);
router.get('/getBotStatus', BotController.getBotStatus);

module.exports = router;