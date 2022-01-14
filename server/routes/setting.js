const express = require('express');
const settingController = require('../controllers/settingController');

const router = new express.Router();

router.get('/getMainSetting', settingController.getMainSetting);
router.post('/setMainSetting', settingController.setMainSetting);
router.post('/addWorkWallet', settingController.addWorkWallet);
router.post('/deleteWorkWallet', settingController.deleteWorkWallet);
router.post('/addWorkWalletFromFile', settingController.addWorkWalletFromFile);

router.post('/getWorkWalletBalance', settingController.getWorkWalletBalance);

router.get('/listWorkWallets', settingController.listWorkWallets);
router.get('/resetAll', settingController.resetAll);

module.exports = router;