import { API_URL, client } from "./api";

/**
* Call wallet List actions - Including for all and black wallets.
* See backend documentation - 
* Simple API wrapper for calling the backend API.
*/
export async function listWorkWallets() {
  try {
    let res = await client.get(`${API_URL}/settings/listWorkWallets`);
    let data = res.data.data;
    return data;
  } catch (err) {
    console.log(err);
  }
}

export async function addWorkWallet(walletAddress, walletPrivateKey) {
  try {
    await client.post(`${API_URL}/settings/addWorkWallet`, {
      walletAddress: walletAddress.trim(),
      walletPrivateKey: walletPrivateKey.trim()
    });
  } catch (err) {
    console.log(err);
  }
}

export async function deleteWorkWallet(walletAddress) {
  try {
    await client.post(`${API_URL}/settings/deleteWorkWallet`, {
      walletAddress: walletAddress.trim()
    });
  } catch (err) {
    console.log(err);
  }
}

export async function getWorkWalletBalance(walletAddress) {
  try {
    let res = await client.post(`${API_URL}/settings/getWorkWalletBalance`, {
      walletAddress: walletAddress.trim()
    });
    let data = res.data.data;
    return data;
  } catch (err) {
    console.log(err);
  }
}


/**
 * 
 * @param {object} file : File information to load 
 */
 export async function addWorkWalletFromFile(files) {
  try {
    console.log(files);
    let formData = new FormData();
    formData.append("uploadFile", files[0]);
    console.log("Prev POST");

    // TODO Add progress bar or loading icon, here.

    await client.post(`${API_URL}/settings/addWorkWalletFromFile`, formData);
    console.log("NEXT POST");
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
      mainWalletAddress: mainWalletAddress.trim(),
      mainWalletPrivateKey : mainWalletPrivateKey.trim(),
      tokenAddress : tokenAddress.trim(),
      tokenName: tokenName.trim(),
      tokenSymbol:tokenSymbol.trim()
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