const ethers = require("ethers");
const chalk = require("chalk");

const { ERC20_ABI, } = require("../constant/erc20");
const { 
  NODE_WSS_TEST, BUSD_TOKEN_TEST, WBNB_TOKEN_TEST,
  MAX_BIGINT, MIN_REMAIN_BNB, DECIMAL_VALUE,
  WBNB_ROUTER,  
} = require("../constant/constants");

const { abi } = require("../../src/constant/abi");
const { NonceManager } = require("@ethersproject/experimental");

/** @module ENGINE*/
/**
 * <pre>
 * Holds the internal functions for bot actions.
 *  GetStaus / Distribute / Gather / Sell / Buy
 * </pre>
*/

const node = NODE_WSS_TEST;
const tokenAddress = BUSD_TOKEN_TEST;
const bnbAddress = WBNB_TOKEN_TEST;
const wbnbRouter = WBNB_ROUTER;

const botWsProvider = new ethers.providers.WebSocketProvider(node);
const tokenContract = new ethers.Contract(tokenAddress, ERC20_ABI, botWsProvider);

/**
 * 
 * @param {String} walletPrivateKey 
 * @param {Number} percentage 
 */
async function tradeOperation(transKind, wallet, percentage, logTrans) {
  const workWallet = new ethers.Wallet(wallet.walletPrivateKey);

  const workAccount = workWallet.connect(botWsProvider);

  const router = new ethers.Contract(
    wbnbRouter,
    [
      "function getAmountsOut(uint amountIn, address[] memory path) public view returns (uint[] memory amounts)",
      "function swapExactTokensForTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)",
      "function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline) external payable returns (uint[] memory amounts)",
      "function swapExactTokensForETH(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)",
      "function swapExactTokensForETHSupportingFeeOnTransferTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external",
    ],
    workAccount
  );

  let tokenIn, tokenOut, tradeAmount;
  if(transKind === "sell") {
    tokenIn = bnbAddress;
    tokenOut = tokenAddress;
    tradeAmount = await tokenContract.balanceOf(wallet.walletAddress);
  } else {
    tokenIn = tokenAddress;
    tokenOut = bnbAddress;
    tradeAmount = await botWsProvider.getBalance(wallet.walletAddress) - MIN_REMAIN_BNB;
  }

  tradeAmount = tradeAmount * ( percentage / 100 );

  let gasPrice = await botWsProvider.getGasPrice();
  const gasSettings = {
    gasLimit: 100000,
    gasPrice: ethers.utils.parseUnits(gasPrice.toString(), "gwei"),
  };

  const wbnbContract = new ethers.Contract(bnbAddress, ERC20_ABI, workAccount);
  
  // Calculate the amount to swap.
  // check if the sender wallet has enough amount of crypto currency.
  let amount = await wbnbContract.allowance(wallet.walletAddress, wbnbRouter);  
  if ( amount < MAX_BIGINT ) {
    wbnbContract.approve(
      wbnbRouter,
      ethers.BigNumber.from("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"),
      gasSettings,
    );
    console.log("=========== SWAP Approved \n");
    
    const amountIn = ethers.utils.parseUnits(tradeAmount.toString(), "ether");

    console.log(chalk.blue.inverse( "=====tokenIn = " + tokenIn
                                + " \t tokenOut = " + tokenOut 
                                + " \t amountIn = " + amountIn ));
    
// TEST CODE
    // signer.provider.getCode(exchangeAddress);
// TEST CODE

    // Get the amounts out - The real value after transaction.
    let amountOut;
    try {
      amountOut = await router.getAmountsOut(amountIn, [tokenIn, tokenOut]);
    } catch (err) {
      console.log("getAmountsOut Error......");
      return;
    }

    // Check the Price for that.
    let price = amountIn / amountOut;

    let swap_tx; 
    if(transKind === "buy") {

//      "function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline) external payable returns (uint[] memory amounts)",
//      "function swapExactTokensForETH(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)",

      // TODO Change per parameter description
      swap_tx = await router.swapExactETHForTokens(
        amountIn,
        amountOutMin,
        [tokenIn, tokenOut],
        wallet.walletAddress,
        Date.now() + 1000 * 60 * 10, //10 minutes
        gasSettings,
      ) .catch((err) => {
        console.log("buy transaction failed................");
        console.log(err);
      });
      
    } else {
      // TODO Change per parameter description
      swap_tx = await router.swapExactTokensForETH(
        amountIn,
        amountOutMin,
        [tokenIn, tokenOut],
        wallet,
        Date.now() + 1000 * 60 * 10, //10 minutes
        gasSettings,
      ) .catch((err) => {
        console.log("buy transaction failed................");
        console.log(err);
      });

    }
    // TODO : Input the transaction into waiting QUEUE
    // We should wait all of the queue cleared.

    // await swap_tx.wait();
    // receipt = provider.getTransactionReceipt(swap_tx.hash);
  }
}

/**
 * @function sendOperation
 * @description 
 * <pre> 
 *    RUN send operation for Gather or Distribute operation.
 * </pre>
 * @param {Stirng} transKind 
 * @param {Object} wallet 
 * @param {Number} amount - (percentage or Exact amount) 
 * @param {String} target 
 * @returns 
 */

async function getNonce(fromAddress) {
  return botWsProvider.getTransactionCount(fromAddress, "latest");
}

async function distributeOperation (mainWalletPrivateKey, toAddress, amount, target, nonce, logTrans) {
  // We should get NONCE value, because it is made for a wallet.

  const fromWallet = new ethers.Wallet(mainWalletPrivateKey);
  sendOperation(fromWallet, toAddress, nonce, amount, target, logTrans);
}

async function gatherOperation (walletPrivateKey, mainWalletAddress, percentage, target, logTrans) {
  const fromWallet = new ethers.Wallet(walletPrivateKey);
  const walletAddress = fromWallet.address;

  var amountTrans = 0;
  // Call APIs to get the balance of BNB and TOKEN.
  try {
    if(target === "bnb" ) {
      const bnbBalance = await botWsProvider.getBalance(walletAddress);
      amountTrans = (+ethers.utils.formatEther(bnbBalance)).toFixed(5);
      // We should leave minimum amount for gas fee for each wallet.
      amountTrans = amountTrans * percentage / 100;
      amountTrans = amountTrans * 0.999;    // Remain 0.1% for gas fee. (minimum 0.05% for transaction.)
    } else {    
      const tokenBalance = await tokenContract.balanceOf(walletAddress);
      amountTrans = (+ethers.utils.formatEther(tokenBalance)).toFixed(5);
      amountTrans = amountTrans * percentage / 100;
    }
  } catch (error){
    console.log( chalk.red("Failed in getting Balance " + walletAddress + " : " + error)) ;
    return;
  }

  let nonce = await botWsProvider.getTransactionCount(fromWallet.getAddress(), "latest");
  
  sendOperation(fromWallet, mainWalletAddress, nonce, amountTrans, target, logTrans);
}


async function sendOperation(fromWallet, toAddress, nonce, amountTrans, target, logTrans) {

  const fromAddress = fromWallet.getAddress();

  // Issue send operation for calculated parameters.
  // const fromAccount = fromWallet.connect(botWsProvider);

  botWsProvider.getGasPrice().then( async (currentGasPrice) => {
    let gasPrice = ethers.utils.hexlify(parseInt(currentGasPrice));
    let walletSigner = fromWallet.connect(botWsProvider);

    if(target === "bnb") {
      const tx = {
        from: fromAddress,
        to: toAddress,
        value: ethers.utils.parseEther(amountTrans.toString()),
        nonce: nonce,
        gasLimit: ethers.utils.hexlify(100000), // 100000
        gasPrice: gasPrice,
      };

      walletSigner.sendTransaction(
        tx
      ).then(transaction => logTrans(transaction, amountTrans.toString() + " bnb")
      ).catch ( error => console.log(error)
      );
      // TODO : Input the transaction into waiting QUEUE

    } else if (target === "token") {
      fromContract =  new ethers.Contract(tokenAddress, abi, walletSigner);
      let numberOfTokens = ethers.utils.parseUnits(amountTrans.toString(), DECIMAL_VALUE);

      fromContract.transfer(
        toAddress, numberOfTokens, { nonce: nonce }
      ).then(transaction => logTrans(transaction, amountTrans.toString() + " token")
      ).catch(error  => console.log(error)
      );
    }
  });
}

/**
 * @function getWalletAddress
 * @param {String} privateKey 
 * @returns Wallet Address
 */
function getWalletAddress (privateKey) {
  try {
    wallet = new ethers.Wallet(privateKey); 
    return wallet.getAddress();
  } catch (error) {
    console.log("Invalid Private Key : " + privateKey);
    return error;
  }
}

/**
 * @function getWalletBalance
 * @description 
 * <pre>
 *    Get the bnb and token amount in the main wallet.
 * </pre>
 * @param {String} address - Hash address of the wallet.
 * @returns {bnbAmount, tokenAmount}
 */
function getWalletBalance (address) {
  
  // Call APIs to get the balance of BNB and TOKEN.
  promise0 = botWsProvider.getBalance(address);
  promise1 = tokenContract.balanceOf(address);

  return Promise.all(
    [promise0, promise1]
  ) .then( function (values) {
    return { 
      bnbBalance: (+ethers.utils.formatEther(values[0])).toFixed(5),     
      tokenBalance: (+ethers.utils.formatEther(values[1])).toFixed(5),   
    };
  }).catch( function (error) {
      console.log( chalk.red("Failed in getting Balance " + address + " : " + error)) ; 
      return {bnbBalance:0, tokenBalance:0};
  });
}

/**
 * @function apiSuccess
 * @description 
 * <pre>
 *      Utility functions for Succes return 
 * </pre>
 * @param {Object} res      - HTTP handler to return the data
 * @param {Object} data     - Data object that is return value for API call
 * @param {String} message  - Additional message 
 * 
 * @return - Restful API response
 */
function apiSuccess(res, data, message) {
  console.log("=== Success : " + arguments.callee.caller.name + " : \n"
       + JSON.stringify(data));
  res.status(201).json({
    error: false,
    data: data,
    message: message,
  });
} 

/**
 * @function apiError
 * @description 
 * <pre>
 *     Utility functions for Error return 
 * </pre>
 * @param {Object} res      - HTTP handler to return the data
 * @param {String} error    - Data object that is return value for API call
 * @param {String} message  - Additional message 
 * 
 * @return - Restful API response
 */
function apiError(res, error, message) {
  console.log(chalk.red("=== ERROR : " + arguments.callee.caller.name + " : \n"
       + message));
  res.json({
    error: true,
    message: error + "\n" + message,
  });
}

module.exports = {
  gatherOperation,  
  distributeOperation,
  getNonce,
  tradeOperation,
  getWalletAddress,
  getWalletBalance,
  apiSuccess,
  apiError
};
