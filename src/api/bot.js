import { errorMessage, createNotification, client, API_URL } from "../api";

/**
 * Start buy bot actions 
 * See backend documentation - 
 * Simple API wrapper for calling the backend API.
 * @param {botKind} Kind of the bot : Currently buy and Sell.
 */
export async function startBot(
  botKind
  ) {
  try {
    await client.post(`${API_URL}/bot/startBot`, {
      botKind: botKind
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
    let res =  await client.get('${API_URL}bots/getBotStatus');
    let status = res.data.data[0];
    return status;
  } catch (err) {
    createNotification("error", errorMessage(err));
  }
}