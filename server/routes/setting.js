const express = require('express');
const settingController = require('../controllers/settingController');

const router = new express.Router();

router.post('/setMainSettings', settingController.setMainSettings);
router.post('/addWallet', settingController.addWallet);
router.post('/deleteWallet', settingController.deleteWallet);
router.post('/addWalletFromFile', settingController.addWalletFromFile);

router.get('/listWallets', settingController.listWallets);
router.get('/resetAll', settingController.resetAll);

// For Transactions : 
router.post('/resetHistory', settingController.resetHistory);


module.exports = router;