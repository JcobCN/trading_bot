import { errorMessage, createNotification, client, API_URL } from "../api";

/**
 * Start buy bot actions 
 * See backend documentation - 
 * Simple API wrapper for calling the backend API.
 */
export async function startTradingBot(
  transKind,
  percentage
  ) {
  try {
    await client.post(`${API_URL}/bots/startBot`, {
      transKind: transKind,
      amountParameter: percentage,
      targetParameter: transKind==="sell" ? "token" : "bnb",
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
  totalAmount,
  target
  ) {
  try {
    await client.post(`${API_URL}/bots/startBot`, {
      transKind: "distribute",
      amountParameter: totalAmount,
      targetParameter: target
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
  percentage,
  target
  ) {
  try {
    await client.post(`${API_URL}/bots/startBot`, {
      transKind: "gather",
      amountParameter: percentage,
      targetParameter: target
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
    await client.get(`${API_URL}/bots/stopBot`);
  } catch (err) {
    createNotification("error", errorMessage(err));
  }
}

/**
 * Get Main Wallet Status for initial actions. 
 * See backend documentation - 
 * Simple API wrapper for calling the backend API.
 */
export async function getMainWalletStatus(
) {
  try {
    let res =  await client.get(`${API_URL}/bots/getMainWalletStatus`);
    let status = res.data.data;
    return status;
  } catch (err) {
    createNotification("error", errorMessage(err));
  }
}

/**
 * Get Bot Status for initial actions. 
 * See backend documentation - 
 * Simple API wrapper for calling the backend API.
 */
export async function getBotStatus(
) {
  try {
    let res =  await client.get(`${API_URL}/bots/getBotStatus`);
    let status = res.data.data;
    return status;
  } catch (err) {
    createNotification("error", errorMessage(err));
  }
}