const express = require('express');
const tokenController = require('../controllers/tokenController');
const blackTokenController = require('../controllers/blacktokenController');

const router = new express.Router();

router.get('/list', tokenController.list);
router.post('/add', tokenController.add);
router.post('/del', tokenController.delete);
router.get('/blacklist', blackTokenController.list);
router.post('/blackadd', blackTokenController.add);
router.post('/blackdel', blackTokenController.delete);

module.exports = router;