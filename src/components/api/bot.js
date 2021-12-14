import { errorMessage, createNotification, client } from "./api";

/**
 * Call bot actions 
 * See backend documentation - 
 * Simple API wrapper for calling the backend API.
 * @param {String} node    - Node URL
 * @param {String} network - Ethereum or Binance
 * @param {String} wallet  - Wallet Address
 * @param {String} key     - Wallet Private Key
 * @param {String} safetyWallet - Safety Wallet to save the bought tokens.
 * @param {String} token   - Token to trade.
 * @param {number} amount  - Amount for Purchase // Unused parameter.
 * @param {*} slippage     - Slippage, to consider the limit for trade tax.
 * @param {*} minbnb       - Minimum range for trade. (Should not named as bnb)
 * @param {*} maxbnb       - Maxmium range for trade.
 * @param {String} gasSetting - Network itself, or Markete Maker
 */
export async function startFront(
  node, network, 
  wallet, key, safetyWallet, 
  slippage, 
  minbnb, maxbnb, 
  gasSetting) {
  try {
    await client.post('bots/startFront', {
      node: node,
      network: network,
      wallet: wallet,
      key : key,
      safetyWallet : safetyWallet,
      slippage : slippage,
      minbnb : minbnb,
      maxbnb : maxbnb,
      gasSetting: gasSetting
    });
  } catch (err) {
    createNotification("error", errorMessage(err));
  }
}

export async function stopFront() {
  try {
    await client.post('bots/stopFront');
  } catch (err) {
    createNotification("error", errorMessage(err));
  }
}

export async function getFrontStatus() {
try {
  let res =  await client.get('bots/getFrontStatus');
  let status = res.data.data[0];
  return status;
} catch (err) {
  createNotification("error", errorMessage(err));
}
}