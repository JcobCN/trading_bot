const { Front, FrontDetail } = require("../models");
const app = require("../app.js");

/** @module settingController */

/** 
 * <pre>
 * APIs for Settings 
 * API prefix : /setting/
 * Provided APIs :   
 *               setMainWallet,
 *               addWallet,
 *               deleteWallet,
 *               addWalletFromFile,
 *               listWallets,
 *               resetAll
 * </pre>
 */
/**
 * @function sendUpdateMessage
 * @description Send update message to each client in order to apply updated settings.
 */
function sendUpdateMessage() {
  var aWss = app.wss.getWss("/");
  aWss.clients.forEach(function (client) {
    client.send("setting Updated");
  });
}

/**
 * @export @function API: /setting/setMainWallet
 * @description Initialize the Main Wallet Data 
 * @description The function clears Front running Transaction History data from database and update.
 * @return : "Front running Transaction History has been deleted" on success
 * @return : Error message on error.
 */
function setMainSettings(req, res) {
  
  const {
    mainWalletAddress, 
    mainWalletPrivateKey,
    tokenAddress,
    tokenName,
    tokenSymbol,
  } = req.body;

  MainSetting.update(
    {
      mainWalletAddress: mainWalletAddress,
      mainWalletPrivateKey: mainWalletPrivateKey,
      tokenAddress: tokenAddress,
      tokenName: tokenName,
      tokenSymbol: tokenSymbol,
    }, 
    {
      where: {id:1,},
    }  
  ).then((mainSetting) =>
      res.status(201).json({
        error: false,
        data:mainSetting,
        message: "Main Setting was saved.",
      })
    )
    .catch((error) =>
      res.json({
        error: true,
        message: error,
      })
    );
  sendUpdateMessage();
}

/**
 * @export @function listWallets
 * @description 
 * <pre>
 *    List the Work Wallets registered in the system. 
 * </pre>
 * @param {object} req 
 * @param {object} res 
 */
function listWallets(req, res) {
  Wallet.findAll({})
    .then((wallets) =>
      res.status(201).json({
        error: false,
        data: wallets,
      })
    )
    .catch((error) =>
      res.json({
        error: true,
        message: error,
      })
    );
}

/**
 * @export @function addWallet
 * @description 
 * <pre>
 *    Add the given wallet information into database.
 * </pre>
 * @param {object} req 
 * @param {object} res 
 */
function addWallet(req, res) {
  const { address, key } = req.body;
  Wallet.create({
    address: address,
    key: key,
  }).then((wallet) =>
    res.status(201).json({
      error: false,
      data: wallet,
    })
  ).catch((error) =>
    res.json({
      error: true,
      message: error,
    })
  );
}

/**
 * @export @function deleteWallet
 * @description 
 * <pre>
 *    Delete the given wallet information from database.
 * </pre>
 * @param {object} req 
 * @param {object} res 
 */
function deleteWallet(req, res) {

  const { address } = req.body;

  Wallet.destroy({
    where: {
      address: address,
    },
  }).then((status) =>
    res.status(201).json({
      error: false,
      message: "Wallet has been deleted",
    })
  ).catch((error) =>
    res.json({
      error: true,
      error: error,
    })
  );
}

/**
 * @export @function addWalletFromFile
 * @description 
 * <pre>
 *    Add all of the wallet lists from given file.
 *    The file syntac : 
 *      address , private key (in plain string.)
 *   EX : 
 *      0x4DD0123123 , 0x4DD0123123
 * </pre>
 * @param {object} req 
 * @param {object} res 
 */
// TODO : implement later
function addWalletFromFile(req, res) {

}
/**
 * 
 * @export @function API: /setting/resetAll
 * @description Initialize all of the settings 
 * @description The function clears all of the settings from database including : .
 * @description Front, FrontDetail ... 
 * @return :"All Information has been deleted" on success
 * @return : Error message on error.
 */
function resetAll(req, res) {
  // We should handle the result if success or fail for each destroy option.
  promise1 = MainSetting.destroy({
    where: {
      id: 1,
    },
  });

  promise2 = Transaction.destroy({
    where: {},
    truncate: true,
  })

  Promise.all([promise1, promise2]).then((status_list) =>
    res.status(201).json({
      error: false,
      message: "All Information has been deleted",
    })
  )
    .catch((error) =>
      res.json({
        error: true,
        message: error,
      })
    );
  sendUpdateMessage();
}

module.exports = {
  setMainSettings,
  addWallet,
  deleteWallet,
  addWalletFromFile,
  listWallets,
  resetAll,
};
