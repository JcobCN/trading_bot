const express = require('express');
const settingController = require('../controllers/settingController');

const router = new express.Router();

router.get('/getMainSetting', settingController.getMainSetting);
router.post('/setMainSetting', settingController.setMainSetting);
router.post('/addWallet', settingController.addWallet);
router.post('/deleteWallet', settingController.deleteWallet);
router.post('/addWalletFromFile', settingController.addWalletFromFile);

router.get('/listWallets', settingController.listWallets);
router.get('/resetAll', settingController.resetAll);

module.exports = router;