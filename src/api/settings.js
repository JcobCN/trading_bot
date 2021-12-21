import { API_URL, client } from "./api";

/**
* Call wallet List actions - Including for all and black wallets.
* See backend documentation - 
* Simple API wrapper for calling the backend API.
*/
export async function listWallets() {
  try {
    let res = await client.get(`${API_URL}/settings/listWallets`);
    let data = res.data.data;
    return data;
  } catch (err) {
    console.log(err);
  }
}

export async function detailWallet(walletAddress) {
  try {
    await client.post(`${API_URL}/settings/detailWallet`, {
      walletAddress: walletAddress
    });
  } catch (err) {
    console.log(err);
  }
}

export async function addWallet(walletAddress, walletPrivateKey) {
  try {
    await client.post(`${API_URL}/settings/addWallet`, {
      walletAddress: walletAddress,
      walletPrivateKey: walletPrivateKey
    });
  } catch (err) {
    console.log(err);
  }
}

export async function deleteWallet(walletAddress) {
  try {
    await client.post(`${API_URL}/settings/deleteWallet`, {
      walletAddress: walletAddress
    });
  } catch (err) {
    console.log(err);
  }
}

/**
 * 
 * @param {object} file : File information to load 
 */
 export async function addWalletFromFile(file) {
  try {
    console.log(file);
    await client.post(`${API_URL}/settings/addWalletFromFile`, {
      file: file,
    });
  } catch (err) {
    console.log(err);
  }
}

/**
 * 
 * @returns Main Settings Data.
 */
export async function getMainSetting () {
  try {
    let res = await client.get(`${API_URL}/settings/getMainSetting`);
    console.log(res)
    let data = res.data.data;
    return data;
  } catch (err) {
    console.log(err);
  }
}

/**
 * @extern 
 * @param {String} mainWalletAddress 
 * @param {String} mainWalletPrivateKey 
 * @param {String} tokenAddress 
 */
export async function setMainSetting(
  mainWalletAddress, 
  mainWalletPrivateKey,
  tokenAddress,
  tokenName,
  tokenSymbol
) {
  try {
    await client.post(`${API_URL}/settings/setMainSetting`, {
      mainWalletAddress: mainWalletAddress,
      mainWalletPrivateKey : mainWalletPrivateKey,
      tokenAddress : tokenAddress,
      tokenName: tokenName,
      tokenSymbol:tokenSymbol
    }); 
  } catch (err) {
    console.log(err);
  }
}


/**
 * Call Settings actions 
 * See backend documentation - 
 * Simple API wrapper for calling the backend API.
 */
export async function resetAllAPI() {
  try {
    await client.get(`${API_URL}/settings/resetAll`);;
  } catch (err) {
    console.log(err);
  }
}