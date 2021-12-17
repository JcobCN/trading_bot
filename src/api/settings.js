import { API_URL, client } from "./api";

/**
* Call wallet List actions - Including for all and black wallets.
* See backend documentation - 
* Simple API wrapper for calling the backend API.
*/
export async function listWallets() {
  try {
    let res = await client.get(`${API_URL}/settings/listWallets`);
    console.log(res)
    let data = res.data.data;
    return data;
  } catch (err) {
    console.log(err);
  }
}

export async function detailWallet(address) {
  try {
    await client.post(`${API_URL}/settings/detailWallet`, {
      address: address
    });
  } catch (err) {
    console.log(err);
  }
}

export async function addWallet(address, privateKey) {
  try {
    await client.post(`${API_URL}/settings/addWallet`, {
      address: address,
      privateKey: privateKey
    });
  } catch (err) {
    console.log(err);
  }
}

export async function deleteWallet(address) {
  try {
    await client.post(`${API_URL}/settings/deleteWallet`, {
      address: address
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
    await client.post(`${API_URL}/wallets/addWalletFromFile`, {
      file: file,
    });
  } catch (err) {
    console.log(err);
  }
}

export async function getMainSettings () {
  try {
    let res = await client.get(`${API_URL}/settings/getMainSettings`);
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
export async function setMainSettings(
  mainWalletAddress, 
  mainWalletPrivateKey,
  tokenAddress,
  tokenName,
  tokenSymbol
) {
  try {
    await client.post(`${API_URL}/settings/setMainWallet`, {
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
    await client.post(`${API_URL}/settings/resetAll`);;
  } catch (err) {
    console.log(err);
  }
}