import { API_URL, client } from "./api";


export async function setMainWallet(address, key) {
  try {
    await client.post(`${API_URL}/wallets/setMain`, {
      address : address,
      key : key
    });
  } catch (err) {
    console.log(err);
  }
}

/**
* Call wallet List actions - Including for all and black wallets.
* See backend documentation - 
* Simple API wrapper for calling the backend API.
*/
export async function listWallets() {
  try {
    let res = await client.get(`${API_URL}/wallets/list`);
    console.log(res)
    let data = res.data.data;
    return data;
  } catch (err) {
    console.log(err);
  }
}

export async function addWallet(address, key) {
  try {
    await client.post(`${API_URL}/wallets/add`, {
      address : address,
      key : key
    });
  } catch (err) {
    console.log(err);
  }
}

export async function deleteWallet(address) {
  try {
    await client.post(`${API_URL}/wallets/del`, {
      address : address
    });
  } catch (err) {
    console.log(err);
  }
}