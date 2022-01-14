const { MainSetting, WorkWallet, BotStatus, Transaction } = require("../models");
const { apiSuccess, apiError, getWalletBalance, getWalletAddress } = require("./engine");
const { formidable } = require("formidable");
const fs = require("fs");
const readline = require('readline');
const app = require("../app");

/** @module settingController */

/** 
 * <pre>
 * APIs for Settings 
 * API prefix : /setting/
 * Provided APIs :   
 *               setMainWallet,
 *               addWorkWallet,
 *               deleteWorkWallet,
 *               addWorkWalletFromFile,
 *               listWorkWallets,
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
    client.send(
      JSON.stringify({
        message:"Setting Updated"
      })
    );
  });
}

/**
 * @export @function API: /setting/getMainSetting
 * @description 
 * <pre>
 *  Get the main settings for the app.
 * </pre>
 * @return : transaction list (timestamp, token, action, price, transaction, other)
 * @return : Error message on error.
 */
function getMainSetting(req, res) {

  // Retrieve all of the front detail information from dataase.
  MainSetting.findAll({
    where: { id: 1, }
  }).then(mainSetting => {
    if (mainSetting.length == 0) {
      let item = {
        id: 1,
        mainWalletAddress: "",
        mainWalletPrivateKey: "",
        tokenAddress: "",
        tokenName: "",
        tokenSymbol: "",
        botStatus: "stop",
      };

      MainSetting.create(item).then((data) => {
        MainSetting.findAll({
          where: {
            id: 1,
          },
        }).then((data) => apiSuccess(res, data, "Created New MainSetting in database.")
        ).catch((error) => apiError(res, error, "Can't create MainSetting")
        );
      });
    } else {
      apiSuccess(res, mainSetting, "Main Setting Data retrieved");
    }
  }).catch((error) => apiError(res, error, "Can't retrieve MainSetting")
  );
}


/**
 * @export @function API: /setting/setMainWallet
 * @description Initialize the Main Wallet Data 
 * @description The function clears Front running Transaction History data from database and update.
 * @return : "Front running Transaction History has been deleted" on success
 * @return : Error message on error.
 */
function setMainSetting(req, res) {

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
      where: { id: 1 },
    }
  ).then((mainSetting) => apiSuccess(res, mainSetting, "Main Setting was saved.")
  ).catch((error) => apiError(res, error, "Can't save Main Setting")
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
function listWorkWallets(req, res) {
  WorkWallet.findAll(
    {}
  ).then((wallets) => apiSuccess(res, wallets, "Got work Wallets")
  ).catch((error) => apiError(res, error, "Can't get work wallets.")
  );
}

/**
 * @export @function addWorkWallet
 * @description 
 * <pre>
 *    Add the given wallet information into database.
 * </pre>
 * @param {object} req 
 * @param {object} res 
 */
async function addWorkWallet(req, res) {
  const {
    walletAddress, walletPrivateKey
  } = req.body;

  addOneWorkWallet(
    walletPrivateKey
  ).then(wallet => apiSuccess(res, wallet, "Added work wallet")
  ).catch(error => apiError(res, error, "Adding work wallet failed : " + walletAddress)
  );
}

async function addOneWorkWallet(privateKey) {

  // 1. Get Wallet Address from the private Key
  let walletAddress = getWalletAddress(privateKey);

  // 2. Retrieve the bnb and token amount in the wallet.
  // we disable this function, because it is time consuming operation for bot.
  // const walletBalence = await getWalletBalance(walletAddress);

  // Update the BotStatus for totalWalletCount increased
  BotStatus.increment(
    'totalWorkWalletCount',
    { where: { id: 1 } },
  );

  // 3. Create a wallet item in the database
  return WorkWallet.upsert(
    {
      timestamp: Date.now(),
      walletAddress: walletAddress,
      walletPrivateKey: privateKey,
    }
  );
}


/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
 async function getWorkWalletBalance(req, res) {
  // First of all, we should get the amount in the main Wallet. 
  const { walletAddress } = req.body;

  if(walletAddress === "" || walletAddress === undefined ) {
    apiError(res, "Empty Wallet address", "getWalletBalance");
    return;
  }

  const walletBalence = await getWalletBalance(walletAddress);
  apiSuccess (res, walletBalence, "wallet balance retrieved");
}

/**
 * @export @function deleteWorkWallet
 * @description 
 * <pre>
 *    Delete the given wallet information from database.
 * </pre>
 * @param {object} req 
 * @param {object} res 
 */
function deleteWorkWallet(req, res) {

  const { walletAddress } = req.body;

  // Update the BotStatus for totalWalletCount increased
  BotStatus.decrement(
    'totalWorkWalletCount',
    { where: { id: 1 } },
  );

  WorkWallet.destroy({
    where: {
      walletAddress: walletAddress,
    },
  }).then((status) => apiSuccess(res, { walletAddress: walletAddress }, "Deleting WorkWallet.")
  ).catch((error) => apiError(res, error, "Can't delete wallet")
  );
}

/**
 * @export @function addWorkWalletFromFile
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
function addWorkWalletFromFile(req, res) {

  let form = new formidable.IncomingForm();

  form.parse(req, (err, fields, file) => {

    var oldpath = file.uploadFile.filepath;

    var rd = readline.createInterface({
      input: fs.createReadStream(oldpath),
      output: process.stdout,
      console: false
    });

    var lineNum = 0;
    // Sample : PrivateKey: 0xf34c419b610772006063f765933cfd261ddb210b149806976ef51d
    rd.on('line', (line) => {
      lineNum++;
      matches = line.match(/[pP]rivate[kK]ey:\s*0x([a-fA-F0-9]*)\s*/);
      if (matches?.length) {
        privateKey = matches[1];
        console.log("line : " + lineNum + " === " + privateKey);
        addOneWorkWallet(privateKey);
      }
    });
  });

  apiSuccess(res, "success", "Successfully imported wallet File")
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
  const truncateOption = {
    where: {},
    truncate: true,
  }

  promise1 = MainSetting.destroy(truncateOption);
  promise2 = BotStatus.destroy(truncateOption);
  promise3 = WorkWallet.destroy(truncateOption);
  promise4 = Transaction.destroy(truncateOption);

  Promise.all(
    [promise1, promise2, promise3, promise4]
  ).then((status_list) => apiSuccess(res, {}, "All Information has been deleted")
  ).catch((error) => apiError(res, error, "Can't delete all information")
  );
  sendUpdateMessage();
}

module.exports = {
  getMainSetting,
  setMainSetting,

  getWorkWalletBalance,

  addWorkWallet,
  deleteWorkWallet,
  addWorkWalletFromFile,
  listWorkWallets,

  resetAll,
};
