const { Wallet } = require( "ethers" );
const Queue = require( "queue-fifo" );
const { 
  apiSuccess, apiError, 
  getWalletBalance,
  tradeOperation, sendOperation, gatherOperation, distributeOperation, getNonce,
}  = require ("./engine");
const {Transaction, MainSetting, WorkWallet, BotStatus} = require("../models");
const app = require("../app");

/////////////////////////////////////////////////////////////////////////
//                          FOR SOCKET OPERATION                       //
/////////////////////////////////////////////////////////////////////////
/*
const express = require('express');
const http = require ('http');

app = express();
var port = 9081;
const server = http.createServer(app);

server.listen(port, function(){
  console.log('app listening on port: '+port);
});
const sockets = {};
const io = require("socket.io")(server);
var socketInstance;
io.on("connection", (socket) => {
  sockets[sessionId] = socket.id;
  // The sockets object is stored in Express so it can be grabbed in a route
  server.set("sockets", sockets);
  console.log(`Client connected: ${socket.id}`)
  socketInstance = io.to(thisSocketId);
});
// The io instance is set in Express so it can be grabbed in a route
app.set("io", io);
*/
/////////////////////////////////////////////////////////////////////////

function sendProgress(data) {
  var aWss = app.wss.getWss("/");
  aWss.clients.forEach( (client) => {
    client.send(
      JSON.stringify({
        message : "progress",
        data: data
      })
    );
  });
}

/** 
 * @module botController
 * <pre>
 * APIs for handling basic bot activity 
 * API prefix : /bots/
 * - Provided APIs : 
 *      getBotStatus,
 *      startBot,
 *      pauseBot,
 *      stopBot
 * 
 * - BOT lifecycle : 
 *    
 *     T----------<--------l                        ( Task was incompleted state, but we abandon bot operation. )
 *    Stop -> Running -> Paused 
 *     l         l-----<----l                       ( Task paused and then resumed again.. )
 *     l         l---------->-------------> End(no state)
 *     L-----------------<-------------------l      ( Task Completed successfully. )
 * - Skip error wallets
 *    There could be error in individual wallet, for example insufficient BNB for gas fee.
 *    We will skip the wallets.
 * 
 * </pre>
 */

 /**
 * @function getMainWallet()
 * @description
 * <pre>
 *   
 * </pre>
 * @returns {Object} Main Wallet Object connected to the ether.js
 */
 async function getMainWallet() {
  try {
    data = await MainSetting.findAll ({
      attributes: ["mainWalletAddress", "mainWalletPrivateKey"],
      where: { id: 1,}
    });
  
    return {
      mainWalletAddress: data[0].dataValues.mainWalletAddress, 
      mainWalletPrivateKey: data[0].dataValues.mainWalletPrivateKey,
    };
  } catch ( error)  {
    apiError(res, error, "Can't get Main Wallet Address")
  }
}

/**
 * @extern @function getBotStatus
 * @description
 * <pre>
 *  Get the current Status of the bot.
 * </per>
 * 
 * @return bnbBalance - Bnb amount in the mainwallet.
 * @return tokenBalance- Token amount in the mainwallet.
 */
async function getMainWalletStatus(req, res) {
  // First of all, we should get the amount in the main Wallet. 
  let mainWalletAddress = "";

  mainWalletAddress  = await getMainWallet();
  mainWalletAddress = mainWalletAddress?.mainWalletAddress;

  if(mainWalletAddress === "" || mainWalletAddress === undefined ) {
    apiError(res, "Empty Main Wallet", "GetMainWalletStatus");
    return;
  }

  const walletBalence = await getWalletBalance(mainWalletAddress);
  apiSuccess (res, walletBalence, "MainWallet status retrieved");
}

/**
 * @extern @function getBotStatus
 * @description
 * <pre>
 *  Get the current Status of the bot.
 * </per>
 * 
 * @return totalWorkWalletCount - Total work Wallet count 
 * @return processedWorkWalletCount - Processed wallet count up to now  (Should be zero on Stop)
 * @return lastWorkWalletIndex   - // Should we manage this parameter?
 * @return botStatus - Bot running status (buy / sell / distribute / gather / stop)
 */
async function getBotStatus(req, res) {

  // Second, we should get the working bot status from database.  
  BotStatus.findAll({
    where: { id: 1, }
  }).then( botStatus => {    
    if (botStatus.length == 0) {
      // Create new one.
      let item = {
        id: 1,
        timestamp: Date.now(),
        totalWorkWalletCount:0,
        processedWorkWalletCount: 0,
        lastWorkWalletIndex: 0,
        transKind: "none",               // buy / sell / distribute / gather / none
        botStatus: "paused",             // running / paused
      };
      
      BotStatus.create(item).then( (data) => {
        apiSuccess(res, item, "Created New BotStatus in database.")
      });
    } else {       
      apiSuccess (res, botStatus[0].dataValues, "Bot status retrieved");
    }
  }).catch((error) => apiError( res, error, "Failed in retrieving Bot status") );
}

async function logTrans(transaction, amountStr) {
  Transaction.create(
    {
      timestamp: Date.now(),
      amount: amountStr,
      from: transaction.from,
      to: transaction.to,
      transaction: transaction.hash,
    }
  ).then(data => data
  ).catch(error => console.log(error)    
  );
}

/**
 * @extern @function startTradingBot
 * @description 
 * <pre>
 *    Start buy or sell bot for the work wallet.  
 *    If the bot was running state, we will resume the bot status. 
 *    
 * <pre>
 * @param {string} transKind - Transaction kind : ( sell / buy )
 * @param {string} percentage - The amount of the transaction - the percentage to transact.
 */
async function startBot(req, res) {
  const {
    transKind,
    amountParameter,
    targetParameter,
  } = req.body;

  let {mainWalletAddress, mainWalletPrivateKey} = await getMainWallet();
  
  workWalletList = await WorkWallet.findAll({    
  }).then( (data)  => data
  ) .catch((error) => {
    apiError(res, error, "Bot Failed, : Can't get work wallets.");
    return;
  });

  totalWorkWalletCount = workWalletList.length;

  var perAmount, percentage;
  switch (transKind) {
    case "distribute" : 
      perAmount = amountParameter / totalWorkWalletCount;
      break;
    case "buy":
    case "sell":
    case "gather":
      percentage = amountParameter;
      break;
    default:
      apiError(res, "Invalid transKind", "Bot Failed, : Bad Parameter");
      return;
  }

  // Set the status of the bot as running. 
  BotStatus.update(
    {
      timestamp: Date.now(),
      transKind: transKind,
      totalWorkWalletCount: totalWorkWalletCount,
      processedWorkWalletCount: 0,
      lastWorkWalletIndex: 0,
      botStatus: "running",
    },
    {
      where: {
        id: 1,
      },
    }
  ) .then((data) => data
  ) .catch((error) => {
    apiError (res, error, "Can't pause Bot");
    return;
  });

  let nonce = await getNonce(mainWalletAddress);

  // Maintain the queue of the work wallets.
  taskQueue = new Queue();
  workWalletList.forEach((workWallet) => taskQueue.enqueue(workWallet.dataValues));
  var processedWorkWalletCount = 0;

  // For each group or individual wallet, apply bot operation.
  while ( !taskQueue.isEmpty() ) {
    // Apply sell/buy transaction for each 
    let wallet = taskQueue.dequeue();

    // Report Progress to the client for every 50 wallets.
    processedWorkWalletCount ++;
    /*
    if(processedWorkWalletCount % 50 === 0 ) {
      socketInstance.emit('BotProgress', {
        totalWorkWalletCount : totalWorkWalletCount,
        processedWorkWalletCount : processedWorkWalletCount
      });
    }
    */
    sendProgress(
      {
        totalWorkWalletCount : totalWorkWalletCount,
        processedWorkWalletCount : processedWorkWalletCount
      }
    );
   
    try{
      switch (transKind) {
        case "buy":
        case "sell": {
          tradeOperation(transKind, wallet, percentage);
          break;
        }
        case "gather": {
          trans = gatherOperation(wallet.walletPrivateKey, mainWalletAddress, percentage, targetParameter, logTrans);
          break;
        }
        case "distribute": {
          trans = distributeOperation(mainWalletPrivateKey, wallet.walletAddress, perAmount, targetParameter, nonce ++, logTrans);
          break;
        }      
      }
    } catch (error) {
      // on Error, we simply neglect 
      console.log("ERROR in " + transKind + "Operation."
               + " address:" + wallet.walletAddress, error);
    }
  }

  // Once the operation is complete, mark the status as stop again.
  // Set the status of the bot as running. 
  BotStatus.update(
    {
      timestamp: Date.now(),
      transKind: "",
      totalWorkWalletCount: 0,
      processedWorkWalletCount: 0,
      lastWorkWalletIndex: 0,
      botStatus: "stop",
    },
    {
      where: {
        id: 1,
      },
    }
  ).then((data) => 
    apiSuccess(res, data, "Bot operation eneded successfully for " + totalWorkWalletCount + " accounts.")
  ).catch((error) => {
    apiError (res, error, "Bot operation eneded successfully, but, can't Stop Bot");
  });

}

/**
 * @extern @function pauseBot
 * @description 
 * <pre>
 *    Stop currently running bot operation.
 * <pre>
 * @param {String} percentage - The amount of the transaction - the percentage to transact.
 * @return {Object} botStatus - Status of the running bot.
 */
function pauseBot(req, res) {
  // Finalize the wallets in the queue.
   
  // Mark the index to 

  // Update the status flag as paused
  BotStatus.update(
    {
      botStatus: "paused",
    },
    {
      where: {
        id: 1,
      },
    }
  ) .then((data) => apiSuccess(res, data, "Bot paused successfully")
  ) .catch((error) => apiError (res, error, "Can't pause Bot")
  );
}

/**
 * @extern @function stopBot
 * @description 
 * <pre>
 *    Stop currently running bot operation. 
 *    So, we will have some wallets processed and the other wallets remained.
 * <pre>
 * @param {*} req 
 * @param {*} res 
 */
async function stopBot(req, res) {

  // 1. Check bot status to find that we can stop the bot.
  try {
    data = await BotStatus.findAll(
      {
        attributes : [ 
          "transKind", 
          "botStatus"
        ]
      },
      { 
        where: { id: 1, },
      }
    );
    if(data[0].dataValues.transKind === "none")  {
      apiError(res, "", "Bot is not running");
      return;
    }
    else if(data[0].dataValues.botStatus !== "paused")  {
      apiError(res, "", "Please pause the bot first, Bot is running");
      return;      
    }
  }  catch(error) {
    apiError(res, error, "Finding Bot status"); 
    return;
  }  

  // Mark the status of the Bot as NOT working.
  BotStatus.update(
    {
      transKind: "none",
      botStatus: "paused",
    },
    {
      where: {
        id: 1,
      },
    }
  ) .then( (data) => apiSuccess(res, data, "Bot Stopped.")
  ) .catch((error) => apiError(res, error, "Updating Bot Status")
  );
}

module.exports = {
  getMainWalletStatus,
  getBotStatus,
  startBot,
  pauseBot,
  stopBot
};