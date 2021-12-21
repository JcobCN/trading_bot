import { errorMessage, createNotification, client, API_URL } from "../api";

/**
 * Start buy bot actions 
 * See backend documentation - 
 * Simple API wrapper for calling the backend API.
 * @param {transKind} Kind of the bot : Currently buy and Sell.
 */
export async function startTradingBot(
  transKind,
  percentage
  ) {
  try {
    await client.post(`${API_URL}/bot/startTradingBot`, {
      transKind: transKind,
      percentage: percentage
    });
  } catch (err) {
    createNotification("error", errorMessage(err));
  }
}

/**
 * Start Distribute bot actions 
 * See backend documentation - 
 * Simple API wrapper for calling the backend API.
 * @param {transKind} Kind of the bot : Currently buy and Sell.
 */
 export async function startDistribteBot(
  totalAmount
  ) {
  try {
    await client.post(`${API_URL}/bot/startDistribteBot`, {
      totalAmount: totalAmount
    });
  } catch (err) {
    createNotification("error", errorMessage(err));
  }
}
/**
 * Start Gather bot actions 
 * See backend documentation - 
 * Simple API wrapper for calling the backend API.
 * @param {transKind} Kind of the bot : Currently buy and Sell.
 */
 export async function startGatherBot(
  percentage
  ) {
  try {
    await client.post(`${API_URL}/bot/startGatherBot`, {
      percentage: percentage
    });
  } catch (err) {
    createNotification("error", errorMessage(err));
  }
}

/**
 * Stop current running bot.
 */
export async function stopBot( 
  ) {
  try {
    await client.get(`${API_URL}/bot/stopBot`);
  } catch (err) {
    createNotification("error", errorMessage(err));
  }
}

/**
 * Get Bot Status for initial actions. 
 * See backend documentation - 
 * Simple API wrapper for calling the backend API.
 * return : 
 *    mainWalletAddress
 *    tokenAddress
 *    tokenName
 *    tokenSymbol
 *    mainBnbAmount
 *    mainTokenAmount
 *    botStatus {sell, buy, stop}
 *    totalWalletCount
 *    processedWalletCount
 */
export async function getBotStatus(
) {
  try {
    let res =  await client.get(`${API_URL}bots/getBotStatus`);
    let status = res.data.data[0];
    return status;
  } catch (err) {
    createNotification("error", errorMessage(err));
  }
}