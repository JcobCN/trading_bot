const { ERC20_ABI,  SWAP_HANDLER, MAX_BIGINT} = require("../constant/erc20");
const { FrontDetail, Token} = require("../models");
const ethers = require("ethers");
const chalk = require("chalk");
const Web3 = require("web3");
const app = require("../app.js");
const axios = require("axios");

let swapHandler;

/** @module frontController*/
/**
 * <pre>
 * Holds the internal functions for bot actions.
 *    scanmempool / sell / buy
 * We monitor incoming transactions from subscription, 
 * Once there is new transaction pending, we check the validity and issue BUY method.
 * 
 * Here, sell method is implemented, but I doubt if it is ever called.
 * I think, this is BUY bot, not a SELL bot.
 * </pre>
 * 
*/

/*****************************************************************************************************
 * Find the new liquidity Pair with specific token while scanning the mempool in real-time.
 * ***************************************************************************************************/
/**
 * @function scanMempool
 * @description 
 * <pre>
 * Find the new liquidity Pair with specific token while scanning the mempool in real-time.
 * Actions : 
 *   RUN forever loop to do : 
 *    1. Subscribe websocket to monitor pendingTransactions 
 *    2. Parse the transactin to tell if the transaction matches for our creteria
 *        - Pending transaction (Still not operated yet.)
 *        - Uniswap/Pancakeswap swap token method (swapExactETHForTokens, swapETHForExactTokens
 *                                      swapExactETHForTokensSupportingFeeOnTransferTokens)
 *        - From our monitored wallets (well-known traders, or such profitable traders)
 *    3. Issue BUY method to mimic(or copy) the action of monitored wallet.
 *        - If gasSetting is native, just do the same for the monitored swap transaction.
 *        - If gasSetting is mm, Set higher gasprice and run preepmtive action.
 *    4. Transfer the swapped token to the safety wallet for security reason.
 *    5. Log the actions to the transaction history
 *        - monitored transaction
 *        - Copied BUY transaction
 *        - Safety transfer transaction
 * </pre>
 * 
 * @param {string} node - Quick Node WSS URL
 * @param {string} network - Ethereum or Binance
 * @param {string} wallet - Wallet address (Public key)
 * @param {string} key - <b>Wallet private KEY(Should be paid attention.)<b> 
 * @param {number} slippage - Slippage(%):
 * @param {number} minbnb - Min ETH to follow
 * @param {number} maxbnb - Max ETH to follow
 * @param {string} gasSetting - Gas Setting - Block Native or MM Recommended Gas
 */
async function scanMempool(
  node,
  network,
  wallet,
  key,
  safetyWallet,
  slippage,
  minbnb,
  maxbnb,
  gasSetting
) {
  /**
   * Load the wallet  list from the Tokens table.
   */
  console.log("--------------------- Scan mempool -------------------------");
// Steven Test START
  // console.log("Starting Steven Test");
  // const node1 = "https://ropsten.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161";
  // const wallet1 = "0x4DD589F02844FB048715F7145a8FF70d8506F19e";
  // const key1 = "ede9418bb4a7bfbfe4ccf1404673e345db9a05fcd9ea151fa2c661cd499c0c87";
  // const tokenAddress1 = "0x110a13FC3efE6A245B50102D2d79B3E76125Ae83";
  // const safeWallet1 = "0x5Ba73512651aBCD37ae219A23c33d39A43a291dF";
  // await safeWalletTransfer(node1, wallet1, key1, tokenAddress1, safeWallet1);
  // return;
// Steven TEST END  

  let tokens = await Token.findAll({
    attributes: ["address"],
    raw: true,
  });

  let walletMemory = [];
  tokens.map((item) => {
    walletMemory.push(item.address.toLowerCase());
  });

  /**
   * Load the black token list from the Tokens table.
   */

  // Now, the walletMemory has token addresses.
  console.log(walletMemory);

  let provider = new Web3.providers.WebsocketProvider(node);
  
  /**
   * Get WEB3 socket with given node URL.
   * By this websocket, we can run buy, sell actions for crypto currencies.
   */ 
  let web3 = new Web3(
    new Web3.providers.WebsocketProvider(node, {
      timeout: 30000,
      reconnect: {
        auto: true,
        delay: 5000,
        maxAttempts: 5,
        onTimeout: false,
      },
      clientConfig: {
        keepalive: true,
        keepaliveInterval: 60000,
        maxReceivedFrameSize: 100000000,
        maxReceivedMessageSize: 100000000,
      },
    })
  );

  /**
   * Subscribe to pending transactions in order to get ones in memory pool.
   * The mempool is where all the valid transactions wait to be confirmed by the Bitcoin network.
   * Refer https://web3js.readthedocs.io/en/v1.2.11/web3-eth-subscribe.html#subscribe-pendingtransactions  
   */ 
  frontSubscription = web3.eth.subscribe("pendingTransactions", function(
    error,
    result
  ) {
  });

  /**
   * Create Web socket provider
   * make wallet object to access the wallet , and connect it to the websocket for communication.
   * Create new contract object to access the contract
   * The contract has following functions : 
   *    getAmountsOut, swapExactTokensForTokens, swapExactETHForTokens
   *    swapExactTokensForETH, swapExactTokensForETHSupportingFeeOnTransferTokens 
  */
  var customWsProvider = new ethers.providers.WebSocketProvider(node);
  var ethWallet = new ethers.Wallet(key);
  const account = ethWallet.connect(customWsProvider);
  
  // Get SWAP handler for given network. 
  
  switch (network ) {
    case "Ethereum" :
      swapHandler = SWAP_HANDLER.UNISWAP_V2; 
      break;
    case "Binance" :
      swapHandler = SWAP_HANDLER.PANCAKESWAP_V2; 
      break;
    default : 
      console.log ("Invalid network option. exiting...");
      return;
  }
  const router = new ethers.Contract(
    swapHandler.router,
    [
      "function getAmountsOut(uint amountIn, address[] memory path) public view returns (uint[] memory amounts)",
      "function swapExactTokensForTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)",
      "function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline) external payable returns (uint[] memory amounts)",
      "function swapExactTokensForETH(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)",
      "function swapExactTokensForETHSupportingFeeOnTransferTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external",
    ],
    account
  );
  
  // Handle the transactions as given.
  try {
    console.log(chalk.red(`\nStart Wallet tracking  ... `));
    
    /**
     * make the Front subscription on to start wallet tracking in background.
     * The subscription goes forever loop and monitors the transaction.
     * transactionHash value is accepted from .on() function.
     */ 
    frontSubscription.on("data", async function(transactionHash) {
      // console.log('transactionHash: ', transactionHash);
      setTimeout(async () => {
        try {

          // Retrieve the transaction data from given transaction Hash value.
          // Refer : https://web3js.readthedocs.io/en/v1.2.11/web3-eth.html?highlight=getTransaction#gettransaction
          let transaction = await web3.eth.getTransaction(transactionHash);

          if (transaction != null) {

            // Handle the transaction -- See internal function for more detail, 
            // Monitor the tranactions from tokens in walletMemory, but not from wallet itself.
            let tx_data = await handleTransaction(
              wallet,
              customWsProvider,
              transaction,
              walletMemory
            );  
            
            /**
             * Refer : https://web3js.readthedocs.io/en/v1.2.11/web3-eth-ens.html?highlight=getAddress#getaddress
             * Once the transaction has one of the methods of swapExactETHForTokens, swapExactETHForTokensSupportingFeeOnTransferTokens, swapETHForExactTokens
             * And the target address is is the PAN_ROUTER (constant given in ERC20)
             * Then, call buy method with given parameter.
             */ 
            if (
              tx_data != null &&
              swapHandler.buyMethod.includes(tx_data[0]) &&
              ethers.utils.getAddress(transaction.to) == swapHandler.router
            ) { 
              try {
                // Prepare bnb_value to buy. and token address.
                let bnb_val = ethers.BigNumber.from(transaction.value);
                let _tokenAddress = ethers.utils.getAddress(tx_data[1][7]);

                {

                  // calculate wei value for buy.
                  let _amnt = bnb_val / 1000000000000000000;

                  console.log("amnt :" + _amnt);

                  var receipt = null;
                  // Issue BUY method for given parameters.
                  if (_amnt >= minbnb && _amnt <= maxbnb) {         
                    console.log(
                      "buy transaction : " + transaction.hash + ", method : " +
                        tx_data[0] + ", amount of BNB : " +
                        bnb_val / 1e18 + "\n"
                    );

                    // Get the result for BUY method to log.
                    receipt = await buy(
                      account, customWsProvider, transactionHash,
                      router, _tokenAddress, wallet, _amnt, 
                      slippage, gasSetting
                    );
                  }
                  const buyReceipt = receipt;

                  /**
                   * Start additional new transaction once a trade is successfully made, sends the tokens to a new address.
                   * We should get this NEW address from UI.
                   */
                  // Originally, this was sell-back bot. 
                  //     Monitor transaction, Front run the transaction to get market maker profit. 
                  //      Sell back the got amount to recover the transaction. 
                  //      Now, let's make this function as sending to NEW safety wallet account;
                  //  FROM : wallet
                  //  TO : safetyWallet
                  //  TOken : _tokenAddress
                  //  Amount : all of the given token.
                  if (receipt != null) {
                    receipt = await safeWalletTransfer(
                      customWsProvider, key, _tokenAddress, 
                      safetyWallet
                    );            
                  }
                  const safeReceipt = receipt;

                  logResult(
                    _tokenAddress, 
                    transaction.value, transaction.hash, 
                    "0", buyReceipt === null ? "BUY_ERROR" :  buyReceipt.transactionHash,
                    "0", safeReceipt === null ? "SAFE_ERROR" : safeReceipt.transactionHash, 
                  ); 
                }
              } catch (err) {
                console.log("buy transaction in ScanMempool....");
                console.log(err);
              }
            }
          }
        } catch (err) {
          // console.log(err);
          console.log("Attempting to reconnect...");
        }
      });
    });

  } catch (err) {
    console.log("----transaction........");

    // console.log(err);
    console.log(
      "Please check the network status... maybe its due because too many scan requests.."
    );
  }
}

/**
 * @description 
 *  
 * <pre>
 *  Parse the transaction String for given Syntax (ERC20)
 * Example : "0x7ff36ab5000000000000000000000000000000000000000000000000011d4fcfbebfbab900000000000000000000000000000000000000000000000000000000000000800000000000000000000000005054e6dfe2587e3d03efd6a469f8383c68f56816000000000000000000000000000000000000000000000000000000005f7a3f7b0000000000000000000000000000000000000000000000000000000000000002000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc20000000000000000000000004689020104edee22454e0f76d3ff682b48806850"
 * Parsed : 
 * Function: swapExactETHForTokens(uint256 amountOutMin, address[] path, address to, uint256 deadline)
 *     MethodID: 0x7ff36ab5
 *     [0]:  000000000000000000000000000000000000000000000000011d4fcfbebfbab9
 *     [1]:  0000000000000000000000000000000000000000000000000000000000000080
 *     [2]:  0000000000000000000000005054e6dfe2587e3d03efd6a469f8383c68f56816
 *     [3]:  000000000000000000000000000000000000000000000000000000005f7a3f7b
 *     [4]:  0000000000000000000000000000000000000000000000000000000000000002
 *     [5]:  000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2
 *     [6]:  0000000000000000000000004689020104edee22454e0f76d3ff682b48806850
 *   More deeper parser : 
 *    #	Name	        Type	    Data
 *    0	amountOutMin	uint256	  80308122039597753
 *    1	path	        address[]	0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2
 *                              0x4689020104eDEE22454E0f76d3fF682b48806850
 *    2	to	          address	  0x5054E6Dfe2587E3D03efD6A469F8383c68F56816
 *    3	deadline	    uint256	  1601847163
 * Actions : 
 *  Analyse the transaction string into items as given in the Protocol. 
 *  Parse only for methods in buyMethods for given swap handler.
 *        (swapExactETHForTokens, swapExactETHForTokensSupportingFeeOnTransferTokens, swapETHForExactTokens)
 * 
 * Refer : https://ethereum.org/en/developers/docs/standards/tokens/erc-20/
 * </pre>
 *
 * @param {String} input - Transaction String. 
 * @return {Object} parsed transaction.
 */
async function parseTx(input) {
  if (input == "0x") {
    return ["0x", []];
  }

  let method = input.substring(0, 10);

  if ((input.length - 8 - 2) % 64 != 0) {
    // throw "Data size misaligned with parse request."
    return null;
  }

  let numParams = (input.length - 8 - 2) / 64;
  var params = [];

  // First two parameters are int, others are hex.
  for (let i = 0; i < numParams; i += 1) {
    let param;
    if (i === 0 || i === 1) {
      param = parseInt(input.substring(10 + 64 * i, 10 + 64 * (i + 1)), 16);
    } else {
      param = "0x" + input.substring(10 + 64 * i + 24, 10 + 64 * (i + 1));
    }
    params.push(param);
  }

  if (swapHandler.buyMethod.includes(method)) {
    params[7] = params[numParams - 1];
    params[6] = params[5];
    params[5] = null;
    params[1] = params[0];
    params[0] = null;
    return [method, params];
  } else {
    return null;
  }
}

/**
 * @function handleTransaction
 * 
 * @description 
 * <pre>
 * Handle the transaction for given information.
 *    The transaction should be pending.
 *    For the Transactions From wallet_list(walletMemory), and not from wallet.
 * Parse the transaction and returns the transaction data
 * </pre>
 * 
 * @param {string} wallet - Wallet's address - The public Key.
 * @param {string} provider - Etherium Web socket Provider here.
 * @param {string} transaction - Transaction hash value
 * @param {list} walletMemory - Tokens List retrieved from database.
 * 
 * @returns method - Transaction input (Here, the kind of buy method)
 * @returns param - Return parameters : Tuple of (sender, receiver)
 */
async function handleTransaction(wallet, provider, transaction, walletMemory) {
  var len = transaction.input.length;

  //Steven Test Start - To pass all of the transactons, not only from walletMemory ... 
  // let tx_data = await parseTx(transaction.input);
  // return tx_data;
  //Steven Test End

  if (len < 64) return null;
  
  if( walletMemory.includes(transaction.from.toLowerCase()) ) {
    console.log("Wow, From 0x4dd589f02844fb048715f7145a8ff70d8506f19e Arrived");
  }

  if (
    transaction != null &&
    (await isPending(provider, transaction.hash)) &&
    walletMemory.includes(transaction.from.toLowerCase()) &&
    wallet.toLowerCase() != transaction.from.toLowerCase()
  ) {
    console.log("Our Transaction Captured");
    let tx_data = await parseTx(transaction.input);
    return tx_data;
  } else {
    return null;
  }
}

/**
 * @function isPending
 * @description
 * <pre>
 * Call getTransactionReceipt for given transaction.
 * </pre>
 * @param {object} provider - Etherium Web socket Provider
 * @param {string} transactionHash 
 * @returns Result as boolean
 */
async function isPending(provider, transactionHash) {
  return (await provider.getTransactionReceipt(transactionHash)) == null;
}

/**
 * @function buy
 * @description
 * <pre>
 * Issue the BUY method of the smart contract for given token.
 *    IN :            WBNB(WETH)
 *    OUT :           ethers.utils.getAddress(tokenAddress) (Given From UI.)
 *    AMOUNT :        inAmount
 *    AMOUNT_OUT_MIN: router.getAmountsOut(amountIn, [tokenIn, tokenOut]) * slippage% 
 *    PRICE :         AMOUNT / SWAPED_TOKEN_AMOUNT
 *    GasPrice :      default gasprice(for native), default gasprice * 1.53 (for mm)
 * </pre>
 * @param {object} account - Etherium wallet account access object
 * @param {object} provider - Etherium provider object
 * @param {string} txHash - Hash value of the transaction.
 * @param {object} router - Etherium contract object
 * @param {string} tokenAddress - "To token" address to purchase
 * @param {string} wallet - Wallet's public address.
 * @param {number} inAmount - Amount to purchase.
 * @param {number} slippage - Token Slippage
 * @param {string} gasSetting - Native or MM
 * 
 * @return {Object} receipt - Receipt Object
 */
async function buy(
  account,
  provider,
  txHash,
  router,
  tokenAddress,
  wallet,
  inAmount,
  slippage,
  gasSetting
) {
  try {
    // Get the smartcontract's gas price.
    let _gasPrice = await provider.getGasPrice();

    let bestGasPrice = ethers.utils.formatUnits(_gasPrice, "gwei");
    console.log(
      chalk.green.inverse(
        `================ Suggested Gas Price =================
         ${bestGasPrice} Gwei`)
    );

    /** 
     * If gas setting is mm we amplify the gas price by 1.53.
     * Or block native, we get gas-price set by smart contract itself.
     * Means that for mm (Market Maker), we are going to dominate the pending transaction pool by our higher gas price.
     */ 
    if (gasSetting === "mm") {
      bestGasPrice = bestGasPrice * 1.53;
      console.log(
        chalk.green.inverse(`BlockNative Gas Price ================= ${bestGasPrice} Gwei`)
      );
    }

    /**
     * Get WETH contract from constant pool - 
     * NOTE : the variable name is WBNB, but the constant means WETH. - Don't make confusion.
     * Refer : https://etherscan.io/address/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2
     */ 
    const WBNB_CONTRACT = new ethers.Contract(swapHandler.wNativeToken, ERC20_ABI, account);

    // Call the allowance of the smart contract. - To check if the sender wallet has enough amount of crypto currency.
    let amount = await WBNB_CONTRACT.allowance(wallet, swapHandler.router);
    
    if ( amount < MAX_BIGINT ) {
      // Call the approve of the smart contract. - To check if the receiver approves the transaction.
      await WBNB_CONTRACT.approve(
          swapHandler.router,
          ethers.BigNumber.from(
            "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
          ),
          {
            gasLimit: 100000,
            gasPrice: ethers.utils.parseUnits(`${bestGasPrice}`, "gwei"),
          }
        );
        console.log(swapHandler.name + "Approved \n");
    }

    // Give in and out token for the transaction.
    const tokenIn = swapHandler.wNativeToken;
    const tokenOut = ethers.utils.getAddress(tokenAddress);

    //We buy x amount of the new token for our wbnb
    const amountIn = ethers.utils.parseUnits(`${inAmount}`, "ether");

    console.log(chalk.blue.inverse( "=====tokenIn = " + tokenIn
                                + "\n tokenOut = " + tokenOut 
                                + "\n amountIn = " + amountIn ));

    // Get the amounts out - The real value after transaction.
    // Refer : https://docs.uniswap.org/protocol/V2/reference/smart-contracts/router-02#getamountsout
    let amounts;
    try {
      amounts = await router.getAmountsOut(amountIn, [tokenIn, tokenOut]);
    } catch (err) {
      console.log("getAmountsOut Error......");
      throw new Error("getAmountsOut Error");
    }

    // Check if the transaction is profitable - by calculating amunt Out MIN.
    const amountOutMin = amounts[1].sub(amounts[1].mul(`${slippage}`).div(100));

    let price = amountIn / amounts[1];

    // Buy token via pancakeswap v2 router.
    // const buy_tx = await router
    //   .swapExactETHForTokens(
    //     0,
    //     [tokenIn, tokenOut],
    //     wallet,
    //     Date.now() + 1000 * 60 * 10, //10 minutes
    //     {
    //       gasLimit: gasLimit,
    //       gasPrice: ethers.utils.parseUnits(`${gasPrice}`, "gwei"),
    //       value: amountIn,
    //     }
    //   )
    //   .catch((err) => {
    //     console.log(err);
    //     console.log("buy transaction failed...");
    //   });

    console.log(
      chalk.green.inverse(
        `Buying Token
        =================
        tokenIn: ${amountIn.toString()} ${tokenIn} (${swapHandler.name})
        ==================
        amountOutMin: ${amountOutMin.toString()} ${tokenOut}
      `
      )
    );

    // Issue buy method for the given contract,
    // Refer : https://docs.uniswap.org/protocol/V2/reference/smart-contracts/router-02#swapexacttokensfortokens
    const buy_tx = await router.swapExactTokensForTokens(
        amountIn,
        amountOutMin,
        [tokenIn, tokenOut],
        wallet,
        Date.now() + 1000 * 60 * 10, //10 minutes
        {
          gasLimit: 400000, //gasLimit
          gasPrice: _gasPrice,
        }
      )
      .catch((err) => {
        console.log("buy transaction failed................");
        console.log(err);
      });

    // Wait until the transaction complete - Synchronized action.
    await buy_tx.wait();
    let receipt = null;
    while (receipt === null) {
      try {
        receipt = provider.getTransactionReceipt(buy_tx.hash);
        console.log("wait buy transaction...");
        await sleep(100);
      } catch (e) {
        console.log("wait buy transaction error...");
      }
    }
    return receipt;

  } catch (err) {
    console.log(err);
    console.log(
      "Please check token balance in the Uniswap, maybe its due because insufficient balance "
    );
  }
}

// Wait function 
const sleep = (milliseconds) => {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
};

/**
 * @function logResult
 * @description 
 * <pre>
 * - Save the transactions in FrontDetail database 
 * - Inform the result of the work by Websocket with the frontend.
 * </pre>

 * @param {String} tokenOut 
 * @param {Number} price 
 * @param {String} txHash 
 * @param {*} wallet 
 * @param {*} buy_tx 
 * @param {*} safetyWallet 
 * @param {*} safe_transfer_tx 
*/

async function logResult (
  tokenOut, detectedPrice, detectedTransaction, 
  boughtPrice, boughtTransaction, 
  safetyPrice, safeTransaction ) {

    // Send the response to the frontend so let the frontend display the event.    
    var aWss = app.wss.getWss("/");

    /**
     * Push to the web socket client to notifiy that the buy transaction was made.
     * The action is composed of two notifications: 
     * One for detected transaction : That we monitored for
     * Other for buy transaction : That we made after the detected transaction.
     */
    var detectedObj = {
      token: tokenOut,
      action: "Detected",
      price: detectedPrice,
      timestamp: new Date().toISOString(),
      transaction: detectedTransaction,
    };

    var boughtObj = {
      token: tokenOut,
      action: "Buy",
      price: boughtPrice,
      timestamp: new Date().toISOString(),
      transaction: boughtTransaction,
    };

    var safetyObj = {
      token: tokenOut,
      action: "Save",
      price: safetyPrice,
      timestamp: new Date().toISOString(),
      transaction: safeTransaction,
    };

    /**
     * Store Front Detail (Transaction detail data) into the database.
     * For Detect Activity : for given transaction ID.
     */ 
    FrontDetail.create(detectedObj);
    // For Buy Activity : for the buy transaction.
    FrontDetail.create(boughtObj);
    // For safey save Activity
    FrontDetail.create(safetyObj);
        
    aWss.clients.forEach(function(client) {

    var detectedInfo = JSON.stringify(detectedObj);
    var boughtInfo = JSON.stringify(boughtObj);
    var safetyInfo = JSON.stringify(safetyObj);

      // client.send(detectedInfo);
      // client.send(boughtInfo);
      // client.send(safetyInfo);
      client.send("front updated");
    });
} 

/**
 * @function safeWalletTransfer
 * @description 
 * <pre>
 * bot wallet is not safe because of many reason.
 * So, we should move the tokens in the bot wallet to the safe wallet (Vault) given.
 *    Token :     tokenAddress
 *    FROM :      wallet that got from key
 *    TO :        safeWallet *    
 *    AMOUNT :    All of the token in the given wallet;
 *    gasPrice :  as network set.
 * Actions : 
 *    Get the gasprice from the network.
 *    Get remaining balance of the token for bot wallet.
 *    Transfer all of the remaining token to safety wallet.
 * </pre>
 * 
 * @param {Object} provider - Node provider Object
 * @param {string} key - Wallet private key FRON
 * @param {string} tokenAddress - Safe transfer token
 * @param {string} safeWallet - Target wallet address for store the token.
 */
async function safeWalletTransfer (provider, key, tokenAddress, safeWallet) {

  console.log('-----------start safeWalletTransfer');
  var ethWallet = new ethers.Wallet(key);
  const account = ethWallet.connect(customWsProvider);

  // Gas Price : 10,000,000,000 (0x2540BE400)
  provider.getGasPrice().then(async (currentGasPrice) => {

    let gasPrice = ethers.utils.hexlify(parseInt(currentGasPrice));

    let contract = new ethers.Contract(
      tokenAddress,
      ERC20_ABI,
      account
    );

    // get how many tokens are there in the wallet.
    let balance = await contract.balanceOf(account.address);
    balance = balance.toString();

    // Send whole tokens to the safety wallet.
    contract.transfer(safeWallet, balance).then((transferResult) => {

      console.dir(transferResult);
      console.log('----------- Finished');

      let receipt = null;
      while (receipt === null) {
        try {
          receipt = provider.getTransactionReceipt(transferResult.hash);
          console.log("wait safe wallet transfer transaction...");
          sleep(100);
        } catch (e) {
          console.log("wait safe wallet transfer transaction error...");
        }
      }
      return receipt;
  
    });
  })
}

/*****************************************************************************************************
 * Sell the token when the token price reaches a setting price.
 * ***************************************************************************************************/
/**
 * @function sell
 * @description
 * <pre>
 * Issue the SELL method of the smart contract for given token.
 * This is resell mechanism for front run bot.
 * Once we pre-purchase over other transaction, The bot get profit for difference between before/after liquidity pool
 * The bot then resell the bought token in order to recover the consumed tokens.
 * This is a kind of FRONT RUN mechanism.
 *    FROM :      tokenAddress
 *    TO :        WBNB
 *    AMOUNT :    getAmountsOut(amountIn, [tokenIn, tokenOut]);
 *    gasLimit :  100000
 *    gasPrice :  10 gwei
 * NOTE : This SELL method is not the case for wallet_bot now, so, it is not called from anywhere in the code.
 * </pre>
 * @param {object} account - Etherium wallet account access object
 * @param {object} provider - Etherium provider object
 * @param {object} router - Etherium contract object
 * @param {string} wallet - Wallet's public address.
 * @param {string} tokenAddress - "To token" address to purchase
 * @param {number} gasLimit_ - Etherium gas limit
 */
async function sell(account, provider, router, wallet, tokenAddress, gasLimit) {
  try {
    console.log("---------Sell token---------");
    const tokenIn = tokenAddress;
    const tokenOut = swapHandler.wNativeToken;

    // Create contract object to access to the smart contract.
    const contract = new ethers.Contract(tokenIn, ERC20_ABI, account);

    //We buy x amount of the new token for our wbnb
    const amountIn = await contract.balanceOf(wallet);

    console.log("--------amountIN---------");
    const decimal = await contract.decimals();
    // console.log("sell amount" + amountIn);
    if (amountIn < 1) 
      return;
    const amounts = await router.getAmountsOut(amountIn, [tokenIn, tokenOut]);
    //Our execution price will be a bit different, we need some flexbility

    // check if the specific token already approves, then approve that token if not.
    let amount = await contract.allowance(wallet, PAN_ROUTER);

    console.log("--------before Approve---------");

    if (
      amount < MAX_BIGINT
    ) {
      await contract.approve(
        swapHandler.router,
        ethers.BigNumber.from(
          "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
        ),
        {
          gasLimit: 100000,
          gasPrice: ethers.utils.parseUnits(`10`, "gwei"),
        }
      );
      console.log(tokenIn, " Approved \n");
    }

    let price = amounts[1] / amountIn;

    console.log(
      chalk.green.inverse(`\nSell tokens: \n`) +
        `================= ${tokenIn} ===============`
    );
    console.log(chalk.yellow(`decimals: ${decimal}`));
    console.log(chalk.yellow(`price: ${price}`));
    console.log("");

    // sell the token via pancakeswap v2 router
    // const tx_sell = await router
    //   .swapExactTokensForETHSupportingFeeOnTransferTokens(
    //     amountIn,
    //     0,
    //     [tokenIn, tokenOut],
    //     wallet,
    //     Date.now() + 1000 * 60 * 10, //10 minutes
    //     {
    //       gasLimit: gasLimit,
    //       gasPrice: ethers.utils.parseUnits(`10`, "gwei"),
    //     }
    //   )
    //   .catch((err) => {
    //     console.log("sell transaction failed...");
    //   });

    // Issue sell method for the given contract,
    // Refer : https://docs.uniswap.org/protocol/V2/reference/smart-contracts/router-02#swapexacttokensfortokens
    const tx_sell = await router
      .swapExactTokensForTokens(
        amountIn,
        0,
        [tokenIn, tokenOut],
        wallet,
        Date.now() + 1000 * 60 * 10, //10 minutes
        {
          gasLimit: gasLimit,
          gasPrice: ethers.utils.parseUnits(`10`, "gwei"),
        }
      )
      .catch((err) => {
        console.log("sell transaction failed...");
        return;
      });

    if (tx_sell == null) 
      return;

    // invoke getTransactionReceipt to wait until the transaction completed
    // and get the result information.
    // Refer : https://docs.ethers.io/v3/api-providers.html#transactionreceipt
    let receipt = null;
    while (receipt === null) {
      try {
        receipt = await provider.getTransactionReceipt(tx_sell.hash);
      } catch (e) {
        console.log(e);
      }
    }
    console.log("Token is sold successfully...");

    // Store the transactoin data into the database.
    FrontDetail.create({
      timestamp: new Date().toISOString(),
      token: tokenIn,
      action: "Sell",
      price: price,
      transaction: tx_sell.hash,
    });

    // Send the response to the frontend so let the frontend display the event.
    // Update the UI by sending information via web socket.
    var aWss = app.wss.getWss("/");
    aWss.clients.forEach(function(client) {
      var obj = {
        type: "front running",
        token: tokenIn,
        action: "Sell",
        price: price,
        timestamp: new Date().toISOString(),
        transaction: tx_sell.hash,
      };
      var updateInfo = JSON.stringify(obj);

      // client.send(detectInfo);
      // client.send(updateInfo);
      client.send("front updated");
    });
  } catch (err) {
    console.log(err);
    console.log(
      "Please check token ETH/WETH or BNB/WBNB balance in the swap, maybe its due because insufficient balance "
    );
  }
}

module.exports = {
  scanMempool: scanMempool,
};
